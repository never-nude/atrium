import { bindThemeToggles, bindUiModeToggles, renderThemeToggle, renderUiModeToggle } from "./theme.js";

const ANCIENT_ROOM_IDS = Object.freeze([
  "egypt-mesopotamia",
  "greek-classical",
  "hellenistic-world",
  "roman-world"
]);

const ERA_ORDER = Object.freeze([
  "Ancient Origins",
  "Greek Foundations",
  "Hellenistic World",
  "Roman World",
  "Parallel Traditions",
  "Rebirth of Antiquity",
  "High Renaissance",
  "Enlightenment Sculpture",
  "Nineteenth Century",
  "Modern Sculpture"
]);

const REGION_ORDER = Object.freeze([
  "Egypt & Mesopotamia",
  "Greek world",
  "Roman world",
  "Asia",
  "Sub-Saharan Africa",
  "Americas",
  "Italy",
  "France"
]);

const ARTIST_ORDER = Object.freeze([
  "Unknown / workshop",
  "Donatello",
  "Benedetto da Maiano",
  "Battista Lorenzi",
  "Michelangelo",
  "Bouchardon",
  "James Pradier",
  "Rodin"
]);

function resolveLobbyEntry(entry, pieces) {
  if (typeof entry === "string") {
    const piece = pieces[entry];
    return {
      pieceId: entry,
      piece,
      href: piece?.darkHref || piece?.path
    };
  }

  if (entry?.pieceId) {
    const piece = pieces[entry.pieceId];
    return {
      pieceId: entry.pieceId,
      piece,
      href: entry.href || piece?.darkHref || piece?.path
    };
  }

  return entry;
}

function splitViewerTitle(viewerTitle = "") {
  const trimmedTitle = viewerTitle.trim();
  const openIndex = trimmedTitle.lastIndexOf(" (");
  if (openIndex === -1 || !trimmedTitle.endsWith(")")) {
    return {
      title: trimmedTitle,
      context: "",
      date: ""
    };
  }

  const title = trimmedTitle.slice(0, openIndex).trim();
  const detail = trimmedTitle.slice(openIndex + 2, -1).trim();
  const commaIndex = detail.lastIndexOf(",");

  if (commaIndex !== -1 && /\d/.test(detail.slice(commaIndex + 1))) {
    return {
      title,
      context: detail.slice(0, commaIndex).trim(),
      date: detail.slice(commaIndex + 1).trim()
    };
  }

  return {
    title,
    context: "",
    date: detail
  };
}

function cleanArtistLine(value = "") {
  return value.replace(/^Artist:\s*/i, "").trim();
}

function approximateCenturyYear(century, era, qualifier = "") {
  const normalizedQualifier = qualifier.toLowerCase();
  const start = era === "bce" ? -century * 100 : (century - 1) * 100;
  const offset =
    normalizedQualifier.includes("late") ? 84 :
    normalizedQualifier.includes("mid") ? 50 :
    normalizedQualifier.includes("early") ? 16 :
    50;
  return start + offset;
}

function parseApproxYear(piece) {
  const text = `${piece?.viewerTitle || ""} ${piece?.subtitle || ""}`;

  if (/mid-19th\s+to\s+early\s+20th\s+century/i.test(text)) {
    return 1885;
  }

  const decadeMatch = text.match(/(\d{3,4})0s/i);
  if (decadeMatch) {
    return Number.parseInt(decadeMatch[1], 10) + 5;
  }

  const yearRangeMatch = text.match(/(\d{1,4})\s*[-–]\s*(\d{1,4})\s*(bce|ce)/i);
  if (yearRangeMatch) {
    const start = Number.parseInt(yearRangeMatch[1], 10);
    const end = Number.parseInt(yearRangeMatch[2], 10);
    const era = yearRangeMatch[3].toLowerCase();
    const signedStart = era === "bce" ? -start : start;
    const signedEnd = era === "bce" ? -end : end;
    return Math.round((signedStart + signedEnd) * 0.5);
  }

  const explicitYearMatch = text.match(/(\d{1,4})\s*(bce|ce)/i);
  if (explicitYearMatch) {
    const year = Number.parseInt(explicitYearMatch[1], 10);
    return explicitYearMatch[2].toLowerCase() === "bce" ? -year : year;
  }

  const centuryRangeMatch = text.match(
    /(early|mid|late)?-?\s*(\d{1,2})(?:st|nd|rd|th)\s+to\s+(early|mid|late)?-?\s*(\d{1,2})(?:st|nd|rd|th)\s+century/i
  );
  if (centuryRangeMatch) {
    const startYear = approximateCenturyYear(
      Number.parseInt(centuryRangeMatch[2], 10),
      "ce",
      centuryRangeMatch[1] || ""
    );
    const endYear = approximateCenturyYear(
      Number.parseInt(centuryRangeMatch[4], 10),
      "ce",
      centuryRangeMatch[3] || ""
    );
    return Math.round((startYear + endYear) * 0.5);
  }

  const centuryMatch = text.match(/(early|mid|late)?-?\s*(\d{1,2})(?:st|nd|rd|th)(?:-century)?(?:\s+type)?(?:\s+(bce|ce))?/i);
  if (centuryMatch && /century/i.test(text)) {
    const era = centuryMatch[3]?.toLowerCase() || "ce";
    return approximateCenturyYear(Number.parseInt(centuryMatch[2], 10), era, centuryMatch[1] || "");
  }

  const plainYearRange = text.match(/(\d{4})\s*[-–]\s*(\d{4})/);
  if (plainYearRange) {
    return Math.round((Number.parseInt(plainYearRange[1], 10) + Number.parseInt(plainYearRange[2], 10)) * 0.5);
  }

  const plainYear = text.match(/\b(1[0-9]{3}|20[0-9]{2})\b/);
  if (plainYear) {
    return Number.parseInt(plainYear[1], 10);
  }

  return null;
}

function formatApproxYear(year) {
  if (year == null) return "Date uncertain";
  const rounded = Math.round(year);
  return rounded < 0 ? `${Math.abs(rounded)} BCE` : `${rounded} CE`;
}

function formatYearRange(entries) {
  const years = entries.map((entry) => parseApproxYear(entry.piece)).filter((value) => value != null);
  if (!years.length) return "Date range pending";
  const min = Math.min(...years);
  const max = Math.max(...years);
  if (min === max) return formatApproxYear(min);
  return `${formatApproxYear(min)} - ${formatApproxYear(max)}`;
}

function formatWorkCount(count, active) {
  return `${count} ${active ? "matching works" : count === 1 ? "work" : "works"}`;
}

function getRegionLabel(piece) {
  if (piece?.region) return piece.region;
  const text = `${piece?.viewerTitle || ""} ${piece?.subtitle || ""} ${piece?.lobbyMeta || ""}`.toLowerCase();

  if (piece?.sectionId === "asia") return "Asia";
  if (piece?.sectionId === "sub-saharan-africa") return "Sub-Saharan Africa";
  if (piece?.sectionId === "americas") return "Americas";
  if (piece?.sectionId === "early-renaissance" || piece?.sectionId === "michelangelo") return "Italy";
  if (piece?.sectionId === "bouchardon" || piece?.sectionId === "rodin") return "France";
  if (piece?.sectionId === "greek-classical" || piece?.sectionId === "hellenistic-world") return "Greek world";
  if (piece?.sectionId === "roman-world") return "Roman world";
  if (piece?.sectionId === "egypt-mesopotamia") {
    return "Egypt & Mesopotamia";
  }

  if (/egypt|giza|sphinx|assyrian|nimrud|nineveh|mesopotamia/.test(text)) return "Egypt & Mesopotamia";
  if (/roman|prima porta|germanicus|capitoline|belvedere torso|ludovisi/.test(text)) return "Roman world";
  if (/delphi|artemision|athena|discobolus|milo|laocoon|gaul|greek|hellenistic|apollo belvedere/.test(text)) {
    return "Greek world";
  }

  return "";
}

function getEraLabel(piece) {
  if (piece?.period) return piece.period;
  const year = parseApproxYear(piece);
  if (year == null) return "Date uncertain";
  if (year <= 500) return "Antiquity";
  if (year < 1400) return "Sacred and Court Traditions";
  if (year < 1500) return "Early Renaissance";
  if (year < 1600) return "High Renaissance";
  if (year < 1800) return "Enlightenment Sculpture";
  if (year < 1900) return "Nineteenth Century";
  return "Modern Sculpture";
}

function getArtistLabel(piece) {
  const maker = String(piece?.maker || "").trim();

  if (!maker) return "Unknown / workshop";
  if (/michelangelo/i.test(maker)) return "Michelangelo";
  if (/bouchardon/i.test(maker)) return "Bouchardon";
  if (/rodin/i.test(maker)) return "Rodin";
  if (/donatello/i.test(maker)) return "Donatello";
  if (/maiano/i.test(maker)) return "Benedetto da Maiano";
  if (/lorenzi/i.test(maker)) return "Battista Lorenzi";
  if (/pradier/i.test(maker)) return "James Pradier";
  if (/unknown|workshop|stonemasons|sculptor|artist|caster|worker|maker/i.test(maker)) return "Unknown / workshop";

  return maker;
}

function buildBrowseItems(field, order, items) {
  const counts = new Map();
  for (const item of items) {
    if (!item[field]) continue;
    counts.set(item[field], (counts.get(item[field]) || 0) + 1);
  }

  const seen = new Set();
  const orderedLabels = [];

  for (const label of order) {
    if (!counts.has(label)) continue;
    seen.add(label);
    orderedLabels.push(label);
  }

  const extras = [...counts.keys()]
    .filter((label) => !seen.has(label))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return [...orderedLabels, ...extras].map((label) => ({
    label,
    value: label,
    count: counts.get(label)
  }));
}

function sortEntries(entries) {
  return entries.sort((a, b) => {
    const aOrder = a.piece?.sortOrder ?? 9999;
    const bOrder = b.piece?.sortOrder ?? 9999;
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    return (a.title || "").localeCompare(b.title || "", undefined, { numeric: true });
  });
}

function entryCreator(piece, titleParts) {
  const subtitle = cleanArtistLine(piece?.subtitle || "").split(";")[0].trim();
  if (piece?.lobbyArtistLine) return piece.lobbyArtistLine;
  if (/^artist:/i.test(piece?.subtitle || "")) return subtitle;
  if (titleParts.context) return titleParts.context;
  return subtitle;
}

function presentEntry(entry, section) {
  const piece = entry.piece;
  const titleParts = splitViewerTitle(piece?.lobbyTitle || piece?.viewerTitle || "");
  const creator = entryCreator(piece, titleParts);

  return {
    id: entry.pieceId,
    href: entry.href,
    piece,
    title: titleParts.title || piece?.viewerTitle || "",
    creator,
    date: piece?.lobbyDate || titleParts.date || formatApproxYear(parseApproxYear(piece)),
    linkLabel: piece?.lobbyLinkLabel || "",
    attribution: piece?.heroAttribution || creator,
    era: getEraLabel(piece),
    region: getRegionLabel(piece),
    artist: getArtistLabel(piece),
    gallery: section.title
  };
}

function buildSections(lobby, pieces) {
  return (lobby.sections || [])
    .map((section) => {
      const items = sortEntries(
        (section.items || [])
          .map((entry) => resolveLobbyEntry(entry, pieces))
          .filter((entry) => entry?.piece && !entry.piece.hiddenFromLobby)
      ).map((entry) => presentEntry(entry, section));

      return {
        id: section.id,
        title: section.title,
        subtitle: section.subtitle,
        region: section.regionLabel || "",
        spineId: section.spineId || "",
        spineTitle: section.spineTitle || "",
        dateRange: formatYearRange(items),
        workCount: items.length,
        items
      };
    })
    .filter((section) => section.items.length > 0);
}

function buildSectionGroups(lobby, sections) {
  const sectionsById = new Map(sections.map((section) => [section.id, section]));
  const rawGroups = Array.isArray(lobby.sectionGroups) ? lobby.sectionGroups : [];

  if (!rawGroups.length) {
    return [{
      id: "all-galleries",
      title: "Galleries",
      showHeading: false,
      workCount: sections.reduce((sum, section) => sum + section.workCount, 0),
      sections
    }];
  }

  return rawGroups
    .map((group) => {
      const groupedSections = (group.sectionIds || [])
        .map((sectionId) => sectionsById.get(sectionId))
        .filter(Boolean);
      if (!groupedSections.length) return null;
      const showHeading = groupedSections.length > 1 || groupedSections[0].title !== group.title;
      return {
        id: group.id,
        title: group.title,
        showHeading,
        workCount: groupedSections.reduce((sum, section) => sum + section.workCount, 0),
        galleryCount: groupedSections.length,
        sections: groupedSections
      };
    })
    .filter(Boolean);
}

function buildRecentAdditions(pieces, sections, count = 5) {
  const visibleEntries = new Map(
    sections.flatMap((section) => section.items.map((item) => [item.id, item]))
  );

  return Object.entries(pieces)
    .filter(([pieceId, piece]) => piece && !piece.hiddenFromLobby && visibleEntries.has(pieceId))
    .slice(-count)
    .reverse()
    .map(([pieceId]) => visibleEntries.get(pieceId));
}

function startOfUtcDay(date) {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  utcDate.setUTCHours(0, 0, 0, 0);
  return utcDate.getTime();
}

function resolveFeaturedPieceId(lobby) {
  const rotation = Array.isArray(lobby.featuredPieceIds) ? lobby.featuredPieceIds.filter(Boolean) : [];
  const fallbackId = lobby.featuredPieceId || rotation[0] || "dying-gaul";

  if (!rotation.length) {
    return fallbackId;
  }

  const anchorDate = lobby.featuredRotationStart ? new Date(`${lobby.featuredRotationStart}T00:00:00Z`) : new Date();
  const anchorDay = startOfUtcDay(anchorDate);
  const currentDay = startOfUtcDay(new Date());
  const elapsedDays = Math.max(0, Math.floor((currentDay - anchorDay) / (24 * 60 * 60 * 1000)));
  return rotation[elapsedDays % rotation.length] || fallbackId;
}

function pickFeaturedPiece(lobby, sections) {
  const featuredId = resolveFeaturedPieceId(lobby);
  for (const section of sections) {
    const directMatch = section.items.find((item) => item.id === featuredId);
    if (directMatch) return directMatch;
  }
  for (const section of sections) {
    const previewable = section.items.find((item) => item.piece?.kind !== "sketchfab" && !/^https?:\/\//.test(item.href || ""));
    if (previewable) return previewable;
  }
  return sections[0]?.items[0] || null;
}

function heroPreviewHref(href) {
  if (!href || /^https?:\/\//.test(href)) return "";
  return href.includes("?") ? `${href}&embed=hero` : `${href}?embed=hero`;
}

function renderBrowseGroup(group) {
  const itemsHtml = group.items
    .map(
      (item) => `
        <button class="browse-chip" type="button" data-filter-group="${group.id}" data-filter-value="${item.value}" aria-controls="rooms" aria-pressed="false">
          <span>${item.label}</span>
          <span class="browse-count">${item.count}</span>
        </button>
      `
    )
    .join("");

  return `
    <section class="browse-group" aria-labelledby="browse-${group.id}">
      <h3 class="browse-group-title" id="browse-${group.id}">${group.title}</h3>
      <div class="browse-chip-row">${itemsHtml}</div>
    </section>
  `;
}

function renderEntry(entry) {
  const linkLabel = entry.linkLabel || "View Piece";
  const linkArrow = "&rarr;";
  const linkAttrs = "";

  return `
    <li class="work-item" id="work-${entry.id}" data-era="${entry.era}" data-region="${entry.region}" data-artist="${entry.artist}" data-gallery="${entry.gallery}">
      <a class="piece" href="${entry.href}"${linkAttrs}>
        <h4 class="piece-title">${entry.title}</h4>
        ${entry.creator ? `<p class="piece-creator">${entry.creator}</p>` : ""}
        ${entry.date ? `<p class="piece-date">${entry.date}</p>` : ""}
        <span class="piece-link">${linkLabel} <span aria-hidden="true">${linkArrow}</span></span>
      </a>
    </li>
  `;
}

function renderSection(section) {
  const itemsHtml = section.items.map((entry) => renderEntry(entry)).join("");
  return `
    <article class="gallery-card" id="rooms-${section.id}" data-work-count-label="${formatWorkCount(section.workCount)}">
      <div class="gallery-head">
        ${section.region ? `<p class="gallery-region">${section.region}</p>` : ""}
        <h3 class="gallery-title">${section.title}</h3>
        ${section.subtitle ? `<p class="gallery-description">${section.subtitle}</p>` : ""}
        <div class="gallery-meta">
          ${section.dateRange ? `<span>${section.dateRange}</span>` : ""}
          <span class="gallery-work-count" data-work-count>${formatWorkCount(section.workCount)}</span>
        </div>
      </div>
      <ul class="work-list">${itemsHtml}</ul>
    </article>
  `;
}

function renderSectionGroup(group) {
  const sectionsHtml = group.sections.map((section) => renderSection(section)).join("");
  const galleryLabel = group.galleryCount === 1 ? "gallery" : "galleries";

  return `
    <section class="chronology-group" id="sequence-${group.id}">
      ${group.showHeading ? `
        <div class="chronology-head">
          <p class="chronology-kicker">Chronology</p>
          <h3 class="chronology-title">${group.title}</h3>
          <p class="chronology-meta">${group.workCount} works • ${group.galleryCount} ${galleryLabel}</p>
        </div>
      ` : ""}
      <div class="gallery-grid">${sectionsHtml}</div>
    </section>
  `;
}

function restoreHashPosition() {
  const hash = (window.location.hash || "").replace(/^#/, "");
  if (!hash) return;
  const target = document.getElementById(hash);
  if (!target) return;
  requestAnimationFrame(() => {
    target.scrollIntoView({ block: "start" });
  });
}

function bindLobbyFilters() {
  const browseButtons = Array.from(document.querySelectorAll(".browse-chip"));
  const resetButton = document.querySelector("[data-filter-reset]");
  const galleryCards = Array.from(document.querySelectorAll(".gallery-card"));
  const chronologyGroups = Array.from(document.querySelectorAll(".chronology-group"));
  const status = document.getElementById("browseStatus");

  let activeGroup = "";
  let activeValue = "";

  function applyFilter(group = "", value = "") {
    activeGroup = group;
    activeValue = value;

    const hasActiveFilter = Boolean(group && value);
    if (status) {
      status.textContent = hasActiveFilter ? `Showing ${value}` : "Viewing the full collection";
    }
    if (resetButton) {
      resetButton.hidden = !hasActiveFilter;
    }

    for (const button of browseButtons) {
      const isActive = button.dataset.filterGroup === group && button.dataset.filterValue === value;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    }

    for (const card of galleryCards) {
      const works = Array.from(card.querySelectorAll(".work-item"));
      let visibleCount = 0;

      for (const work of works) {
        const isVisible = !hasActiveFilter || work.dataset[group] === value;
        work.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
        }
      }

      card.hidden = visibleCount === 0;

      const countNode = card.querySelector("[data-work-count]");
      if (countNode) {
        countNode.textContent = hasActiveFilter
          ? formatWorkCount(visibleCount, true)
          : card.dataset.workCountLabel || "";
      }
    }

    for (const groupNode of chronologyGroups) {
      const visibleCards = Array.from(groupNode.querySelectorAll(".gallery-card")).filter((card) => !card.hidden);
      groupNode.hidden = visibleCards.length === 0;
    }
  }

  for (const button of browseButtons) {
    button.addEventListener("click", () => {
      const nextGroup = button.dataset.filterGroup || "";
      const nextValue = button.dataset.filterValue || "";
      const isSameFilter = nextGroup === activeGroup && nextValue === activeValue;

      applyFilter(isSameFilter ? "" : nextGroup, isSameFilter ? "" : nextValue);

      if (!isSameFilter) {
        const firstVisibleGallery = galleryCards.find((card) => !card.hidden);
        firstVisibleGallery?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  resetButton?.addEventListener("click", () => {
    applyFilter();
  });

  applyFilter();
}

export function renderMuseumLobby(lobby, pieces) {
  const sections = buildSections(lobby, pieces);
  const sectionGroups = buildSectionGroups(lobby, sections);
  const entries = sections.flatMap((section) => section.items);
  const recentAdditions = buildRecentAdditions(pieces, sections);
  const featuredPiece = pickFeaturedPiece(lobby, sections);
  const browseGroups = [
    {
      id: "era",
      title: "By Era",
      items: buildBrowseItems("era", ERA_ORDER, entries)
    },
    {
      id: "region",
      title: "By Region",
      items: buildBrowseItems("region", REGION_ORDER, entries)
    },
    {
      id: "artist",
      title: "By Maker",
      items: buildBrowseItems("artist", ARTIST_ORDER, entries)
    },
    {
      id: "gallery",
      title: "By Gallery",
      items: sections.map((section) => ({
        label: section.title,
        value: section.title,
        count: section.workCount
      }))
    }
  ];

  const browseGroupsHtml = browseGroups.map((group) => renderBrowseGroup(group)).join("");
  const sectionsHtml = sectionGroups.map((group) => renderSectionGroup(group)).join("");
  const recentAdditionsHtml = recentAdditions.map((entry) => {
    const previewFrame = heroPreviewHref(entry.href);
    return `
      <li class="new-addition-item">
        <a class="new-addition-card" href="${entry.href}" aria-label="Open ${entry.title}">
          <span class="new-addition-stage">
            ${previewFrame ? `
              <iframe
                class="new-addition-frame"
                src="${previewFrame}"
                tabindex="-1"
                loading="lazy"
                title="${entry.title} preview"
              ></iframe>
            ` : ""}
          </span>
          <span class="new-addition-meta">
            <span class="new-addition-gallery">${entry.gallery}</span>
            <span class="new-addition-title">${entry.title}</span>
            ${entry.creator ? `<span class="new-addition-creator">${entry.creator}</span>` : ""}
            ${entry.date ? `<span class="new-addition-date">${entry.date}</span>` : ""}
            <span class="piece-link">${entry.linkLabel || "View Piece"} <span aria-hidden="true">&rarr;</span></span>
          </span>
        </a>
      </li>
    `;
  }).join("");
  const heroFrame = featuredPiece ? heroPreviewHref(featuredPiece.href) : "";
  const brandWords = String(lobby.brand || "FORM GALLERY").trim().split(/\s+/);
  const brandForm = brandWords[0] || "FORM";
  const brandGallery = brandWords.slice(1).join(" ") || "GALLERY";
  const titleText = lobby.title || "Atrium";
  const regionCount = browseGroups.find((group) => group.id === "region")?.items.length || 0;
  const makerCount = browseGroups.find((group) => group.id === "artist")?.items.length || 0;
  const collectionMeta = `${entries.length} works • ${sections.length} galleries • ${regionCount} regions • ${makerCount} makers`;
  const pageActions = [
    lobby.tourHref ? `<a class="explore-button" href="${lobby.tourHref}">${lobby.tourLabel || "Enter 3D Tour"}</a>` : "",
    renderUiModeToggle({ className: "ui-mode-toggle--hero" }),
    renderThemeToggle({ className: "theme-toggle--hero" })
  ]
    .filter(Boolean)
    .join("");
  const tourAction = `
    <div class="page-actions">
      ${pageActions}
      ${lobby.tourNote ? `<p class="page-action-note">${lobby.tourNote}</p>` : ""}
    </div>
  `;

  document.body.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to collection content</a>
    <div class="app lobby-app">
      <header class="museum-header museum-header--simple">
        <p class="page-title page-title--progressive" aria-label="${lobby.brand || "FORM GALLERY"}">
          <span class="page-title-form">${brandForm}</span>
          <span class="page-title-gallery">${brandGallery}</span>
        </p>
        <h1 class="page-heading">${titleText}</h1>
        <p class="page-subtitle">${lobby.subtitle || ""}</p>
        <p class="page-meta">${collectionMeta}</p>
        ${tourAction}
      </header>

      <main class="stage" id="main-content">
        ${featuredPiece ? `
          <section class="featured-work" aria-labelledby="featured-work-title">
            <div class="featured-copy">
              <p class="featured-label">${lobby.featuredLabel || "Featured Sculpture"}</p>
              <h2 class="featured-title" id="featured-work-title">${featuredPiece.title}</h2>
              ${(featuredPiece.attribution || featuredPiece.date) ? `
                <p class="featured-artist">
                  ${featuredPiece.attribution || ""}
                  ${featuredPiece.attribution && featuredPiece.date ? " • " : ""}
                  ${featuredPiece.date || ""}
                </p>
              ` : ""}
              <a class="explore-button" href="${featuredPiece.href}">${lobby.featuredCtaLabel || "Explore the Work"}</a>
            </div>
            <a class="sculpture-stage sculpture-stage--link" href="${featuredPiece.href}" aria-label="Open ${featuredPiece.title}">
              ${heroFrame ? `
                <iframe
                  class="hero-frame"
                  src="${heroFrame}"
                  tabindex="-1"
                  loading="eager"
                  title="${featuredPiece.title} preview"
                ></iframe>
              ` : ""}
            </a>
          </section>
        ` : ""}

        ${recentAdditions.length ? `
          <section class="new-additions-section" aria-labelledby="new-additions-title">
            <div class="section-head">
              <div>
                <p class="section-kicker">Recent Works</p>
                <h2 class="section-title" id="new-additions-title">New Additions</h2>
              </div>
            </div>
            <ul class="new-additions-grid" aria-label="Recent additions gallery walk">
              ${recentAdditionsHtml}
            </ul>
          </section>
        ` : ""}

        <section class="browse-section" aria-labelledby="browse-title">
          <div class="section-head">
            <div>
              <p class="section-kicker">Collection Guide</p>
              <h2 class="section-title" id="browse-title">${lobby.browseTitle || "Browse the Collection"}</h2>
            </div>
            <button class="browse-reset" type="button" data-filter-reset aria-controls="rooms" hidden>${lobby.browseResetLabel || "Show all works"}</button>
          </div>
          <p class="section-sub">${lobby.browseSubtitle || ""}</p>
          <p class="browse-status" id="browseStatus" aria-live="polite">Viewing the full collection</p>
          <div class="browse-grid">${browseGroupsHtml}</div>
        </section>

        <section class="rooms-section" id="rooms" aria-labelledby="rooms-title">
          <div class="section-head">
            <div>
              <p class="section-kicker">Chronology</p>
              <h2 class="section-title" id="rooms-title">Collection Sequence</h2>
            </div>
          </div>
          ${sectionsHtml}
        </section>
      </main>
    </div>
  `;

  bindThemeToggles(document.body);
  bindUiModeToggles(document.body);
  bindLobbyFilters();
  restoreHashPosition();
}
