@echo off
cd /d "%~dp0"

git add .

git commit -m "updates on frontend..."

git push -u origin main