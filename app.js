/* =====================================================================
   app.js — rendering, interaction, state and progress.

   No course copy lives here. Every string a student reads comes from
   content.js. This file only decides how those strings are put on screen.

   Nothing in here makes a network request. State is held in localStorage
   under the "setu-genai-course:" namespace, and every access is wrapped
   so that private browsing degrades to a working, non-persistent course.
   ===================================================================== */
(function () {
  "use strict";

  var NS = "setu-genai-course:";
  var STATE_KEY = NS + "state";

  /* ------------------------------------------------------------------
     1. Storage. Never throws. `available` is false when the browser
        refuses us, and the course runs identically without it.
     ------------------------------------------------------------------ */
  var store = {
    available: (function () {
      try {
        var probe = NS + "probe";
        window.localStorage.setItem(probe, "1");
        window.localStorage.removeItem(probe);
        return true;
      } catch (e) {
        return false;
      }
    })(),
    read: function (key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    write: function (key, value) {
      try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
    },
    clearNamespace: function () {
      try {
        var doomed = [];
        for (var i = 0; i < window.localStorage.length; i++) {
          var k = window.localStorage.key(i);
          if (k && k.indexOf(NS) === 0) { doomed.push(k); }
        }
        doomed.forEach(function (k) { window.localStorage.removeItem(k); });
        return true;
      } catch (e) { return false; }
    }
  };

  /* ------------------------------------------------------------------
     2. State
     ------------------------------------------------------------------ */
  function blankState() {
    return {
      current: 0,
      completed: {},     /* moduleId  -> true                                */
      answers: {},       /* checkId   -> { checked: bool, picks: {qid:[ids]} } */
      sorts: {},         /* sortId    -> { checked: bool, placed: {cardId:bucketId} } */
      sliders: {},       /* sliderId  -> stop index                          */
      reflections: {},   /* reflectId + "/" + promptId -> text               */
      builders: {},      /* builderId -> field values                        */
      finalScore: null,  /* { correct, total, passed }                       */
      recordName: ""
    };
  }

  var state = blankState();

  function loadState() {
    var raw = store.read(STATE_KEY);
    if (!raw) { return; }
    try {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        var fresh = blankState();
        Object.keys(fresh).forEach(function (k) {
          if (Object.prototype.hasOwnProperty.call(parsed, k)) { fresh[k] = parsed[k]; }
        });
        state = fresh;
      }
    } catch (e) {
      console.warn("Saved progress could not be read and has been ignored.", e);
    }
  }

  function save() {
    try { store.write(STATE_KEY, JSON.stringify(state)); } catch (e) { /* nothing to do */ }
  }

  /* ------------------------------------------------------------------
     3. Small DOM helpers
     ------------------------------------------------------------------ */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined && text !== null) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function byId(id) { return document.getElementById(id); }

  /* Inline markup in content.js is limited to <strong>, <em> and <a>
     (§4). Anything else is reduced to its text. Attributes are dropped
     apart from href on a link. */
  var ALLOWED_INLINE = { STRONG: 1, EM: 1, A: 1 };

  function sanitiseInto(source, target) {
    Array.prototype.slice.call(source.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        markConfirms(node.nodeValue, target);
        return;
      }
      if (node.nodeType !== 1) { return; }
      if (ALLOWED_INLINE[node.nodeName] === 1) {
        var kept = document.createElement(node.nodeName.toLowerCase());
        if (node.nodeName === "A") {
          var href = node.getAttribute("href") || "";
          if (/^(https?:|mailto:|#)/i.test(href)) { kept.setAttribute("href", href); }
          if (/^https?:/i.test(href)) {
            kept.setAttribute("rel", "noopener noreferrer");
          }
        }
        sanitiseInto(node, kept);
        target.appendChild(kept);
      } else {
        console.warn("content.js: <" + node.nodeName.toLowerCase() + "> is not allowed in course text and was reduced to plain text.");
        sanitiseInto(node, target);
      }
    });
  }

  /* [[CONFIRM: ...]] markers are shown on the page rather than hidden,
     so a reviewer can see what is still outstanding (§13). */
  var CONFIRM_PATTERN = /\[\[CONFIRM:[\s\S]*?\]\]/g;

  function markConfirms(text, target) {
    var last = 0;
    var match;
    CONFIRM_PATTERN.lastIndex = 0;
    while ((match = CONFIRM_PATTERN.exec(text)) !== null) {
      if (match.index > last) {
        target.appendChild(document.createTextNode(text.slice(last, match.index)));
      }
      target.appendChild(el("span", "confirm-marker", match[0]));
      last = match.index + match[0].length;
    }
    if (last < text.length) {
      target.appendChild(document.createTextNode(text.slice(last)));
    }
  }

  /* Returns a fragment of safe inline content for a string from content.js. */
  function rich(str) {
    var frag = document.createDocumentFragment();
    var holder = document.createElement("template");
    holder.innerHTML = String(str === undefined || str === null ? "" : str);
    sanitiseInto(holder.content, frag);
    return frag;
  }

  function richInto(node, str) {
    node.appendChild(rich(str));
    return node;
  }

  function icon(name) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    /* A tick and a cross: correctness is carried by shape and by the
       word beside it, not by colour (§8). */
    path.setAttribute("d", name === "tick"
      ? "M2.5 10.8 L7.4 15.6 L17.5 4.9"
      : "M4.2 4.2 L15.8 15.8 M15.8 4.2 L4.2 15.8");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2.6");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    return svg;
  }

  /* ------------------------------------------------------------------
     4. Block renderers. Registered by `type`; an unknown type renders
        nothing and warns (§4).
     ------------------------------------------------------------------ */
  var renderers = {};

  renderers.prose = function (block) {
    var wrap = el("div", "block block--prose");
    if (block.heading) {
      wrap.appendChild(richInto(el("h3", "block__heading"), block.heading));
    }
    (block.paragraphs || []).forEach(function (p) {
      wrap.appendChild(richInto(el("p"), p));
    });
    return wrap;
  };

  renderers.list = function (block) {
    var wrap = el("div", "block block--list");
    if (block.heading) {
      wrap.appendChild(richInto(el("h3", "block__heading"), block.heading));
    }
    if (block.lead) {
      wrap.appendChild(richInto(el("p", "block__lead"), block.lead));
    }
    var list = el(block.ordered ? "ol" : "ul");
    (block.items || []).forEach(function (item) {
      list.appendChild(richInto(el("li"), item));
    });
    wrap.appendChild(list);
    return wrap;
  };

  renderers.callout = function (block) {
    var tone = block.tone === "warning" || block.tone === "quote" ? block.tone : "note";
    var wrap = el("aside", "block callout callout--" + tone);
    if (block.title) {
      wrap.appendChild(richInto(el("h3", "callout__title"), block.title));
    }
    (block.paragraphs || []).forEach(function (p) {
      wrap.appendChild(richInto(el("p"), p));
    });
    if (block.items && block.items.length) {
      var list = el(block.ordered ? "ol" : "ul");
      block.items.forEach(function (item) {
        list.appendChild(richInto(el("li"), item));
      });
      wrap.appendChild(list);
    }
    if (block.attribution) {
      wrap.appendChild(richInto(el("p", "callout__attribution"), block.attribution));
    }
    return wrap;
  };

  /* hotspot and branch are deferred to v2. They render their stub copy
     and an HTML comment, and are deliberately not partially built. */
  function renderStub(block) {
    var wrap = el("div", "block stub");
    var stub = block.stub || {};
    wrap.appendChild(document.createComment(" v2: " + (stub.v2 || block.type) + " "));
    wrap.appendChild(el("p", "stub__flag", "Not in this preview"));
    if (stub.heading) {
      wrap.appendChild(richInto(el("h3", "stub__heading"), stub.heading));
    }
    (stub.paragraphs || []).forEach(function (p) {
      wrap.appendChild(richInto(el("p"), p));
    });
    return wrap;
  }
  renderers.hotspot = renderStub;
  renderers.branch = renderStub;

  /* --- INTERACTIONS --- */

  function renderBlock(block, module) {
    if (!block || typeof block.type !== "string") {
      console.warn("content.js: a block with no type was skipped.", block);
      return null;
    }
    var fn = renderers[block.type];
    if (typeof fn !== "function") {
      console.warn('content.js: unknown block type "' + block.type + '" was skipped.');
      return null;
    }
    try {
      return fn(block, module);
    } catch (e) {
      console.warn('content.js: the "' + block.type + '" block could not be rendered and was skipped.', e);
      return null;
    }
  }

  /* ------------------------------------------------------------------
     5. Module rendering
     ------------------------------------------------------------------ */
  var moduleRoot, moduleNav, contentsList, resumeSlot;

  function moduleIndexById(id) {
    for (var i = 0; i < COURSE.modules.length; i++) {
      if (COURSE.modules[i].id === id) { return i; }
    }
    return -1;
  }

  function renderModule(index) {
    var module = COURSE.modules[index];
    clear(moduleRoot);
    moduleRoot.setAttribute("aria-labelledby", "module-title");

    var head = el("div", "module__head");

    /* The brand 'U' device, one instance per screen, anchored to the top
       of its area, holding the module number (§9.5). */
    var u = el("div", "u-shape");
    u.setAttribute("aria-hidden", "true");
    u.appendChild(el("span", "u-shape__number", String(module.number)));
    head.appendChild(u);

    var headText = el("div", "module__headtext");
    headText.appendChild(el("p", "module__eyebrow",
      COURSE.ui.moduleLabel + " " + module.number + " of " + (COURSE.modules.length - 1) +
      "  ·  " + module.minutes + " " + COURSE.ui.minutesLabel));
    var title = el("h2", "module__title", module.title);
    title.id = "module-title";
    headText.appendChild(title);
    headText.appendChild(richInto(el("p", "module__summary"), module.summary));
    head.appendChild(headText);
    moduleRoot.appendChild(head);

    (module.blocks || []).forEach(function (block) {
      var node = renderBlock(block, module);
      if (node) { moduleRoot.appendChild(node); }
    });

    renderModuleNav(index);
    renderContents();
    updateProgress();
  }

  function renderModuleNav(index) {
    clear(moduleNav);
    var last = COURSE.modules.length - 1;

    if (index > 0) {
      var prev = el("button", "btn btn--secondary", COURSE.ui.previousLabel);
      prev.type = "button";
      prev.addEventListener("click", function () { go(index - 1); });
      moduleNav.appendChild(prev);
    } else {
      moduleNav.appendChild(el("span"));
    }

    var next = el("button", "btn");
    next.type = "button";
    if (index < last) {
      next.textContent = COURSE.ui.continueLabel + " " + COURSE.modules[index + 1].number;
      next.addEventListener("click", function () {
        completeModule(index);
        go(index + 1);
      });
    } else {
      next.textContent = COURSE.ui.finishLabel;
      next.addEventListener("click", function () {
        completeModule(index);
        updateProgress();
        renderContents();
        var target = byId("final-check-anchor") || moduleRoot;
        if (target.focus) { target.focus(); }
        target.scrollIntoView({ block: "start" });
      });
    }
    moduleNav.appendChild(next);
  }

  function completeModule(index) {
    var id = COURSE.modules[index].id;
    if (!state.completed[id]) {
      state.completed[id] = true;
      save();
    }
  }

  /* ------------------------------------------------------------------
     6. Contents and progress
     ------------------------------------------------------------------ */
  function renderContents() {
    clear(contentsList);
    COURSE.modules.forEach(function (module, index) {
      var item = el("li", "contents__item");
      var link = el("a", "contents__link");
      link.href = "#module-" + module.id;
      if (index === state.current) { link.setAttribute("aria-current", "true"); }

      link.appendChild(el("span", "contents__title", module.number + ". " + module.title));

      var status = state.completed[module.id]
        ? COURSE.ui.completeLabel
        : (index === state.current ? COURSE.ui.inProgressLabel : COURSE.ui.notStartedLabel);
      link.appendChild(el("span", "contents__meta",
        module.minutes + " " + COURSE.ui.minutesLabel + "  ·  " + status));

      item.appendChild(link);
      contentsList.appendChild(item);
    });
  }

  function updateProgress() {
    var total = COURSE.modules.length;
    var done = COURSE.modules.filter(function (m) { return state.completed[m.id]; }).length;
    var pct = Math.round((done / total) * 100);

    byId("site-progress").hidden = false;
    byId("progress-label").textContent = COURSE.ui.progressLabel;
    byId("progress-count").textContent = done + " of " + total + " " + COURSE.ui.progressOf;
    byId("progress-fill").style.width = pct + "%";

    var track = byId("progress-fill").parentNode;
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", String(total));
    track.setAttribute("aria-valuenow", String(done));
    track.setAttribute("aria-valuetext", done + " of " + total + " " + COURSE.ui.progressOf);
  }

  /* ------------------------------------------------------------------
     7. Routing
     ------------------------------------------------------------------ */
  var suppressHashHandling = false;

  function go(index, opts) {
    var options = opts || {};
    if (index < 0 || index >= COURSE.modules.length) { return; }
    state.current = index;
    save();

    suppressHashHandling = true;
    var hash = "#module-" + COURSE.modules[index].id;
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    window.setTimeout(function () { suppressHashHandling = false; }, 0);

    renderModule(index);

    if (!options.silent) {
      var main = byId("main");
      main.focus();
      window.scrollTo(0, 0);
    }
  }

  function indexFromHash() {
    var hash = window.location.hash || "";
    var match = /^#module-(.+)$/.exec(hash);
    if (!match) { return -1; }
    return moduleIndexById(match[1]);
  }

  function handleHashChange() {
    if (suppressHashHandling) { return; }
    var index = indexFromHash();
    if (index >= 0 && index !== state.current) { go(index); }
  }

  /* ------------------------------------------------------------------
     8. Resume
     ------------------------------------------------------------------ */
  function renderResume(savedIndex) {
    clear(resumeSlot);
    var box = el("aside", "resume");
    box.appendChild(el("h2", "resume__title", COURSE.intro.resumeTitle));
    box.appendChild(el("p", null, COURSE.intro.resumeBody));

    var row = el("div", "btn-row");
    var resume = el("button", "btn",
      COURSE.ui.resumeLabel + " " + COURSE.modules[savedIndex].number + ": " + COURSE.modules[savedIndex].title);
    resume.type = "button";
    resume.addEventListener("click", function () {
      clear(resumeSlot);
      go(savedIndex);
    });

    var again = el("button", "btn btn--secondary", COURSE.ui.startAgainLabel);
    again.type = "button";
    again.addEventListener("click", function () {
      clear(resumeSlot);
      go(0);
    });

    row.appendChild(resume);
    row.appendChild(again);
    box.appendChild(row);
    resumeSlot.appendChild(box);
  }

  /* ------------------------------------------------------------------
     9. Chrome: header, footer, contents toggle, reset
     ------------------------------------------------------------------ */
  function renderChrome() {
    document.title = COURSE.title;
    byId("course-title").textContent = COURSE.title;
    byId("course-subtitle").textContent = COURSE.subtitle;
    byId("contents-heading").textContent = COURSE.ui.contentsTitle;

    var toggle = byId("contents-toggle");
    toggle.textContent = COURSE.ui.contentsToggle;
    var list = byId("contents-list");

    /* The list is a plain sticky column on desktop and a collapsible
       panel on narrow screens. The toggle only exists below 60rem, so
       the collapsed state is set from the same media query. */
    var narrow = window.matchMedia("(max-width: 60rem)");
    function syncCollapse() {
      if (narrow.matches) {
        var open = toggle.getAttribute("aria-expanded") === "true";
        list.hidden = !open;
      } else {
        list.hidden = false;
      }
    }
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      syncCollapse();
    });
    if (narrow.addEventListener) {
      narrow.addEventListener("change", syncCollapse);
    } else if (narrow.addListener) {
      narrow.addListener(syncCollapse);
    }
    list.addEventListener("click", function (event) {
      if (event.target.closest && event.target.closest(".contents__link") && narrow.matches) {
        toggle.setAttribute("aria-expanded", "false");
        syncCollapse();
      }
    });
    syncCollapse();

    byId("footer-privacy").textContent = COURSE.footer.privacy;
    byId("footer-review").textContent = COURSE.footer.reviewNote;
    byId("confirms-summary").textContent =
      COURSE.footer.confirmsTitle + " (" + COURSE.confirms.length + ")";
    var confirmsList = byId("confirms-list");
    COURSE.confirms.forEach(function (text) {
      confirmsList.appendChild(el("li", null, text));
    });

    var reset = byId("reset-all");
    reset.textContent = COURSE.footer.resetLabel;
    reset.addEventListener("click", function () {
      if (!window.confirm(COURSE.footer.resetConfirm)) { return; }
      store.clearNamespace();
      state = blankState();
      clear(resumeSlot);
      byId("footer-status").textContent = COURSE.footer.resetDone;
      go(0);
    });

    if (!store.available) {
      byId("footer-status").textContent = COURSE.intro.noStorageNotice;
    }
  }

  /* ------------------------------------------------------------------
     10. Start
     ------------------------------------------------------------------ */
  function start() {
    if (typeof COURSE === "undefined") {
      console.error("content.js did not load, so there is no course to show.");
      return;
    }

    moduleRoot = byId("module-root");
    moduleNav = byId("module-nav");
    contentsList = byId("contents-list");
    resumeSlot = byId("resume-slot");

    loadState();
    renderChrome();

    var hashIndex = indexFromHash();
    if (hashIndex >= 0) {
      /* An explicit link wins: a lecturer sending someone to #module-3
         should land there without being asked. */
      go(hashIndex, { silent: true });
    } else {
      var savedIndex = Math.min(Math.max(state.current | 0, 0), COURSE.modules.length - 1);
      var hasProgress = savedIndex > 0 ||
        COURSE.modules.some(function (m) { return state.completed[m.id]; });
      go(0, { silent: true });
      if (hasProgress) { renderResume(savedIndex); }
    }

    window.addEventListener("hashchange", handleHashChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}());
