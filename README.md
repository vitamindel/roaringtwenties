# The Normalcy Files: America, 1920–1929

A playable, pixel-art history museum about the Roaring Twenties and the promise of a "return to normalcy."

**Central question:** Did America's return to normalcy restore stability after World War I, or did it hide deeper problems in American government and society?

---

## 1. How to run it

**Quickest way:** double-click `index.html`. It opens in Chrome, Edge, Firefox or Safari and works offline. The one exception is the archival Harding recording, which streams from the Library of Congress and needs internet.

**Recommended way (needed for the video captions file):** run a local web server from this folder:

```
python -m http.server 8000
```

Then open **http://localhost:8000**. If Python isn't installed, any static server works, for example `npx serve`.

There is nothing to build or install. The game is plain HTML, CSS and JavaScript.

## 2. How to play

| Key | Action |
|---|---|
| **W A S D** / arrow keys | Walk (hold **Shift** to hurry) |
| **E** / **Space** | Examine, talk, play, enter a door |
| **M** | Map, room directory and fast travel |
| **N** | Room narration (captions + transcript) |
| **Esc** | Close a window / pause and settings |
| **H** | Help screen |

Phones and tablets get an on-screen joystick and an **E** button.

**Route:** the gold arrow at the top of the screen always points to the next stop.

1. Union Station: The Aftermath of World War I
2. The White House: Inside Harding's White House
3. The Daily Ledger: The Teapot Dome Scandal
4. Treasury & Press Hall: The Age of Calvin Coolidge
5. Hall of Nations: America and the World
6. Community Hall: Normalcy for Whom?
7. **Courthouse:** Judge Normalcy, the final evidence-based verdict
8. **Public Library:** Reference room with the bibliography, credits, scripts and Essential Questions

Inside every room:
- ✦ **Sparkles** mark artifacts you haven't examined yet (30 in total).
- ★ A **gold star** marks the room's mini-game (6 in total).
- The red **EXIT** mat at the bottom leads back to town.

Progress saves automatically in your browser. You can reset it under Esc → Settings.

## 3. Replacing the placeholders (your group's media)

| What | Where to put it | What happens if it's missing |
|---|---|---|
| Help-desk video | `media/video/helpdesk.mp4` | Title screen shows a "coming soon" card that plays a text-to-speech preview of the script, with captions |
| Video captions | `media/captions/helpdesk.vtt` | Captions fall back to automatic timing from the script |
| Room narrations | `media/audio/room1.mp3` … `room6.mp3` | Narration panel plays a text-to-speech preview, with captions |
| Team names | `js/content.js` → `TEAM` list (top of the file) | Shows "[Your name here]" |

Scripts for all recordings are in **`docs/SCRIPTS.md`**. The help-desk video runs about 65–75 seconds, and each room narration about 60–75 seconds at a natural pace.

**Tips**
- Export audio as MP3 and video as MP4 (H.264). Keep the exact file names.
- After recording the video, open `media/captions/helpdesk.vtt` in any text editor and adjust the times (`00:00:04.500 --> 00:00:09.000`) to match when each line is spoken.
- If you change any wording while recording, update the matching text in `js/content.js` so the captions and transcripts still match. Then run `node tools/build-docs.js` to regenerate the scripts, captions and bibliography.

## 4. Editing the historical content

Everything historical lives in **`js/content.js`**: rooms, narration, artifacts, mini-game questions, evidence for the verdict, sources and credits. You can edit text there without touching any game code.

- **Artifacts** have a title, date, creator, source type, background, "why it matters", a historian's question, Essential Question tags, and source IDs that link to the bibliography.
- **Sources** are in MLA 9th edition style. Every artifact cites its sources by ID, and the game checks those IDs.
- To add an archival image, put the file in `assets/archive/` and reference it from an artifact's `media` field.

## 5. Deliverables in this folder

| Deliverable | File |
|---|---|
| Playable game | `index.html` (+ `js/`, `css/`, `assets/`) |
| Help-desk video script | `docs/SCRIPTS.md` (top section) |
| Six narration scripts | `docs/SCRIPTS.md` |
| Word-ready bibliography (MLA) | `docs/BIBLIOGRAPHY.html`: open it, then Ctrl+A, Ctrl+C, paste into Word. There is also an in-game "Copy all" button in the Library. |
| Bibliography (plain text) | `docs/BIBLIOGRAPHY.md` |
| Placeholder instructions | Section 3 of this README |

## 6. Historical accuracy notes (for the Main Researcher)

- **Verified quotations.** Each one was checked against its original source:
  - Harding's "Readjustment" passage: Library of Congress catalog record
  - Coolidge's 1925 newspaper editors' speech: American Presidency Project
  - Coolidge's 1925 inaugural address: Miller Center
  - *Gitlow v. New York*: Cornell Legal Information Institute
  - Kellogg-Briand Pact: Avalon Project, Yale
  - The Budget and Accounting Act, Revenue Act of 1921, Tariff Act of 1922, and the 1921 and 1924 immigration laws: GovInfo
- **Archival materials are real.** There are 18 Library of Congress photographs and 3 Chronicling America front pages: the *New York Herald* (Nov. 3, 1920) and the *Evening Star* (Jan. 25 and Feb. 13, 1924). Restricted-rights images (for example, Benjamin Gitlow's portrait) were left out and replaced with clearly labeled pixel illustrations plus a link.
- **Everything made by us is labeled.** The town, characters, maps and diagrams are modern illustrations. Townspeople and mini-game profiles are marked as fictional or composite. Simulations show their rules and say they are simplified.
- **Careful claims.** The game separates corruption *in* Harding's administration from any evidence about Harding himself (there is no evidence he took oil bribes). It also does not claim Coolidge's policies alone caused the Great Depression, which began after his term.
- **Class materials not yet included.** The following could not be accessed while building, so they are **not** cited: AP Henretta Ch. 21, Savvas, GALE, *ABC News: The Century*, McGraw-Hill, and *American Issues*. If your group uses them, add them to `SOURCES` in `js/content.js` and run `node tools/build-docs.js`. The ushistory.org reading *is* cited.

## 7. Project structure

```
index.html            – page shell: title screen, HUD, overlays
css/style.css         – Art Deco / pixel interface styles
css/fonts.css         – locally bundled fonts (work offline)
js/content.js         – ALL historical content, sources, team credits
js/art.js             – procedural pixel-art generator (sprites, buildings, furniture)
js/world.js           – town and room layouts, collisions, interactables
js/engine.js          – game loop, movement, camera, traffic, train, lighting, saving
js/audio.js           – original synthesized music, ambience and sound effects
js/ui.js              – HUD, dialogue, map, settings, narration player, title screen
js/artifacts.js       – archive-file viewer and media widgets
js/minigames.js       – six mini-games + the final verdict
js/main.js            – startup
assets/archive/       – Library of Congress photographs and newspapers
assets/fonts/         – font files (SIL Open Font License)
media/                – your video, narration and captions go here
docs/                 – scripts and bibliography
tools/build-docs.js   – regenerates docs from content.js
```

## 8. Credits

- Archival media: Library of Congress (Prints & Photographs Division; Chronicling America; Nation's Forum Collection). Statutes: GovInfo.
- All pixel art, music and sound effects were generated in code for this project. No copyrighted music or recordings are used.
- Fonts: Limelight, Pixelify Sans, Silkscreen, Special Elite, EB Garamond (Google Fonts, open licenses).
