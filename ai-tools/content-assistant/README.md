# Content-Assistent

## Was macht dieses Feature?

Generiert Tagebuch-Entwürfe aus Stichpunkten. Die Heim-Mitarbeitenden geben kurze Stichworte ein (z. B. "Ausflug Zürich, Schifffahrt, Sonnenschein, alle begeistert"), und der Assistent formuliert daraus einen vollständigen Tagebuch-Eintrag im Stil des Hirzelheims.

## Status

**Phase 2** — noch nicht aktiviert.

## Aktivierung

In `ai-tools/config.yaml`:

```yaml
content-assistant:
  enabled: true
```

## Technische Umsetzung (geplant)

- Node.js-Script, das via Claude API oder OpenAI API arbeitet
- Input: Stichpunkte (String)
- Output: Markdown-Datei im Hugo-Content-Format
- Stil-Vorgaben: Warm, persönlich, Schweizer Orthografie (kein ß)
