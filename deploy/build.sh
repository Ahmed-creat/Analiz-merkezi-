#!/usr/bin/env bash
# Vercel build adımı: yayınlanacak statik PWA'yı bu depodaki site/ klasöründen üretir.
# Vercel projesi GitHub hesabına bağlanmadığı için (Login Connection yok) dosyalar
# build sırasında public depodan klonlanır; çıktı out/ klasörüne kopyalanır.
set -euo pipefail

BRANCH="${SITE_BRANCH:-arena/cc4de070-analiz-merkezi}"
REPO="${SITE_REPO:-https://github.com/Ahmed-creat/Analiz-merkezi-.git}"
KAYNAK="/tmp/analiz-merkezi-kaynak"

rm -rf "$KAYNAK" out
mkdir -p out

git clone --depth 1 --branch "$BRANCH" "$REPO" "$KAYNAK"
cp -a "$KAYNAK/site/." out/

test -f out/index.html
test -f out/app-pwa.js
test -d out/content/soru_havuzlari

echo "Yayın paketi hazır: $(find out -type f | wc -l) dosya, $(du -sh out | cut -f1)"
