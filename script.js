// ===== AKTIVITETSVÄLJAREN – app.js =====

// --- Aktivitetsdatabas ---
// icon: Font Awesome-klass, t.ex. "fa-solid fa-book"
const activities = {
  // ENSAM
  solo_quick_low:    { icon: "fa-solid fa-book", title: "Läs en bok", desc: "Slå dig ner med en riktigt bra bok. Ibland är det enda man behöver." },
  solo_quick_medium: { icon: "fa-solid fa-headphones", title: "Lyssna på en podd", desc: "Hitta ett avsnitt av din favoritpodd och koppla av." },
  solo_quick_high:   { icon: "fa-solid fa-person-running", title: "Intervallspring", desc: "Kort, intensiv löprunda. Sätt igång pulsen på 20–30 minuter!" },
  solo_medium_low:   { icon: "fa-solid fa-palette", title: "Rita eller måla", desc: "Ta fram papper och pennor och låt kreativiteten flöda utan krav." },
  solo_medium_medium:{ icon: "fa-solid fa-gamepad", title: "Videospel", desc: "Dyk ner i ett spel du älskar eller testa något nytt." },
  solo_medium_high:  { icon: "fa-solid fa-spa", title: "Yoga & stretching", desc: "En 45-minuterspass med yoga gör kropp och sinne gott." },
  solo_long_low:     { icon: "fa-solid fa-film", title: "Filmmaraton", desc: "Välj en trilogi eller en tv-serie och kryp ihop i soffan." },
  solo_long_medium:  { icon: "fa-solid fa-puzzle-piece", title: "Pussel", desc: "Plocka fram ett stort pussel och försvinn in i det under hela eftermiddagen." },
  solo_long_high:    { icon: "fa-solid fa-bicycle", title: "Längre cykeltur", desc: "Packa vatten och snacks och utforska din omgivning på cykel." },

  // DUO (2 pers)
  duo_quick_low:     { icon: "fa-solid fa-chess", title: "Schack eller dam", desc: "Klassiska parspel med djup – perfekt för en snabb match." },
  duo_quick_medium:  { icon: "fa-solid fa-cards-blank fa-regular", title: "Kortspel", desc: "Välj ett snabbt kortspel som Uno, War eller Speed." },
  duo_quick_high:    { icon: "fa-solid fa-table-tennis-paddle-ball", title: "Pingis", desc: "En snabb pingismatch – enkelt att sätta igång!" },
  duo_medium_low:    { icon: "fa-solid fa-utensils", title: "Laga mat ihop", desc: "Välj ett recept, handla ingredienser och laga ett gott mål mat tillsammans." },
  duo_medium_medium: { icon: "fa-solid fa-dice", title: "Sällskapsspel för 2", desc: "Prova Catan, Ticket to Ride eller Hive – toppenspel för 2 spelare." },
  duo_medium_high:   { icon: "fa-solid fa-mountain", title: "Klättring inomhus", desc: "Bouldercentrum – roligt, socialt och fysiskt utmanande för alla nivåer." },
  duo_long_low:      { icon: "fa-solid fa-landmark", title: "Museibesök", desc: "Utforska ett museum eller galleri i närheten i lugn takt." },
  duo_long_medium:   { icon: "fa-solid fa-bowling-ball", title: "Bowling + pizza", desc: "Boka en bowlingbana och avsluta med pizza – klassisk kombo!" },
  duo_long_high:     { icon: "fa-solid fa-person-hiking", title: "Vandring", desc: "Hitta en naturled och vandra i några timmar – ta med fika!" },

  // LITEN GRUPP (3–5)
  small_quick_low:   { icon: "fa-solid fa-brain", title: "Quizduel", desc: "Dela upp er i lag och kör ett snabbt frågesport-spel." },
  small_quick_medium:{ icon: "fa-solid fa-masks-theater", title: "Charader", desc: "Klassisk mim – garanterat skratt på kortast möjliga tid!" },
  small_quick_high:  { icon: "fa-solid fa-futbol", title: "Spontanfotboll", desc: "Hitta en gräsyta och sparka boll – inga regler behövs!" },
  small_medium_low:  { icon: "fa-solid fa-fire-burner", title: "Grillkväll", desc: "Tänd grillen, dela upp uppgifter och njut av god mat tillsammans." },
  small_medium_medium:{ icon: "fa-solid fa-dice-d20", title: "Sällskapsspel", desc: "Codenames, Mysterium eller Dixit – välj ett spel för hela gruppen." },
  small_medium_high: { icon: "fa-solid fa-volleyball", title: "Badminton/volleyboll", desc: "Dra igång en match på plan – enkelt att ordna och superroligt!" },
  small_long_low:    { icon: "fa-solid fa-clapperboard", title: "Filmkväll med tema", desc: "Rösta fram ett tema, välj filmer och gör det till en riktig bioupplevelse hemma." },
  small_long_medium: { icon: "fa-solid fa-lock", title: "Escape room", desc: "Boka ett escape room – utmanar hjärnan och teamwork på en gång." },
  small_long_high:   { icon: "fa-solid fa-tree", title: "Äventyrspark", desc: "Hitta en äventyrspark med klättring, linbanor eller paintball." },

  // STOR GRUPP (6+)
  big_quick_low:     { icon: "fa-solid fa-note-sticky", title: "Vem är jag?", desc: "Klistra lappar i pannan och gissa varandras namn – busenkelt och kul!" },
  big_quick_medium:  { icon: "fa-solid fa-microphone", title: "Karaoke!", desc: "Dra igång karaoke – alla deltar, ingen döms." },
  big_quick_high:    { icon: "fa-solid fa-flag-checkered", title: "Stafettlekar", desc: "Dela upp er i lag och kör klassiska stafettlekar utomhus." },
  big_medium_low:    { icon: "fa-solid fa-bowl-food", title: "Potluck-middag", desc: "Alla tar med en rätt – enkelt, socialt och massor av variation på bordet." },
  big_medium_medium: { icon: "fa-solid fa-star", title: "Partyspel", desc: "Just One, Pictionary eller Jackbox – perfekta spel för stora grupper." },
  big_medium_high:   { icon: "fa-solid fa-basketball", title: "Lag-sport", desc: "Organisera en basketmatch, innebandy eller beachvolley-turnering." },
  big_long_low:      { icon: "fa-solid fa-trophy", title: "Spelkväll med turneringsformat", desc: "Kör ett turneringschema med flera spel – kröna en vinnare till slut!" },
  big_long_medium:   { icon: "fa-solid fa-list-ol", title: "Bowlingturnering", desc: "Boka flera banor och kör en ordentlig gruppturnering med poängtavla." },
  big_long_high:     { icon: "fa-solid fa-gun", title: "Laser tag eller paintball", desc: "Ta med hela gänget på laser tag – adrenalin och skratt garanteras." },
};

// --- Tillståndsvariabler ---
const selections = {
  persons: null,
  time: null,
  energy: null,
};

// --- DOM-referenser ---
const findBtn   = document.getElementById("findBtn");
const resultSection = document.getElementById("resultSection");
const resultCard    = document.getElementById("resultCard");
const resultIcon    = document.getElementById("resultIcon");
const resultTitle   = document.getElementById("resultTitle");
const resultDesc    = document.getElementById("resultDesc");
const resetBtn      = document.getElementById("resetBtn");

// --- Välj alternativ ---
document.querySelectorAll(".opt-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const group = btn.dataset.group;
    const value = btn.dataset.value;

    document.querySelectorAll(`.opt-btn[data-group="${group}"]`).forEach((b) => {
      b.classList.remove("selected");
    });

    btn.classList.add("selected");
    selections[group] = value;

    if (selections.persons && selections.time && selections.energy) {
      findBtn.disabled = false;
    }
  });
});

// --- Hitta aktivitet ---
findBtn.addEventListener("click", () => {
  const key = `${selections.persons}_${selections.time}_${selections.energy}`;
  const activity = activities[key];

  if (!activity) {
    resultIcon.innerHTML = '<i class="fa-solid fa-party-horn"></i>';
    resultTitle.textContent = "HITTA PÅ NÅGOT KUL!";
    resultDesc.textContent = "Oavsett vad ni väljer – njut av stunden tillsammans!";
  } else {
    resultIcon.innerHTML = `<i class="${activity.icon}"></i>`;
    resultTitle.textContent = activity.title.toUpperCase();
    resultDesc.textContent = activity.desc;
  }

  // Ändra visuell detalj dynamiskt baserat på energinivå
  resultCard.classList.remove("energy-low", "energy-medium", "energy-high");
  resultCard.classList.add(`energy-${selections.energy}`);

  resultSection.classList.add("visible");
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

// --- Återställ ---
resetBtn.addEventListener("click", () => {
  selections.persons = null;
  selections.time    = null;
  selections.energy  = null;

  document.querySelectorAll(".opt-btn").forEach((b) => b.classList.remove("selected"));
  findBtn.disabled = true;

  resultSection.classList.remove("visible");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
