# 🎤 Guess the Song: PH Throwback Edition

A simple, colorful music-guessing ice breaker for classrooms, seminars, and
presentations. Play a short clip, guess the title, sing a little part, and move on!

**Game flow:** Play Clip → Guess Title → Reveal Title → Sing a short part → Next Song

No teams, no scores, no leaderboards — just quick, fun rounds. 🎶

---

## ▶️ How to play

1. Open the game (see links below) and click **Start Game**.
2. Click **Play Clip** — a short snippet plays behind a colorful **Listen Mode**
   cover, so the audience hears the song but can't see the title, artist, lyrics,
   or thumbnail.
3. Let the audience guess the **title** (and artist if they can!).
4. Click **Reveal Title** to show the answer and the **Sing Challenge**.
5. Click **Next Song** to continue.

Extra buttons: **Replay Clip**, **Show Hint**, **Show Sing Challenge**,
**Shuffle Songs**, **Reset Game**, and a presenter-only **Test All Clips** screen.

## 🔊 Test All Clips (before you present)

From the start screen, click **Test All Clips** to quickly check every song's
clip and timing before going live. If a video won't embed, swap its link
(see below).

---

## ✏️ How to edit the songs

All songs live in one array at the top of **`script.js`**. Each song looks like:

```js
{
  title: "I Want It That Way",
  artist: "Backstreet Boys",
  difficulty: "Easy",              // Easy | Medium | Hard | Hardest
  category: "90s Pop / Boy Band",
  hint: "Iconic boy band hit — 'Tell me why...'",
  youtubeEmbedUrl: "https://www.youtube.com/watch?v=4fndeDfaWCg",
  startTime: 49,                   // where the clip begins, in SECONDS (49 = 0:49)
  clipDuration: 10,                // how many seconds the clip plays (8–12 is nice)
  singChallenge: "Sing: 'Tell me why...' (the chorus!)"
}
```

- **`startTime`** is in seconds: `60` = 1:00, `90` = 1:30.
- **`clipDuration`** controls how long the clip plays and the countdown timer.
- **`youtubeEmbedUrl`** accepts a normal watch link, a `youtu.be` link, an embed
  link, or a plain 11-character video ID — all work.

To **add** a song, copy a block and paste it into the list. To **remove** one,
delete its block.

### If a video won't play

Some videos are blocked from embedding by their owner. If a clip shows an error,
replace that song's `youtubeEmbedUrl` with **another embeddable YouTube version**
of the same song (lyric-video uploads usually embed fine). A small
**"Open on YouTube (backup)"** link is available per round for emergencies only.

---

## 🎵 About the music (copyright)

This game **does not download or store any audio**. Songs are streamed only
through **official YouTube embeds** that you provide via `youtubeEmbedUrl`.
Nothing is hosted in this repository except the HTML, CSS, and JavaScript.

---

## 🗂️ Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and screens |
| `style.css`  | Colorful karaoke-style design |
| `script.js`  | Game logic + the editable song list |

## 🖥️ Run it locally (optional)

Best played through a local server or GitHub Pages (not `file:///`), so the
YouTube player gets a valid origin. On Windows you can double-click
`start-game.bat` to serve it at `http://localhost:8000`.
