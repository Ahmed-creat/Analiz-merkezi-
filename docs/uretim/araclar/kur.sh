#!/usr/bin/env bash
# pypdf kurulumu (her yeni oturumda gerekebilir — kurulum sandbox dışına yazılır)
set -euo pipefail
if python3 -c "import pypdf" >/dev/null 2>&1; then
  python3 -c "import pypdf; print('pypdf hazır:', pypdf.__version__)"
else
  pip3 install --quiet --break-system-packages pypdf
  python3 -c "import pypdf; print('pypdf kuruldu:', pypdf.__version__)"
fi
