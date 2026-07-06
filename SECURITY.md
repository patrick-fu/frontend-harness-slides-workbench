# Security Policy

## Supported Versions

This repository is maintained from `main`. Security fixes target the latest
commit on `main`; older commits are not supported as separate release lines.

## Reporting a Vulnerability

For non-sensitive issues, open a GitHub issue:

https://github.com/patrick-fu/frontend-harness-slides-workbench/issues

For sensitive reports, email Patrick Fu at `paaatrickfu@gmail.com`.

Please include:

- Affected URL, commit, or file.
- Reproduction steps.
- Expected impact.
- Any proof of concept that does not expose private data or third-party secrets.

## Project Security Notes

This is a static React/Vite demo workbench. It does not run a custom backend,
store user accounts, process payments, or intentionally collect user data.
Deployment secrets are expected to live only in GitHub Actions or Vercel
secret storage.
