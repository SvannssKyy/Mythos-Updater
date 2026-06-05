// ─────────────────────────────────────────────────────────────────────────────
//  Utility: logger
// ─────────────────────────────────────────────────────────────────────────────

const LEVELS = { info: '✅', warn: '⚠️ ', error: '❌' };

/**
 * @param {'info'|'warn'|'error'} level
 * @param {string} message
 */
function log(level, message) {
  const icon      = LEVELS[level] ?? '•';
  const timestamp = new Date().toISOString();
  const line      = `[${timestamp}] ${icon}  ${message}`;

  if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
}

module.exports = { log };
