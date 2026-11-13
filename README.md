# Hasznos linkek

Témák szerint rendezett, magyar nyelvű linkgyűjtemény játékhoz, Linuxhoz és tanuláshoz. A témalapokon név és leírás szerint kereshetsz, kategóriát szűrhetsz, név szerint rendezhetsz, illetve kedvenceket menthetsz. A megnyitott linkek a főoldalon is visszakereshetők.

Az oldalak felépítéséről, a JavaScript-funkciókról és a War Thunder napló automatikus frissítéséről a [működési útmutató](MUKODESI_UTMUTATO.md) ad részletes magyarázatot.

## Az oldal megnyitása

Nyisd meg az `index.html` fájlt böngészőben, majd válassz témát a főoldalon vagy a felső navigációban. A külső hivatkozások új lapon nyílnak meg. A rövid leírás asztali nézetben föléjük állva, mobilon közvetlenül a link alatt olvasható. A kedvencek és a legutóbb megnyitott linkek az adott böngészőben tárolódnak.

## Témák

### War Thunder

Közösségi oldalak, hírek, játékbeli segédletek, statisztikák és adatbányászati források.

#### Közösség és hírek

- [Hivatalos fórum](https://forum.warthunder.com/) – kérdések, válaszok és közösségi beszélgetések.
- [Hírek](https://warthunder.com/en/news) – hivatalos hírek, frissítések és bejelentések.
- [Hivatalos frissítési napló](https://warthunder.com/en/game/changelog/) – a legutóbbi hat bejegyzés a GitHub Actions segítségével, körülbelül 30 percenként frissül.
- [War Thunder Esports Twitch](https://www.twitch.tv/warthunder_esports) – esports közvetítések és versenyek.
- [Skinek és modok](https://live.warthunder.com/) – közösségi festések, skinek és letölthető tartalmak.
- [WTRTI](https://github.com/MeSoftHorny/WTRTI) – külső segédprogram játékbeli jármű- és teljesítményadatokhoz.

#### Taktikák és segédletek

- [Bombázási táblázat](https://docs.google.com/spreadsheets/d/1oNwp_MXszU5J2dcaz5IoCtSAQ-infPdOWhwtJXqtrwU/edit?gid=1086388524#gid=1086388524) – bombázási útmutató gépekhez és célpontokhoz.
- [Nuclear Thunder térkép](https://majorlier.github.io/nuclear-thunder-interactive-map/) – interaktív térkép a Nuclear Thunder eseményhez.
- [Emelkedés és MEC](https://docs.google.com/spreadsheets/d/1rmN88QSthSclf7kxd6-miXjPFZEGmBQ5xMumqixKC6s/edit?gid=1152453200#gid=1152453200) – repülős segédlet emelkedési teljesítményhez és motorvezérléshez.
- [Fegyverzeti táblázat](https://docs.google.com/spreadsheets/u/1/d/1Px6G3kvcWbiS-sdIR6r4s7lSwfcxguUgJw95qj0NIzs/htmlview) – járművekhez választható fegyverzetek és függesztmények.

#### Statisztika és ballisztika

- [Rakéták](https://wt.flareflo.dev/table.html) – rakétaadatok és -tulajdonságok.
- [ARM-ek](https://docs.google.com/spreadsheets/d/1Ve6lJA9sXQ8MRCPzVV7SB7ZEryf-cQyclAEWJzJ1q0M/edit?gid=1440022221#gid=1440022221) – radarbesugárzásra rávezető rakéták adatai.
- [Bombák](https://wt.flareflo.dev/bombing_table.html) – bombák sebzéséhez és hatótávolságához kapcsolódó adatok.
- [További járműadatok](https://wt.flareflo.dev/) – további jármű- és fegyveradatok.
- [Statshark](https://statshark.net/) – játékosprofilok és teljesítménystatisztikák.
- [Thunderskill](https://thunderskill.com/) – játékos- és járműteljesítmény-statisztikák.

#### Adatbányászat és modellek

- [Fórumbejegyzések és megosztások](https://forum.warthunder.com/u/xPorkulusx) – a megadott fórumprofil bejegyzései.
- [Datamine összefoglalók](https://gszabi99.github.io/) – frissítésekből összegyűjtött adatbányászati információk.
- [War Thunder Datamine a GitHubon](https://github.com/gszabi99/War-Thunder-Datamine) – részletes adatgyűjtemény a játék fájljaiból.
- [3D modellek](https://gamemodels3d.com/) – járművek böngészhető 3D modelljei.

### Linux

- [RP1](https://rp1.hu/) – magyar nyelvű, Linuxhoz kapcsolódó közösségi oldal.
- [ProtonDB](https://www.protondb.com/explore?sort=playerCount&page=3) – játékosok tapasztalatai a Linuxon, Protonnal futtatott játékokról.

### Suli

- [Learn Git Branching – magyar](https://learngitbranching.js.org/?locale=hu_HU) – interaktív gyakorló Git-ágakhoz és parancsokhoz.

## Fájlok

| Fájl vagy ág | Tartalom |
| --- | --- |
| `index.html` | Főoldal és témaválasztó |
| `warthunder.html` | War Thunder linkek témacsoportok szerint |
| `linux.html` | Linuxhoz kapcsolódó hivatkozások |
| `suli.html` | Tanulást segítő hivatkozások |
| `alap.css` | Közös megjelenés és reszponzív stílusok |
| `app.js` | Keresés, szűrés, rendezés, kedvencek és előzmények |
| `warthunder-updates` ág | A bot ezen az ágon kizárólag az automatikusan frissített `war-thunder-updates.json` fájlt commitolja |
| `scripts/update_warthunder_log.py` | A hivatalos changelog beolvasása és a JSON frissítése |
| `.github/workflows/update-war-thunder-log.yml` | 30 percenként futó workflow, amely csak a `warthunder-updates` ág JSON-fájlját commitolja |
| `CHANGELOG.md` | Elkészült változások naplója |
| `MUKODESI_UTMUTATO.md` | Részletes magyarázat az oldal működéséről és karbantartásáról |
| `ideas.md` | Későbbi tartalmi és karbantartási ötletek |
| `PICS/` | A főoldalon használt képek |

## Új link hozzáadása

1. Válaszd ki a megfelelő témalapot és linkcsoportot.
2. Adj a linknek rövid, egyértelmű nevet és egymondatos leírást.
3. Az új linkről készíts HTML sort a következő minta alapján, a `href`, a `data-tooltip` és az `aria-description` értékét cseréld a saját tartalomra:

```html
<li><a href="https://pelda.hu/" target="_blank" rel="noopener noreferrer" data-tooltip="Rövid leírás arról, mit találok a hivatkozáson." aria-description="Rövid leírás arról, mit találok a hivatkozáson."><span>Link neve</span><span>↗</span></a></li>
```

4. Add hozzá ugyanezt a hivatkozást a README megfelelő témaköréhez is, egy rövid magyarázattal.

## Automatikus War Thunder napló

A `main` ág tartalmazza a weboldal kódját és a kézi változtatásaidat. A GitHub Actions körülbelül 30 percenként ellenőrzi a hivatalos changelogot, és változás esetén kizárólag a `warthunder-updates` ág `war-thunder-updates.json` fájlját commitolja. A War Thunder oldal ebből a külön ágból olvassa be az adatot; a nyitva hagyott oldal legfeljebb 5 percenként újraellenőrzi.

Ehhez a `warthunder-updates` ágnak léteznie kell, a GitHub Actions használatának és a `contents: write` jogosultságnak pedig engedélyezve kell lennie a repóban. A GitHub Pages továbbra is a `main` ágat szolgálja ki.
