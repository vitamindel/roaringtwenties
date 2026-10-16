# The Normalcy Files: America, 1920–1929

A playable, pixel-art history museum about the Roaring Twenties and the promise of a "return to normalcy."

**Central question:** Did America's return to normalcy restore stability after World War I, or did it hide deeper problems in American government and society?

**The two big questions** that run through the museum:
1. How did the federal government's relationship with business and the public interest shape America's return to normalcy?
2. Did the political and economic choices of the 1920s protect freedom and opportunity equally for all Americans?

---

## 1. How to run it

**Quickest way:** double-click `index.html`. It opens in Chrome, Edge, Firefox or Safari and works offline. The one exception is the archival Harding recording, which streams from the Library of Congress and needs internet. Its full transcript is always shown, even offline.

**Recommended way (needed for the video captions file):** run a local web server from this folder:

```
python -m http.server 8000
```

Then open **http://localhost:8000**. Any static server works. There is nothing to build or install.

## 2. How to play

| Key | Action |
|---|---|
| **W A S D** or arrow keys | Walk (hold **Shift** to hurry) |
| **E** or **Space** | Examine, talk, play, or enter a door |
| **1, 2, 3, 4** | Choose a question during a conversation |
| **M** | Map, room directory and fast travel |
| **N** | Replay or stop the room narration (it also starts by itself the first time you enter an exhibit) |
| **Esc** | Close a window, or open pause and settings |

Phones and tablets get an on-screen joystick and an **E** button. You can also click the "Press E" prompt.

**What the markers mean**
- ✦ **Sparkle:** an exhibit you have not examined yet. A small ✓ appears once you have.
- 💬 **Speech bubble:** a person you can talk to. You pick the questions; each one gets a different answer.
- ★ **Gold star:** the room's mini-game.
- **Door signs** name every exhibit and show ✓ after you visit.
- The **gold arrow** at the top always points to your next stop. The HUD shows a one-line objective for each room.

**Route:** the town square is the museum hub. Visit Exhibits 1 to 6 (clockwise around the square), then the Courthouse. The Library holds the sources.

1. Union Station: The Aftermath of World War I
2. The White House: Inside Harding's White House
3. The Daily Ledger: The Teapot Dome Scandal
4. Treasury & Press Hall: The Age of Calvin Coolidge
5. Hall of Nations: America and the World
6. Community Hall: Normalcy for Whom?
7. **Courthouse:** your verdict on normalcy, plus written answers with feedback
8. **Public Library:** bibliography, credits, scripts, music credits and the two big questions

Inside every room, the red **EXIT** mat at the bottom leads back to the square. Progress saves automatically in the browser (Esc, then "Reset progress" to start over).

## 3. The Courthouse written answers

Visitors answer three questions in writing and press **Submit answer**. Each answer gets a score out of 4 and specific suggestions:

| Criterion | What earns the point |
|---|---|
| Historical accuracy | Uses real history from the museum and avoids common errors (for example "Harding took the oil bribes" or "Teapot Dome is in California") |
| Specific evidence | Names at least one specific person, law, date, event or artifact |
| Reasoning | States a claim and explains how the evidence supports it ("because," "this shows," and so on) |
| Connection to normalcy | Ties the argument back to normalcy, public trust, the public interest, or equal opportunity |

This is an **automatic rubric check** based on keywords and evidence. It is not a teacher and not an AI. Any conclusion can earn full marks if it is supported. Answers and feedback are saved so they can be revised and resubmitted. To change the questions, keywords or error checks, edit `WRITTEN` and `RED_FLAGS` in `js/content.js`.

## 4. Music

Every area plays a different genuine jazz recording from 1920 to 1924, listed below. Sound recordings published before 1926 are in the U.S. public domain. The files came from Wikimedia Commons and were converted to small mono MP3s in `media/music/`.

| Area | Recording |
|---|---|
| Town square | "Riverboat Shuffle," Bix Beiderbecke and the Wolverine Orchestra (1924) |
| Exhibit 1 | "Krooked Blues," King Oliver's Creole Jazz Band (1923) |
| Exhibit 2, Library | "Modulations," Clarence M. Jones, piano (1923) |
| Exhibit 3 | "Limehouse Blues," Arthur Lange and His Orchestra (1924) |
| Exhibit 4 | "Whispering," Paul Whiteman and His Ambassador Orchestra (1920) |
| Exhibit 5 | "On the Alamo," Benson Orchestra of Chicago (1922) |
| Exhibit 6, Courthouse | "St. Louis Blues," Handy's Memphis Blues Band (1922) |

Tracks never overlap: the old one fades out before the next begins. Music lowers automatically while narration or the Harding recording plays. Settings (Esc) include music on/off, music volume, voiceover volume, sound-effect volume and ambient volume. If a music file is missing, the game simply stays quiet.

## 5. Replacing the placeholders (your group's media)

| What | Where to put it | What happens if it's missing |
|---|---|---|
| Help-desk video | `media/video/helpdesk.mp4` | The title screen plays a computer-voice preview of the script, with captions |
| Video captions | `media/captions/helpdesk.vtt` | Captions fall back to automatic timing from the script |
| Room narrations (done) | `media/audio/room1.mp3` … `room6.mp3` | The narration panel uses a computer voice, with captions |
| Team names | `js/content.js`, `TEAM` list at the top | Shows "[Your name here]" |

The help-desk script is in **`docs/SCRIPTS.md`** (about 70 seconds).

**Narration (recorded).** Each exhibit plays its student recording the first time a visitor walks in. Captions and a live transcript appear automatically, so nobody has to switch them on. Each line is timed to the recording, and a pixel avatar of the narrator, drawn in their costume, moves its mouth while they speak.

| Exhibit | Narrator | Costume on the avatar |
|---|---|---|
| 1 and 2 | Nitya | Wide-brimmed hat with a ribbon bow, cable-knit sweater |
| 3 | Ike | Bowler hat, patterned blazer, saxophone neck strap |
| 4 and 6 | Ashwin | Navy quarter-zip over a white shirt and navy tie, glasses |
| 5 | Dyuti | Flapper headband with a jeweled brooch, sherpa jacket |

The captions are the `cues` lists in `js/content.js` (each line is `[start time in seconds, text]`). If you re-record a room, update its times and text there. Visitors can turn captions off with the Captions button, and automatic narration can be switched off in Esc, Settings. The original uploads (`media/audio/exhibit1.mp4` and so on) were converted into `room1.mp3` … `room6.mp3`, which are the files the game uses.

## 6. Editing the historical content

Everything historical lives in **`js/content.js`**: rooms, narration, artifacts, conversations (`PEOPLE`), mini-game questions, courthouse questions, evidence for the verdict, sources, music and credits. You can edit text there without touching any game code.

- **Artifacts** have a short summary, background, "what this evidence tells us," "limits of this source," "why it matters," optional "read more" paragraphs, a question, images with captions, credits and alt text, and source IDs.
- **Conversations:** each character has a greeting and two to four questions. Each answer can cite a source ID. Fictional guides and historical composites are labeled as such.
- **House style:** no em dashes. Use commas, periods, colons or parentheses.
- To add an archival image, put the file in `assets/archive/` and add it to an artifact's `images` list with a caption, credit and alt text.

## 7. Deliverables in this folder

| Deliverable | File |
|---|---|
| Playable game | `index.html` (plus `js/`, `css/`, `assets/`, `media/`) |
| Help-desk video script | `docs/SCRIPTS.md` (top section) |
| Six narration scripts | `docs/SCRIPTS.md` |
| Word-ready bibliography (MLA) | `docs/BIBLIOGRAPHY.html`: open it, press Ctrl+A and Ctrl+C, then paste into Word. The Library's card catalog also has a "Copy all" button. |
| Bibliography (plain text) | `docs/BIBLIOGRAPHY.md` |

## 8. Historical accuracy notes (for the Main Researcher)

- **Verified quotations.** Each one was checked against its original source:
  - Harding's "Readjustment" recording: the full Miller Center transcription, checked sentence by sentence against the Library of Congress audio with speech recognition. The disc is complete (4 min 22 s), with nothing cut.
  - Coolidge, 1925 newspaper editors' speech: American Presidency Project. Coolidge, 1925 inaugural: Miller Center.
  - *Gitlow v. New York*: Cornell Legal Information Institute and the official *U.S. Reports* pages. The majority quotation uses an ellipsis to omit one phrase, which is marked.
  - Kellogg-Briand Pact: Avalon Project, Yale. All five laws: the Statutes at Large on GovInfo.
- **Archival materials.** There are 27 Library of Congress photographs and prints, 3 Chronicling America front pages, 3 pages from *U.S. Reports*, and 5 page scans from the Statutes at Large. The Doughboy popup shows the real Wheeling, West Virginia memorial (dedicated May 30, 1931).
  - Benjamin Gitlow's Library of Congress portrait record (loc.gov/item/2002711324) has no digitized image and its rights are "not evaluated," so the exhibit shows the Supreme Court's printed opinion instead.
- **Labels.** Modern illustrations, the simplified maps and diagrams, fictional guides, historical composites and simulations are all labeled.
- **Careful claims.**
  - The game separates corruption *in* Harding's administration from any claim about Harding himself (there is no evidence he took oil bribes).
  - It does not claim Coolidge's policies alone caused the Great Depression, which began after his term.
  - It keeps Harding's policies (1921–23) and Coolidge's (1923–29) distinct.
- **Class materials not yet included.** These could not be accessed while building, so they are **not** cited: AP Henretta Ch. 21, Savvas, GALE, *ABC News: The Century*, McGraw-Hill, and *American Issues*. If your group uses them, add them to `SOURCES` in `js/content.js` and run `node tools/build-docs.js`. The ushistory.org reading *is* cited.

## 9. Project structure

```
index.html            page shell: title screen, HUD, overlays
css/style.css         museum and pixel interface styles
css/fonts.css         locally bundled fonts (work offline)
js/content.js         ALL historical content, conversations, questions, sources, music, credits
js/art.js             procedural pixel-art generator (sprites, buildings, furniture, maps)
js/world.js           town and room layouts, collisions, interactables, characters
js/engine.js          game loop, movement, camera, traffic, train, lighting, door signs, saving
js/audio.js           music player (one track at a time), ambience and sound effects
js/ui.js              HUD, conversations, map, settings, narration player, title screen
js/artifacts.js       archive window: gallery, transcript, documents, evidence board
js/minigames.js       six mini-games, the verdict, and the written-answer rubric
js/main.js            startup
assets/archive/       Library of Congress images, newspapers, court pages, statute pages
assets/fonts/         font files (open licenses)
media/music/          public-domain jazz recordings
media/                your video, narration and captions go here
docs/                 scripts and bibliography
tools/build-docs.js   regenerates docs from content.js
```

## 10. Credits

- Archival media: Library of Congress (Prints and Photographs Division; Chronicling America; Nation's Forum Collection; U.S. Reports). Statutes: GovInfo. Harding transcript: Miller Center, University of Virginia.
- Music: public-domain recordings (1920–1924) via Wikimedia Commons, listed above.
- The pixel art, diagrams and sound effects were made in code for this project.
- Fonts: Limelight, Pixelify Sans, Silkscreen, Special Elite, EB Garamond (open licenses).
