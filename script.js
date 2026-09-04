// ---------- Floating hearts background ----------
(function spawnHearts() {
  const container = document.getElementById('floatingHearts');
  const symbols = ['💗', '💖', '💕', '💓', '❤️'];
  const count = 18;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    const duration = 8 + Math.random() * 10;
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = (Math.random() * duration) + 's';
    container.appendChild(heart);
  }
})();

// ---------- Screen navigation ----------
const screens = {
  ask: document.getElementById('screen-ask'),
  when: document.getElementById('screen-when'),
  food: document.getElementById('screen-food'),
  flowers: document.getElementById('screen-flowers'),
  final: document.getElementById('screen-final'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

const state = {
  date: null,
  time: null,
  food: null,
  flowers: null,
};

// ---------- Screen 1: the ask, with an unclickable "No" ----------
const yesBtn1 = document.getElementById('yesBtn1');
const noBtn1 = document.getElementById('noBtn1');
const hint1 = document.getElementById('hint1');

const dodgeMessages = [
  "Nice try 😏",
  "Not so fast...",
  "Nope!",
  "You can't catch me",
  "Try again 😉",
  "So close!",
];

function dodge() {
  const btnRect = noBtn1.getBoundingClientRect();
  const margin = 12;
  const maxX = window.innerWidth - btnRect.width - margin;
  const maxY = window.innerHeight - btnRect.height - margin;

  if (!noBtn1.classList.contains('dodging')) {
    noBtn1.classList.add('dodging');
    noBtn1.style.width = btnRect.width + 'px';
  }

  const newX = margin + Math.random() * Math.max(0, maxX - margin);
  const newY = margin + Math.random() * Math.max(0, maxY - margin);

  noBtn1.style.left = newX + 'px';
  noBtn1.style.top = newY + 'px';

  hint1.textContent = dodgeMessages[Math.floor(Math.random() * dodgeMessages.length)];
}

// Move away before the pointer even lands a click
noBtn1.addEventListener('mouseenter', dodge);
noBtn1.addEventListener('pointerdown', (e) => { e.preventDefault(); dodge(); });
noBtn1.addEventListener('touchstart', (e) => { e.preventDefault(); dodge(); }, { passive: false });
// Safety net in case a click ever lands
noBtn1.addEventListener('click', (e) => { e.preventDefault(); dodge(); });

yesBtn1.addEventListener('click', () => {
  showScreen('when');
});

// ---------- Screen 2: date + time ----------
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const continueBtn2 = document.getElementById('continueBtn2');

const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

function checkWhen() {
  continueBtn2.disabled = !(dateInput.value && timeInput.value);
}
dateInput.addEventListener('input', checkWhen);
timeInput.addEventListener('input', checkWhen);

continueBtn2.addEventListener('click', () => {
  state.date = dateInput.value;
  state.time = timeInput.value;
  showScreen('food');
});

// ---------- Screen 3: food choice ----------
const foodOptions = document.querySelectorAll('.food-option');
const continueBtn3 = document.getElementById('continueBtn3');

foodOptions.forEach(btn => {
  btn.addEventListener('click', () => {
    foodOptions.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.food = btn.dataset.food;
    continueBtn3.disabled = false;
  });
});

continueBtn3.addEventListener('click', () => {
  showScreen('flowers');
});

// ---------- Screen 4: flowers ----------
document.getElementById('flowersYes').addEventListener('click', () => {
  state.flowers = true;
  finish();
});
document.getElementById('flowersNo').addEventListener('click', () => {
  state.flowers = false;
  finish();
});

// ---------- Screen 5: final ----------
function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatTime(t) {
  if (!t) return '';
  let [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${suffix}`;
}

function finish() {
  const timeStr = formatTime(state.time);
  document.getElementById('finalMessage').textContent = `Be ready by ${timeStr}, I'm coming to get you.`;

  const lines = [
    `📅 ${formatDate(state.date)} at ${timeStr}`,
    `🍽️ ${state.food}`,
    state.flowers ? '💐 Flowers: yes' : '💐 Flowers: not this time',
  ];
  document.getElementById('summary').textContent = lines.join('\n');

  showScreen('final');
}
