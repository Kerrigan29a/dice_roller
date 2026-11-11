"""Assemble three runtimes around a single copy of the shared static assets."""
from pathlib import Path
import shutil
import hashlib
import json

ROOT = Path(__file__).resolve().parent.parent


def main():
    output = ROOT / "dist"
    applications = {
        "elm": ["elm.js", "app.js"],
        "gleam": ["app.js"],
        "go": ["wasm_exec.js", "app.js", "app.wasm"],
    }
    for language, files in applications.items():
        for name in files:
            if not (ROOT / "build" / language / name).is_file():
                raise SystemExit(f"Compile {language} before assembling the site.")
    if output.exists():
        shutil.rmtree(output)
    ignore = shutil.ignore_patterns(".DS_Store", "__pycache__")
    shutil.copytree(ROOT / "site", output, ignore=ignore)
    assets = ROOT / "assets"
    shutil.copytree(assets, output / "assets", ignore=ignore)
    pack = {path.relative_to(assets).as_posix(): path.read_text()
            for path in sorted((assets / "icons").rglob("*.svg"))}
    catalog = json.loads((assets / "icons/icons.json").read_text())
    expected = {f"icons/ffffff/transparent/{size}/{author}/{name}.svg"
                for size, authors in catalog["icons"].items()
                for author, names in authors.items() for name in names}
    if set(pack) != expected:
        raise SystemExit("The pictogram catalog and SVG files do not match.")
    (output / "assets/offline-icons.json").write_text(json.dumps(pack, separators=(",", ":")))
    count = len(pack)
    template = (ROOT / "web/index.html.in").read_text().replace("__ICON_COUNT__", str(count))
    worker_template = (ROOT / "web/service-worker.js.in").read_text()
    common = ["../assets/" + path.name for path in sorted((output / "assets").iterdir()) if path.is_file()]
    common += ["../assets/icons/icons.json"]
    for language, files in applications.items():
        app = output / language
        app.mkdir()
        for name in files:
            shutil.copy2(ROOT / "build" / language / name, app / name)
        scripts = [f'<script defer src="{name}"></script>' for name in files if name.endswith(".js") and name != "app.js"]
        scripts.append('<script type="module" src="app.js"></script>')
        (app / "index.html").write_text(template.replace("__SCRIPTS__", "\n    ".join(scripts)))
        shutil.copy2(ROOT / "web/manifest.json", app / "manifest.json")
        paths = ["index.html", "manifest.json", *files, *common]
        version = hashlib.sha256(worker_template.encode())
        for name in paths:
            version.update(name.encode() + b"\0")
            version.update(hashlib.sha256((app / name).read_bytes()).digest())
        worker = worker_template.replace("__PRECACHE__", json.dumps(paths)).replace("__BUILD_VERSION__", json.dumps(version.hexdigest()))
        (app / "service-worker.js").write_text(worker)
    (output / ".nojekyll").touch()


if __name__ == "__main__":
    main()
