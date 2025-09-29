#!/user/bin/env sh
set -e
npm run build
cd dist
git init
git checkout -b gh-pages
git remote add origin