// Tema — uygulamanın markası (koyu lacivert + profesyonel mavi) ile uyumlu.
export const T = {
  zeminKoyu: '#04060E',
  zemin: '#070B16',
  zeminAcik: '#0B1426',
  cizgi: 'rgba(148, 163, 184, 0.16)',
  metin: '#F5F8FF',
  metinSoluk: '#93A3BC',
  metinCok: '#5E7091',
  mavi: '#3B82F6',
  maviDerin: '#1D4ED8',
  camgobegi: '#22D3EE',
  mor: '#8B5CF6',
  yesil: '#22C55E',
  amber: '#F59E0B',
  posta: 'Inter, "Segoe UI", system-ui, sans-serif',
};

export const yumusak = (p: number) => {
  // yumuşak giriş-çıkış
  const t = Math.min(1, Math.max(0, p));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
