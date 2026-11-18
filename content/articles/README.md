# AURA Sport article content

Pages CMS stores one JSON file per article in this folder.

- Keep AI-generated work at `status: "draft"`.
- Change to `status: "review"` when ready for editorial review.
- Only change to `status: "published"` after the editor has checked facts, sources, language, image rights and final copy.
- Published articles require a valid `publishedAt` date.
- English is the source language; Hindi fields are explicit editorial translations.
- Never invent source URLs, quotes, scores, dates or image credits.

The website build includes only records whose status is `published`.
