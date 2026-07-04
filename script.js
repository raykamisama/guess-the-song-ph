/* ============================================================
   Guess the Song: PH Throwback Edition  (simple ice-breaker)
   ============================================================
   ┌──────────────────────────────────────────────────────────┐
   │  HOW TO EDIT SONGS  (this is the only part you change)     │
   └──────────────────────────────────────────────────────────┘
   Each song is an object in the `songs` array:

   - title            : the song title (the answer)
   - artist           : the performing artist
   - difficulty       : "Easy", "Medium", or "Hard"
   - category         : short label shown during the round
   - hint             : shown when "Show Hint" is clicked
   - youtubeEmbedUrl  : an official YouTube link. Watch links,
                        youtu.be links, embed links, or a plain
                        11-char video ID all work. Leave "" to show
                        "Add YouTube link here."
   - startTime        : where the clip BEGINS, in SECONDS.
                        e.g. 45 = 0:45,  60 = 1:00,  90 = 1:30
   - clipDuration     : how many seconds the clip plays (8–12 is nice)
   - singChallenge    : the little "sing this part" prompt

   COPYRIGHT NOTE: No audio is downloaded or stored. The game only
   embeds official YouTube videos and plays a short clip.
   ============================================================ */

console.log("script.js loaded");

const DEFAULT_DURATION = 10;

const songs = [
  /* ---------------- EASY (3) ---------------- */
  {
    title: "I Want It That Way",
    artist: "Backstreet Boys",
    difficulty: "Easy",
    category: "90s Pop / Boy Band",
    hint: "Iconic boy band hit — 'Tell me why...'",
    youtubeEmbedUrl: "https://www.youtube.com/watch?v=4fndeDfaWCg",
    startTime: 49,
    clipDuration: 10,
    singChallenge: "Sing: 'Tell me why...' (the chorus!)"
  },
  {
    title: "My Heart Will Go On",
    artist: "Celine Dion",
    difficulty: "Easy",
    category: "Movie Theme Ballad",
    hint: "The theme from Titanic.",
    youtubeEmbedUrl: "https://www.youtube.com/watch?v=p79GmLNLMrY",
    startTime: 45,
    clipDuration: 12,
    singChallenge: "Sing: 'Near, far, wherever you are...'"
  },
  {
    title: "Ang Huling El Bimbo",
    artist: "Eraserheads",
    difficulty: "Easy",
    category: "OPM Classic",
    hint: "Pinoy rock legend — 'Kamukha mo si Paraluman...'",
    youtubeEmbedUrl: "https://www.youtube.com/watch?v=v6f7jv-egIU",
    startTime: 40,
    clipDuration: 12,
    singChallenge: "Sing: 'Kamukha mo si Paraluman...'"
  },

  /* ---------------- MEDIUM (3) ---------------- */
  {
    title: "Harana",
    artist: "Parokya ni Edgar",
    difficulty: "Medium",
    category: "OPM Kilig",
    hint: "A sweet Pinoy serenade song.",
    youtubeEmbedUrl: "https://www.youtube.com/watch?v=4uzgcpSR-_4",
    startTime: 35,
    clipDuration: 12,
    singChallenge: "Sing the sweet chorus of the harana!"
  },
  {
    title: "214",
    artist: "Rivermaya",
    difficulty: "Medium",
    category: "OPM Rock Ballad",
    hint: "A number you'll never forget.",
    youtubeEmbedUrl: "https://www.youtube.com/watch?v=d59MC-PEJK0",
    startTime: 45,
    clipDuration: 11,
    singChallenge: "Sing: 'When your problems make you feel...'"
  },
  {
    title: "...Baby One More Time",
    artist: "Britney Spears",
    difficulty: "Medium",
    category: "Late 90s Pop",
    hint: "'Oh baby baby...' — a pop icon's debut.",
    youtubeEmbedUrl: "https://www.youtube.com/watch?v=C-u5WLJ9Yk4",
    startTime: 7,
    clipDuration: 11,
    singChallenge: "Sing: 'My loneliness is killing me...'"
  },

  /* ---------------- HARD (3) ---------------- */
  {
    title: "When I Met You",
    artist: "APO Hiking Society",
    difficulty: "Hard",
    category: "OPM Timeless",
    hint: "Kilig classic — 'The night that I met you...'",
    youtubeEmbedUrl: "https://www.youtube.com/watch?v=vTyJmM_nPxY",
    startTime: 40,
    clipDuration: 12,
    singChallenge: "Sing: 'I knew I needed you so...'"
  },
  {
    title: "Forevermore",
    artist: "Side A",
    difficulty: "Hard",
    category: "OPM Wedding Favorite",
    hint: "A classic Pinoy love song — 'Like the sun...'",
    youtubeEmbedUrl: "https://www.youtube.com/watch?v=jhgxW1-12JQ",
    startTime: 50,
    clipDuration: 12,
    singChallenge: "Sing: 'You are my forevermore...'"
  },
  {
    title: "More to Lose",
    artist: "Seona Dancing",
    difficulty: "Hard",
    category: "80s New Wave",
    hint: "Ricky Gervais's old band — a cult hit in the PH!",
    youtubeEmbedUrl: "https://www.youtube.com/watch?v=Gw1MMcz_m4A",
    startTime: 40,
    clipDuration: 12,
    singChallenge: "Sing the dramatic chorus!"
  }
];

/* ============================================================
   GAME LOGIC — no need to edit below to change songs.
   ============================================================ */

let order = [];
let current = 0;
let shuffleOn = false;

let countdownId = null;
let clipStopId = null;
let timeLeft = DEFAULT_DURATION;

let currentTest = 0; // which song is shown on the Test All Clips screen

/* Standard permissions/attributes to reduce YouTube Error 153 */
const IFRAME_ALLOW = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
const IFRAME_REFERRER = "strict-origin-when-cross-origin";

/* ---------- YouTube player (main game) ---------- */
let player = null;
let playerReady = false;

// Only send a real http(s) origin. On file:// the origin is "null"/"file://",
// which BREAKS the IFrame API — that's why you must run via start-game.bat.
const SAFE_ORIGIN = (location.origin && location.origin.indexOf("http") === 0)
  ? location.origin : undefined;

function createPlayer() {
  if (player) return; // already created
  console.log("Creating YouTube player… origin =", SAFE_ORIGIN || "(none — running from file://?)");
  try {
    player = new YT.Player("youtube-player", {
      height: "390",
      width: "640",
      videoId: "",
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        cc_load_policy: 0,
        disablekb: 1,
        playsinline: 1,
        fs: 0,
        origin: SAFE_ORIGIN
      },
      events: {
        onReady: onPlayerReady,
        onError: onPlayerError
      }
    });
  } catch (e) {
    console.warn("Could not create YouTube player:", e);
  }
}

// The API calls this global when it finishes loading.
window.onYouTubeIframeAPIReady = function () {
  console.log("YouTube IFrame API ready");
  createPlayer();
};

// Fallback: if the API was already ready before this script ran, create now.
if (window.YT && window.YT.Player) createPlayer();

// Once the player iframe exists, add the referrer/permission attributes.
function onPlayerReady() {
  playerReady = true;
  console.log("Player ready ✅ — Play Clip will now work in-page");
  try {
    const f = player.getIframe();
    if (f) {
      f.setAttribute("referrerpolicy", IFRAME_REFERRER);
      f.setAttribute("allow", IFRAME_ALLOW);
      f.setAttribute("allowfullscreen", "");
    }
  } catch (e) { /* ignore */ }
}

// If a video refuses to embed (101/150) or errors, show the small backup link
// and tell the presenter to swap the link for that song.
function onPlayerError(e) {
  const code = e && e.data;
  console.warn("YouTube player error:", code);
  const blocked = (code === 101 || code === 150);
  showOverlay("song-overlay",
    (blocked
      ? "⚠️ This video can't be embedded."
      : "⚠️ This video couldn't load.") +
    `<br><small>Use the small “Open on YouTube (backup)” link below, or replace this song's link in <code>script.js</code> with another embeddable YouTube version.</small>`);
  const fb = document.getElementById("yt-fallback");
  if (fb) fb.classList.remove("hidden");
}

/* ---------- Safe helpers ---------- */
function onClick(id, handler) {
  const el = document.getElementById(id);
  if (!el) { console.warn(`Missing button or element: ${id}`); return; }
  el.addEventListener("click", handler);
}
function $(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`Missing element: ${id}`);
  return el;
}

function getVideoId(url) {
  if (!url || !url.trim()) return null;
  url = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  try {
    const u = new URL(url);
    let id = null;
    if (u.pathname.includes("/embed/")) id = u.pathname.split("/embed/")[1].split(/[/?]/)[0];
    else if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1).split(/[/?]/)[0];
    else id = u.searchParams.get("v");
    return (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) ? id : null;
  } catch (e) { return null; }
}

function clipTiming(song) {
  const start = Number(song.startTime) > 0 ? Number(song.startTime) : 0;
  const dur = Number(song.clipDuration) > 0 ? Number(song.clipDuration) : DEFAULT_DURATION;
  return { start, dur };
}

// Format seconds as m:ss  (e.g. 62 -> "1:02")
function fmtTime(s) {
  s = Number(s) || 0;
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, "0");
  return `${m}:${sec}`;
}

// A "watch" link that jumps to the start time (for Open on YouTube buttons).
function watchLink(song) {
  const id = getVideoId(song.youtubeEmbedUrl);
  if (!id) return null;
  const { start } = clipTiming(song);
  return `https://www.youtube.com/watch?v=${id}${start ? "&t=" + start + "s" : ""}`;
}

/* ---------- Screens ---------- */
function goTo(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const screen = document.getElementById(id);
  if (screen) screen.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Setup ---------- */
function buildOrder() {
  order = songs.map((_, i) => i);
  if (shuffleOn) {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  }
}

function startGame() {
  console.log("Start Game clicked");
  stopTestPlayer();
  current = 0;
  buildOrder();
  $("round-total").textContent = songs.length;
  goTo("screen-game");
  loadRound();
}

/* ---------- Difficulty colours ---------- */
function applyDifficulty(level, el) {
  const badge = el || $("difficulty-badge");
  badge.textContent = level || "—";
  badge.className = badge === $("difficulty-badge") ? "badge" : "badge small-badge";
  const map = { "Easy": "diff-easy", "Medium": "diff-medium", "Hard": "diff-hard", "Hardest": "diff-hardest" };
  if (map[level]) badge.classList.add(map[level]);
}

/* ---------- Round ---------- */
function loadRound() {
  clearTimers();
  const song = songs[order[current]];
  const { dur } = clipTiming(song);
  console.log(`Round ${current + 1}: ${song.title}`);

  $("round-current").textContent = current + 1;
  $("category").textContent = song.category;
  applyDifficulty(song.difficulty);

  // reset video + overlay back to the idle "press play" cover
  if (player && player.stopVideo) { try { player.stopVideo(); } catch (e) {} }
  showIdleOverlay();

  // fallback "Open on YouTube" link for this song (small backup only)
  const link = watchLink(song);
  const fb = $("yt-fallback");
  if (link) { fb.href = link; fb.classList.remove("hidden"); }
  else { fb.classList.add("hidden"); }

  // reset hint
  $("hint-box").classList.add("hidden");
  $("hint-text").textContent = song.hint;

  // reset title (hidden)
  $("hidden-title").classList.remove("hidden");
  const rev = $("revealed");
  rev.classList.add("hidden");
  rev.classList.remove("reveal-anim");
  $("answer-title").textContent = song.title;
  $("answer-artist").textContent = song.artist;
  const svBtn = $("btn-showvideo");
  if (svBtn) svBtn.textContent = "📺 Show Video After Reveal";

  // reset sing challenge
  $("sing-box").classList.add("hidden");
  $("sing-text").textContent = song.singChallenge || "";

  // reset timer
  timeLeft = dur;
  $("timer").textContent = timeLeft;

  $("btn-play").textContent = "▶ Play Clip";
}

/* ---------- Play / Replay ---------- */
function playClip() {
  console.log("Play Clip clicked");
  const song = songs[order[current]];
  const { start, dur } = clipTiming(song);
  const videoId = getVideoId(song.youtubeEmbedUrl);

  if (!videoId || !playerReady) {
    showOverlay("song-overlay",
      !videoId
        ? `🎵 Add YouTube link here for "${song.title}" in <code>script.js</code>.<br><small>(Timer still runs — go ahead and guess!)</small>`
        : "Loading player… tap Play Clip again in a second.");
    startCountdown(dur);
    $("btn-play").textContent = "🔁 Replay Clip";
    return;
  }

  // The clip plays BEHIND the Listen Mode overlay: audio is heard,
  // but the video/title/thumbnail stays hidden. We never display:none
  // the iframe, so playback is not interrupted.
  showListenOverlay();
  player.loadVideoById({ videoId: videoId, startSeconds: start, endSeconds: start + dur });
  player.playVideo();

  startCountdown(dur);
  clipStopId = setTimeout(() => {
    if (player && player.pauseVideo) { try { player.pauseVideo(); } catch (e) {} }
  }, dur * 1000 + 400);

  $("btn-play").textContent = "🔁 Replay Clip";
}

/* ---------- Overlay states ---------- */
// Idle cover shown before the clip is played and between songs.
function showIdleOverlay() {
  const o = $("song-overlay");
  o.className = "video-placeholder";        // reset styling
  o.innerHTML = "Press ▶ Play Clip to start";
  o.classList.remove("hidden");
}

// Colorful "Listen Mode" cover shown WHILE the clip plays (hides the video).
function showListenOverlay() {
  const o = $("song-overlay");
  o.className = "video-placeholder listen-mode";
  o.innerHTML =
    `<div class="lm-badge">🎧 LISTEN MODE</div>
     <div class="lm-main">Guess the song title!</div>
     <div class="lm-sub">No peeking 👀</div>`;
  o.classList.remove("hidden");
}

// Reveal the actual video (only after the title has been revealed).
function showVideoAfterReveal() {
  console.log("Show Video After Reveal clicked");
  hideOverlay("song-overlay");
  const btn = $("btn-showvideo");
  if (btn) btn.textContent = "📺 Video Showing";
}

function replayClip() {
  console.log("Replay Clip clicked");
  playClip();
}

/* ---------- Timer ---------- */
function startCountdown(seconds) {
  clearTimers();
  timeLeft = seconds;
  const t = $("timer");
  t.textContent = timeLeft;
  t.classList.remove("time-up");

  countdownId = setInterval(() => {
    timeLeft--;
    t.textContent = Math.max(timeLeft, 0);
    if (timeLeft <= 0) {
      clearInterval(countdownId);
      countdownId = null;
      t.textContent = "⏰ Time!";
      t.classList.add("time-up");
      // Pause the clip, keep the cover up, and switch to the TIME'S UP message.
      if (player && player.pauseVideo) { try { player.pauseVideo(); } catch (e) {} }
      showTimeUpOverlay();
    }
  }, 1000);
}

// Cover shown when the timer runs out (still hides the video).
function showTimeUpOverlay() {
  const o = $("song-overlay");
  o.className = "video-placeholder listen-mode";
  o.innerHTML =
    `<div class="lm-badge">⏰ TIME'S UP!</div>
     <div class="lm-main">Now guess the song title!</div>`;
  o.classList.remove("hidden");
}

function clearTimers() {
  if (countdownId) { clearInterval(countdownId); countdownId = null; }
  if (clipStopId) { clearTimeout(clipStopId); clipStopId = null; }
  const t = document.getElementById("timer");
  if (t) t.classList.remove("time-up");
}

/* ---------- Overlay ---------- */
function showOverlay(id, html) {
  const o = $(id);
  if (!o) return;
  o.innerHTML = html;
  o.classList.remove("hidden");
}
function hideOverlay(id) {
  const o = $(id);
  if (o) o.classList.add("hidden");
}

/* ---------- Hint / Reveal / Sing ---------- */
function showHint() {
  console.log("Show Hint clicked");
  $("hint-box").classList.remove("hidden");
}

function revealTitle() {
  console.log("Reveal Title clicked");
  clearTimers();
  if (player && player.pauseVideo) { try { player.pauseVideo(); } catch (e) {} }
  $("hidden-title").classList.add("hidden");
  const rev = $("revealed");
  rev.classList.remove("hidden");
  rev.classList.remove("reveal-anim");
  void rev.offsetWidth;
  rev.classList.add("reveal-anim");
}

function showSing() {
  console.log("Show Sing Challenge clicked");
  $("sing-box").classList.remove("hidden");
}

/* ---------- Navigation ---------- */
function nextSong() {
  console.log("Next Song clicked");
  current = (current + 1) % order.length; // loops back to song 1 after the last
  loadRound();
}

/* ---------- Shuffle / Reset ---------- */
function toggleShuffle() {
  shuffleOn = !shuffleOn;
  console.log("Shuffle:", shuffleOn ? "On" : "Off");
  $("btn-shuffle").textContent = "🔀 Shuffle Songs: " + (shuffleOn ? "On" : "Off");
  buildOrder();
  current = 0;
  loadRound();
}

function resetGame() {
  console.log("Reset Game clicked");
  clearTimers();
  if (player && player.stopVideo) { try { player.stopVideo(); } catch (e) {} }
  current = 0;
  goTo("screen-intro");
}

/* ============================================================
   TEST ALL CLIPS SCREEN  (for the presenter, before the show)
   ============================================================ */

// Build a plain iframe with the Error-153-friendly attributes.
function testIframe(videoId, start) {
  const p = new URLSearchParams({
    start: String(start), autoplay: "1", rel: "0", modestbranding: "1"
  });
  return `<iframe src="https://www.youtube.com/embed/${videoId}?${p}"
            referrerpolicy="${IFRAME_REFERRER}"
            allow="${IFRAME_ALLOW}"
            allowfullscreen></iframe>`;
}

function buildTestList() {
  const list = $("test-list");
  if (!list) return;
  list.innerHTML = "";

  songs.forEach((song, i) => {
    const { start, dur } = clipTiming(song);
    const link = watchLink(song);
    const hasLink = !!link;

    const row = document.createElement("div");
    row.className = "test-row";
    row.innerHTML = `
      <div class="test-info">
        <span class="test-num">${i + 1}</span>
        <div class="test-textwrap">
          <div class="test-title">${song.title}</div>
          <div class="test-sub">${song.artist}</div>
          <div class="test-tags">
            <span class="badge small-badge ${diffClass(song.difficulty)}">${song.difficulty}</span>
            <span class="test-timing">▶ Start ${fmtTime(start)} · ${dur}s</span>
          </div>
        </div>
      </div>
      <div class="test-actions">
        <button class="btn btn-green test-clip-btn" data-i="${i}">▶ Test Clip</button>
        <a class="btn btn-blue yt-open ${hasLink ? "" : "disabled"}"
           href="${hasLink ? link : "#"}" target="_blank" rel="noopener">▶ Open on YouTube</a>
      </div>`;
    list.appendChild(row);
  });

  // Wire the Test Clip buttons
  list.querySelectorAll(".test-clip-btn").forEach(btn => {
    btn.addEventListener("click", () => testClip(parseInt(btn.dataset.i, 10)));
  });
}

function diffClass(level) {
  return { "Easy": "diff-easy", "Medium": "diff-medium", "Hard": "diff-hard", "Hardest": "diff-hardest" }[level] || "";
}

function openTestScreen() {
  console.log("Test All Clips clicked");
  stopTestPlayer();
  buildTestList();
  goTo("screen-test");
}

function testClip(i) {
  console.log("Test Clip:", i + 1);
  currentTest = i;
  const song = songs[i];
  const { start } = clipTiming(song);
  const videoId = getVideoId(song.youtubeEmbedUrl);
  const frame = $("test-player-frame");

  // highlight the active row
  document.querySelectorAll(".test-row").forEach((r, idx) =>
    r.classList.toggle("active-row", idx === i));

  if (!videoId) {
    frame.innerHTML = "";
    showOverlay("test-overlay", `🎵 No YouTube link for "${song.title}". Add one in <code>script.js</code>.`);
    return;
  }
  hideOverlay("test-overlay");
  frame.innerHTML = testIframe(videoId, start);
  // scroll the player into view so you can see it play
  document.querySelector("#screen-test .video-frame").scrollIntoView({ behavior: "smooth", block: "center" });
}

function nextTest() {
  currentTest = (currentTest + 1) % songs.length;
  testClip(currentTest);
}

function stopTestPlayer() {
  const frame = document.getElementById("test-player-frame");
  if (frame) frame.innerHTML = ""; // removing the iframe stops playback
  const ov = document.getElementById("test-overlay");
  if (ov) { ov.innerHTML = "Click ▶ Test Clip on any song below"; ov.classList.remove("hidden"); }
}

function backToGame() {
  console.log("Back to Game clicked");
  stopTestPlayer();
  goTo("screen-intro");
}

/* ============================================================
   WIRE UP BUTTONS — after the HTML has loaded.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded — wiring up buttons");

  // Start screen
  onClick("btn-start", startGame);
  onClick("btn-test", openTestScreen);

  // Game screen
  onClick("btn-play", playClip);
  onClick("btn-replay", replayClip);
  onClick("btn-hint", showHint);
  onClick("btn-reveal", revealTitle);
  onClick("btn-sing", showSing);
  onClick("btn-showvideo", showVideoAfterReveal);
  onClick("btn-next", nextSong);
  onClick("btn-shuffle", toggleShuffle);
  onClick("btn-reset", resetGame);

  // Test screen
  onClick("btn-next-test", nextTest);
  onClick("btn-back-game", backToGame);

  console.log("All buttons wired up ✅");
});
