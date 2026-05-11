# AgriMart Android Release Build Script
# Run this from anywhere:  .\build-android.ps1

$env:JAVA_HOME    = "E:\android_studio\jbr"
$env:PATH         = "$env:JAVA_HOME\bin;$env:PATH"
$env:ANDROID_HOME = "C:\Users\himan\AppData\Local\Android\Sdk"

$ROOT      = "e:\Agri_Mart\AgriMart_Android"
$ANDROID   = "$ROOT\apps\mobile\android"
$BUILDFILE = "$ANDROID\app\build.gradle"

# ── Auto-increment versionCode ────────────────────────────────────────────────
$content     = Get-Content $BUILDFILE -Raw
$match       = [regex]::Match($content, 'versionCode\s+(\d+)')
$currentCode = [int]$match.Groups[1].Value
$newCode     = $currentCode + 1
$content     = $content -replace "versionCode\s+$currentCode", "versionCode $newCode"
Set-Content $BUILDFILE $content -NoNewline
Write-Host "`nVersion code: $currentCode -> $newCode" -ForegroundColor Magenta

# ── Steps ─────────────────────────────────────────────────────────────────────
Write-Host "`n[1/4] Building web app..." -ForegroundColor Cyan
Set-Location $ROOT
npm run build:mobile
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed" -ForegroundColor Red; exit 1 }

Write-Host "`n[2/4] Syncing to Android..." -ForegroundColor Cyan
Set-Location "$ROOT\apps\mobile"
npx cap sync android
if ($LASTEXITCODE -ne 0) { Write-Host "Capacitor sync failed" -ForegroundColor Red; exit 1 }

Write-Host "`n[3/4] Building signed AAB..." -ForegroundColor Cyan
Set-Location $ANDROID
.\gradlew bundleRelease
if ($LASTEXITCODE -ne 0) { Write-Host "Gradle build failed" -ForegroundColor Red; exit 1 }

$AAB = "$ANDROID\app\build\outputs\bundle\release\app-release.aab"
Write-Host "`n[4/4] Done!" -ForegroundColor Green
Write-Host "AAB ready at: $AAB" -ForegroundColor Yellow
Write-Host "Upload this file to Play Console -> Internal Testing -> Create new release`n" -ForegroundColor Yellow

Start-Process explorer.exe "$ANDROID\app\build\outputs\bundle\release"
