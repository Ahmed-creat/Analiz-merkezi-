#!/usr/bin/env python3
"""Analiz Merkezi tanıtım filmi için özgün ambiyans parçası üretir.

Pixabay'e bu ortamdan erişilemediği için (ağ yalnız belirli paket sitelerine açık)
telif sorunu olmayan, tamamen sentezlenmiş bir "modern teknoloji" altlığı üretilir.
İstenirse public/muzik.mp3 dosyası lisanslı parçayla değiştirilebilir; film onu
otomatik kullanır.

Çıktı: public/muzik.wav (44.1 kHz, stereo, 95 sn)
"""
import math
import random
import struct
import wave

SR = 44100
SURE = 95.0
N = int(SR * SURE)

random.seed(7)


def nota(f):
    return f


# --- akor yürüyüşü: Am - F - C - G (her akor 8 sn, 12 akor) ---
AKORLAR = [
    (110.00, [220.00, 261.63, 329.63, 440.00]),   # Am
    (87.31, [174.61, 220.00, 261.63, 349.23]),    # F
    (130.81, [261.63, 329.63, 392.00, 523.25]),   # C
    (98.00, [196.00, 246.94, 293.66, 392.00]),    # G
]
AKOR_SN = 8.0

sol = [0.0] * N
sag = [0.0] * N

# ---------- ped (yastık) ----------
for i in range(N):
    t = i / SR
    a = int(t / AKOR_SN) % 4
    kok, notalar = AKORLAR[a]
    # akor geçişlerinde yumuşak giriş/çıkış
    yerel = t % AKOR_SN
    zarf = min(1.0, yerel / 1.6) * min(1.0, (AKOR_SN - yerel) / 1.6)
    zarf = zarf ** 1.5
    lfo = 0.8 + 0.2 * math.sin(2 * math.pi * 0.07 * t)
    deger = 0.0
    for j, f in enumerate(notalar):
        agirlik = 0.5 / (j + 1)
        # hafif detune ile genişlik
        deger += agirlik * math.sin(2 * math.pi * f * 0.999 * t)
        deger += agirlik * math.sin(2 * math.pi * f * 1.001 * t + 0.7)
        deger += 0.18 * agirlik * math.sin(2 * math.pi * f * 2 * t + 0.3)
    deger *= 0.11 * zarf * lfo
    sol[i] += deger * 0.95
    sag[i] += deger * 1.05

# ---------- bas ----------
for i in range(N):
    t = i / SR
    a = int(t / AKOR_SN) % 4
    kok, _ = AKORLAR[a]
    yerel = t % AKOR_SN
    zarf = min(1.0, yerel / 1.2) * min(1.0, (AKOR_SN - yerel) / 1.2)
    d = 0.16 * zarf * math.sin(2 * math.pi * (kok / 2) * t)
    sol[i] += d
    sag[i] += d

# ---------- yumuşak vuruş (kick benzeri) ----------
def vurus(baslangic, guc=1.0):
    s0 = int(baslangic * SR)
    uzunluk = int(0.55 * SR)
    for k in range(uzunluk):
        i = s0 + k
        if i >= N:
            return
        t = k / SR
        zarf = math.exp(-t * 14)
        # düşen frekans
        f = 58 + 42 * math.exp(-t * 26)
        d = 0.22 * guc * zarf * math.sin(2 * math.pi * f * t)
        sol[i] += d
        sag[i] += d


bpm = 92
vurus_aralik = 60.0 / bpm
t = 1.2
while t < SURE - 1.0:
    vurus(t, 1.0 if (round(t / vurus_aralik) % 4 == 0) else 0.55)
    t += vurus_aralik

# ---------- arpej / kıvılcım ----------
def pluck(baslangic, f, guc=0.1):
    s0 = int(baslangic * SR)
    uzunluk = int(1.8 * SR)
    for k in range(uzunluk):
        i = s0 + k
        if i >= N:
            return
        t = k / SR
        zarf = math.exp(-t * 3.2) * min(1.0, t / 0.01)
        d = guc * zarf * (math.sin(2 * math.pi * f * t) + 0.3 * math.sin(2 * math.pi * f * 2 * t))
        pan = 0.5 + 0.4 * math.sin(baslangic * 0.7)
        sol[i] += d * (1 - pan) * 1.6
        sag[i] += d * pan * 1.6


t = 0.5
sayac = 0
while t < SURE:
    a = int(t / AKOR_SN) % 4
    _, notalar = AKORLAR[a]
    f = notalar[sayac % 4] * (2 if sayac % 8 == 0 else 1)
    pluck(t, f, 0.055)
    sayac += 1
    t += 0.75

# ---------- hava / shimmer ----------
random.seed(11)
son = 0.0
for i in range(N):
    t = i / SR
    x = random.uniform(-1, 1)
    son = son * 0.985 + x * 0.015
    zarf = 0.02 + 0.02 * math.sin(2 * math.pi * 0.03 * t)
    sol[i] += son * zarf
    sag[i] += son * zarf * 0.9

# ---------- kısa yankı (delay) ----------
gecikme = int(0.24 * SR)
geri = 0.28
for i in range(gecikme, N):
    sol[i] += sol[i - gecikme] * geri * 0.5
    sag[i] += sag[i - gecikme] * geri * 0.5

# ---------- giriş / çıkış zarfları ----------
for i in range(N):
    t = i / SR
    giris = min(1.0, t / 2.4)
    cikis = min(1.0, max(0.0, (SURE - t) / 4.5))
    g = (giris ** 1.4) * (cikis ** 1.2)
    sol[i] *= g
    sag[i] *= g

# ---------- normalleştir ----------
tepe = max(1e-9, max(max(abs(v) for v in sol), max(abs(v) for v in sag)))
k = 0.82 / tepe
cerceve = bytearray()
for i in range(N):
    l = max(-1.0, min(1.0, sol[i] * k))
    r = max(-1.0, min(1.0, sag[i] * k))
    cerceve += struct.pack('<hh', int(l * 32000), int(r * 32000))

with wave.open('public/muzik.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(bytes(cerceve))

print('yazıldı: public/muzik.wav', SURE, 'sn')
