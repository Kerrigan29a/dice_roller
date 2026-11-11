#!/bin/sh
set -eu

cd "$(dirname "$0")/.."
version=1.19.2
case "$(uname -s)-$(uname -m)" in
    Darwin-x86_64)
        target=x86_64-apple-darwin
        sha=c578192530507b868c4a6c8cb7ad5d2ab0830890257f41036f17c82853f19d05
        ;;
    Darwin-arm64)
        target=aarch64-apple-darwin
        sha=fa7c6113e162ab1d979f72e7dde3e907b87e4b30c518af178768e577d180324d
        ;;
    Linux-x86_64)
        target=x86_64-unknown-linux-musl
        sha=2ba2afb66ca9f6dcc01a4a6e9169b6942963bad6483bec9571ddc078cfe6f41f
        ;;
    *)
        printf 'Unsupported platform. Install Gleam %s and pass GLEAM=/path/to/gleam to make.\n' "$version" >&2
        exit 1
        ;;
esac

if [ -x .tools/gleam ] && [ "$(.tools/gleam --version)" = "gleam $version" ]; then
    exit 0
fi

mkdir -p .tools
staging=$(mktemp -d .tools/gleam.XXXXXX)
trap 'rm -rf "$staging"' EXIT
if [ "$#" -eq 1 ]; then
    cp "$1" "$staging/release.tar.gz"
else
    curl -L --fail --silent --show-error \
        "https://github.com/gleam-lang/gleam/releases/download/v$version/gleam-v$version-$target.tar.gz" \
        -o "$staging/release.tar.gz"
fi
printf '%s  %s\n' "$sha" "$staging/release.tar.gz" | shasum -a 256 -c -
tar -xzf "$staging/release.tar.gz" -C "$staging" gleam
"$staging/gleam" --version
mv "$staging/gleam" .tools/gleam
