{
  "name": "github-ai-agent",
  "version": "1.0.0",
  "description": "A cross-browser Manifest V3 extension plus GitHub Actions agent for repository maintenance",
  "main": "src/action/index.js",
  "scripts": {
    "test": "jest",
    "lint": "eslint \"src/**/*.js\"",
    "format": "prettier --write \"src/**/*.js\""
  },
  "dependencies": {
    "@actions/core": "^1.11.1",
    "@actions/github": "^6.0.0",
    "openai": "^4.83.0"
  },
  "devDependencies": {
    "eslint": "^9.19.0",
    "jest": "^29.7.0",
    "prettier": "^3.4.2"
  }
}