# Discoverability evidence manifest 1.0

## Root

- `schemaVersion`: required string. Current value: `1.0`.
- `organization`: required canonical entity record.
- `evidence`: required array of public evidence records.
- `promptPanel`: optional array of fixed evaluation prompts.

## Organization

- `name`: approved public brand name.
- `legalName`: optional legal entity name.
- `canonicalUrl`: HTTPS homepage, including a trailing slash.
- `primaryCategory`: one commercial category, written in plain language.
- `location`: `locality`, `region`, and ISO-style `country` value.
- `serviceArea`: public geographic service scope.
- `sameAs`: optional array of verified public profiles.

## Evidence

- `id`: stable unique identifier.
- `kind`: `case-study`, `dataset`, `repository`, `documentation`, `release`, `coverage`, or another explicit type.
- `url`: stable public HTTPS evidence URL.
- `reviewedAt`: ISO `YYYY-MM-DD` date.
- `claims`: one or more claim records.

## Claim

- `statement`: the exact proposition supported by the source.
- `sourceUrl`: HTTPS page supporting that proposition.
- `verifiedAt`: ISO `YYYY-MM-DD` validation date.
- `methodologyUrl`: optional HTTPS method or protocol.

## Prompt panel

- `id`: stable unique identifier.
- `class`: category, local, problem, vertical, comparison, evidence, developer, product, reputation, or recommendation.
- `prompt`: complete natural-language question.
- `eligible`: optional boolean used to exclude prompts where the organization is not relevant.

