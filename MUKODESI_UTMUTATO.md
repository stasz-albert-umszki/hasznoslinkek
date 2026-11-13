# Működési útmutató

> Tanulási célú leírás a Hasznos linkek statikus weboldalának felépítéséről. A példák és a fájlnevek a jelenlegi kódot követik.

## 1. Rövid áttekintés

Ez a projekt egy egyszerű, statikus weboldal. Nincs hozzá szerveroldali alkalmazás, adatbázis, csomagkezelő vagy buildlépés. A HTML írja le az oldal tartalmát, az `alap.css` adja a közös megjelenést, az `app.js` pedig betölti a böngészős kényelmi funkciókat.

A GitHub Pages a `main` ág weboldalfájljait egyszerűen kiszolgálja. A JavaScript a látogató böngészőjében fut. A War Thunder napló adatfájlja a külön `warthunder-updates` ágon él, és egy GitHub Actions workflow frissíti.

```text
Látogató böngészője
  ├─ HTML oldalak
  ├─ alap.css
  ├─ app.js ── keresés, szűrés, kedvencek, előzmények
  └─ raw GitHub URL ── war-thunder-updates ág JSON-fájlja

GitHub Actions (a workflow a main ágon van)
  └─ scripts/update_warthunder_log.py
       └─ lekéri a hivatalos changelogot, csak a warthunder-updates ágra commitol
```

## 2. Fájlok és szerepük

| Fájl vagy ág | Szerep |
| --- | --- |
| `index.html` | Főoldal, navigációs menü és a témalapokra vezető kártyák. Az `app.js` ide teszi a kedvencek, az előzmények és a linkdarabszámok blokkot. |
| `warthunder.html` | War Thunder linkgyűjtemény és az automatikus frissítési napló üres tartóeleme. |
| `linux.html` | Linux témájú linkek. |
| `suli.html` | Tanulást segítő linkek. |
| `alap.css` | Közös színek, elrendezések, interakciós állapotok, reszponzív és mozgáscsökkentő szabályok. |
| `app.js` | Az összes főoldali és témalapi böngészős funkció. A fájl több oldalra kerül be, és csak azokat az elemeket módosítja, amelyek az adott lapon megtalálhatók. |
| `warthunder-updates` ág | A `main` kezdeti pillanatképéből indult, az élő JSON itt található, és a bot későbbi commitjai kizárólag ezt a fájlt módosítják. |
| `scripts/update_warthunder_log.py` | Lekéri, ellenőrzi, rendezi és szükség esetén kiírja a napló JSON-adatát. |
| `.github/workflows/update-war-thunder-log.yml` | A `main` ágon lévő workflow a frissítőscriptet futtatja, a megváltozott JSON-t pedig a `warthunder-updates` ágra commitolja. |
| `PICS/` | A főoldali témakártyák képei. |
| `README.md` | Projektbemutató, linkkatalógus és új link hozzáadásához minta. |
| `CHANGELOG.md` | A fontosabb elkészült változások összefoglalója. |
| `ideas.md` | Későbbi ötletek és még nyitott karbantartási feladatok. |

Az `alap.html`, a `trollolo.html`, az `1x1.gif` és a gyökérben lévő szöveges jegyzetek nem részei a fő navigációban használt oldalaknak. A főoldal nem hivatkozik rájuk.

## 3. Az oldalak felépítése

Mind a négy fő HTML-oldal magyar nyelvű, mobilnézetre beállított dokumentum. Mindegyik behúzza az `alap.css` fájlt és az `app.js` fájlt. A `defer` miatt a JavaScript a HTML feldolgozása után indul, így a keresett oldalelemek addigra már létrejöttek.

- A közös fejlécben található márkajelzés és a négy fő navigációs hivatkozás.
- Az `index.html` témakártyákat és a dinamikusan létrejövő otthoni blokkokat tartalmazza.
- A témalapokon a `.link-section` szakaszokba rendezett `.link-list` listák vannak.
- A War Thunder lapon az `.update-log` rész kezdetben csak a napló címét, státuszát, frissítőgombját és üres listáját tartalmazza. A bejegyzéseket a JavaScript teszi bele.
- A külső linkek új lapon nyílnak meg (`target="_blank"`), és a `rel="noopener noreferrer"` csökkenti az új lap és az eredeti oldal közötti biztonsági kockázatot.

Egy hivatkozás tipikusan ilyen felépítésű:

```html
<li>
  <a href="https://pelda.hu/" target="_blank" rel="noopener noreferrer"
     data-tooltip="Rövid leírás."
     aria-description="Rövid leírás.">
    <span>Link neve</span><span>↗</span>
  </a>
</li>
```

A `data-tooltip` értékét az oldal a leíráshoz, a JavaScript pedig kereshető szövegként is használja. Az `aria-description` a kisegítő technológiáknak ad leírást.

## 4. Mit csinál az `app.js`?

A kód azonnal lefutó függvényen belül van, ezért a belső változók nem kerülnek a globális névtérbe. A függvény közös fájlként fut minden oldalon, de az egyes részek csak akkor indulnak el, ha megtalálják a hozzájuk tartozó HTML-elemeket.

### Témakártyák képei

Ha egy főoldali kép nem tölthető be, a kép `error` eseménye eltávolítja azt, és az `image-unavailable` osztályra vált. Így nem marad törött képikon.

### Keresés, kategória és rendezés

Ha vannak `.link-list` elemek, az `app.js` vezérlősávot készít eléjük. Ez tartalmazza a keresést, kategóriaszűrőt, kedvencszűrőt és rendezést.

- A kereső a link nevét és a `data-tooltip` leírását vizsgálja, magyar kis- és nagybetű-kezeléssel.
- A kategóriákat a HTML-ben szereplő `.link-section` címekből állítja elő.
- A kedvencszűrő csak a mentett kedvenc hivatkozásokat hagyja láthatóan.
- A név szerinti rendezés magyar nyelvi összehasonlítást használ; az eredeti sorrendhez eltárolja a listaelemek kezdeti indexét.
- A nem egyező elemek és üres csoportok rejtve maradnak, az eredményszámláló frissül.

### Kedvencek és legutóbbi linkek

A csillag gombok a `.link-list` sorok mellett, futás közben jönnek létre. A kedvenceket a böngésző `localStorage` tárában a `hasznoslinkek-favorites` kulcs tárolja. A legutóbb megnyitott linkek a `hasznoslinkek-recent` kulcsba kerülnek; az ismétlődő URL előre kerül, a lista legfeljebb hat elemes.

A főoldal minden témakártyához linkdarabszámot ad, és létrehozza a Kedvencek, illetve Legutóbb megnyitott blokkokat. Az előzményekből legfeljebb négy jelenik meg. A témák linkdarabszámai jelenleg kézzel vannak beírva az `app.js` `topicCounts` objektumában; új link felvételekor ezt is frissíteni kell.

A tárolás böngészőhöz és webhely-eredethez kötött: másik böngészőben vagy eszközön nem oszlik meg automatikusan. A kód kezeli a hibás JSON-t és a tiltott tárolást. Mentés előtt csak érvényes, felhasználói név/jelszó nélküli HTTPS URL-t fogad el; a megjelenített szöveget DOM-elemek `textContent` értékeként állítja be.

### Vissza az oldal tetejére

Ha egy témalapon nyolcnál több link van, az oldal alján megjelenik egy gomb, amikor a látogató 180 képpontnál többet görgetett. A gomb simán visszagörget az oldal elejére.

## 5. A War Thunder napló adatútja

Az automatikus frissítés nem a látogatók böngészőjében hívja közvetlenül a War Thunder oldalt. A forrás lekérését a GitHub Actions végzi. A feladatok két ágra oszlanak: a `main` a weboldal és a kézi fejlesztés ága, a `warthunder-updates` pedig az automatikus naplóadatoké. A Pages a weboldalt a `main` ágról szolgálja ki, az oldal JavaScriptje pedig a külön adatág nyilvános raw GitHub URL-jéről olvas.

1. A `.github/workflows/update-war-thunder-log.yml` workflow 30 percenként indulhat el (`*/30 * * * *`). A `workflow_dispatch` lehetővé teszi a kézi indítást az Actions felületéről.
2. A workflow a `main` ágat ellenőrzi, majd Python 3-at állít be, és külön checkoutolja a `warthunder-updates` ágat is. A `main` frissítőscriptjét átmásolja az adatág checkoutjába, és ott futtatja, így mindig a legújabb script kódját használja, de a létező JSON-hoz viszonyít.
3. A Python script a `https://warthunder.com/en/game/changelog/` oldalt kéri le 30 másodperces időkorláttal és saját User-Agent fejléccel.
4. A `ChangelogParser` a forrás HTML-jében a napló widgetjeit, címét, dátumát, leírását és cikkhivatkozását keresi. Csak a várt HTTPS-című, numerikus azonosítójú changelog cikkeket fogadja el.
5. A dátumokat feldolgozza, az azonos URL-eket kiszűri, a bejegyzéseket legújabbtól rendezi, majd legfeljebb hatot tart meg. Ha egyetlen érvényes bejegyzést sem talál, hibával megáll; nem ír üres naplót a meglévő helyére.
6. A script összehasonlítja a beolvasott bejegyzéseket a `warthunder-updates` ágon lévő JSON `entries` listájával. Ha azonosak, nem módosítja a fájlt. Ha eltérnek, kiírja az új tartalmat és az `updatedAt` időpontot.
7. A workflow csak akkor készít commitot és pusholja azt a `warthunder-updates` ágra, ha a JSON megváltozott. A commit kizárólag a `war-thunder-updates.json` fájlt tartalmazza. A `main` ágra nem ír automatikus commitot.
8. A War Thunder oldal a `raw.githubusercontent.com` nyilvános URL-jéről tölti be az adatág JSON-ját. Betöltéskor, a frissítőgomb megnyomásakor, majd látható böngészőfülnél ötpercenként újra lekéri.

A látogató böngészője ellenőrzi, hogy minden elem a `warthunder.com` megfelelő changelog útvonaláról származik. A cím és a leírás korlátozott hosszúságú, a megjelenítés `textContent`-tel történik. Sikeres betöltéskor a státusz a JSON `updatedAt` értékét mutatja.

Fontos: az `updatedAt` csak akkor változik, amikor a bejegyzések tartalma is megváltozik. Ezért a dátum nem a legutóbbi sikeres ellenőrzés időpontja. Ha nincs új bejegyzés, a workflow sikeresen futhat úgy is, hogy nem keletkezik commit.

## 6. Helyi megnyitás és közzététel

Az oldalak HTML-fájljai közvetlenül is megnyithatók, de a War Thunder JSON betöltése `file://` címről böngészőbiztonsági okokból nem működik megbízhatóan. A teljes teszthez helyi webszervert vagy a GitHub Pages címet használd.

Python telepítése esetén a projekt gyökérmappájából elindítható egy egyszerű helyi szerver:

```powershell
python -m http.server 8000
```

Ezután a `http://localhost:8000/` címen nyisd meg a főoldalt. A szervert a terminálban `Ctrl+C` állítja le. Nincs külön build vagy npm install lépés.

A GitHub Pages a repó beállításai szerint a `main` ágból publikálja a HTML, CSS és JavaScript fájlokat. A napló külön ágon van, ezért azt a Pages nem publikálja; a böngésző közvetlenül a GitHub raw címről olvassa. Így a bot által készített adatcommitok nem keverednek a weboldal fejlesztési ágaiba.

## 7. Új link vagy témalap hozzáadása

### Link hozzáadása meglévő témához

1. Válaszd ki a megfelelő `.link-section` blokkot az egyik témalapon.
2. Adj hozzá egy `<li>` elemet, a fenti mintát követve. A név az első `<span>` szövege legyen, a rövid leírás kerüljön a `data-tooltip` és `aria-description` attribútumba.
3. Használj HTTPS címet, és tartsd meg a `target="_blank"` és `rel="noopener noreferrer"` attribútumokat.
4. Frissítsd a README linkkatalógusát és az `app.js` `topicCounts` értékét.
5. Ha viselkedés vagy fontos funkció változott, dokumentáld a `CHANGELOG.md` fájlban is.

### Új témalap hozzáadása

Készíts új HTML-fájlt a meglévő témalapok szerkezetét követve. Kapcsolja be az `alap.css` és az `app.js` fájlokat, legyen benne közös fejléc és `section-grid`/`link-section`/`link-list` szerkezet. Add hozzá a lapot mindegyik oldal navigációjához, a főoldal új témakártyájához, a README-hez és az `app.js` `topicCounts` objektumához.

## 8. Hibaelhárítás

| Jelenség | Ellenőrzés |
| --- | --- |
| A napló közvetlen fájlmegnyitáskor üres. | Használj GitHub Pages címet vagy helyi webszervert; a `file://` hozzáférés korlátozza a `fetch` kérést. |
| A napló nem tölt be Pagesen. | Nyisd meg közvetlenül a `warthunder-updates` ágon lévő raw JSON URL-t. Ellenőrizd a böngésző fejlesztői eszközeinek Network/Console lapját, a raw URL-t és a JSON érvényességét. |
| A JSON régi, az Actions futás hibás. | Nyisd meg a workflow futási naplóját. Vizsgáld meg a forrás HTTP-válaszát és azt, hogy változott-e a War Thunder oldal HTML-szerkezete vagy dátumformátuma. |
| A futás sikeres, de nincs új commit. | Ez normális, ha a legújabb hat bejegyzés azonos a JSON-ban lévőkkel. A workflow szándékosan csak adatváltozáskor commitol. |
| A workflow nem indul automatikusan vagy nem tud pusholni. | Ellenőrizd, hogy a workflow a default `main` ágon van-e, létezik-e a `warthunder-updates` ág, engedélyezett-e az Actions, és a repository Actions beállításai megadják-e a `contents: write` jogosultságot. Kézi indításhoz használd a `workflow_dispatch` lehetőséget. |
| A kedvencek vagy előzmények másik böngészőben hiányoznak. | Ezek böngészőnként és webhely-eredetenként külön `localStorage`-ban vannak; nem kerülnek a GitHubra. |

## 9. Stílus és hozzáférhetőség

Az `alap.css` gyökéreleme tartalmazza a közös színváltozókat. A rácsok széles képernyőn több oszloposak, 760 képpont alatt mobil elrendezésre váltanak. A `:focus-visible` szabályok billentyűzetes használatkor látható fókuszt adnak, a `prefers-reduced-motion` pedig visszafogja az animációkat azoknál, akik ezt a rendszerbeállításukban kérik.

Ha új vezérlőt adsz hozzá, legyen egyértelmű neve vagy `aria-label` attribútuma, és billentyűzettel is használható. A tartalmat HTML-elemekkel és `textContent`-tel illeszd be, ne felhasználható szövegből összefűzött HTML-ként.