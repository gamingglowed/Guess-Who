(() => {
  const people = Array.isArray(window.PEOPLE) ? window.PEOPLE.filter(person => person && person.name) : [];
  const form = document.querySelector("#name-form");
  const input = document.querySelector("#name-input");
  const clear = document.querySelector(".clear-button");
  const suggestion = document.querySelector("#suggestion");
  const entrance = document.querySelector("#entrance");
  const thankYou = document.querySelector("#thank-you");
  const universe = document.querySelector(".universe");
  const heading = document.querySelector("#thanks-heading");
  const subtitle = document.querySelector("#thanks-subtitle");
  const message = document.querySelector("#thank-you-message");
  const personalNote = document.querySelector("#personal-note-text");
  const portrait = document.querySelector("#portrait");
  const photo = document.querySelector("#person-image");
  const portraitTop = document.querySelector("#portrait-top");
  const photoTop = document.querySelector("#person-image-top");
  const back = document.querySelector("#back-button");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let selected = null;
  let confirmCandidate = null;
  let transitionTimer;
  let revealTimer;

  const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase();

  function distance(a, b) {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let diagonal = row[0]; row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const above = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
        diagonal = above;
      }
    }
    return row[b.length];
  }

  function closestName(value) {
    const query = normalize(value);
    if (!query || !people.length) return null;
    const ranked = people.map(person => ({ person, score: distance(query, normalize(person.name)) })).sort((a, b) => a.score - b.score);
    const [best, next] = ranked;
    const threshold = Math.max(1, Math.floor(query.length * .34));
    return best.score <= threshold && (!next || best.score < next.score) ? best.person : null;
  }

  function setSuggestion(person) {
    suggestion.replaceChildren();
    if (!person) { confirmCandidate = null; return; }
    confirmCandidate = person;
    suggestion.append("Did you mean ");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${person.name}? Tap to confirm`;
    button.addEventListener("click", () => showNote(person));
    suggestion.append(button);
  }

  function showNote(person) {
    selected = person;
    confirmCandidate = null;
    universe.classList.toggle("mom-galaxy", person.name === "Gayathri");
    thankYou.classList.toggle("for-gayathri", person.name === "Gayathri");
    universe.classList.toggle("punitha-galaxy", person.name === "Punitha");
    universe.classList.toggle("dakhshaya-galaxy", person.name === "Dakhshaya");
    thankYou.classList.toggle("for-dakhshaya", person.name === "Dakhshaya");
    const title = person.title || `Thanks, ${person.name}.`;
    heading.replaceChildren();
    if (person.titleEmphasis && title.includes(person.titleEmphasis)) {
      const start = title.indexOf(person.titleEmphasis);
      const emphasis = document.createElement("strong");
      emphasis.textContent = person.titleEmphasis;
      heading.append(title.slice(0, start), emphasis, title.slice(start + person.titleEmphasis.length));
    } else {
      heading.textContent = title;
    }
    subtitle.textContent = person.subtitle || "";
    subtitle.hidden = !person.subtitle;
    thankYou.classList.toggle("has-custom-title", Boolean(person.title));
    thankYou.classList.toggle("for-punitha", person.name === "Punitha");
    back.lastChild.textContent = person.name === "Gayathri"
      ? " I PROMISE YOU, MY HANDSOME MOST FAVOURITE CHILD!"
      : " Back to the stars";
    const asideMarker = "[[small-aside]]";
    if (person.smallAside && person.message && person.message.includes(asideMarker)) {
      const [beforeAside, afterAside] = person.message.split(asideMarker);
      const aside = document.createElement("span");
      aside.className = "inline-aside";
      aside.textContent = person.smallAside;
      message.replaceChildren(document.createTextNode(beforeAside), aside, document.createTextNode(afterAside));
    } else {
      message.textContent = person.message || "[Add a short thank-you message for this person in people.js.]";
    }
    personalNote.textContent = person.note || "[Optional extra note — e.g. ‘Thank you, my beloved strawberry.’]";
    portrait.classList.remove("image-loaded");
    photo.removeAttribute("src");
    photoTop.removeAttribute("src");
    portraitTop.classList.remove("image-loaded");
    portrait.hidden = false;
    portraitTop.hidden = person.name !== "Dakhshaya" && !(person.imageTop && person.imageTop.trim());
    if (person.imageTop && person.imageTop.trim()) {
      photoTop.alt = `An additional photo for ${person.name}`;
      photoTop.src = person.imageTop;
    } else {
      photoTop.alt = "";
    }
    if (person.image && person.image.trim()) {
      photo.alt = `A photo for ${person.name}`;
      photo.src = person.image;
    } else {
      photo.alt = "";
    }
    suggestion.replaceChildren();
    clearTimeout(transitionTimer); clearTimeout(revealTimer);
    entrance.classList.add("is-leaving");
    entrance.setAttribute("aria-hidden", "true");
    thankYou.hidden = false;
    thankYou.setAttribute("aria-hidden", "false");
    thankYou.classList.remove("is-revealing");
    universe.classList.remove("settled");
    universe.classList.add("traveling");
    const travelTime = motion.matches ? 0 : 1050;
    transitionTimer = setTimeout(() => {
      entrance.hidden = true;
      entrance.classList.remove("is-leaving");
      universe.classList.remove("traveling"); universe.classList.add("settled");
      thankYou.classList.add("is-revealing");
      revealTimer = setTimeout(() => document.visibilityState === "visible" && back.focus({ preventScroll: true }), motion.matches ? 0 : 2050);
    }, travelTime);
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) { input.focus(); return; }
    const exact = people.find(person => normalize(person.name) === normalize(value));
    if (exact) { showNote(exact); return; }
    const candidate = closestName(value);
    if (candidate) { setSuggestion(candidate); return; }
    setSuggestion(null);
    suggestion.textContent = people.length ? "I couldn’t find that name. Check the spelling and try again." : "Add people to people.js to prepare your notes.";
  });

  input.addEventListener("input", () => {
    clear.hidden = !input.value;
    suggestion.replaceChildren(); confirmCandidate = null;
  });
  clear.addEventListener("click", () => { input.value = ""; clear.hidden = true; suggestion.replaceChildren(); input.focus(); });
  photo.addEventListener("load", () => portrait.classList.add("image-loaded"));
  photo.addEventListener("error", () => portrait.classList.remove("image-loaded"));
  photoTop.addEventListener("load", () => portraitTop.classList.add("image-loaded"));
  photoTop.addEventListener("error", () => portraitTop.classList.remove("image-loaded"));
  back.addEventListener("click", () => {
    clearTimeout(transitionTimer); clearTimeout(revealTimer);
    thankYou.hidden = true; thankYou.setAttribute("aria-hidden", "true"); thankYou.classList.remove("is-revealing");
    entrance.hidden = false; entrance.setAttribute("aria-hidden", "false");
    entrance.classList.remove("is-leaving");
    universe.classList.remove("traveling", "settled", "mom-galaxy", "punitha-galaxy", "dakhshaya-galaxy");
    input.value = ""; clear.hidden = true; suggestion.replaceChildren(); selected = null;
    input.focus({ preventScroll: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      universe.classList.add("page-hidden");
      universe.style.animationPlayState = "paused";
      universe.querySelectorAll(".nebula,.star-layer").forEach(layer => { layer.style.animationPlayState = "paused"; });
      clearTimeout(transitionTimer); clearTimeout(revealTimer);
    } else {
      universe.classList.remove("page-hidden");
      universe.style.animationPlayState = "";
      universe.querySelectorAll(".nebula,.star-layer").forEach(layer => { layer.style.animationPlayState = ""; });
      if (!thankYou.hidden && !thankYou.classList.contains("is-revealing")) {
        entrance.hidden = true; universe.classList.remove("traveling"); universe.classList.add("settled"); thankYou.classList.add("is-revealing");
      }
    }
  });
})();
