/**
 * Convert a string or array to a clean string array.
 * Handles legacy data with newlines, commas, or emojis.
 */
const toArray = (val) => {
  if (!val) return [];
  
  // Already an array - clean and return
  if (Array.isArray(val)) {
    return val.map((s) => String(s).trim()).filter(Boolean);
  }

  const str = String(val).trim();
  if (!str) return [];

  // Try splitting by newline first (highest priority)
  const lines = str.split(/[\r\n]+/).map((s) => s.replace(/,\s*$/, '').trim()).filter(Boolean);
  if (lines.length > 1) {
    return lines;
  }

  // Fall back to comma split
  return str.split(',').map((s) => s.trim()).filter(Boolean);
};

module.exports = { toArray };
