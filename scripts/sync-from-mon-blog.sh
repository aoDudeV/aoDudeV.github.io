#!/usr/bin/env bash
# Synchronise les articles et les médias depuis le blog Next.js mon-blog.
# Les redirections historiques ne sont pas régénérées : elles correspondent
# à la migration initiale du site Hexo.
set -euo pipefail

SOURCE="${1:-../mon-blog}"

if [ ! -f "$SOURCE/data/articles-base.js" ] || [ ! -f "$SOURCE/data/hexo-articles.json" ]; then
  echo "Source introuvable : $SOURCE" >&2
  echo "Usage : $0 /chemin/vers/mon-blog" >&2
  exit 1
fi

cp "$SOURCE/data/articles-base.js" src/data/articles-base.js
cp "$SOURCE/data/hexo-articles.json" src/data/hexo-articles.json

rm -rf public/images/hexo
mkdir -p public/images
cp -a "$SOURCE/public/images/hexo" public/images/hexo

echo "Articles et images synchronisés depuis $SOURCE."
echo "Les redirections de src/data/redirects.json sont conservées."
