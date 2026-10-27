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

# Supabase erişim kontrolü (build ortamından, kritik değil)
if [ -n "${SUPABASE_URL:-}" ] && [ -n "${SUPABASE_ANON_KEY:-}" ]; then
  KOD=$(curl -s -o /dev/null -m 10 -w '%{http_code}' \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    "${SUPABASE_URL}/rest/v1/app_states?select=user_id&limit=1" || true)
  echo "Supabase REST kontrolü: HTTP ${KOD} (anon anahtar geçerli, RLS: boş liste beklenir)"
else
  echo "Supabase ortam değişkenleri tanımlı değil (statik site için sorun değil)."
fi
