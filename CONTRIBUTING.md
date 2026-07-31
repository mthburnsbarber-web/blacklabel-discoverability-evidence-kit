# Contributing

1. Open an issue describing the validation gap or specification change.
2. Add or update a failing Node test first.
3. Keep the runtime dependency-free unless the maintainer approves a dependency with a concrete security and maintenance reason.
4. Run `npm test` and `npm run check`.
5. Document any field-contract change in `SPEC.md` and the changelog.

Changes must preserve truthful failure: an unsupported or malformed claim must never pass because a network dependency is unavailable.

