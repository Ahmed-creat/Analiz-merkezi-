const fs = require('fs'), zlib = require('zlib'), path = require('path');
const src = 'node_modules/@sparticuz/chromium/bin/al2023.tar.br';
const out = '/tmp/chromium-libs';
const buf = zlib.brotliDecompressSync(fs.readFileSync(src));
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync('/tmp/al2023.tar', buf);
console.log('tar boyutu:', (buf.length / 1048576).toFixed(1), 'MB');
