UV_RUN := uv run --locked --
ELM := node_modules/.bin/elm
ELM_INPUTS := $(shell find src -type d -o -name '*.elm') elm.json
STATIC_ASSETS := $(filter-out assets/icons assets/service-worker.js.in,$(wildcard assets/*))
ICON_INPUTS := $(shell find assets/icons -name '.*' -prune -o -print)

.PHONY: all build clean run test
.DELETE_ON_ERROR:

all: run

clean:
	rm -rf dist
	rm -rf elm-stuff

run: build
	$(UV_RUN) python -m http.server --directory dist

build: dist/service-worker.js

test: build
	$(UV_RUN) npm test

dist:
	mkdir -p $@

$(ELM): package.json package-lock.json pyproject.toml uv.lock
	$(UV_RUN) npm ci
	test -x $@

dist/main.js: $(ELM_INPUTS) $(ELM) | dist
	$(UV_RUN) ./$(ELM) make src/Main.elm --output=$@ --optimize

dist/service-worker.js: assets assets/service-worker.js.in generate_service_worker.py dist/main.js $(STATIC_ASSETS:assets/%=dist/%) dist/icons/icons.json dist/offline-icons.json
	$(UV_RUN) python generate_service_worker.py

dist/icons/icons.json: $(ICON_INPUTS) | dist
	rm -rf dist/icons
	cp -R assets/icons dist/icons

dist/offline-icons.json: generate_service_worker.py $(ICON_INPUTS) | dist
	$(UV_RUN) python generate_service_worker.py --pack-icons

dist/index.html: assets/index.html assets/icons/icons.json generate_service_worker.py | dist
	$(UV_RUN) python generate_service_worker.py --render-index

dist/%: assets/% | dist
	cp $< $@
