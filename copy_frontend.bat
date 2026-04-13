@echo off
set SRC=d:\NAAN MUDHALVAN
set DEST=d:\NAAN MUDHALVAN\frontend

copy "%SRC%\index.html"        "%DEST%\index.html"
copy "%SRC%\vite.config.ts"    "%DEST%\vite.config.ts"
copy "%SRC%\tsconfig.json"     "%DEST%\tsconfig.json"
copy "%SRC%\tsconfig.app.json" "%DEST%\tsconfig.app.json"
copy "%SRC%\tsconfig.node.json""%DEST%\tsconfig.node.json"
copy "%SRC%\eslint.config.js"  "%DEST%\eslint.config.js"
copy "%SRC%\.env.example"      "%DEST%\.env.example"
copy "%SRC%\.gitignore"        "%DEST%\.gitignore"

echo Done copying config files.
