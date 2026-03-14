# Stiftung Hirzelheim — Website

Website der Stiftung Hirzelheim Regensberg — Alters- und Pflegeheim für hörbehinderte und betagte Menschen.

## Tech-Stack

- **Static Site Generator**: [Hugo](https://gohugo.io/) (Extended)
- **CSS**: [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **CMS**: [Decap CMS](https://decapcms.org/) (Git-basiert)
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **CI/CD**: GitHub Actions

## Schnellstart

### Voraussetzungen

- [Hugo Extended](https://gohugo.io/installation/) (v0.145.0+)
- [Node.js](https://nodejs.org/) (v18+, für AI-Tools)
- Git

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd hirzelheim

# Setup ausführen
./scripts/setup.sh

# Lokalen Server starten
cd hugo-site
hugo server
```

Die Website ist dann unter http://localhost:1313/ erreichbar.
Der Admin-Bereich unter http://localhost:1313/admin/ (benötigt `npx decap-server` für lokale Entwicklung).

## Projektstruktur

```
├── hugo-site/           # Hugo-Projekt (Website)
│   ├── config/          # Hugo-Konfiguration
│   ├── content/         # Markdown-Inhalte
│   ├── layouts/         # HTML-Templates
│   ├── static/          # Bilder, PDFs, etc.
│   └── assets/          # CSS, JS (Build)
├── admin/               # Decap CMS
├── ai-tools/            # Modulare AI-Features
├── scripts/             # Build- und Hilfsscripts
├── docs/                # Dokumentation
│   ├── BETRIEB.md       # Für WebCom (technisch)
│   └── REDAKTION.md     # Für Mitarbeitende
└── image-prompts.md     # KI-Bild-Prompts
```

## Dokumentation

- **[BETRIEB.md](docs/BETRIEB.md)** — Technische Betriebsdokumentation für WebCom 2000 GmbH
- **[REDAKTION.md](docs/REDAKTION.md)** — Redaktionshandbuch für Heim-Mitarbeitende
- **[image-prompts.md](image-prompts.md)** — Prompts für KI-Bildgenerierung

## Deployment

Automatisch bei Push auf `main` via GitHub Actions → Cloudflare Pages.

## AI-Features

Konfiguration in `ai-tools/config.yaml`. Aktuell aktiv:

- **Quality-Checker**: Prüft Links, Alt-Texte und Platzhalter

Geplant (Phase 2):
- Content-Assistent, Bild-Optimierer, Erinnerungs-System, SEO-Optimierer
