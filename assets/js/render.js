function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderProfileHeader(cfg) {
  document.getElementById("profile-pic").src = cfg.profilePicture;
  document.getElementById("profile-pic").alt = cfg.displayName;
  document.getElementById("display-name").textContent = cfg.displayName;
  document.getElementById("tagline").textContent = cfg.tagline;
  document.getElementById("banner-text").textContent = cfg.bannerText;

  const statusDot = document.getElementById("status-dot");
  const statusLabel = document.getElementById("status-label");
  if (cfg.status === "online") {
    statusDot.classList.add("online");
    statusLabel.textContent = "online now";
  } else {
    statusDot.classList.add("offline");
    statusLabel.textContent = "offline";
  }
}

function renderContact(cfg) {
  const box = document.getElementById("contact-icons");
  const links = [];
  if (cfg.contact.email) links.push(`<a href="mailto:${escapeHtml(cfg.contact.email)}">email</a>`);
  if (cfg.contact.instagram) links.push(`<a href="${escapeHtml(cfg.contact.instagram)}">instagram</a>`);
  if (cfg.contact.github) links.push(`<a href="${escapeHtml(cfg.contact.github)}">github</a>`);
  if (cfg.contact.discord) links.push(`<a href="${escapeHtml(cfg.contact.discord)}">discord</a>`);
  box.innerHTML = links.join(" ");
}

function renderGeneralInfo(cfg) {
  const table = document.getElementById("general-info-table");
  table.innerHTML = "";
  for (const [label, value] of Object.entries(cfg.generalInfo)) {
    const row = document.createElement("tr");
    row.innerHTML = `<td class="label">${escapeHtml(label)}:</td><td>${escapeHtml(value)}</td>`;
    table.appendChild(row);
  }
}

function renderAboutMe(cfg) {
  const container = document.getElementById("about-me-body");
  container.innerHTML = cfg.aboutMe.map(p => `<p>${escapeHtml(p)}</p>`).join("");
}

function renderWhoIdLikeToMeet(cfg) {
  const container = document.getElementById("wilm-body");
  container.innerHTML = cfg.whoIdLikeToMeet.map(p => `<p>${escapeHtml(p)}</p>`).join("");
}

function renderInterests(cfg) {
  const table = document.getElementById("interests-table");
  table.innerHTML = "";
  for (const [label, value] of Object.entries(cfg.interests)) {
    const row = document.createElement("tr");
    row.innerHTML = `<td class="label">${escapeHtml(label)}:</td><td class="value">${escapeHtml(value)}</td>`;
    table.appendChild(row);
  }
}

function renderMusic(cfg) {
  document.getElementById("now-playing-text").textContent = cfg.music.nowPlaying;

  const list = document.getElementById("playlist");
  list.innerHTML = "";
  cfg.music.tracks.forEach((track, i) => {
    const li = document.createElement("li");
    const num = String(i + 1).padStart(2, "0");
    li.innerHTML = `<span class="track-num">${num}.</span>${escapeHtml(track.title)} — ${escapeHtml(track.artist)}`;
    list.appendChild(li);
  });

  const audio = document.getElementById("audio-player");
  const firstTrackWithSrc = cfg.music.tracks.find(t => t.src);
  if (firstTrackWithSrc) {
    audio.src = firstTrackWithSrc.src;
  } else {
    audio.remove();
    const note = document.createElement("div");
    note.style.fontSize = "10px";
    note.style.marginTop = "4px";
    note.style.fontStyle = "italic";
    note.textContent = "(add an audio file path to config.js to enable playback)";
    document.getElementById("music-player").appendChild(note);
  }
}

function renderFriends(cfg) {
  const grid = document.getElementById("friends-grid");
  grid.innerHTML = "";
  cfg.topFriends.slice(0, 8).forEach(friend => {
    const card = document.createElement("div");
    card.className = "friend-card";
    card.innerHTML = `
      <a href="${escapeHtml(friend.url)}">
        <img src="${escapeHtml(friend.pic)}" alt="${escapeHtml(friend.name)}">
        <div class="friend-name">${escapeHtml(friend.name)}</div>
      </a>
    `;
    grid.appendChild(card);
  });
}

function renderComments(cfg) {
  const container = document.getElementById("comments-list");
  container.innerHTML = "";
  cfg.comments.forEach(comment => {
    const el = document.createElement("div");
    el.className = "comment";
    el.innerHTML = `
      <div class="comment-header">
        <img src="${escapeHtml(comment.pic)}" alt="${escapeHtml(comment.author)}">
        <div class="comment-meta">
          <div class="comment-author">${escapeHtml(comment.author)}</div>
          <div class="comment-date">${escapeHtml(comment.date)}</div>
        </div>
      </div>
      <div class="comment-body">${escapeHtml(comment.body)}</div>
    `;
    container.appendChild(el);
  });
  document.getElementById("comment-count").textContent = cfg.comments.length;
}

function renderVisitorCounter(cfg) {
  const stored = Number(localStorage.getItem("visitorCounterBump") || 0);
  const total = cfg.visitorCount + stored;
  document.getElementById("visitor-counter").textContent = String(total).padStart(6, "0");
}

function bumpVisitorCounterOncePerSession() {
  if (sessionStorage.getItem("counted")) return;
  sessionStorage.setItem("counted", "1");
  const stored = Number(localStorage.getItem("visitorCounterBump") || 0);
  localStorage.setItem("visitorCounterBump", String(stored + 1));
}

function initCommentForm(cfg) {
  const form = document.getElementById("comment-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const nameInput = document.getElementById("comment-name-input");
    const bodyInput = document.getElementById("comment-body-input");
    const name = nameInput.value.trim();
    const body = bodyInput.value.trim();
    if (!name || !body) return;

    cfg.comments.unshift({
      author: name,
      pic: "assets/img/friend-placeholder.svg",
      date: "just now",
      body: body
    });
    renderComments(cfg);
    nameInput.value = "";
    bodyInput.value = "";
  });
}

function renderAll(cfg) {
  renderProfileHeader(cfg);
  renderContact(cfg);
  renderGeneralInfo(cfg);
  renderAboutMe(cfg);
  renderWhoIdLikeToMeet(cfg);
  renderInterests(cfg);
  renderMusic(cfg);
  renderFriends(cfg);
  renderComments(cfg);
  bumpVisitorCounterOncePerSession();
  renderVisitorCounter(cfg);
  initCommentForm(cfg);
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll(PROFILE_CONFIG);
});
