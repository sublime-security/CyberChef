#!/bin/bash
set -e

echo "Building CyberChef for Cloudflare Workers..."

# Install dependencies and build with Node 18
npm install
npm run build

# Clean up unnecessary files
rm -f build/prod/*.zip build/prod/BundleAnalyzerReport.html

echo "Build complete!"
