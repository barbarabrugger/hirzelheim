#!/usr/bin/env node

/**
 * Bild-Optimierung für die Hirzelheim-Website
 *
 * Konvertiert Bilder in WebP-Format und optimiert die Grösse.
 * Benötigt: npm install sharp
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'hugo-site', 'static', 'images');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const MAX_WIDTH = 1920;
const QUALITY = 80;

async function optimizeImages() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('❌ sharp ist nicht installiert. Bitte ausführen:');
    console.error('   npm install sharp');
    process.exit(1);
  }

  function getAllImages(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getAllImages(fullPath));
      } else if (SUPPORTED_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const images = getAllImages(IMAGES_DIR);
  console.log(`📷 ${images.length} Bilder gefunden.\n`);

  for (const imagePath of images) {
    const relPath = path.relative(IMAGES_DIR, imagePath);
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    try {
      await sharp(imagePath)
        .resize(MAX_WIDTH, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(webpPath);

      const originalSize = fs.statSync(imagePath).size;
      const webpSize = fs.statSync(webpPath).size;
      const savings = Math.round((1 - webpSize / originalSize) * 100);

      console.log(`✅ ${relPath} → WebP (${savings}% kleiner)`);
    } catch (err) {
      console.error(`❌ Fehler bei ${relPath}: ${err.message}`);
    }
  }
}

optimizeImages();
