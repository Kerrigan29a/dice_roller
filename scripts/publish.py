"""Publish the complete dist tree to gh-pages without changing the checkout."""
import os
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent.parent


def git(*args, env=None, cwd=ROOT):
    return subprocess.check_output(["git", *args], cwd=cwd, env=env, text=True).strip()


def main():
    if git("branch", "--show-current") != "main" or git("status", "--porcelain", "--untracked-files=normal"):
        raise SystemExit("Commit the source changes on main before publishing.")
    if git("remote", "get-url", "origin") != "https://github.com/Kerrigan29a/dice_roller.git":
        raise SystemExit("Unexpected publication repository.")
    output = ROOT / "dist"
    for name in ("", "elm", "gleam", "go"):
        if not (output / name / "index.html").is_file():
            raise SystemExit("Run make build before publishing.")
    git("fetch", "origin", "main", "gh-pages")
    source = git("rev-parse", "HEAD")
    if source != git("rev-parse", "origin/main"):
        raise SystemExit("Push main before publishing its compiled site.")
    parent = git("rev-parse", "origin/gh-pages")
    with tempfile.TemporaryDirectory(prefix="dice-roller-publish-") as temporary:
        env = {**os.environ, "GIT_INDEX_FILE": str(Path(temporary) / "index"),
               "GIT_DIR": str(ROOT / ".git"), "GIT_WORK_TREE": str(output)}
        git("read-tree", "--empty", env=env, cwd=output)
        git("add", "--force", "--all", "--", ".", env=env, cwd=output)
        tree = git("write-tree", env=env, cwd=output)
        if tree == git("rev-parse", f"{parent}^{{tree}}"):
            print("The published site is already up to date.")
            return
        commit = git("commit-tree", tree, "-p", parent, "-m", f"Publish Dice Roller from {source[:12]}")
    # A concurrent remote update rejects this ordinary, non-forced push.
    git("push", "origin", f"{commit}:refs/heads/gh-pages")
    if git("rev-parse", "refs/heads/gh-pages") == parent:
        git("update-ref", "refs/heads/gh-pages", commit, parent)
    print(f"Published {commit[:12]} from main {source[:12]}.")


if __name__ == "__main__":
    main()
