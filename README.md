# OOP Studio

A self-contained, interactive interview-preparation website for object-oriented programming. **HTML + CSS + vanilla JavaScript.** No npm dependencies, build step, server, API key, or database required.

## What's included

- All 10 sections of the supplied OOP checklist, with detailed concept notes, examples, misconceptions, and short interview answers.
- All 16 classic design patterns, their trade-offs, when to use/avoid them, and side-by-side comparisons.
- Ten object-oriented design challenges with requirements, suggested classes and relationships, interviewer twists, optional reference solutions, and saved notes.
- Multiple-choice quizzes with randomized questions, explanations, best score, and adjustable module/length.
- Recall flashcards with lightweight spaced repetition (10 minutes after “Again”, then 1/3/7+ day intervals after “Got it”).
- Three timed mock-interview tracks with writable talking points.
- Per-topic completion, bookmarks, searchable/filterable curriculum, saved notes, local progress, and import/export backups.
- Keyboard shortcut: `/` focuses the global search field; `Esc` closes the topic panel.
- Accessible native dialog, responsive layouts, and reduced-motion support.

## Run locally

Open `index.html` directly in a modern browser, or serve from this folder:

```bash
python3 -m http.server 8080
```

Go to `http://localhost:8080`.

## Deploy to GitHub Pages

1. Create a **public GitHub repository**, for example `oop-studio`.
2. Upload **all files** from this folder to the repository root (keep `assets/` and the `.nojekyll` file).
3. Go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**.
4. Select the **main** branch and **/(root)** folder, then save.
5. Your site will be available at `https://YOUR_USERNAME.github.io/REPO_NAME/` after deployment.

This site uses only relative file references and hash-based navigation, so it works in project Pages subpaths without rewrite rules. There are no source maps or build artifacts to deploy.

## Files

| File | Role |
|---|---|
| `index.html` | App shell, navigation, semantic markup, inline SVG icon symbols. |
| `styles.css` | Colors, typography, layouts, responsiveness. |
| `content.js` | Editable curriculum, interview questions, patterns, design challenges, tracks. |
| `app.js` | State, navigation, localStorage, interactions, views. |
| `assets/favicon.svg` | Brand mark. |
| `.nojekyll` | Ensures GitHub Pages serves site files without Jekyll processing. |

## Editing the curriculum

Entries in `content.js` use the `entry(id, title, definition, example, trap, answer, extra?)` helper inside a `section(...)`. An ID must be unique across the entire curriculum. `app.js` references these IDs for progress, flashcards, design cases, and quiz filtering.

To add questions, append a `{ m, q, a, c, e }` object to `QUESTION_BANK` (`c` is the zero-based index of the right answer). You can change the olive/charcoal palette in the `:root` CSS custom properties.

## Privacy and limitations

Progress is kept **only** in that browser's localStorage, not synchronized across devices. Clearing browser storage or using a different browser loses local progress unless an exported backup is imported. Timer sessions run only while the page remains open; this is intentionally a single-user, static-only app. Google Fonts is optional: the CSS includes local system-font fallbacks and the application works without font-network access.

Content is educational, not an exhaustive guide to every edge case or language. All code snippets are illustrative, not necessarily standalone compilable programs.
# oop-interview-studio
