"""Porträt eines Beraters im Trickfilm-Stil über Codex (GPT Image über das ChatGPT-Abo, keine Credits).

Ablauf je Berater:
  1. base.png  : Codex zeichnet die Person im einheitlichen Stil auf grünem Grund
  2. open.png, mid.png, blink.png : Codex bearbeitet base.png (Mund offen, Mund "o", Blinzeln)
  3. build_portraits.py baut daraus die vier Sprechbilder <key>-*.webp für den Tisch

    python portrait_codex.py <key> "<Name>" [--look "Kleidung, Merkmale"] [--photo foto.jpg]
                             [--dir build/portraits/<key>] [--out app/public/portraits] [--only base|edits|build]

Braucht die Codex-CLI (angemeldet mit dem ChatGPT-Abo), Python mit opencv-python und numpy.
"""
import argparse
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]

# Der gemeinsame Stil. Wer ihn ändert, bekommt Berater, die nicht mehr zu den anderen passen.
STYLE = (
    "a stylized Pixar-like 3D animated feature film character portrait of {name}, clearly recognizable "
    "as {name} with their real face shape, hairline, hair color and typical facial hair, "
    "cartoon proportions with slightly larger expressive eyes and soft rounded shapes, "
    "warm golden key light and soft rim light. {look} "
    "Head and upper chest bust, facing the camera straight on, centered, eyes looking at the viewer, "
    "mouth closed in a relaxed friendly smile, head filling about 40 percent of the image width, "
    "generous empty space above the head. Plain flat solid pure green (#00ff00) background, "
    "nothing else in the frame, no text, no logos, no hat."
)
KEEP = ("Keep everything else exactly identical: same character, same face, same head position and size, "
        "same pose, same clothes, same lighting, same framing, same flat pure green background.")
EDITS = {
    "open": f"Edit: the character is mid-sentence talking, mouth open wide in an 'ah' shape, teeth and tongue visible. {KEEP} Only the mouth changes.",
    "mid": f"Edit: the character is talking, mouth half open saying 'oh', lips slightly rounded. {KEEP} Only the mouth changes.",
    "blink": f"Edit: the character blinks, both eyes fully closed with relaxed eyelids. {KEEP} Only the eyes change.",
}


def codex(prompt, cwd, images=(), timeout=600):
    cmd = ["codex", "exec", "--skip-git-repo-check", "-s", "workspace-write", "-C", str(cwd)]
    for im in images:
        cmd += ["-i", str(im)]
    cmd.append("-")
    r = subprocess.run(cmd, input=prompt, text=True, encoding="utf-8", capture_output=True, timeout=timeout,
                       shell=sys.platform == "win32")
    return r.returncode, (r.stdout or "")[-400:] + (r.stderr or "")[-400:]


def make(d, name, file, prompt, images=()):
    target = d / file
    if target.exists():
        return f"{file}: schon da"
    full = (f"Use your image generation tool to create ONE square 1024x1024 image and save it as {file} "
            f"in the current folder. {prompt} Reply only with the file path.")
    for attempt in (1, 2):
        code, log = codex(full, d, images)
        if target.exists():
            return f"{file}: ok"
    return f"{file}: FEHLT ({log.strip()[-200:]})"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("key")
    ap.add_argument("name")
    ap.add_argument("--look", default="Wearing a plain dark burgundy top with no logo.")
    ap.add_argument("--photo", help="echtes Foto als Vorlage für die Ähnlichkeit (optional)")
    ap.add_argument("--dir")
    ap.add_argument("--out", default=str(ROOT / "app" / "public" / "portraits"))
    ap.add_argument("--only", choices=["base", "edits", "build"])
    a = ap.parse_args()

    d = Path(a.dir) if a.dir else ROOT / "build" / "portraits" / a.key
    d.mkdir(parents=True, exist_ok=True)

    if a.only in (None, "base"):
        prompt = "Image: " + STYLE.format(name=a.name, look=a.look)
        imgs = []
        if a.photo:
            prompt += " The attached photo shows the real person: keep their likeness, but redraw everything in the style described."
            imgs = [Path(a.photo).resolve()]
        print(make(d, a.name, "base.png", prompt, imgs), flush=True)
        if not (d / "base.png").exists():
            sys.exit(2)

    if a.only in (None, "edits"):
        with ThreadPoolExecutor(3) as ex:
            for msg in ex.map(lambda kv: make(d, a.name, f"{kv[0]}.png", "EDIT the attached image. " + kv[1], [d / "base.png"]), EDITS.items()):
                print(msg, flush=True)

    if a.only in (None, "build"):
        r = subprocess.run([sys.executable, str(HERE / "build_portraits.py"), "build", str(d), a.key, "--out", a.out])
        sys.exit(r.returncode)


if __name__ == "__main__":
    main()
