# GitHub AI Agent

A cross-browser Manifest V3 extension plus GitHub Actions agent for meaningful, safe repository maintenance.

## Goals

- Chrome, Edge, Brave, and Opera support.
- Analyze repositories and identify worthwhile improvements.
- Make changes safely and validate them.
- Create pull requests instead of blindly modifying `main`.
- Run on a daily GitHub Actions schedule.
- No website or Vercel deployment required.

## Project status

Phase 1 — Foundation.

## Safety principles

1. Never expose or store GitHub tokens in source code.
2. Protect secrets, environment files, deployment configuration, and production data by default.
3. Prefer one meaningful change over artificial daily commits.
4. Run validation before opening a pull request.
5. If there is nothing worthwhile to change, make no commit.
