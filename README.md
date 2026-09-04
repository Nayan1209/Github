# GitHub AI Agent

A cross-browser Manifest V3 extension plus GitHub Actions agent for meaningful, safe repository maintenance.

## Goals

- Chrome, Edge, Brave, and Opera support.
- Analyze repositories and identify worthwhile improvements.
- Make changes safely and validate them.
- Create pull requests instead of blindly modifying `main`.
- Run on a daily GitHub Actions schedule.
- No website or Vercel deployment required.

## Safety Principles

1. **Token Protection:** Never expose or store GitHub tokens in source code.
2. **Data & Config Isolation:** Protect secrets, environment files, deployment configuration, and production data by default.
3. **Quality Over Quantity:** Prefer one meaningful change over artificial daily commits.
4. **Validation First:** Run validation (linting, tests, build checks) before opening a pull request.
5. **Idempotency & Restraint:** If there is nothing worthwhile to change, make no commit.

## Architecture & Components

The project consists of two primary components designed to work in tandem or independently:

1. **Browser Extension (Manifest V3):** Allows users to trigger, configure, and monitor the agent directly from the GitHub UI on supported browsers (Chrome, Edge, Brave, Opera).
2. **GitHub Action:** A scheduled or manually triggered workflow that runs headlessly within your repository's CI/CD pipeline to analyze code and suggest improvements.

## Directory Structure

```text
├── .github/
│   └── workflows/          # GitHub Action definition (cron/workflow_dispatch)
├── src/
│   ├── extension/          # Manifest V3 Extension source files
│   │   ├── manifest.json   # Browser extension metadata
│   │   ├── background.js   # Background service worker
│   │   └── popup/          # Extension UI popup
│   ├── action/             # Core logic for AI analysis & PR creation
│   └── shared/             # Shared utilities (validation, Git helper utilities)
└── README.md
```

## Getting Started

### Browser Extension Installation

1. Clone this repository locally.
2. Open your browser's extension management page (e.g., `chrome://extensions` in Chrome).
3. Enable **Developer mode** (usually a toggle in the top-right corner).
4. Click **Load unpacked** and select the `src/extension/` directory.

### GitHub Action Setup

To run the agent on a daily schedule in your own repository:

1. Copy the workflow file from `.github/workflows/ai-agent.yml` to your repository.
2. Add a `GITHUB_TOKEN` secret to your repository settings (or rely on the default `GITHUB_TOKEN` if permissions allow creation of Pull Requests).
3. Ensure your repository settings allow GitHub Actions to create and approve Pull Requests (`Settings > Actions > General > Workflow permissions`).

## Configuration

The behavior of the agent can be customized using a local `.github/ai-agent-config.json` file:

```json
{
  "frequency": "daily",
  "allowedDirectories": ["src/", "docs/"],
  "ignoredExtensions": [".env", ".pem", ".key"],
  "autoValidate": true
}
```

## Project Status

**Phase 1 — Foundation.**
- Designing architecture and initial repository structure.
- Defining safety boundaries and core agent prompts.
- Laying down Manifest V3 skeleton.

## License

This project is licensed under the MIT License. See the LICENSE file for details.