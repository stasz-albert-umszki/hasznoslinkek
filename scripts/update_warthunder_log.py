import json
import re
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


SOURCE_URL = "https://warthunder.com/en/game/changelog/"
ARTICLE_PATH = re.compile(r"^/en/game/changelog/current/\d+$")


def clean_text(value):
    return " ".join(value.split())


class ChangelogParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.entries = []
        self.current = None
        self.div_depth = 0
        self.field = None
        self.field_tag = None
        self.field_depth = 0
        self.field_parts = []

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        classes = set((attributes.get("class") or "").split())

        if self.current is None:
            if tag == "div" and {"showcase__item", "widget"}.issubset(classes):
                self.current = {"url": "", "title": "", "date": "", "description": ""}
                self.div_depth = 1
            return

        if tag == "div":
            self.div_depth += 1

        href = attributes.get("href", "")
        if tag == "a" and href.startswith("/en/game/changelog/current/"):
            self.current["url"] = href

        field_by_class = {
            "widget__title": "title",
            "widget__meta": "date",
            "widget__comment": "description",
        }
        for class_name, field_name in field_by_class.items():
            if class_name in classes:
                self.field = field_name
                self.field_tag = tag
                self.field_depth = self.div_depth
                self.field_parts = []
                break

    def handle_data(self, data):
        if self.current is not None and self.field is not None:
            self.field_parts.append(data)

    def handle_endtag(self, tag):
        if self.current is None:
            return

        if self.field is not None and tag == self.field_tag and self.div_depth == self.field_depth:
            self.current[self.field] = clean_text("".join(self.field_parts))
            self.field = None
            self.field_tag = None
            self.field_parts = []

        if tag == "div":
            self.div_depth -= 1
            if self.div_depth == 0:
                self.entries.append(self.current)
                self.current = None


def fetch_entries():
    request = Request(SOURCE_URL, headers={"User-Agent": "HasznosLinkekUpdater/1.0"})
    with urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"A hivatalos oldal HTTP {response.status} választ adott.")
        markup = response.read().decode("utf-8", errors="replace")

    parser = ChangelogParser()
    parser.feed(markup)
    entries = []
    for entry in parser.entries:
        parsed_url = urlparse(urljoin(SOURCE_URL, entry["url"]))
        if parsed_url.scheme != "https" or parsed_url.netloc != "warthunder.com" or not ARTICLE_PATH.fullmatch(parsed_url.path):
            continue
        if not entry["title"] or not entry["date"]:
            continue
        try:
            timestamp = datetime.strptime(entry["date"], "%d %B %Y")
        except ValueError:
            continue
        entry["url"] = parsed_url.geturl()
        entry["description"] = entry["description"][:500]
        entry["_timestamp"] = timestamp
        entries.append(entry)

    unique_entries = {entry["url"]: entry for entry in entries}
    sorted_entries = sorted(unique_entries.values(), key=lambda entry: entry["_timestamp"], reverse=True)[:6]
    for entry in sorted_entries:
        del entry["_timestamp"]
    if not sorted_entries:
        raise RuntimeError("Nem sikerült feldolgozni a hivatalos frissítési napló bejegyzéseit.")
    return sorted_entries


def main():
    repository_root = Path(__file__).resolve().parents[1]
    output_path = repository_root / "war-thunder-updates.json"
    entries = fetch_entries()

    previous_entries = []
    if output_path.exists():
        try:
            previous_entries = json.loads(output_path.read_text(encoding="utf-8")).get("entries", [])
        except (json.JSONDecodeError, AttributeError):
            previous_entries = []

    if previous_entries == entries:
        print("A frissítési napló nem változott; nincs módosítandó adatfájl.")
        return

    payload = {
        "source": SOURCE_URL,
        "updatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "entries": entries,
    }
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Frissült a {output_path.name}: {len(entries)} bejegyzés.")


if __name__ == "__main__":
    main()