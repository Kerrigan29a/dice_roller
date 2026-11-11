"""Copy the browser assets and version the offline cache from the build contents."""
import hashlib
import json
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
ASSETS = ROOT / "assets"
TEMPLATE = ASSETS / "service-worker.js.in"

shutil.copytree(ASSETS, DIST, dirs_exist_ok=True, ignore=shutil.ignore_patterns(TEMPLATE.name))
version = hashlib.sha256(TEMPLATE.read_bytes())
paths = sorted(path.relative_to(DIST).as_posix() for path in DIST.rglob("*") if path.is_file())
for name in paths:
    version.update(name.encode() + b"\0")
    version.update(hashlib.sha256((DIST / name).read_bytes()).digest())
worker = TEMPLATE.read_text().replace("__BUILD_VERSION__", json.dumps(version.hexdigest()))
worker = worker.replace("__PRECACHE__", json.dumps(paths))
(DIST / "service-worker.js").write_text(worker)
