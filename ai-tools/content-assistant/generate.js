#!/usr/bin/env node

/**
 * Content-Assistent: Generiert Tagebuch-Entwürfe aus Stichpunkten
 * Status: Phase 2 — Stub
 */

const fs = require('fs');
const path = require('path');

// Feature-Toggle prüfen
const yaml = require('js-yaml'); // npm install js-yaml
const config = yaml.load(fs.readFileSync(path.join(__dirname, '..', 'config.yaml'), 'utf8'));

if (!config.features['content-assistant'].enabled) {
  console.log('Content-Assistent ist deaktiviert. Aktivierung in ai-tools/config.yaml.');
  process.exit(0);
}

// TODO Phase 2: AI-Integration implementieren
// - Stichpunkte als CLI-Argument oder via stdin entgegennehmen
// - AI API aufrufen (Claude oder OpenAI)
// - Markdown-Datei generieren
// - In hugo-site/content/aktuell/ speichern

console.log('Content-Assistent: Noch nicht implementiert (Phase 2).');
