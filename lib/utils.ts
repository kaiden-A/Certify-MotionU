export function parseCSV(text: string): string[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const names: string[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    
    if (fields[0]?.trim()) {
      names.push(fields[0].trim());
    }
  }
  return names;
}

export function slugify(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '') // remove extension
    .replace(/\s+/g, '-')
    .toLowerCase();
}