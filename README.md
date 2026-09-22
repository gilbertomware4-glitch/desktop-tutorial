# Incheck Talk (Taj Toj)

Incheck Talk is a worldwide community for discovering how people are changing technology, climate, community life, work, and fashion. People can explore stories, save useful ideas, follow creators, and join conversations.

## Run locally

Open `index.html` directly, or run `start.bat` on Windows. The launcher uses a local PowerShell server when available.

## Publish

The repository is configured for GitHub Pages through the workflow in `.github/workflows/deploy-pages.yml`. In GitHub, open **Settings > Pages**, choose **GitHub Actions** as the source, and wait for the workflow to finish.

The expected online address is `https://gilbertomware4-glitch.github.io/desktop-tutorial/`.

This repository is public so GitHub Pages can host the site on the free plan.

Project owner: Gilbert Omware.

## Start earning

The support modal is ready for Stripe Payment Links or PayPal links. Add the public checkout URLs to `paymentLinks.membership` and `paymentLinks.tip` near the top of `script.js`, then commit and push. Never place private API keys in this static site; use hosted payment links or a secure serverless backend.
