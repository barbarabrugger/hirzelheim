#!/bin/bash
set -e

echo "🏗️  Hirzelheim Website — Setup"
echo "==============================="
echo ""

# Hugo prüfen
if ! command -v hugo &> /dev/null; then
  echo "❌ Hugo ist nicht installiert."
  echo "   Installation: https://gohugo.io/installation/"
  echo ""
  echo "   macOS:   brew install hugo"
  echo "   Linux:   snap install hugo"
  echo "   Windows: choco install hugo-extended"
  exit 1
fi

echo "✅ Hugo gefunden: $(hugo version)"
echo ""

# Node.js prüfen (für AI-Tools)
if command -v node &> /dev/null; then
  echo "✅ Node.js gefunden: $(node --version)"
else
  echo "⚠️  Node.js nicht gefunden — AI-Tools benötigen Node.js"
fi

echo ""

# Erster Build
echo "📦 Erster Build..."
cd hugo-site
hugo --minify

echo ""
echo "✅ Build erfolgreich! Dateien in hugo-site/public/"
echo ""

# Admin-Bereich kopieren
echo "📋 Admin-Bereich kopieren..."
cp -r ../admin public/admin
echo "✅ Admin-Bereich unter /admin verfügbar"
echo ""

echo "🚀 Lokaler Server starten mit:"
echo "   cd hugo-site && hugo server"
echo ""
echo "   Admin-Bereich (lokal): http://localhost:1313/admin/"
echo ""
echo "🎉 Setup abgeschlossen!"
