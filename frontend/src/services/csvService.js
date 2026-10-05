const files = {
  students: '/data/students.csv',
  attendance: '/data/attendance_records.csv',
  academic: '/data/academic_records.csv',
  engagement: '/data/engagement_records.csv',
  predictions: '/data/risk_predictions.csv',
  factors: '/data/risk_factors.csv',
};

function parseCsv(text) {
  const rows = [];
  let row = [], value = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i], next = text[i + 1];
    if (char === '"' && quoted && next === '"') { value += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(value); value = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(value); value = '';
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
    } else value += char;
  }
  if (value || row.length) { row.push(value); if (row.some((cell) => cell.trim())) rows.push(row); }
  const [headers, ...body] = rows;
  return body.map((cells) => headers.reduce((record, header, index) => ({ ...record, [header.trim()]: cells[index]?.trim() || '' }), {}));
}

export async function loadCsv(name) {
  const response = await fetch(files[name]);
  if (!response.ok) throw new Error(`Could not load ${name} data (${response.status})`);
  return parseCsv(await response.text());
}

export async function loadLmsData() {
  const entries = await Promise.all(Object.keys(files).map(async (name) => [name, await loadCsv(name)]));
  return Object.fromEntries(entries);
}
