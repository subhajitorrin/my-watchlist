@echo off
cd /d "%~dp0"

git add .

git commit -m "updates on backend filtering..."

git push -u origin main