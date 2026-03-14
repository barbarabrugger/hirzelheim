#!/usr/bin/env node

/**
 * Quality-Checker für die Hirzelheim-Website
 *
 * Prüft die gebaute Hugo-Site auf:
 * - Kaputte interne Links
 * - Fehlende Alt-Texte bei Bildern
 * - Platzhalter-Text im Output
 * - Grundlegende HTML-Validierung
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', '..', 'hugo-site', 'public');
const PLACEHOLDER_PATTERNS = [
  /\{[a-z_]+\}/gi,           // {vendor_count}, {placeholder}
  /TODO/g,                    // TODO
  /PRÜFEN/g,                  // PRÜFEN
  /FIXME/g,                   // FIXME
  /XXX/g,                     // XXX
  /lorem ipsum/gi,            // Lorem ipsum
  /placeholder/gi,            // placeholder (in sichtbarem Text)
];

let errors = 0;
let warnings = 0;

function log(type, message) {
  const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '✅';
  console.log(`${prefix}  ${message}`);
  if (type === 'error') errors++;
  if (type === 'warn') warnings++;
}

function getAllHtmlFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractLinks(html) {
  const linkRegex = /href="([^"]*?)"/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[1]);
  }
  return links;
}

function extractImages(html) {
  const imgRegex = /<img\s[^>]*?>/gi;
  const images = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const tag = match[0];
    const srcMatch = tag.match(/src="([^"]*?)"/);
    const altMatch = tag.match(/alt="([^"]*?)"/);
    images.push({
      src: srcMatch ? srcMatch[1] : '',
      alt: altMatch ? altMatch[1] : null,
      tag: tag,
    });
  }
  return images;
}

function stripHtmlTags(html) {
  // Remove script and style content
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');
  // Remove tags
  text = text.replace(/<[^>]+>/g, ' ');
  return text;
}

function checkInternalLinks(htmlFiles) {
  console.log('\n📋 Prüfe interne Links...');
  let checked = 0;
  let broken = 0;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const links = extractLinks(html);
    const relPath = path.relative(PUBLIC_DIR, file);

    for (const link of links) {
      // Skip external links, anchors, mailto, tel, javascript
      if (link.startsWith('http') || link.startsWith('#') ||
          link.startsWith('mailto:') || link.startsWith('tel:') ||
          link.startsWith('javascript:') || link.startsWith('data:')) {
        continue;
      }

      checked++;
      // Resolve relative to public dir
      let targetPath = link;
      if (targetPath.startsWith('/')) {
        targetPath = path.join(PUBLIC_DIR, targetPath);
      } else {
        targetPath = path.join(path.dirname(file), targetPath);
      }

      // Check if it's a directory (should have index.html)
      if (targetPath.endsWith('/') || !path.extname(targetPath)) {
        const withIndex = path.join(targetPath, 'index.html');
        const withoutSlash = targetPath + '.html';
        if (!fs.existsSync(withIndex) && !fs.existsSync(withoutSlash) && !fs.existsSync(targetPath)) {
          log('error', `Kaputter Link in ${relPath}: ${link}`);
          broken++;
        }
      } else if (!fs.existsSync(targetPath)) {
        // Could be a file (PDF, image, etc.)
        log('warn', `Fehlende Datei in ${relPath}: ${link}`);
        broken++;
      }
    }
  }

  log('info', `${checked} interne Links geprüft, ${broken} problematisch.`);
}

function checkAltTexts(htmlFiles) {
  console.log('\n📋 Prüfe Alt-Texte...');
  let total = 0;
  let missing = 0;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const images = extractImages(html);
    const relPath = path.relative(PUBLIC_DIR, file);

    for (const img of images) {
      total++;
      if (img.alt === null || img.alt.trim() === '') {
        // Decorative images with role="presentation" or aria-hidden are OK
        if (img.tag.includes('aria-hidden="true"') || img.tag.includes('role="presentation"')) {
          continue;
        }
        log('error', `Fehlender Alt-Text in ${relPath}: ${img.src}`);
        missing++;
      }
    }
  }

  log('info', `${total} Bilder geprüft, ${missing} ohne Alt-Text.`);
}

function checkPlaceholders(htmlFiles) {
  console.log('\n📋 Prüfe Platzhalter-Texte...');
  let found = 0;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const visibleText = stripHtmlTags(html);
    const relPath = path.relative(PUBLIC_DIR, file);

    for (const pattern of PLACEHOLDER_PATTERNS) {
      const matches = visibleText.match(pattern);
      if (matches) {
        for (const match of matches) {
          log('warn', `Platzhalter-Text in ${relPath}: "${match}"`);
          found++;
        }
      }
      // Reset regex lastIndex
      pattern.lastIndex = 0;
    }
  }

  log('info', `${found} Platzhalter-Texte gefunden.`);
}

function checkBasicHtml(htmlFiles) {
  console.log('\n📋 Prüfe HTML-Struktur...');

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const relPath = path.relative(PUBLIC_DIR, file);

    // Check for doctype
    if (relPath === 'index.html' || relPath.endsWith('/index.html')) {
      if (!html.trim().toLowerCase().startsWith('<!doctype html>')) {
        log('warn', `Fehlender DOCTYPE in ${relPath}`);
      }
    }

    // Check for lang attribute
    if (html.includes('<html') && !html.match(/<html[^>]*lang=/)) {
      log('warn', `Fehlendes lang-Attribut in ${relPath}`);
    }

    // Check for meta viewport
    if (html.includes('<head') && !html.includes('viewport')) {
      log('warn', `Fehlender Viewport-Meta-Tag in ${relPath}`);
    }

    // Check for title
    if (html.includes('<head') && !html.includes('<title>') && !html.includes('<title ')) {
      log('error', `Fehlender <title> in ${relPath}`);
    }
  }
}

// Main
console.log('🔍 Hirzelheim Quality-Checker\n');

if (!fs.existsSync(PUBLIC_DIR)) {
  console.error(`❌ Build-Ordner nicht gefunden: ${PUBLIC_DIR}`);
  console.error('   Bitte zuerst "hugo" im hugo-site/ Verzeichnis ausführen.');
  process.exit(1);
}

const htmlFiles = getAllHtmlFiles(PUBLIC_DIR);
console.log(`📁 ${htmlFiles.length} HTML-Dateien gefunden.\n`);

checkInternalLinks(htmlFiles);
checkAltTexts(htmlFiles);
checkPlaceholders(htmlFiles);
checkBasicHtml(htmlFiles);

// Summary
console.log('\n' + '═'.repeat(50));
console.log(`\n📊 Zusammenfassung: ${errors} Fehler, ${warnings} Warnungen\n`);

if (errors > 0) {
  console.log('❌ Es gibt Fehler, die behoben werden sollten.');
  process.exit(1);
} else if (warnings > 0) {
  console.log('⚠️  Warnungen vorhanden — bitte prüfen.');
  process.exit(0);
} else {
  console.log('✅ Alles in Ordnung!');
  process.exit(0);
}
