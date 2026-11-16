#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DERS KİTABI PDF -> SAYFA NUMARALI METİN ÖNBELLEĞİ
==================================================
Soru üretiminde tek referans ders kitabıdır. Kitap PDF'i repoya girmez (telif +
boyut); metin `docs/uretim/.kitap-metin/<slug>.json` altında tutulur (gitignore).

Kullanım
  python3 docs/uretim/araclar/kitap-metin.py --slug fizik --ekle /yol/part1.pdf
  python3 docs/uretim/araclar/kitap-metin.py --slug fizik --ekle /yol/part2.pdf   # devamı eklenir
  python3 docs/uretim/araclar/kitap-metin.py --slug fizik --rapor
  python3 docs/uretim/araclar/kitap-metin.py --slug fizik --sayfa 12-18
  python3 docs/uretim/araclar/kitap-metin.py --slug fizik --ara "sabit hızlı"
  python3 docs/uretim/araclar/kitap-metin.py --slug fizik --sifirla

Notlar
  - Parçalar veriliş sırasıyla eklenir; sayfa numaraları süreklidir.
  - Her parçanın sha256 + boyutu kayda geçer (KAYNAK-DEFTERI.md için).
  - Bir sayfada 200 karakterden az metin varsa "taranmış olabilir" uyarısı verilir.
"""
import argparse
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path

KOK = Path(__file__).resolve().parents[3]
CACHE = KOK / "docs" / "uretim" / ".kitap-metin"
ESIK = 200  # bir sayfa için "metin var" eşiği


def temizle(t: str) -> str:
    t = t.replace("\u00ad", "").replace("\ufb01", "fi").replace("\ufb02", "fl")
    t = unicodedata.normalize("NFC", t)
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n[ ]+", "\n", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def sha256(yol: Path) -> str:
    h = hashlib.sha256()
    with open(yol, "rb") as f:
        for parca in iter(lambda: f.read(1 << 20), b""):
            h.update(parca)
    return h.hexdigest()


def kayit_yolu(slug: str) -> Path:
    return CACHE / (slug + ".json")


def yukle(slug: str) -> dict:
    p = kayit_yolu(slug)
    if p.exists():
        return json.loads(p.read_text(encoding="utf-8"))
    return {"slug": slug, "sayfa_sayisi": 0, "parcalar": [], "sayfalar": []}


def kaydet(slug: str, veri: dict) -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    kayit_yolu(slug).write_text(
        json.dumps(veri, ensure_ascii=False, indent=1), encoding="utf-8"
    )


def ekle(slug: str, pdf: Path) -> None:
    try:
        from pypdf import PdfReader
    except ImportError:
        sys.exit("pypdf yok. Önce: bash docs/uretim/araclar/kur.sh")
    if not pdf.exists():
        sys.exit("PDF bulunamadı: %s" % pdf)

    reader = PdfReader(str(pdf))
    veri = yukle(slug)
    basla = veri["sayfa_sayisi"]
    bos = 0
    for i, sayfa in enumerate(reader.pages, start=1):
        try:
            metin = temizle(sayfa.extract_text() or "")
        except Exception as e:  # bozuk sayfa
            metin = ""
            print("  ! sayfa %d okunamadı: %s" % (basla + i, e))
        if len(metin) < ESIK:
            bos += 1
        veri["sayfalar"].append({"s": basla + i, "parca": len(veri["parcalar"]) + 1,
                                 "metin": metin, "kr": len(metin)})
    bilgi = {
        "dosya": pdf.name,
        "sha256": sha256(pdf),
        "boyut_mb": round(pdf.stat().st_size / (1024 * 1024), 2),
        "sayfa": len(reader.pages),
        "sayfa_araligi": [basla + 1, basla + len(reader.pages)],
    }
    veri["parcalar"].append(bilgi)
    veri["sayfa_sayisi"] = len(veri["sayfalar"])
    kaydet(slug, veri)

    print("eklendi: %s" % pdf.name)
    print("  sha256 : %s" % bilgi["sha256"])
    print("  sayfa  : %d-%d (kitap toplam %d)" %
          (bilgi["sayfa_araligi"][0], bilgi["sayfa_araligi"][1], veri["sayfa_sayisi"]))
    if bos:
        print("  ! %d sayfada metin çok kısa (<%d kr) — taranmış olabilir, OCR gerekebilir"
              % (bos, ESIK))


def rapor(slug: str) -> None:
    veri = yukle(slug)
    if not veri["sayfalar"]:
        sys.exit("Kayıt yok: %s (önce --ekle)" % kayit_yolu(slug))
    print("== KİTAP METİN RAPORU: %s ==" % slug)
    for p in veri["parcalar"]:
        print("  parça %d: %s · %s MB · s.%d-%d · sha256 %s…"
              % (veri["parcalar"].index(p) + 1, p["dosya"], p["boyut_mb"],
                 p["sayfa_araligi"][0], p["sayfa_araligi"][1], p["sha256"][:12]))
    print("  toplam sayfa: %d" % veri["sayfa_sayisi"])
    kisa = [x for x in veri["sayfalar"] if x["kr"] < ESIK]
    print("  metinsiz/zayıf sayfa: %d" % len(kisa))
    if kisa:
        print("    " + ", ".join(str(x["s"]) for x in kisa[:40]) +
              (" …" if len(kisa) > 40 else ""))
    print("\n  sayfa  kr    ilk satır")
    for x in veri["sayfalar"]:
        ilk = " ".join(x["metin"].split())[:70]
        print("  %5d %5d  %s" % (x["s"], x["kr"], ilk))


def sayfa_yaz(slug: str, aralik: str) -> None:
    veri = yukle(slug)
    if not veri["sayfalar"]:
        sys.exit("Kayıt yok: %s" % kayit_yolu(slug))
    m = re.match(r"^(\d+)(?:\s*-\s*(\d+))?$", aralik.strip())
    if not m:
        sys.exit("Sayfa aralığı biçimi: 12 veya 12-18")
    a = int(m.group(1))
    b = int(m.group(2)) if m.group(2) else a
    for x in veri["sayfalar"]:
        if a <= x["s"] <= b:
            print("\n===== s.%d =====" % x["s"])
            print(x["metin"] if x["metin"] else "(metin yok — taranmış sayfa)")


def ara(slug: str, terim: str) -> None:
    veri = yukle(slug)
    if not veri["sayfalar"]:
        sys.exit("Kayıt yok: %s" % kayit_yolu(slug))
    q = unicodedata.normalize("NFC", terim).lower()
    bulunan = 0
    for x in veri["sayfalar"]:
        duz = " ".join(x["metin"].split())
        i = duz.lower().find(q)
        if i >= 0:
            bulunan += 1
            print("s.%-4d … %s …" % (x["s"], duz[max(0, i - 90): i + 120]))
            if bulunan >= 30:
                print("(ilk 30 sonuç)")
                break
    if not bulunan:
        print("bulunamadı: %r" % terim)


def main() -> None:
    ap = argparse.ArgumentParser(add_help=True)
    ap.add_argument("--slug", required=True, help="kitap kısa adı (ör. fizik)")
    ap.add_argument("--ekle", action="append", default=[], metavar="PDF")
    ap.add_argument("--rapor", action="store_true")
    ap.add_argument("--sayfa", metavar="A-B")
    ap.add_argument("--ara", metavar="TERİM")
    ap.add_argument("--sifirla", action="store_true")
    a = ap.parse_args()

    if a.sifirla:
        p = kayit_yolu(a.slug)
        if p.exists():
            p.unlink()
            print("sıfırlandı: %s" % p)
        else:
            print("kayıt yoktu")
        return
    for pdf in a.ekle:
        ekle(a.slug, Path(pdf).expanduser().resolve())
    if a.rapor:
        rapor(a.slug)
    if a.sayfa:
        sayfa_yaz(a.slug, a.sayfa)
    if a.ara:
        ara(a.slug, a.ara)
    if not (a.ekle or a.rapor or a.sayfa or a.ara):
        ap.print_help()


if __name__ == "__main__":
    main()
