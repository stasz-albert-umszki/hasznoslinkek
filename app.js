(() => {
  const FAVORITES_KEY = "hasznoslinkek-favorites";
  const RECENT_KEY = "hasznoslinkek-recent";
  const readStore = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : fallback;
    } catch {
      return fallback;
    }
  };
  const sanitizeStoredLinks = (items) => items.flatMap((item) => {
    if (!item || typeof item.url !== "string") return [];
    try {
      const url = new URL(item.url);
      if (url.protocol !== "https:" || url.username || url.password) return [];
      return [{
        url: url.href,
        title: typeof item.title === "string" ? item.title.slice(0, 200) : "Mentett hivatkozás",
        description: typeof item.description === "string" ? item.description.slice(0, 500) : "",
      }];
    } catch {
      return [];
    }
  });
  const writeStore = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  };
  const favorites = sanitizeStoredLinks(readStore(FAVORITES_KEY, []));
  const linkRows = [...document.querySelectorAll(".link-list li")];
  const linkSections = [...document.querySelectorAll(".link-section")];
  let updateFilters = () => {};

  document.querySelectorAll(".topic-card img").forEach((image) => {
    image.addEventListener("error", () => {
      image.closest(".topic-card")?.classList.add("image-unavailable");
      image.remove();
    }, { once: true });
  });

  const linkInfo = (link) => ({
    url: link.href,
    title: link.querySelector("span")?.textContent.trim() || link.textContent.trim(),
    description: link.dataset.tooltip || "",
  });

  const isFavorite = (url) => favorites.some((item) => item.url === url);

  const setFavoriteButton = (button, active) => {
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? "Eltávolítás a kedvencek közül" : "Hozzáadás a kedvencekhez");
    button.title = active ? "Eltávolítás a kedvencek közül" : "Hozzáadás a kedvencekhez";
    button.textContent = active ? "★" : "☆";
  };

  const recordRecent = (info) => {
    const safeInfo = sanitizeStoredLinks([info])[0];
    if (!safeInfo) return;
    const updated = [safeInfo, ...sanitizeStoredLinks(readStore(RECENT_KEY, [])).filter((item) => item.url !== safeInfo.url)].slice(0, 6);
    writeStore(RECENT_KEY, updated);
  };

  const makeStoredLink = (info) => {
    const safeInfo = sanitizeStoredLinks([info])[0];
    if (!safeInfo) return document.createDocumentFragment();
    const link = document.createElement("a");
    link.href = safeInfo.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "stored-link";
    const title = document.createElement("span");
    title.className = "stored-link-title";
    title.textContent = safeInfo.title;
    link.append(title);
    if (safeInfo.description) {
      const description = document.createElement("span");
      description.className = "stored-link-description";
      description.textContent = safeInfo.description;
      link.append(description);
    }
    link.addEventListener("click", () => recordRecent(safeInfo));
    return link;
  };

  linkRows.forEach((row, index) => {
    const link = row.querySelector("a");
    if (!link) return;
    row.dataset.originalIndex = String(index);
    const info = linkInfo(link);
    link.addEventListener("click", () => recordRecent(info));

    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "favorite-toggle";
    setFavoriteButton(favoriteButton, isFavorite(info.url));
    favoriteButton.addEventListener("click", () => {
      const current = isFavorite(info.url);
      const updated = current ? favorites.filter((item) => item.url !== info.url) : [info, ...favorites];
      favorites.splice(0, favorites.length, ...updated);
      writeStore(FAVORITES_KEY, favorites);
      setFavoriteButton(favoriteButton, !current);
      updateFilters();
    });
    row.append(favoriteButton);
  });

  if (linkRows.length) {
    const toolbar = document.createElement("section");
    toolbar.className = "link-tools";
    toolbar.setAttribute("aria-label", "Hivatkozások keresése és rendezése");
    toolbar.innerHTML = `
      <label class="search-field"><span>Keresés</span><input type="search" placeholder="Név vagy leírás..." autocomplete="off"></label>
      <label class="select-field"><span>Téma</span><select class="category-filter"><option value="all">Minden kategória</option></select></label>
      <label class="select-field"><span>Mutatás</span><select class="favorite-filter"><option value="all">Minden link</option><option value="favorites">Kedvencek</option></select></label>
      <label class="select-field"><span>Rendezés</span><select class="sort-links"><option value="default">Eredeti sorrend</option><option value="name">Név szerint</option></select></label>
      <p class="result-count" aria-live="polite"></p>`;
    const sectionGrid = document.querySelector(".section-grid");
    sectionGrid.before(toolbar);

    const categoryFilter = toolbar.querySelector(".category-filter");
    linkSections.forEach((section, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = section.querySelector("h2")?.textContent.trim() || `Kategória ${index + 1}`;
      categoryFilter.append(option);
    });

    updateFilters = () => {
      const query = toolbar.querySelector("input").value.trim().toLocaleLowerCase("hu");
      const category = categoryFilter.value;
      const favoriteMode = toolbar.querySelector(".favorite-filter").value;
      const sortMode = toolbar.querySelector(".sort-links").value;
      let visible = 0;

      linkSections.forEach((section, sectionIndex) => {
        const categoryMatches = category === "all" || category === String(sectionIndex);
        section.hidden = !categoryMatches;
        const list = section.querySelector(".link-list");
        const rows = [...list.querySelectorAll("li")];
        rows.sort((a, b) => {
          if (sortMode === "name") return linkInfo(a.querySelector("a")).title.localeCompare(linkInfo(b.querySelector("a")).title, "hu");
          return Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex);
        });
        rows.forEach((row) => {
          list.append(row);
          const link = row.querySelector("a");
          const searchable = `${linkInfo(link).title} ${linkInfo(link).description}`.toLocaleLowerCase("hu");
          const match = categoryMatches
            && searchable.includes(query)
            && (favoriteMode !== "favorites" || isFavorite(link.href));
          row.hidden = !match;
          if (match) visible += 1;
        });
        if (categoryMatches && rows.every((row) => row.hidden)) section.hidden = true;
      });
      toolbar.querySelector(".result-count").textContent = `${visible} link`;
    };

    toolbar.addEventListener("input", updateFilters);
    toolbar.addEventListener("change", updateFilters);
    updateFilters();
  }

  const updateLog = document.querySelector(".update-log");
  if (updateLog) {
    const dataUrl = "war-thunder-updates.json";
    const status = updateLog.querySelector(".update-feed-status");
    const list = updateLog.querySelector(".update-list");
    const refreshButton = updateLog.querySelector(".update-refresh");

    const loadUpdates = async () => {
      refreshButton.disabled = true;
      status.textContent = "Frissítések betöltése…";
      try {
        const response = await fetch(`${dataUrl}?v=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error("A frissítési adatfájl nem érhető el.");
        const payload = await response.json();
        const updates = Array.isArray(payload.entries)
          ? payload.entries.flatMap((entry) => {
            if (!entry || typeof entry.url !== "string" || typeof entry.title !== "string") return [];
            try {
              const url = new URL(entry.url);
              if (url.origin !== "https://warthunder.com" || !/^\/en\/game\/changelog\/current\/\d+$/.test(url.pathname)) return [];
              return [{
                url: url.href,
                title: entry.title.slice(0, 200),
                date: typeof entry.date === "string" ? entry.date.slice(0, 80) : "Dátum nélkül",
                description: typeof entry.description === "string" ? entry.description.slice(0, 500) : "",
              }];
            } catch {
              return [];
            }
          }).slice(0, 6)
          : [];
        if (!updates.length) throw new Error("Nincsenek megjeleníthető bejegyzések.");
        const entries = updates.map((update) => {
          const item = document.createElement("li");
          item.className = "update-entry";
          const link = document.createElement("a");
          link.className = "update-entry-link";
          link.href = update.url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          const heading = document.createElement("strong");
          heading.textContent = update.title;
          const date = document.createElement("time");
          date.className = "update-date";
          date.textContent = update.date;
          const summary = document.createElement("span");
          summary.className = "update-summary";
          summary.textContent = update.description.length > 240 ? `${update.description.slice(0, 240).trimEnd()}…` : update.description;
          link.append(heading, date);
          if (update.description) link.append(summary);
          item.append(link);
          return item;
        });
        list.replaceChildren(...entries);
        const updatedDate = payload.updatedAt ? new Date(payload.updatedAt).toLocaleDateString("hu-HU") : "";
        status.textContent = `Az adatfájlt a GitHub Actions frissíti kb. 30 percenként${updatedDate ? ` · adatfájl dátuma: ${updatedDate}` : ""}.`;
      } catch {
        status.textContent = list.children.length
          ? "A frissítés most nem sikerült; az utoljára betöltött lista látható."
          : window.location.protocol === "file:"
            ? "A frissítési napló fájl közvetlen megnyitásakor nem tölthető be; GitHub Pagesen vagy helyi webszerveren működik."
            : "A frissítési adatfájl most nem érhető el. Nyisd meg a teljes hivatalos naplót.";
      } finally {
        refreshButton.disabled = false;
      }
    };

    refreshButton.addEventListener("click", loadUpdates);
    loadUpdates();
    window.setInterval(() => {
      if (!document.hidden) loadUpdates();
    }, 5 * 60 * 1000);
  }

  const topicCards = [...document.querySelectorAll(".topic-card")];
  const topicCounts = { "warthunder.html": 19, "linux.html": 2, "suli.html": 1 };
  topicCards.forEach((card) => {
    const page = card.getAttribute("href");
    const count = document.createElement("span");
    count.className = "topic-count";
    count.textContent = `${topicCounts[page] || 0} link`;
    card.querySelector(".topic-card-content")?.append(count);
  });

  if (topicCards.length) {
    const savedFavorites = favorites;
    const savedRecent = sanitizeStoredLinks(readStore(RECENT_KEY, []));
    const shelves = document.createElement("section");
    shelves.className = "home-shelves";

    const makeShelf = (title, items, emptyText) => {
      const section = document.createElement("section");
      section.className = "home-shelf";
      const heading = document.createElement("h2");
      heading.textContent = title;
      const list = document.createElement("div");
      list.className = "stored-links";
      if (items.length) items.forEach((item) => list.append(makeStoredLink(item)));
      else {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = emptyText;
        list.append(empty);
      }
      section.append(heading, list);
      return section;
    };

    shelves.append(
      makeShelf("Kedvencek", savedFavorites, "A linkek melletti csillaggal menthetsz ide hivatkozásokat."),
      makeShelf("Legutóbb megnyitott", savedRecent.slice(0, 4), "A megnyitott külső linkek itt jelennek meg.")
    );
    document.querySelector(".topic-grid").after(shelves);
  }

  if (linkRows.length > 8) {
    const topButton = document.createElement("button");
    topButton.type = "button";
    topButton.className = "back-to-top";
    topButton.textContent = "↑";
    topButton.setAttribute("aria-label", "Vissza az oldal tetejére");
    topButton.title = "Vissza az oldal tetejére";
    topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.append(topButton);
    const updateTopButton = () => topButton.classList.toggle("visible", window.scrollY > 180);
    window.addEventListener("scroll", updateTopButton, { passive: true });
    updateTopButton();
  }
})();