#!/bin/bash
echo "🔄 src → docs 同期中..."
rm -rf docs/*
cp -r src/* docs/
echo "✅ 同期完了！"

git add .
git commit -m "build: sync src to docs"
git push origin main
