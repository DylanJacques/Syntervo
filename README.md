# Syntervo Website

Static multi-page site for Syntervo — ready for GitHub Pages.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, service teasers |
| `about.html` | About — story, process, outcomes |
| `services.html` | Services — full service detail |
| `contact.html` | Contact — email and book a call |

## Assets

- `assets/logo.png` — company logo (header & footer)
- `assets/ill-*.svg` — decorative illustrations (hero, services)
- `style.css` — shared styles
- `script.js` — nav, scroll effects, animations

## Run locally

Open any `.html` file in a browser, or:

```powershell
cd "Syntervo Website"
start index.html
```

## Deploy to GitHub Pages

Push all files to the repo root. Enable Pages on the `main` branch. Site serves `index.html` as the home page.

## Contact form

The site uses [Web3Forms](https://web3forms.com) (FormSubmit was unreliable).

1. Go to [web3forms.com](https://web3forms.com) and create a free access key for `Syntevo@gmail.com`.
2. Open `contact-config.js` and replace `REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY` with your key.
3. Redeploy / push to GitHub Pages.

Until the key is set, visitors can still use the mailto link on the contact page.

## Contact

Email: Syntevo@gmail.com
