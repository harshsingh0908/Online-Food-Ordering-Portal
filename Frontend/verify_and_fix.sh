#!/bin/bash
# verify_and_fix.sh: Build backend and frontend, capture errors to generation_report.txt
set -e
cd "$(dirname "$0")"
cd backend/demo
mvn -q -DskipTests clean package > ../generation_report.txt 2>&1 || exit 1
cd ../../
cd src
npm ci >> ../generation_report.txt 2>&1 || exit 1
npx ng build --configuration development >> ../generation_report.txt 2>&1 || npm run build >> ../generation_report.txt 2>&1 || exit 1
echo "Build completed. See generation_report.txt for details."
