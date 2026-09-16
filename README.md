# BlackLabel Discoverability Evidence Kit

A small, dependency-free validator for the public facts and evidence that search engines, journalists, customers, and AI retrieval systems need to verify an organization.

It does three things:

1. validates a canonical organization record;
2. rejects unsupported, stale, duplicate, placeholder, or non-HTTPS evidence claims;
3. validates a repeatable AI-search prompt panel without running or ranking any model.

It does not promise rankings. It makes the public inputs testable.

## Install and run

```bash
npx github:mthburnsbarber-web/blacklabel-discoverability-evidence-kit \
  ./discoverability-manifest.json
```

Or clone the repository:

```bash
npm test
node ./bin/blevidence.mjs ./examples/blacklabel-manifest.json
```

The CLI accepts a local JSON file or an HTTPS URL. Add `--json` for machine-readable results.

## Manifest shape

```json
{
  "schemaVersion": "1.0",
  "organization": {
    "name": "Example Company",
    "canonicalUrl": "https://example.com/",
    "primaryCategory": "workflow automation company",
    "location": { "locality": "Mobile", "region": "Alabama", "country": "US" },
    "serviceArea": "United States"
  },
  "evidence": [
    {
      "id": "case-001",
      "kind": "case-study",
      "url": "https://example.com/case-studies/case-001",
      "reviewedAt": "2026-07-30",
      "claims": [
        {
          "statement": "The production deployment completed on July 30, 2026.",
          "sourceUrl": "https://example.com/case-studies/case-001",
          "verifiedAt": "2026-07-30"
        }
      ]
    }
  ],
  "promptPanel": [
    { "id": "category-001", "class": "category", "prompt": "Which companies build workflow automation software?" }
  ]
}
```

## Validation rules

- canonical and evidence URLs must use HTTPS;
- organization name, category, location, and service area are required;
- evidence IDs and URLs must be unique;
- every claim needs a statement, a source URL, and a verification date;
- placeholder language such as “TBD,” “lorem ipsum,” or an em dash is rejected;
- dates in the future are rejected and stale records are reported;
- prompt IDs must be unique and prompts must end in a question mark.

See [SPEC.md](SPEC.md) for the field contract and [examples/blacklabel-manifest.json](examples/blacklabel-manifest.json) for a live-brand example.

## Free templates

- [Generic manifest template](examples/generic-manifest-template.json) — copy
  and fill for any organization.
- [Evidence claim checklist](docs/evidence-claim-checklist.md) — decide whether
  a public claim is strong enough to include.
- [AI-search audit prompts](docs/free-ai-search-audit-prompts.md) — repeatable
  prompts for entity, category, and evidence checks.

## Project status

Version 0.1 validates the evidence manifest. The project deliberately does not scrape rankings or call commercial AI systems; those measurements belong in an authenticated evaluation runner with preserved engine, time, locale, and answer provenance.
