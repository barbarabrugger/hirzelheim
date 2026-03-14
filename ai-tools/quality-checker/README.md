# Quality-Checker

## Was macht dieses Feature?

Prüft die gebaute Website automatisch auf häufige Qualitätsprobleme:

- **Interne Links**: Sind alle internen Links erreichbar?
- **Alt-Texte**: Haben alle Bilder Alt-Texte?
- **Platzhalter**: Gibt es noch Platzhalter-Texte (TODO, PRÜFEN, etc.)?
- **HTML-Validierung**: Grundlegende HTML-Struktur korrekt?
- **Lighthouse** (optional): Performance- und Accessibility-Checks

## Status

**Aktiv** — kann sofort verwendet werden.

## Verwendung

```bash
# Voraussetzung: Hugo-Site muss gebaut sein
cd hugo-site && hugo

# Quality-Check ausführen
node ../ai-tools/quality-checker/check.js
```

## Konfiguration

Keine spezielle Konfiguration nötig. Der Checker analysiert den `hugo-site/public/`-Ordner.
