UV_RUN := uv run --locked --
PYTHON ?= python3
GLEAM ?= .tools/gleam
GO ?= .tools/go/bin/go
PORT ?= 4176

.PHONY: all bootstrap browsers build build-elm build-gleam build-go generate run test publish clean clean-all cleanall
all: run

bootstrap:
	sh scripts/install-gleam.sh
	sh scripts/install-go.sh
	$(UV_RUN) npm ci

browsers: node_modules/.package-lock.json
	$(UV_RUN) npm exec -- playwright install chromium firefox

.tools/gleam: scripts/install-gleam.sh
	sh scripts/install-gleam.sh

.tools/go/bin/go: scripts/install-go.sh
	sh scripts/install-go.sh

node_modules/.package-lock.json: package.json package-lock.json uv.lock
	$(UV_RUN) npm ci

generate:
	$(PYTHON) scripts/generate_tables.py

build-elm: generate node_modules/.package-lock.json
	mkdir -p build/elm
	cd elm && PATH="$(abspath .venv/bin):$$PATH" ../node_modules/.bin/elm make src/Main.elm --optimize --output=../build/elm/main.js
	$(UV_RUN) node scripts/bundle.mjs elm

build-gleam: generate $(GLEAM) node_modules/.package-lock.json
	cd gleam && $(abspath $(GLEAM)) build --target javascript
	$(UV_RUN) node scripts/bundle.mjs gleam

build-go: generate $(GO) node_modules/.package-lock.json
	mkdir -p build/go
	cd go && GOOS=js GOARCH=wasm $(abspath $(GO)) build -trimpath -ldflags="-s -w" -o ../build/go/app.wasm ./app
	cp "$$($(GO) env GOROOT)/lib/wasm/wasm_exec.js" build/go/wasm_exec.js
	$(UV_RUN) node scripts/bundle.mjs go

build: build-elm build-gleam build-go
	$(PYTHON) scripts/build_site.py

run: build
	$(PYTHON) -m http.server $(PORT) --bind 127.0.0.1 --directory dist

test: build
	cd go && $(abspath $(GO)) test ./internal/...
	PORT=$(PORT) $(UV_RUN) npm test

publish: build
	$(PYTHON) scripts/publish.py

clean:
	rm -rf build dist elm/elm-stuff elm/generated gleam/build
	rm -f go/internal/roller/tables.json go/internal/roller/version.go
	rm -f gleam/src/dice_roller/table_data.gleam gleam/src/dice_roller/build_info.gleam

clean-all: clean
	rm -rf .tools .venv node_modules playwright-report test-results
	find . -name .git -prune -o -type d -name __pycache__ -prune -exec rm -rf {} + -o -type f -name .DS_Store -exec rm -f {} +

cleanall: clean-all
