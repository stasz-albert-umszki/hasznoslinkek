# Ötletek a Hasznos linkek oldalhoz

Ez a fájl a későbbi tartalmi bővítéseket és még nyitott karbantartási ötleteket gyűjti össze. A keresés, szűrés, rendezés, kedvencek, előzmények, mobilos leírások és témánkénti linkdarabszám már elkészült.

## Tartalmi bővítések

- [ ] **Linux: telepítés és hibaelhárítás** – disztribúciók, gyakori problémák és hasznos parancsok.
- [ ] **Suli: további tantárgyak** – matematika, programozás, nyelvtanulás vagy más tananyagok, ahogy gyűlnek a linkek.
- [ ] **War Thunder: kezdőknek szóló rész** – alapfogalmak, járműfejlesztés és játékmódok.
- [ ] **Új témák** – külön oldal készülhet programozáshoz, további játékokhoz vagy rendszereszközökhöz, amikor összegyűlik hozzá elég link.
- [ ] **Forrásjelölések** – opcionális címkékkel jelezni, hogy egy oldal hivatalos, közösségi vagy külső segédanyag.

## Funkció- és karbantartási ötletek

- [ ] **Ékezetfüggetlen keresés** – a keresés normalizálja az ékezeteket, így például a „rakéta” megtalálhatja a „Rakéták” címet is. Az ellenőrzésen a pontos részszöveg-keresés működött, de az ékezeteltérés miatt nem lett találat.
- [ ] **Témánkénti linkdarabszám automatikusan** – a főoldali kártyák jelenleg kézzel megadott számokat használnak az `app.js` fájlban; a számláló számolhatná a témalap tényleges linksorait.
- [ ] **Kedvencek és előzmények kezelése** – külön művelet a mentett elemek törlésére, illetve a kedvencek JSON-fájlba exportálása és visszaimportálása.
- [ ] **A napló ellenőrzési idejének jelzése** – külön jelenjen meg a legutóbbi sikeres ellenőrzés ideje. Az `updatedAt` csak adatváltozáskor frissül, ezért most nem az ellenőrzés időpontját jelenti.
- [ ] **Automatizált regressziós tesztek** – legyen ellenőrzés a keresésre, szűrőkre, böngészős tárolásra és a napló JSON-formátumára; a Python parserhez egy mentett HTML-minta is segíthet a forrásoldal változásának észlelésében.

## Karbantartás és hozzáférhetőség

- [ ] **Linkek időszakos felülvizsgálata** – a megszűnt vagy megváltozott külső címek javítása; ezek elérhetőségét a böngésző biztonsági korlátai miatt nem ellenőrzi automatikusan a statikus oldal.
- [ ] **Mobilnézet további próbája** – 390 képpont szélességen a témalapok nem lógtak túl, a 320 képpontos és tablet nézet, valamint a hosszú nevek további ellenőrzést igényelnek.
- [ ] **Kedvencek és előzmények törlése** – külön kezelőfelület a mentett böngészőadatok egyszerű ürítéséhez.
