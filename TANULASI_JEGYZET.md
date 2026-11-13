# Tanulási jegyzet: hogyan működik a Hasznos linkek rendszer?

Ez a fájl önálló tananyag. Nincs belinkelve a weboldalról vagy a projektismertetőből. Úgy haladj rajta, hogy közben megnyitod a leírt forrásfájlokat, és megkeresed bennük az említett elemeket.

## 1. Mit építettünk?

Ez egy statikus weboldal, amelyben a böngésző közvetlenül letölti a fájlokat, majd a JavaScript a látogató gépén fut. Nincs saját alkalmazásszerver vagy adatbázis.

A rendszer mégis tud automatikusan frissülő tartalmat mutatni. A GitHub Actions időzítve futtat egy Python programot, amely lekéri a hivatalos War Thunder naplót. Az új adatot egy külön Git ágra írja, a weboldal JavaScriptje pedig onnan olvassa be.

Alapfogalmak:

- **Statikus fájl:** előre elkészített HTML, CSS, JavaScript vagy JSON. A kiszolgáló nem állítja elő minden kérésre.
- **Böngészőoldali kód:** olyan JavaScript, amely a látogató böngészőjében fut.
- **Workflow:** GitHub Actions automatizálási szabály. Megmondja, mikor és milyen lépések fussanak.
- **JSON:** strukturált szöveges adat, amelyet programok könnyen feldolgoznak.
- **Git ág (branch):** külön fejlesztési vagy adatvonal, amelynek commitjai nem kerülnek automatikusan egy másik ágba.
- **Commit:** egy vagy több fájl változásának névvel és üzenettel elmentett egysége a Git történetében.

## 2. A rendszer térképe

```text
Te szerkesztesz
   |
   v
main ág: HTML + CSS + JavaScript + Python frissítő + workflow
   |                                      |
   | GitHub Pages                         | GitHub Actions, kb. 30 percenként
   v                                      v
Látogató böngészője                 Hivatalos War Thunder oldal
   |                                      |
   | app.js fetch()                       | HTML letöltése és feldolgozása
   |                                      v
   +------------------------------ warthunder-updates ág
                                          |
                                          +-- war-thunder-updates.json
```

A két ág külön feladatot kapott:

- A `main` az ember által karbantartott weboldal és az automatizálás forráskódja.
- A `warthunder-updates` az automatikusan frissülő adatok külön ága.
- A workflow csak a `war-thunder-updates.json` fájlt commitolja a `warthunder-updates` ágra.
- A GitHub Pages a `main` ágat szolgálja ki. A napló JSON-ját nem a Pagesről, hanem a GitHub nyilvános raw fájlcíméről tölti be az oldal.

A `warthunder-updates` ág létrehozásakor a `main` akkori teljes pillanatképe került át oda. Ezért a branch fájllistája kezdetben hasonlíthat a `main`-hez. A lényeg a későbbi commitok tartalma: a bot csak a JSON-t módosítja.

## 3. Milyen fájl hol vesz részt?

### Az oldal

- `index.html`: a főoldal HTML-szerkezete és a témakártyák.
- `warthunder.html`, `linux.html`, `suli.html`: a témalapok. A linkek neve és leírása itt található.
- `alap.css`: közös színek, méretek, elrendezések és mobilos szabályok.
- `app.js`: keresés, szűrés, kedvencek, előzmények, frissítési napló és egyéb böngészős interakciók.
- `PICS/`: a főoldali kártyák képei.

### Az automatikus frissítés

- `.github/workflows/update-war-thunder-log.yml`: mikor induljon az automatizálás és milyen parancsokat hajtson végre.
- `scripts/update_warthunder_log.py`: hogyan kérje le és dolgozza fel a hivatalos oldalt.
- `war-thunder-updates.json`: a külön adatágon az aktuális strukturált naplóadat.

## 4. A weboldal alapja: HTML, CSS, JavaScript

### HTML: a szerkezet

A HTML leírja, milyen elemek legyenek az oldalon. Például egy témalap egy csoportja ilyen szerkezetű:

```html
<section class="link-section">
  <h2>Közösség és hírek</h2>
  <ul class="link-list">
    <li>
      <a href="https://pelda.hu/" data-tooltip="Rövid leírás.">
        <span>Link neve</span>
        <span>↗</span>
      </a>
    </li>
  </ul>
</section>
```

A `class` egy vagy több elemen is ismétlődhet. A JavaScript és a CSS ezeket az osztályneveket használja az elemek megkereséséhez és formázásához. Az `href` mondja meg, hová vezet a hivatkozás. A `data-tooltip` egy saját adatattribútum: a leírás vizuálisan és kereshető szövegként is felhasználható.

### CSS: a megjelenés

Az `alap.css`-ben a `:root` alatt lévő CSS-változók közös színeket tárolnak. Például a `--ink` a fő szövegszín. Ha egy változót több szabály használ, a szín megváltoztatása egy helyen frissíti az egész témát.

A szabály alakja általában:

```css
.link-list a {
  color: var(--ink);
  text-decoration: none;
}
```

A `.link-list a` választó minden olyan hivatkozást kiválaszt, amely egy `link-list` osztályú elemen belül van. A `@media (max-width: 760px)` rész kis képernyőn módosítja az elrendezést. A `:focus-visible` szabály a billentyűzetes navigációnál látható fókuszt ad.

### JavaScript: viselkedés

Az oldalak az `app.js` fájlt `defer` attribútummal töltik be. Ez azt jelenti, hogy a böngésző a HTML feldolgozása után futtatja a scriptet. Emiatt a JavaScript már meg tudja keresni a HTML-ben leírt elemeket.

A `document.querySelector(...)` egy megfelelő HTML-elemet keres, a `document.querySelectorAll(...)` pedig az összes találatot. Például:

```js
const updateLog = document.querySelector(".update-log");
if (updateLog) {
  // Ezen az oldalon van naplóblokk, így elindulhat annak kezelése.
}
```

Ugyanaz a script több oldalon is fut. A `if (updateLog)` ellenőrzés miatt a napló kódja csak a War Thunder lapon működik. Másik oldalon nincs ilyen elem, így ez a funkció egyszerűen kimarad.

Az `app.js` legkülső `(() => { ... })();` alakja egy azonnal lefutó függvény. A benne létrehozott változók nem szennyezik a böngésző globális névterét.

## 5. Egy felhasználói művelet útja

Vegyük a kedvenc csillag megnyomását a War Thunder oldalon:

1. A HTML tartalmazza a linket, de a kedvenc gombot nem kell kézzel megírni.
2. Az `app.js` végigmegy a `.link-list li` sorokon, mindegyikhez létrehoz egy gombot.
3. A `button.addEventListener("click", ...)` eseménykezelőt kapcsol a gombhoz. Ez a függvény csak kattintáskor fut le.
4. A függvény megnézi, hogy a link már kedvenc-e. Ha igen, eltávolítja; ha nem, hozzáadja.
5. A `localStorage` a böngészőben elmenti az új állapotot.
6. A gomb `aria-pressed` és `aria-label` attribútuma frissül, hogy a megjelenés és a kisegítő technológiák is jelezzék az állapotot.
7. A szűrő újraszámolja a látható sorokat, ha éppen csak a kedvenceket mutatjuk.

A `localStorage` nem a GitHub része. Az adatok az adott böngészőben, az adott webhely címe alatt maradnak. Emiatt egy másik gépen nem jelennek meg automatikusan.

A kereső hasonló elven működik: a keresőmező `input` eseménye meghívja az `updateFilters` függvényt. Ez összeveti a keresett szöveget a link nevével és leírásával, majd a nem találó sorokra beállítja a `hidden` tulajdonságot.

## 6. A frissítési napló: teljes adatfolyam

A kulcs az, hogy a forrás HTML letöltése a GitHub Actionsben történik, nem a látogató böngészőjében. Így nem kell a böngészőnek közvetlenül a War Thunder oldaláról adatot kérnie.

### 6.1. A workflow indítása

A `.github/workflows/update-war-thunder-log.yml` két indítási módot határoz meg:

- `schedule` és a `*/30 * * * *` cron: félóránkénti ellenőrzés.
- `workflow_dispatch`: kézi futtatás a GitHub Actions felületéről.

A workflow a `main` ágon van, mert a GitHub az időzített workflow-kat a repository alapértelmezett ágáról indítja. A `contents: write` jogosultság teszi lehetővé, hogy a futás commitot és push-t készítsen.

### 6.2. Két checkout egy futásban

A workflow két példányban ellenőrzi ki a repót:

- Az alapértelmezett helyen a `main` tartalma van. Innen származik a frissítőscript aktuális kódja.
- A `warthunder-updates` alkönyvtárban a külön adatág található. Ennek JSON-ját fogja összehasonlítani és frissíteni a program.

A workflow átmásolja a `main` frissítőscriptjét az adatág mappájába, majd onnan futtatja. Ez fontos: a script fájl elérési helye határozza meg, melyik gyökérmappában keresi és írja a JSON-t.

A Python-kódban ez a sor számolja ki a gyökérmappát:

```python
repository_root = Path(__file__).resolve().parents[1]
```

Ha a script a `warthunder-updates/scripts/` mappából fut, akkor a gyökér a `warthunder-updates/` checkout lesz. Így a program nem a `main` munkapéldányában dolgozik.

### 6.3. A Python program beolvassa a forrást

A `fetch_entries()` függvény a hivatalos changelog címére küld HTTP-kérést. A `Request` objektum egy User-Agent fejlécet állít be; az `urlopen(..., timeout=30)` legfeljebb 30 másodpercig vár a válaszra.

A válasz HTML-szöveg, nem JSON. A `ChangelogParser(HTMLParser)` nevű osztály ezt az oldalszöveget elemzi. Figyeli a HTML-tagok kezdetét, tartalmát és végét, és a megfelelő CSS-osztályok alapján összegyűjti:

- a cikk URL-jét,
- a címet,
- a dátumot,
- a rövid leírást.

A `clean_text()` egy szóközre egyszerűsíti a sortöréseket és többszörös whitespace karaktereket.

### 6.4. Adatellenőrzés és JSON

A nyers HTML-ből kinyert adatokra nem szabad vakon hagyatkozni. A kód ellenőrzi az URL protokollját, hostját és útvonalát: HTTPS, `warthunder.com`, valamint numerikus changelog cikkazonosító szükséges. A dátumot a megadott formátum szerint kell tudni feldolgozni.

Ezután a script eltávolítja a duplikált URL-eket, a dátum szerint csökkenő sorrendbe rendezi a bejegyzéseket, és a hat legújabbat tartja meg. Ha nem talál egyetlen érvényes bejegyzést sem, hibát jelez. Ez biztonsági korlát: egy megváltozott forrásoldal ne írjon véletlenül üres adatot a jó JSON helyére.

A JSON például ilyen szerkezetű:

```json
{
  "source": "https://warthunder.com/en/game/changelog/",
  "updatedAt": "2026-11-13T10:00:00+00:00",
  "entries": [
    {
      "url": "https://warthunder.com/en/game/changelog/current/1916",
      "title": "Update 2.61.0.13",
      "date": "12 November 2026",
      "description": "Numerous bug fixes"
    }
  ]
}
```

Az `entries` tömbben legfeljebb hat ilyen elem van. A `updatedAt` nem az utolsó ellenőrzés ideje: csak akkor változik, amikor a bejegyzések tartalma is megváltozik.

### 6.5. Miért nem commitol minden ellenőrzéskor?

A script először beolvassa az adatág meglévő JSON-ját, majd csak az `entries` listát hasonlítja össze az új eredménnyel. Ha a két lista egyenlő, a program nem írja át a fájlt. Ha eltérnek, új JSON-t készít, benne az új bejegyzésekkel és az aktuális `updatedAt` értékkel.

A workflow ezután a következő parancs logikáját használja:

```sh
git -C warthunder-updates diff --quiet -- war-thunder-updates.json
```

A `git -C ...` azt jelenti, hogy a Git parancsot a megadott mappában hajtsa végre. A `diff --quiet` nem ír ki diffet; kilépési kódjából derül ki, történt-e változás. Változás hiányában a workflow befejezi a futást új commit nélkül.

Változáskor a workflow csak a JSON-t adja hozzá (`git add -- war-thunder-updates.json`), commitolja, majd ezt pusholja a külön adatágra. A `main` ágat a bot nem módosítja.

### 6.6. Az oldal betölti a JSON-t

Az `app.js` War Thunder blokkja meghívja a `fetch()` függvényt a nyilvános `raw.githubusercontent.com` URL-re. A `?v=${Date.now()}` egy változó URL-paramétert tesz a cím végére, a `cache: "no-store"` pedig arra kéri a böngészőt, hogy ne a régi cache-választ használja.

A `response.ok` ellenőrzi a HTTP választ, majd `response.json()` feldolgozza a JSON-t JavaScript objektummá. A program ezután ellenőrzi a cikk URL-jét, levágja a túl hosszú szövegeket, létrehozza a lista HTML-elemeit, és `textContent`-tel helyezi beléjük a szöveget.

A `textContent` fontos: szövegként jeleníti meg a forrásból érkező címet, nem HTML-kódként futtatja le. A linket az `a.href` tulajdonságon állítja be, de előtte ellenőrzi, hogy a host és az útvonal megfelel-e az elvárt mintának.

A frissítés három alkalommal indulhat el:

1. Az oldal betöltésekor.
2. A frissítő gomb megnyomásakor.
3. Ötpercenként, ha a böngészőlap látható.

A raw GitHub válasz CORS-fejléce engedélyezi a nyilvános fájl böngészőből történő lekérését. Ez teszi lehetővé, hogy egy Pagesről érkező oldal másik hostról olvasson JSON-t.

## 7. Mit jelent a két ág a Git használatakor?

A `main` és a `warthunder-updates` külön ágnevek, amelyek egy-egy commitra mutatnak. A munkafád jelenleg a `main`-en van, ezért az itt végzett weboldal-módosítások nem kerülnek át maguktól az adatágra.

A rendszerhez kapcsolódó ellenőrző parancsok:

```sh
git status --short --branch
git branch --verbose --verbose
```

Az első megmutatja, melyik ág aktív és vannak-e helyi módosításaid. A második megmutatja a helyi ágak és a hozzájuk tartozó távoli ágak kapcsolatát. Ebben a projektben a bot a `warthunder-updates` távoli ágára pushol. A te weboldal-változtatásaid a `main` ágon maradnak, és csak akkor kerülnek GitHubra, amikor te pusholod őket.

Ne keverd össze ezt a két eseményt:

- **A workflow futása:** a GitHub Actions megpróbálja lekérni és feldolgozni a forrást.
- **A bot commitja:** csak akkor történik meg, ha a JSON-adat változott.

Így egy sikeres workflow-futás mellett is lehet nulla új commit.

## 8. Helyi tanulás és hibakeresés

A projekt gyökeréből egyszerű statikus szerver indítható:

```powershell
python -m http.server 8000
```

Ezután a böngészőben a `http://localhost:8000/` oldalt nyisd meg. A szerver a helyi HTML, CSS és JavaScript fájlokat szolgálja ki. A napló adatát az `app.js` az élő, nyilvános adatágról tölti be. Ha közvetlenül `file://` címről nyitod meg a HTML-t, a böngésző a helyi fájlokra vonatkozó biztonsági szabályai blokkolhatják a `fetch()` hívást.

Hibakereséskor haladj kívülről befelé:

1. **Oldal:** betöltődött-e a `warthunder.html`?
2. **Script:** a böngésző fejlesztői eszközeinek Console lapján van-e JavaScript-hiba?
3. **Hálózat:** a Network lapon milyen státuszt kapott a JSON-kérés? A 200 sikeres választ jelent.
4. **Adat:** a raw URL böngészőben megnyitva érvényes JSON-t ad-e, és van-e benne `entries` tömb?
5. **Automatizálás:** a GitHub Actions futásának melyik lépése sikerült vagy hibázott?
6. **Commit:** ha a futás sikeres, változott-e a JSON? Azonos adatok esetén szándékosan nincs új commit.

Gyakori esetek:

- **A weboldal közvetlen HTML-megnyitásakor üres a napló:** használj helyi webszervert vagy a GitHub Pages címet.
- **A workflow zöld, de nem látszik új commit:** valószínűleg a legfrissebb hat bejegyzés már azonos volt.
- **A workflow hibával áll le, és a parser nem talál adatot:** megváltozhatott a hivatalos oldal HTML-szerkezete vagy dátumformátuma.
- **Nem sikerül pusholni:** ellenőrizd a workflow `contents: write` jogosultságát és hogy a `warthunder-updates` ág létezik-e.
- **A JSON elérhető, de a böngésző nem tölti be:** vizsgáld meg a Network és Console lapot; lehet CORS-, hálózati vagy JSON-formátumhiba.

## 9. Tanulási gyakorlatok

Érdemes egyesével megcsinálni őket. Minden feladat előtt jegyezd fel, mit vársz, utána nézd meg, valóban azt csinálta-e a kód.

1. **HTML:** adj egy új linket az egyik témalaphoz. Nézd meg, hogyan jelenik meg a tooltip leírás, és hogyan találja meg a kereső.
2. **CSS:** változtass meg egy `:root` színváltozót, és figyeld meg, hány komponens színe változik egyszerre.
3. **JavaScript:** keresd meg az `updateFilters` függvényt, és kövesd végig, hogyan jut el az inputmező értékétől a `row.hidden` beállításig.
4. **Tárolás:** jelölj kedvencnek egy linket, majd a fejlesztői eszközök Application/Storage részében keresd meg a `hasznoslinkek-favorites` értéket.
5. **JSON:** nyisd meg a nyilvános JSON-fájlt, és keresd meg, mely mezők alapján épül fel egy naplóbejegyzés a képernyőn.
6. **Python:** keresd meg, melyik CSS-osztály indítja egy changelog bejegyzés feldolgozását, és írd le, mi történne, ha az osztály neve megváltozna a forrásoldalon.
7. **Workflow:** nézd meg, hogyan vezérli a `git diff --quiet` a commit lépést. Magyarázd el, miért jobb ez, mint minden futáskor commitot készíteni.
8. **Ágak:** hasonlítsd össze a `main` és a `warthunder-updates` ág legutóbbi commitjait. Állapítsd meg, melyik változást készítette ember és melyiket az automatizálás.

## 10. Javasolt olvasási sorrend

Ha most ismerkedsz a kóddal, ebben a sorrendben haladj:

1. `index.html`: ismerd meg a HTML szerkezetet és a közös CSS/JavaScript betöltését.
2. `warthunder.html`: nézd meg az ismétlődő linkcsoportokat és a napló üres tartóelemeit.
3. `alap.css`: keresd meg a színváltozókat, a fő rácsokat és a mobilos `@media` részt.
4. `app.js`: előbb a kedvenc- és keresőfunkciót, aztán a napló `fetch()` részét kövesd.
5. `war-thunder-updates.json`: tanuld meg az objektum, tömb és szöveg mezők szerepét.
6. `scripts/update_warthunder_log.py`: kövesd a `main()`-tól a `fetch_entries()`-en át a JSON-írásig.
7. `.github/workflows/update-war-thunder-log.yml`: kösd össze a GitHub Actions lépéseit az előző Python-programmal.
8. `git status` és a GitHub Actions futási naplója: ellenőrizd, hogyan válik a helyi módosításból távoli commit.

A legfontosabb gondolat: a weboldal maga statikus, de a statikus fájlokat egy automatizálás időnként frissítheti. A böngésző csak megjeleníti az adatot; a forráslekérést és a fájl módosítását a GitHub Actions végzi.
