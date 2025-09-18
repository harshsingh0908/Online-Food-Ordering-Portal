# verify_and_fix.ps1: Build backend and frontend, capture errors to generation_report.txt
$ErrorActionPreference = 'Stop'
Set-Location "$PSScriptRoot"
Set-Location "backend/demo"
mvn -q -DskipTests clean package *> ../generation_report.txt
Set-Location ../..
Set-Location src
npm ci *>> ../generation_report.txt
try {
  npx ng build --configuration development *>> ../generation_report.txt
} catch {
  npm run build *>> ../generation_report.txt
}
Write-Host "Build completed. See generation_report.txt for details."
