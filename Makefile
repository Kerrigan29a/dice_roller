PYTHON ?= python3
PORT ?= 4176

.PHONY: all build run publish clean clean-all cleanall
all: run

build:
	$(MAKE) -C elm build
	$(MAKE) -C gleam build
	$(MAKE) -C go build
	$(PYTHON) scripts/build_site.py

run: build
	$(PYTHON) -m http.server $(PORT) --bind 127.0.0.1 --directory dist

publish: build
	$(PYTHON) scripts/publish.py

clean:
	$(MAKE) -C elm clean
	$(MAKE) -C gleam clean
	$(MAKE) -C go clean
	rm -rf dist

clean-all: clean
	rm -rf elm/.venv elm/node_modules gleam/.tools gleam/.venv gleam/node_modules
	rm -rf elm/playwright-report elm/test-results gleam/playwright-report gleam/test-results
	find . -name .git -prune -o -type d -name __pycache__ -prune -exec rm -rf {} + -o -type f -name .DS_Store -exec rm -f {} +

cleanall: clean-all
