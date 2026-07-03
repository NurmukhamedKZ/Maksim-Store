#!/bin/bash
# Builds ParkSpot in release mode and packages it as a double-clickable .app bundle.
set -euo pipefail
cd "$(dirname "$0")"

swift build -c release --product ParkSpot

APP="ParkSpot.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS"
cp .build/release/ParkSpot "$APP/Contents/MacOS/ParkSpot"
cp Info.plist "$APP/Contents/Info.plist"

echo "Built $APP"
