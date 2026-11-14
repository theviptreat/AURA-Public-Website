# AURA Sport — AI Cricket Newsroom

## Editorial output

Prepare drafts for these sections:
- `news`: latest cricket news and verified developments.
- `match-report`: completed-match reports based on confirmed scorecards and match facts.
- `analysis`: original cricket analysis, with facts separated from interpretation.

Other supported sections are `match-preview` and `knowledge`.

## Approval workflow

1. Research the story and collect direct, reliable source URLs.
2. Verify every material claim against the source. Prefer official boards, tournament/league pages, scorecards and direct statements; use established publishers for additional context.
3. Write original copy. Do not reproduce another publisher's article, headline, distinctive phrasing or copyrighted photograph.
4. Prepare English and Hindi versions from the same verified facts. Do not invent a Hindi translation of a quote or statistic.
5. Save the record with `status: "draft"` and include source references and internal editorial notes.
6. An editor checks accuracy, context, spelling, translation, image rights and SEO fields. Change to `review` when ready.
7. Only the editor can change status to `published`. The website build and article routes include only published records.

AI must never publish, deploy, or change a draft's status to published.

## Source and accuracy rules

- Attach a source reference for every important factual claim.
- Record the exact URL and the date it was checked.
- If a claim cannot be verified, omit it or mark it clearly as unverified in internal notes; never present it as fact.
- Do not infer injuries, team selection, player intent, quotes, statistics or match events.
- For match reports, verify score, result, player figures, venue and match date against an official scorecard where possible.
- Separate confirmed facts from analysis and opinion.
- Avoid betting language, guaranteed outcomes and claims of certain prediction accuracy.

## Image rules

Use original, licensed, public-domain or otherwise permission-cleared images only. Keep the image credit and source in the CMS record. AI image suggestions are suggestions only; they are not automatically published.

## Draft request template

Use this request in ChatGPT when asking the newsroom to prepare a story:

> Research the current cricket development described below. Verify facts using reliable, direct sources and provide source URLs. Draft an original AURA Sport article in English and Hindi using the website's article schema. Set status to draft. Include source references, checked dates, SEO title and description in both languages, image alt text, and internal editorial notes. Do not invent or infer missing facts, do not copy source wording, do not publish, and clearly flag anything that could not be verified.
>
> Topic / match: [describe the story]
> Preferred section: [news / match-report / analysis]
> Required coverage or angle: [optional]

## CMS branch safety

For the current implementation, use the GitHub branch `feature/i18n-en-hi` in Pages CMS. Do not select `main`. Pages CMS saves edits to the selected repository branch. Render AutoDeploy remains off, and no deployment is triggered by this setup.
