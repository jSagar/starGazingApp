const starCatalog = [
  { name: 'Mercury', type: 'planet', bestMonths: [2, 3, 4, 9, 10, 11], difficulty: 'moderate', altitudeHint: 'Very low after sunset or before sunrise', note: 'Look near the horizon during twilight with unobstructed views.' },
  { name: 'Venus', type: 'planet', bestMonths: [1, 2, 3, 4, 10, 11, 12], difficulty: 'easy', altitudeHint: 'Bright in the west or east twilight', note: 'Use a moon filter to reduce glare and look for phases.' },
  { name: 'Mars', type: 'planet', bestMonths: [11, 12, 1, 2, 3], difficulty: 'moderate', altitudeHint: 'Reddish object in the eastern to southern sky', note: 'Best detail appears near opposition with steady seeing.' },
  { name: 'Jupiter', type: 'planet', bestMonths: [8, 9, 10, 11, 12], difficulty: 'easy', altitudeHint: 'High in the southeast', note: 'Great cloud bands and Galilean moons.' },
  { name: 'Saturn', type: 'planet', bestMonths: [7, 8, 9, 10], difficulty: 'easy', altitudeHint: 'South after dusk', note: 'Try 120x+ to reveal rings and Cassini division.' },
  { name: 'Uranus', type: 'planet', bestMonths: [9, 10, 11, 12, 1], difficulty: 'challenging', altitudeHint: 'Aquarius/Aries region, use a chart', note: 'Appears as a tiny blue-green disk at higher magnification.' },
  { name: 'Neptune', type: 'planet', bestMonths: [8, 9, 10, 11, 12], difficulty: 'challenging', altitudeHint: 'Low in Pisces/Aquarius, very dim', note: 'Star-hopping and dark skies are essential.' },
  { name: 'Andromeda Galaxy (M31)', type: 'deep-sky', bestMonths: [9, 10, 11, 12], difficulty: 'moderate', altitudeHint: 'Northeast, overhead later', note: 'Use low magnification and dark skies.' },
  { name: 'Orion Nebula (M42)', type: 'deep-sky', bestMonths: [11, 12, 1, 2, 3], difficulty: 'easy', altitudeHint: 'South around midnight in winter', note: 'A UHC filter can improve contrast.' },
  { name: 'Pleiades (M45)', type: 'star', bestMonths: [10, 11, 12, 1, 2], difficulty: 'easy', altitudeHint: 'East to southwest arc', note: 'Best viewed with binoculars or a wide eyepiece.' },
  { name: 'Ring Nebula (M57)', type: 'deep-sky', bestMonths: [5, 6, 7, 8, 9], difficulty: 'challenging', altitudeHint: 'Near zenith in summer', note: 'Try medium magnification and steady seeing.' },
  { name: 'Albireo', type: 'star', bestMonths: [6, 7, 8, 9], difficulty: 'easy', altitudeHint: 'Cygnus high in summer', note: 'Beautiful gold and blue double star.' },
  { name: 'Triangulum Galaxy (M33)', type: 'deep-sky', bestMonths: [9, 10, 11, 12], difficulty: 'challenging', altitudeHint: 'High in autumn', note: 'Requires dark sky and low magnification.' }
];

const planList = document.getElementById('planList');
const objectList = document.getElementById('objectList');
const targetForm = document.getElementById('targetForm');
const journalForm = document.getElementById('journalForm');
const journalEntries = document.getElementById('journalEntries');
const observationDateInput = document.getElementById('observationDate');

function getSelectedDate() {
  const selected = observationDateInput.value;
  return selected ? new Date(`${selected}T20:00:00`) : new Date();
}

function renderConditions(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const moonCycle = (date.getTime() / 86400000 + 4.867) % 29.53;
  const illumination = Math.round((1 - Math.cos((2 * Math.PI * moonCycle) / 29.53)) * 50);

  let phase = 'New Moon';
  if (illumination > 10 && illumination < 40) phase = moonCycle < 14.7 ? 'Waxing Crescent' : 'Waning Crescent';
  if (illumination >= 40 && illumination < 60) phase = moonCycle < 14.7 ? 'First Quarter' : 'Last Quarter';
  if (illumination >= 60 && illumination < 95) phase = moonCycle < 14.7 ? 'Waxing Gibbous' : 'Waning Gibbous';
  if (illumination >= 95) phase = 'Full Moon';

  const darknessStart = month >= 4 && month <= 9 ? '22:00' : '19:30';
  const darknessEnd = month >= 4 && month <= 9 ? '04:30' : '05:45';
  const seeing = illumination > 85 ? 'Fair (bright moon)' : illumination > 50 ? 'Good' : 'Excellent';
  const bortleSuggestion = illumination > 85 ? 'Aim for Bortle 4 or better' : 'Bortle 5+ can still work for brighter targets';

  document.getElementById('moonPhase').textContent = `${phase} (${illumination}% illum.)`;
  document.getElementById('darknessWindow').textContent = `${darknessStart} - ${darknessEnd}`;
  document.getElementById('seeing').textContent = seeing;
  document.getElementById('bortle').textContent = bortleSuggestion;
  document.getElementById('conditionsSummary').textContent = `On ${date.toDateString()}, expect best contrast around local midnight. Prioritize faint galaxies when moon illumination is below 50%.`;

  return { month, day };
}


function renderSkyCanvas(month, day) {
  const canvas = document.getElementById('skyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, '#020814');
  gradient.addColorStop(0.6, '#09213f');
  gradient.addColorStop(1, '#143960');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  const seed = month * 100 + day * 7;
  const starCount = 220;
  for (let i = 0; i < starCount; i += 1) {
    const x = (Math.sin(seed + i * 12.9898) * 43758.5453 % 1 + 1) % 1 * w;
    const y = ((Math.cos(seed + i * 78.233) * 12345.678 % 1 + 1) % 1) * (h * 0.85);
    const size = i % 15 === 0 ? 2.2 : 1 + ((i * 7) % 10) / 15;
    ctx.beginPath();
    ctx.fillStyle = i % 20 === 0 ? '#ffe8b8' : '#dbe9ff';
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(0, h - 55, w, 55);
  ctx.fillStyle = '#c9dcff';
  ctx.font = '18px Segoe UI';
  ctx.fillText('Horizon', 16, h - 20);
}

function renderObjects(month) {
  const typeFilter = document.getElementById('objectTypeFilter').value;
  const difficultyFilter = document.getElementById('difficultyFilter').value;

  const visibleObjects = starCatalog.filter((obj) => {
    const seasonal = obj.bestMonths.includes(month);
    const typeMatch = typeFilter === 'all' || obj.type === typeFilter;
    const difficultyMatch = difficultyFilter === 'all' || obj.difficulty === difficultyFilter;
    return seasonal && typeMatch && difficultyMatch;
  });

  objectList.innerHTML = '';
  visibleObjects.forEach((obj) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${obj.name}</strong> · ${obj.difficulty} · ${obj.altitudeHint}<br><span class="muted">${obj.note}</span>`;
    objectList.appendChild(li);
  });

  if (!visibleObjects.length) {
    objectList.innerHTML = '<li>No matching targets for this date/filter. Try changing filters.</li>';
  }

  return visibleObjects;
}

function generatePlan() {
  const date = getSelectedDate();
  const { month, day } = renderConditions(date);
  renderSkyCanvas(month, day);
  const visibleObjects = renderObjects(month);

  planList.innerHTML = '';
  const sessionPlan = [
    `20:30 - Setup and polar alignment (allow optics to cool for ${month >= 10 || month <= 2 ? 35 : 20} min).`,
    `21:15 - Start with easy calibration target: ${visibleObjects[0]?.name || 'Jupiter'}.`,
    `22:00 - Deep-sky run: ${visibleObjects.slice(1, 4).map((x) => x.name).join(', ') || 'Orion Nebula, Andromeda Galaxy'}.`,
    `23:30 - High-power lunar/planetary pass if seeing remains steady.`,
    `00:${String((day * 3) % 60).padStart(2, '0')} - Capture notes and sketches while memory is fresh.`
  ];

  sessionPlan.forEach((step) => {
    const li = document.createElement('li');
    li.textContent = step;
    planList.appendChild(li);
  });
}

function calculateOptics() {
  const aperture = Number(document.getElementById('aperture').value);
  const focalLength = Number(document.getElementById('focalLength').value);
  const eyepiece = Number(document.getElementById('eyepiece').value);
  const output = document.getElementById('opticsOutput');

  if (!aperture || !focalLength || !eyepiece) return;

  const magnification = (focalLength / eyepiece).toFixed(1);
  const focalRatio = (focalLength / aperture).toFixed(1);
  const maxUseful = Math.round(aperture * 2);
  const exitPupil = (aperture / magnification).toFixed(2);

  output.innerHTML = `
    <li>Magnification: <strong>${magnification}x</strong></li>
    <li>Focal Ratio: <strong>f/${focalRatio}</strong></li>
    <li>Exit Pupil: <strong>${exitPupil} mm</strong></li>
    <li>Estimated Maximum Useful Magnification: <strong>${maxUseful}x</strong></li>
  `;
}

function loadJournal() {
  const entries = JSON.parse(localStorage.getItem('stargazingJournal') || '[]');
  journalEntries.innerHTML = '';
  entries
    .slice()
    .reverse()
    .forEach((entry) => {
      const item = document.createElement('article');
      item.className = 'journal-entry';
      item.innerHTML = `
        <h4>${entry.target} <small>(${entry.date})</small></h4>
        <p><strong>Rating:</strong> ${entry.rating}/5 · <strong>Instrument:</strong> ${entry.instrument}</p>
        <p>${entry.notes}</p>
      `;
      journalEntries.appendChild(item);
    });

  if (!entries.length) {
    journalEntries.innerHTML = '<p class="muted">No observations yet. Add your first log entry tonight.</p>';
  }
}

targetForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('targetName').value.trim();
  const time = document.getElementById('targetTime').value;
  const notes = document.getElementById('targetNotes').value.trim();

  if (!name || !time) return;

  const li = document.createElement('li');
  li.textContent = `${time} - ${name}${notes ? ` (${notes})` : ''}`;
  planList.appendChild(li);
  targetForm.reset();
});

journalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const entry = {
    date: new Date().toLocaleDateString(),
    target: document.getElementById('journalTarget').value.trim(),
    rating: document.getElementById('journalRating').value,
    instrument: document.getElementById('journalInstrument').value.trim(),
    notes: document.getElementById('journalNotes').value.trim()
  };

  const entries = JSON.parse(localStorage.getItem('stargazingJournal') || '[]');
  entries.push(entry);
  localStorage.setItem('stargazingJournal', JSON.stringify(entries));
  journalForm.reset();
  loadJournal();
});

document.getElementById('generatePlan').addEventListener('click', generatePlan);
document.getElementById('calculateOptics').addEventListener('click', calculateOptics);
document.getElementById('toggleNightMode').addEventListener('click', () => {
  document.body.classList.toggle('night-mode');
});

document.getElementById('objectTypeFilter').addEventListener('change', () => renderObjects(getSelectedDate().getMonth() + 1));
document.getElementById('difficultyFilter').addEventListener('change', () => renderObjects(getSelectedDate().getMonth() + 1));
observationDateInput.valueAsDate = new Date();

generatePlan();
calculateOptics();
loadJournal();
