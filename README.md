# Using Gen AI at SETU — self-paced student course

A short web course that takes an SETU student through the university's
student guidelines on generative AI in about 20 minutes.

**This is a version 1 proof of concept**, built to be shown to colleagues and
to the students' union before the full course is commissioned. It looks and
behaves like the finished thing. Two activities are deliberately left as short
notes rather than half-built: see [What is not built yet](#what-is-not-built-yet).

---

## Contents

- [Opening and hosting the files](#opening-and-hosting-the-files)
- [The files, and which one to edit](#the-files-and-which-one-to-edit)
- [Editing a question](#editing-a-question)
- [Adding a card to the sort activity](#adding-a-card-to-the-sort-activity)
- [Adding a module](#adding-a-module)
- [Brand colours, fonts and type](#brand-colours-fonts-and-type)
- [Data and privacy](#data-and-privacy)
- [Review dates](#review-dates)
- [Items awaiting confirmation](#items-awaiting-confirmation)
- [What is not built yet](#what-is-not-built-yet)

---

## Opening and hosting the files

**To look at it on your own machine:** double-click `index.html`. It opens in
your browser and everything works, including saved progress. There is nothing
to install.

**To put it on the web:** copy the whole folder — including `assets/` — to any
web space that serves plain files. There is no build step, no server-side code
and no database. A university web folder, a static host or a shared drive all
work. Keep the folder structure exactly as it is, because the pages find the
fonts by their path.

**What you must copy:**

```
index.html
styles.css
content.js
app.js
assets/fonts/     four .woff2 files
README.md
```

If you copy `index.html` on its own it will look plain and do nothing. All four
files have to travel together.

---

## The files, and which one to edit

| File | What it holds | Edit it? |
|---|---|---|
| `content.js` | **Every word a student reads.** Questions, feedback, cards, module text. | Yes — this is the one |
| `styles.css` | Colours, fonts, spacing, print layout | Only with the brand guidelines to hand |
| `app.js` | How the page works. No course text at all | Leave to a developer |
| `index.html` | The empty frame the course is drawn into | Leave to a developer |
| `assets/fonts/` | DM Sans and Inter, stored locally | Leave alone |

Everything below is about `content.js`.

**Before you start:** make a copy of `content.js` first. If something breaks,
you can put the copy back.

**How to edit it:** open `content.js` in any plain-text editor — Notepad on
Windows, TextEdit on a Mac (Format ▸ Make Plain Text), or Visual Studio Code.
Do not open it in Word, which will add formatting that stops it working.

**Three rules that will save you:**

1. Text sits inside `"straight double quotes"`. If your text contains a double
   quote, use a single quote instead. Curly quotes typed by a word processor
   will break the file.
2. Every line inside a list ends with a comma, except the last one.
3. Save the file, then reload the page in your browser. If the page comes up
   blank, you have a punctuation error. Undo your last change and try again in
   smaller pieces.

You may use `<strong>bold</strong>`, `<em>italic</em>` and
`<a href="https://example.ie">a link</a>` inside any piece of text. Anything
else is stripped out automatically.

---

## Editing a question

Find the module, then find its `check` block. Each question looks like this:

```js
{
  id: "u1",
  prompt: "Your word processor offers to rewrite a paragraph for you. Do the guidelines apply to it?",
  multi: false,
  options: [
    {
      id: "a",
      text: "Yes — a tool built into software you already use is still a Gen AI tool, so check the brief",
      correct: true,
      feedback: "Yes. Where the tool lives makes no difference..."
    },
    ...
  ]
}
```

- `prompt` is the question.
- `multi: false` means one answer; `multi: true` means select all that apply.
- `text` is what the student sees beside the button.
- `correct: true` marks a right answer. With `multi: true` you can mark several.
- `feedback` is the explanation shown when they check their answer.

**Every option needs its own `feedback`, including the correct ones.** This is
the point of the design: the feedback explains *why*, referring back to the
guidelines. "Correct" on its own teaches nobody anything, so please do not
shorten it to that.

`id` values only need to be different from each other within the same question.
Leave them as they are unless you are adding a new option.

---

## Adding a card to the sort activity

The sort activity is in module 3, in the block that starts `type: "sort"`.
Add a new entry to the `cards` list:

```js
{
  id: "c12",
  text: "Using AI to generate the images in a presentation",
  correctBucket: "ask",
  explain: "Whether this is permitted depends on what the presentation is assessing..."
},
```

- `id` — any short label not already used by another card.
- `text` — what appears on the card.
- `correctBucket` — one of `"fine"`, `"ask"` or `"no"`. These match the three
  columns: Generally fine, Ask your lecturer first, Not acceptable.
- `explain` — shown for that card after the student checks their sorting.

Keep the number of cards to around a dozen. Beyond that the activity stops
being a two-minute exercise.

If you add cards, glance at the `summary` line underneath the `cards` list. It
tells the student why so many land in the middle column, and it is the teaching
point of the whole activity.

---

## Adding a module

Copy an existing module, paste it into the `modules` list where you want it,
and change the top five lines:

```js
{
  id: "referencing",        // short, no spaces. Becomes the web link #module-referencing
  number: 8,                // the number shown in the shape at the top
  title: "Referencing AI output",
  summary: "One sentence, shown in the contents list.",
  minutes: 3,               // your honest estimate
  blocks: [ ... ]           // the content, in the order it appears
}
```

Then replace the `blocks`. The building blocks available are:

| `type` | What it makes |
|---|---|
| `prose` | Paragraphs, with an optional `heading` above them |
| `list` | A bulleted list, or numbered with `ordered: true` |
| `callout` | A boxed note. `tone` is `"note"`, `"warning"` or `"quote"` |
| `check` | A knowledge check |
| `sort` | The card-sorting activity |
| `slider` | The permission spectrum |
| `builder` | The declaration builder |
| `reflect` | A free-text reflection, saved on the student's device |

The schema for each is written out in the comment at the very top of
`content.js`, with an example of every field.

**Renumbering:** if you insert a module in the middle, change the `number` on
the ones after it. The contents list, the progress bar and the Continue buttons
all follow the order of the `modules` list, so nothing else needs touching.

**One thing to check:** module 7 holds the final check and the completion
record. If you add a module, decide whether the new material needs a question
in that final check — it draws on the whole course.

---

## Brand colours, fonts and type

These live at the top of `styles.css`, in the block marked
`1. Brand tokens`. They come from the **SETU Brand Guidelines, Version 1,
May 2022**, and they are the brand's own colour names.

**Please do not change a colour without checking the brand document.** The
choices here are not decoration:

- Slate grey carries all body copy, because the guidelines make it the primary
  colour.
- Sea green is used for anything you can click, and for the progress bar.
- Grass green marks a correct answer and sunset red marks an incorrect one —
  but always alongside a word and a tick or cross, never colour on its own.
- Sunset red is never used for body-sized text. The brand's own accessibility
  chart does not permit it.
- The other four brand colours are listed in the file but deliberately unused.
  The guidelines ask for a small, consistent set rather than all nine.
- The brand gradients are not used. They need supplied image files, and a
  reading interface is the wrong place for them.

The fonts are **DM Sans Bold** for headings and buttons and **Inter** for body
copy, both as the guidelines specify. They are stored in `assets/fonts/` rather
than loaded from Google, so the course makes no network request at all. Both
are open-source and free to host this way.

Text is left-aligned everywhere. The guidelines are explicit that justified
type compromises accessibility, so please do not justify anything.

If you change a colour, a size or a pairing, the contrast has to be re-checked.
The measured figures for every pair shipped here are written into the comment at
the top of `styles.css`, under **Measured contrast**, with the reasoning for the
two that sit below the usual threshold.

---

## Data and privacy

**Nothing a student types leaves their browser.** There is no account, no
analytics, no tracking, no server and no network request of any kind — not even
for fonts. Progress, answers, reflections and the declaration builder are all
stored in the student's own browser, under names beginning
`setu-genai-course:`.

The consequences worth knowing:

- A student who uses a different browser, a different device, or private
  browsing starts again. The course still works; it just will not remember.
- Nobody, including you, can see what any student answered. There is no report
  to run. The completion record exists only on that student's screen until they
  print it.
- **Reset all my data** in the footer clears everything, after asking.

This matters for more than compliance. A course about handling data carefully
should not quietly collect any, and the footer says so where students can read
it.

---

## Review dates

Both source documents are versioned, so both files that depend on them carry a
review date near the top:

- `content.js` — reviewed against the **SETU Student Guidelines on the use of
  Gen AI**. Review date: **2026-09-02**.
- `styles.css` — reviewed against the **SETU Brand Guidelines, Version 1,
  May 2022**. Review date: **2026-09-02**.

When either document is reissued, re-read the file against it and move the date
on. The brand document in particular states that fuller guidelines were due the
September after publication, so a later version may already exist.

---

## Items awaiting confirmation

Some values could not be invented and are marked in the text as
`[[CONFIRM: ...]]`. They are visible on the page on purpose, and the footer
lists them under **Build notes: items awaiting confirmation**.

They include the SETU logo files, links to the academic integrity policies, the
support contact for a student facing a concern, whether a standard declaration
form already exists, and the verbatim wording of the five key principles in
module 6. Search `content.js` for `[[CONFIRM` to find them all.

**Every one of these should be resolved before students see this.** When you
have the real value, replace the whole marker including its double square
brackets, and delete the matching line from the `confirms` list at the bottom
of `content.js`.

---

## What is not built yet

Two activities are noted on the page as "Not in this preview" rather than
half-built:

- **Spot the problem** (module 2) — clicking the flaws in a piece of
  AI-generated coursework. Left out on build cost; the module teaches the same
  points in prose.
- **A walkthrough** (module 6) — a step-by-step scenario of a concern being
  raised. Left out because it depends on procedural detail that is not yet
  confirmed.

Both carry a note in `content.js` describing what a full build would need.
