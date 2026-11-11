#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
version=1.27.4
case "$(uname -s)-$(uname -m)" in
  Darwin-x86_64) target=darwin-amd64; sha=2b799377704ef12db39bd254995d5c348c9cc8d86562ca817724390e56c38f43 ;;
  Darwin-arm64) target=darwin-arm64; sha=91a44a2b8a716600ad94a4f143e156116620db8828086a6e3602291be9bd0bb4 ;;
  Linux-x86_64) target=linux-amd64; sha=7226736c2339719cda28fbf3a54d71aa63bcefe376e98cef00034268dab24840 ;;
  Linux-aarch64) target=linux-arm64; sha=3392582988a273a87ab5043ee1b2c9c17a2c3c00580bf9326c47a2e0aaaeac92 ;;
  *) printf 'Unsupported platform. Install Go %s and pass GO=/path/to/go.\n' "$version" >&2; exit 1 ;;
esac
if [ -x .tools/go/bin/go ] && [ "$(.tools/go/bin/go version)" = "go version go$version $(printf '%s' "$target" | tr - /)" ]; then
  exit 0
fi
mkdir -p .tools
staging=$(mktemp -d .tools/go.XXXXXX)
trap 'rm -rf "$staging"' EXIT
curl -L --fail --silent --show-error "https://go.dev/dl/go$version.$target.tar.gz" -o "$staging/go.tar.gz"
printf '%s  %s\n' "$sha" "$staging/go.tar.gz" | shasum -a 256 -c -
tar -xzf "$staging/go.tar.gz" -C "$staging"
"$staging/go/bin/go" version
rm -rf .tools/go
mv "$staging/go" .tools/go
