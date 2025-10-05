# tiny-json-workflow

[![CI/CD](https://github.com/tinnguyenhuuletrong/tiny-flow-in-json/actions/workflows/ci.yml/badge.svg)](https://github.com/tinnguyenhuuletrong/tiny-flow-in-json/actions/workflows/ci.yml)

This project is a tiny JSON-based workflow engine.

## CI/CD

The CI/CD pipeline is configured using GitHub Actions. The workflow is defined in `.github/workflows/ci.yml`. It automatically builds and tests the project on every push to the `main` branch.

## Deployment

The web application is automatically deployed to GitHub Pages. You can access it here: [https://tinnguyenhuuletrong.github.io/tiny-flow-in-json/](https://tinnguyenhuuletrong.github.io/tiny-flow-in-json/)

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
