"""Assemble the static PWA around the bundled JavaScript and shared assets."""
import shutil
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from generate_service_worker import ASSETS, DIST, TEMPLATE, generate_worker, pack_icons, render_index


def main():
    if not (DIST / "app.js").is_file():
        raise SystemExit("Bundle the JavaScript target before assembling dist/.")

    DIST.mkdir(exist_ok=True)
    modules = DIST / "modules"
    if modules.exists():
        shutil.rmtree(modules)
    for asset in ASSETS.iterdir():
        if asset != TEMPLATE and asset.name != "app.js" and not asset.name.startswith("."):
            target = DIST / asset.name
            if asset.is_dir():
                if target.exists():
                    shutil.rmtree(target)
                shutil.copytree(asset, target)
            else:
                shutil.copy2(asset, target)
    render_index()
    pack_icons()
    generate_worker()


if __name__ == "__main__":
    main()
