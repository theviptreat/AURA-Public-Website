import { rm } from 'node:fs/promises';

// Editorial cover images remain in source control for possible future use,
// but are excluded from the deployed public website while publishing is paused.
await rm('dist/images/articles', { recursive: true, force: true });
