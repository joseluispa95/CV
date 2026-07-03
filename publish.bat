@echo off
REM ============================================================
REM  Publica la web en GitHub (repo: CV) y deja lista GitHub Pages
REM  Requisitos: Git y GitHub CLI (gh) instalados.
REM    - Git:  https://git-scm.com/download/win
REM    - gh :  https://cli.github.com/
REM  Doble clic para ejecutar, o desde terminal: publish.bat
REM ============================================================

cd /d "%~dp0"

echo.
echo === Comprobando GitHub CLI ===
where gh >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontro "gh" (GitHub CLI). Instalalo desde https://cli.github.com/ y vuelve a ejecutar.
  pause
  exit /b 1
)

echo.
echo === Login en GitHub (si hace falta) ===
gh auth status >nul 2>nul || gh auth login

echo.
echo === Inicializando repositorio ===
if not exist ".git" git init
git add .
git commit -m "Portfolio web" || echo (No habia cambios que commitear)
git branch -M main

echo.
echo === Creando repo CV en GitHub y subiendo ===
gh repo create CV --public --source=. --remote=origin --push

echo.
echo === Activando GitHub Pages (rama main, carpeta raiz) ===
for /f "delims=" %%u in ('gh api user --jq ".login"') do set GHUSER=%%u
gh api -X POST repos/%GHUSER%/CV/pages -f "source[branch]=main" -f "source[path]=/" 2>nul || echo (Si falla, activalo a mano en Settings ^> Pages)

echo.
echo ============================================================
echo  LISTO. En 1-2 minutos estara online en:
echo    https://%GHUSER%.github.io/CV/
echo  Si Pages no se activo solo: GitHub ^> Settings ^> Pages ^>
echo    Source: Deploy from a branch ^> main ^> / (root)
echo ============================================================
echo.
pause
