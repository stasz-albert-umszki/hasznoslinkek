# Changelog

A projekt fontosabb változásainak összefoglalója.

## 2026-11-13

### Hozzáadva

- Keresés a hivatkozások nevében és leírásában.
- Kategória- és kedvencszűrő, valamint név szerinti rendezés a témalapokon.
- Kedvencek csillaggal jelölése és böngészőben történő megjegyzése.
- Legutóbb megnyitott hivatkozások megjelenítése a főoldalon.
- Témánkénti linkdarabszám a főoldali kártyákon.
- Görgetés után megjelenő vissza-a-tetejére gomb a hosszabb témalapokon.
- Képbetöltési hiba kezelése a főoldali témakártyákon.
- GitHub Actions által körülbelül 30 percenként frissített War Thunder játéknapló külön JSON-adatfájlban.
- Magyar nyelvű működési útmutató az oldalak, a böngészős funkciók és az automatikus naplófrissítés tanulmányozásához.
- Rövid leírások minden hivatkozáshoz; mobilon a link alatt, asztali nézetben rámutatáskor vagy billentyűzetes fókusznál jelennek meg.
- `ideas.md` a későbbi tartalmi bővítések és karbantartási feladatok nyilvántartására.

### Megváltozott

- A főoldal és a War Thunder, Linux, illetve suli témalapok közös, reszponzív, sötét megjelenést kaptak.
- A War Thunder hivatkozások közösség, segédletek, statisztikák, adatbányászat és modellek szerint csoportosultak.
- A README áttekinthető projektleírássá és linkkatalógussá bővült; új hivatkozás hozzáadásához minta is került bele.
- A főoldali témakártyák és a navigáció a különálló témalapokra vezetnek.

### Ellenőrizve

- A War Thunder napló GitHub Actions workflow-jának kézi futtatása sikeresen befejeződött. A hivatalos forrásból beolvasott legutóbbi hat bejegyzés már egyezett az adatfájllal, ezért a workflow nem készített felesleges commitot.
- A GitHub Pagesen közzétett `war-thunder-updates.json` elérhető, és a War Thunder témalap ezt a statikus adatfájlt tölti be.

### Javítva

- A főoldal képeire és témalapjaira mutató helyi útvonalak működnek.
- Eltávolításra kerültek az üres README-linkhelyőrzők és a főoldal felesleges záró HTML-tagje.
- A kedvencek és előzmények tárolt adataiból csak érvényes HTTPS-hivatkozás jeleníthető meg.
