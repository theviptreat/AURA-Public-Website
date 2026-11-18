import { spawnSync } from 'node:child_process';

const ALLOWED_ADVISORY = 'GHSA-FC5Q-39XC-VJPF';
const EXPIRES_ON = '2026-12-18';
const LEVELS = ['info', 'low', 'moderate', 'high', 'critical'];
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isCount = value => Number.isSafeInteger(value) && value >= 0;
const fail = message => { console.error(`Dependency audit gate: ${message}`); process.exit(1); };

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function todayUtc() {
  if (Object.hasOwn(process.env, 'AUDIT_GATE_TODAY')) {
    const value = process.env.AUDIT_GATE_TODAY;
    if (!validDate(value)) fail('AUDIT_GATE_TODAY must be a real YYYY-MM-DD date.');
    return value;
  }
  return new Date().toISOString().slice(0, 10);
}

function runAudit() {
  if (process.argv.length !== 2) fail('unexpected command-line arguments.');
  const result = spawnSync('npm', ['audit', '--json', '--audit-level=high'], {
    encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
  });
  if (result.error) fail(`could not run npm audit: ${result.error.message}`);
  if (result.signal) fail(`npm audit terminated by ${result.signal}.`);
  if (typeof result.stdout !== 'string' || !result.stdout.trim()) fail('npm audit returned no report.');
  let report;
  try { report = JSON.parse(result.stdout); } catch { fail('npm audit returned invalid JSON.'); }
  return { report, status: result.status };
}

function inspectReport(report) {
  if (!isRecord(report) || Object.hasOwn(report, 'error')) fail('unexpected npm audit report or error payload.');
  if (![2, 3].includes(report.auditReportVersion)) fail('missing or unsupported audit report version.');
  if (!isRecord(report.vulnerabilities) || !isRecord(report.metadata) ||
      !isRecord(report.metadata.vulnerabilities) || !isRecord(report.metadata.dependencies)) {
    fail('audit report sections are missing or malformed.');
  }

  const counts = report.metadata.vulnerabilities;
  for (const key of [...LEVELS, 'total']) {
    if (!isCount(counts[key])) fail(`invalid metadata vulnerability count: ${key}.`);
  }
  if (counts.total !== LEVELS.reduce((sum, level) => sum + counts[level], 0)) {
    fail('metadata vulnerability totals are inconsistent.');
  }
  for (const key of ['prod', 'dev', 'optional', 'peer', 'peerOptional', 'total']) {
    if (!isCount(report.metadata.dependencies[key])) fail(`invalid dependency count: ${key}.`);
  }

  const observed = Object.fromEntries(LEVELS.map(level => [level, 0]));
  const entries = new Map();
  for (const [name, item] of Object.entries(report.vulnerabilities)) {
    if (!name || !isRecord(item) || item.name !== name || !LEVELS.includes(item.severity) ||
        typeof item.isDirect !== 'boolean' || !Array.isArray(item.via) || item.via.length === 0 ||
        typeof item.range !== 'string' || !Array.isArray(item.effects) ||
        !item.effects.every(value => typeof value === 'string') || !Array.isArray(item.nodes) ||
        !item.nodes.every(value => typeof value === 'string')) {
      fail(`malformed vulnerability entry: ${name || '(unnamed)'}.`);
    }
    if (!(typeof item.fixAvailable === 'boolean' ||
        (isRecord(item.fixAvailable) && typeof item.fixAvailable.name === 'string' &&
         typeof item.fixAvailable.version === 'string' && typeof item.fixAvailable.isSemVerMajor === 'boolean'))) {
      fail(`invalid fixAvailable field for ${name}.`);
    }

    const highAdvisories = [];
    for (const via of item.via) {
      if (typeof via === 'string') {
        if (!via.trim()) fail(`empty via dependency in ${name}.`);
        continue;
      }
      if (!isRecord(via) || !Number.isSafeInteger(via.source) || via.source <= 0 ||
          typeof via.name !== 'string' || !via.name || typeof via.dependency !== 'string' ||
          typeof via.title !== 'string' || typeof via.url !== 'string' ||
          typeof via.severity !== 'string' || !LEVELS.includes(via.severity) || typeof via.range !== 'string') {
        fail(`malformed advisory object in ${name}.`);
      }
      if (via.severity === 'high' || via.severity === 'critical') {
        let url;
        try { url = new URL(via.url); } catch { fail(`invalid advisory URL in ${name}.`); }
        if (url.protocol !== 'https:') fail(`non-HTTPS advisory URL in ${name}.`);
        const match = via.url.match(/GHSA-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}/i);
        highAdvisories.push(match ? match[0].toUpperCase() : `npm:${via.source}`);
      }
    }
    observed[item.severity]++;
    entries.set(name, { item, highAdvisories });
  }

  for (const level of LEVELS) {
    if (observed[level] !== counts[level]) fail(`metadata ${level} count does not match vulnerability entries.`);
  }

  const advisories = new Set();
  function follow(name, path = new Set()) {
    if (path.has(name)) fail(`cyclic vulnerability chain at ${name}.`);
    const entry = entries.get(name);
    if (!entry) fail(`vulnerability chain references missing package ${name}.`);
    const next = new Set(path);
    next.add(name);
    for (const via of entry.item.via) {
      if (typeof via === 'string') follow(via, next);
      else if (via.severity === 'high' || via.severity === 'critical') {
        for (const id of entry.highAdvisories) advisories.add(id);
      }
    }
    if ((entry.item.severity === 'high' || entry.item.severity === 'critical') &&
        entry.highAdvisories.length === 0 && !entry.item.via.some(value => typeof value === 'string')) {
      fail(`high/critical vulnerability ${name} has no identifiable advisory.`);
    }
  }
  for (const [name, entry] of entries) {
    if (entry.item.severity === 'high' || entry.item.severity === 'critical') follow(name);
  }
  return { counts, advisories };
}

function main() {
  const today = todayUtc();
  const { report, status } = runAudit();
  const { counts, advisories } = inspectReport(report);
  const highOrCritical = counts.high + counts.critical;
  if (status !== 0 && highOrCritical === 0) fail('npm audit exited unsuccessfully without high/critical findings.');
  if (highOrCritical === 0) {
    console.log('Dependency audit gate: no high or critical vulnerabilities.');
    return;
  }
  if (advisories.size !== 1 || !advisories.has(ALLOWED_ADVISORY)) {
    fail(`high/critical advisories found: ${[...advisories].join(', ') || 'unidentified'}.`);
  }
  if (today > EXPIRES_ON) fail(`temporary ${ALLOWED_ADVISORY} exception expired on ${EXPIRES_ON}.`);
  console.warn(`Dependency audit gate: temporarily allowing only ${ALLOWED_ADVISORY} through ${EXPIRES_ON}.`);
}

main();
