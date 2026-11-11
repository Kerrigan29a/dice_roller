import argparse
import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).parent
ASSETS = ROOT / "assets"
DIST = ROOT / "dist"
TEMPLATE = ASSETS / "service-worker.js.in"
ICON_PACK = DIST / "offline-icons.json"


def pack_icons():
    icons = {
        path.relative_to(ASSETS).as_posix(): path.read_text(encoding="utf-8")
        for path in sorted((ASSETS / "icons").rglob("*.svg"))
    }
    ICON_PACK.write_text(json.dumps(icons, separators=(",", ":")), encoding="utf-8")


def render_index():
    catalog = json.loads((ASSETS / "icons/icons.json").read_text(encoding="utf-8"))
    count = sum(len(names) for authors in catalog["icons"].values() for names in authors.values())
    template = (ASSETS / "index.html").read_text(encoding="utf-8")
    (DIST / "index.html").write_text(template.replace("__ICON_COUNT__", str(count)), encoding="utf-8")


def generate_worker():
    shell_assets = sorted(
        DIST / path.name
        for path in ASSETS.iterdir()
        if path.is_file() and not path.name.startswith(".") and path != TEMPLATE
    )
    precache = [DIST / "main.js", *shell_assets, DIST / "icons/icons.json", ICON_PACK]

    template = TEMPLATE.read_text(encoding="utf-8")
    paths = [path.relative_to(DIST).as_posix() for path in precache]
    version = hashlib.sha256(template.encode("utf-8"))
    for name, path in zip(paths, precache):
        version.update(name.encode("utf-8") + b"\0")
        version.update(hashlib.sha256(path.read_bytes()).digest())

    worker = template.replace("__PRECACHE__", json.dumps(paths)).replace(
        "__BUILD_VERSION__", json.dumps(version.hexdigest())
    )
    (DIST / "service-worker.js").write_text(worker, encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--pack-icons", action="store_true")
    mode.add_argument("--render-index", action="store_true")
    args = parser.parse_args()
    if args.pack_icons:
        pack_icons()
    elif args.render_index:
        render_index()
    else:
        generate_worker()
