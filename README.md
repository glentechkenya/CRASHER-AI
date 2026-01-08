# Crasher AI by Glen Tech

A futuristic WhatsApp‑style chat app with animated floating particles and a typing indicator. It connects to GitHub Models (GitHub Marketplace) using a `GITHUB_TOKEN`.

## Features
- WhatsApp‑style chat bubbles
- “Typing…” three‑dots animation before AI replies
- Floating particle background
- Render‑ready Flask backend
- GitHub Models API integration via `GITHUB_TOKEN`

## Environment variables
- `GITHUB_TOKEN` — your GitHub token with access to GitHub Models
- `GITHUB_MODEL` — model name (default: `gpt-4o-mini`)

## Local setup
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
