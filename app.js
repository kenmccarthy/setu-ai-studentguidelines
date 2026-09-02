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

  /* ------------------------------------------------------------------
     Knowledge check (§6.1)

     Real radio and checkbox inputs. Every option carries its own
     feedback, correct ones included. Answers persist, retries are
     unlimited, and nothing here is scored except the final check.
     ------------------------------------------------------------------ */

  function checkState(id) {
    if (!state.answers[id]) { state.answers[id] = { checked: false, picks: {} }; }
    return state.answers[id];
  }

  function isQuestionCorrect(question, picked) {
    var correct = question.options.filter(function (o) { return o.correct; })
      .map(function (o) { return o.id; }).sort();
    var chosen = (picked || []).slice().sort();
    return correct.length === chosen.length && correct.every(function (id, i) { return id === chosen[i]; });
  }

  function questionVerdict(question, picked) {
    if (!picked || !picked.length) { return "none"; }
    if (isQuestionCorrect(question, picked)) { return "correct"; }
    var anyRight = picked.some(function (id) {
      return question.options.some(function (o) { return o.id === id && o.correct; });
    });
    return (question.multi && anyRight) ? "partial" : "incorrect";
  }

  function feedbackItem(option, verdictClass, tag) {
    var item = el("div", "feedback__item feedback__item--" + verdictClass);
    var status = el("p", "feedback__status");
    var glyph = icon(verdictClass === "correct" ? "tick" : "cross");
    glyph.setAttribute("class", "feedback__icon feedback__icon--" + verdictClass);
    status.appendChild(glyph);
    status.appendChild(document.createTextNode(tag));
    item.appendChild(status);
    item.appendChild(el("p", "feedback__option", option.text));
    item.appendChild(richInto(el("p", "feedback__why"), option.feedback));
    return item;
  }

  function renderQuestionFeedback(region, question, picked) {
    clear(region);
    var verdict = questionVerdict(question, picked);
    if (verdict === "none") {
      region.appendChild(el("p", "feedback__why", COURSE.ui.notAnsweredLabel));
      return verdict;
    }

    var headline = verdict === "correct" ? COURSE.ui.correctLabel
      : (verdict === "partial" ? COURSE.ui.partialLabel : COURSE.ui.incorrectLabel);
    var summary = el("p", "feedback__status");
    var glyph = icon(verdict === "correct" ? "tick" : "cross");
    glyph.setAttribute("class", "feedback__icon feedback__icon--" + (verdict === "correct" ? "correct" : "incorrect"));
    summary.appendChild(glyph);
    summary.appendChild(document.createTextNode(headline));
    region.appendChild(summary);

    /* What the student chose, with the reason for each choice. */
    picked.forEach(function (id) {
      var option = question.options.filter(function (o) { return o.id === id; })[0];
      if (!option) { return; }
      region.appendChild(feedbackItem(option, option.correct ? "correct" : "incorrect",
        option.correct ? COURSE.ui.youChoseRight : COURSE.ui.youChoseWrong));
    });

    /* When the answer is not fully right, the correct options and their
       reasons are shown too, so the question teaches rather than marks. */
    if (verdict !== "correct") {
      question.options.forEach(function (option) {
        if (!option.correct) { return; }
        if (picked.indexOf(option.id) !== -1) { return; }
        region.appendChild(feedbackItem(option, "correct", COURSE.ui.missedRight));
      });
    }
    return verdict;
  }

  renderers.check = function (block) {
    var saved = checkState(block.id);
    var section = el("section", "block check");
    section.setAttribute("aria-labelledby", "check-" + block.id + "-title");
    if (block.scored) { section.id = "final-check-anchor"; section.tabIndex = -1; }

    var title = el("h3", "check__title", block.title || COURSE.ui.checkDefaultTitle);
    title.id = "check-" + block.id + "-title";
    section.appendChild(title);
    if (block.intro) { section.appendChild(richInto(el("p"), block.intro)); }

    var scoreRegion = el("div", "check__score");
    scoreRegion.setAttribute("aria-live", "polite");
    if (block.scored) { section.appendChild(scoreRegion); }

    var regions = {};

    block.questions.forEach(function (question, qIndex) {
      var group = el("fieldset", "question");
      var legend = el("legend", "question__prompt");
      legend.appendChild(document.createTextNode((qIndex + 1) + ". "));
      legend.appendChild(rich(question.prompt));
      group.appendChild(legend);
      group.appendChild(el("p", "question__hint",
        question.multi ? COURSE.ui.multiHint : COURSE.ui.singleHint));

      var list = el("ul", "options");
      var name = "q-" + block.id + "-" + question.id;

      question.options.forEach(function (option) {
        var li = el("li");
        var label = el("label", "option");
        var input = document.createElement("input");
        input.type = question.multi ? "checkbox" : "radio";
        input.name = name;
        input.value = option.id;
        input.className = "option__input";
        input.checked = (saved.picks[question.id] || []).indexOf(option.id) !== -1;
        if (input.checked) { label.classList.add("option--chosen"); }

        input.addEventListener("change", function () {
          var picks = Array.prototype.slice
            .call(list.querySelectorAll("input:checked"))
            .map(function (i) { return i.value; });
          saved.picks[question.id] = picks;
          save();
          Array.prototype.slice.call(list.querySelectorAll(".option")).forEach(function (l) {
            var box = l.querySelector("input");
            l.classList.toggle("option--chosen", !!(box && box.checked));
          });
          if (saved.checked) { showAll(); }
        });

        label.appendChild(input);
        label.appendChild(richInto(el("span", "option__text"), option.text));
        li.appendChild(label);
        list.appendChild(li);
      });

      group.appendChild(list);

      var region = el("div", "feedback");
      region.setAttribute("aria-live", "polite");
      regions[question.id] = region;
      group.appendChild(region);

      section.appendChild(group);
    });

    function showAll() {
      var correctCount = 0;
      var answered = 0;
      block.questions.forEach(function (question) {
        var picked = saved.picks[question.id] || [];
        if (picked.length) { answered++; }
        var verdict = renderQuestionFeedback(regions[question.id], question, picked);
        if (verdict === "correct") { correctCount++; }
      });
      if (block.scored) { renderScore(correctCount, answered); }
    }

    function clearAll() {
      saved.checked = false;
      saved.picks = {};
      save();
      Array.prototype.slice.call(section.querySelectorAll("input")).forEach(function (input) {
        input.checked = false;
      });
      Array.prototype.slice.call(section.querySelectorAll(".option")).forEach(function (label) {
        label.classList.remove("option--chosen");
      });
      Object.keys(regions).forEach(function (id) { clear(regions[id]); });
      clear(scoreRegion);
      if (block.scored) {
        state.finalScore = null;
        save();
        renderRecord();
      }
    }

    function renderScore(correctCount, answered) {
      clear(scoreRegion);
      var total = block.questions.length;
      var pass = correctCount >= (block.passMark || total);

      if (answered < total) {
        scoreRegion.appendChild(el("p", "score__headline",
          COURSE.ui.answerAllLabel.replace("{n}", String(total - answered))));
        state.finalScore = null;
        save();
        renderRecord();
        return;
      }

      var panel = el("div", "score");
      var headline = el("p", "score__headline");
      var glyph = icon(pass ? "tick" : "cross");
      glyph.setAttribute("class", "feedback__icon feedback__icon--" + (pass ? "correct" : "incorrect"));
      headline.appendChild(glyph);
      headline.appendChild(document.createTextNode(
        COURSE.ui.scoreYouGot + " " + correctCount + " " + COURSE.ui.scoreOutOf.replace("{total}", String(total))));
      panel.appendChild(headline);
      panel.appendChild(el("p", null, pass ? COURSE.ui.passedLabel : COURSE.ui.failedLabel));
      scoreRegion.appendChild(panel);

      state.finalScore = { correct: correctCount, total: total, passed: pass };
      save();
      renderRecord();
    }

    var row = el("div", "btn-row");
    var checkBtn = el("button", "btn", COURSE.ui.checkAnswersLabel);
    checkBtn.type = "button";
    checkBtn.addEventListener("click", function () {
      saved.checked = true;
      save();
      showAll();
    });
    var clearBtn = el("button", "btn btn--secondary",
      block.scored ? COURSE.ui.retryFinalLabel : COURSE.ui.tryAgainLabel);
    clearBtn.type = "button";
    clearBtn.addEventListener("click", clearAll);
    row.appendChild(checkBtn);
    row.appendChild(clearBtn);
    section.appendChild(row);

    if (store.available) {
      section.appendChild(el("p", "check__saved", COURSE.ui.savedLabel));
    }

    if (saved.checked) {
      /* Restore the feedback the student had last time, after this
         section has been placed in the document. */
      window.setTimeout(showAll, 0);
    }

    return section;
  };

  /* Replaced in the completion-record section below. Declared here so
     the final check can call it before that section is reached. */
  var renderRecord = function () {};

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
