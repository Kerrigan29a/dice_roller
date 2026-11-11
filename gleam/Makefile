UV_RUN := uv run --locked --
GLEAM ?= .tools/gleam
PYTHON ?= python3
PORT ?= 4174

.PHONY: all bootstrap build check clean clean-all cleanall run test

all: run

bootstrap:
	sh scripts/install-gleam.sh

.tools/gleam: scripts/install-gleam.sh
	sh scripts/install-gleam.sh

build: $(GLEAM) node_modules/.package-lock.json
	$(GLEAM) build --target javascript
	$(UV_RUN) npm run build
	$(PYTHON) scripts/build.py

check: $(GLEAM)
	$(GLEAM) check --target javascript

run: build
	$(PYTHON) -m http.server $(PORT) --bind 127.0.0.1 --directory dist

node_modules/.package-lock.json: package.json package-lock.json uv.lock
	$(UV_RUN) npm ci

test: build
	PORT=$(PORT) $(UV_RUN) npm test

clean:
	rm -rf build dist

clean-all: clean
	rm -rf .tools .venv node_modules playwright-report test-results
	find . -name .git -prune -o \
		-type d -name __pycache__ -prune -exec rm -rf {} + -o \
		-type f -name .DS_Store -exec rm -f {} +

cleanall: clean-all
