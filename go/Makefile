PORT ?= 4178
.PHONY: all run clean build
all: run

run: build
	python3 -m http.server $(PORT) --bind 127.0.0.1 --directory dist

clean:
	rm -rf build dist

build:
	rm -rf dist
	mkdir -p dist
	GOOS=js GOARCH=wasm go build -trimpath -ldflags="-s -w" -o dist/app.wasm ./app
	cp "$$(go env GOROOT)/lib/wasm/wasm_exec.js" dist/wasm_exec.js
	python3 build.py
