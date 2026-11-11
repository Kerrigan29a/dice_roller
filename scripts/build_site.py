"""Assemble the landing page and the three independently built static apps."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent


def main():
    output = ROOT / "dist"
    # Check everything before replacing the previous complete site.
    applications = {name: ROOT / name / "dist" for name in ("elm", "gleam", "go")}
    for name, source in applications.items():
        if not (source / "index.html").is_file():
            raise SystemExit(f"Build {name} before assembling the site.")
    if output.exists():
        shutil.rmtree(output)
    shutil.copytree(ROOT / "site", output)
    for name, source in applications.items():
        shutil.copytree(source, output / name)
    (output / ".nojekyll").touch()


if __name__ == "__main__":
    main()
