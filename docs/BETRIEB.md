# Technische Betriebsdokumentation — Hirzelheim-Website

**Für:** WebCom 2000 GmbH (technischer Betrieb)
**Stand:** März 2026

---

## Übersicht

Die Website hirzelheim.ch ist eine **statische Website**, gebaut mit [Hugo](https://gohugo.io/). Es gibt keine Datenbank, kein PHP, keinen klassischen Webserver. Die gesamte Site wird aus Markdown-Dateien und Templates generiert und als statische HTML-Dateien ausgeliefert.

### Architektur

```
GitHub Repository
    ↓ (Push auf main)
GitHub Actions
    ↓ (Hugo Build)
Cloudflare Pages
    ↓ (CDN)
hirzelheim.ch
```

## Was muss WebCom tun?

**Kurz: Fast nichts.**

- **DNS pflegen**: Die Domain hirzelheim.ch zeigt auf Cloudflare Pages. DNS-Einträge werden im Cloudflare Dashboard verwaltet.
- **SSL**: Wird automatisch von Cloudflare bereitgestellt und erneuert. Kein Handlungsbedarf.
- **Backup**: Das Git-Repository IST das Backup. Jede Änderung ist versioniert und rückverfolgbar.
- **Updates**: Es gibt keine Server-Software, die aktualisiert werden muss. Hugo und die Dependencies werden nur beim Build verwendet.

## Hosting

### Cloudflare Pages

- **Dashboard**: https://dash.cloudflare.com/
- **Projekt**: `hirzelheim`
- **Deployment**: Automatisch bei jedem Push auf den `main`-Branch
- **Custom Domain**: hirzelheim.ch (CNAME auf Cloudflare Pages)

### DNS-Konfiguration

| Typ   | Name          | Inhalt                        |
|-------|---------------|-------------------------------|
| CNAME | hirzelheim.ch | hirzelheim.pages.dev          |
| CNAME | www           | hirzelheim.pages.dev          |

## Git-Repository

- **Plattform**: GitHub
- **Deployment-Branch**: `main`
- **Inhalt**: Alles — Templates, Content, Konfiguration, Scripts

### Wichtige Verzeichnisse

| Verzeichnis      | Inhalt                          |
|------------------|---------------------------------|
| `hugo-site/content/` | Alle Textinhalte (Markdown) |
| `hugo-site/static/`  | Bilder, PDFs, statische Dateien |
| `admin/`             | Decap CMS Konfiguration      |
| `ai-tools/`          | Optionale AI-Features         |

## Redaktionssystem (Decap CMS)

Die Heim-Mitarbeitenden bearbeiten Inhalte über `/admin` im Browser. Das CMS speichert Änderungen direkt als Git-Commits. Es gibt keine separate Datenbank.

### Zugang einrichten

Decap CMS verwendet Git-Gateway (z.B. via Netlify Identity oder GitHub OAuth). Für neue Redakteure:

1. GitHub-Account erstellen (oder bestehenden verwenden)
2. Zugang zum Repository gewähren (Collaborator)
3. Login unter https://hirzelheim.ch/admin/

## Notfall-Prozedur

### Website ist nicht erreichbar

1. **Cloudflare-Status prüfen**: https://www.cloudflarestatus.com/
2. **DNS prüfen**: `dig hirzelheim.ch` — zeigt auf Cloudflare Pages?
3. **Deployment prüfen**: GitHub Actions → letzter Build erfolgreich?
4. **Letzte Änderung rückgängig machen**: Im Git-Repository den letzten Commit reverten

### Website zeigt falschen Inhalt

1. Im GitHub-Repository prüfen, ob ungewollte Änderungen committed wurden
2. Alten Stand wiederherstellen: `git revert <commit-hash>`
3. Auf `main` pushen → automatisches Re-Deployment

### Redakteur kann sich nicht einloggen

1. GitHub-Zugang prüfen
2. Repository-Berechtigung prüfen (Collaborator-Status)
3. Browser-Cache leeren

## AI-Features ein-/ausschalten

Die AI-Features werden in `ai-tools/config.yaml` konfiguriert:

```yaml
features:
  quality-checker:
    enabled: true   # Aktiv
  content-assistant:
    enabled: false  # Deaktiviert
```

Um ein Feature zu aktivieren/deaktivieren:
1. `ai-tools/config.yaml` im Repository bearbeiten
2. `enabled: true` oder `enabled: false` setzen
3. Änderung committen und pushen

## Kontakt

Bei technischen Fragen zum Repository oder zur Architektur:
<!-- PRÜFEN: Kontaktperson für technische Übergabe -->
