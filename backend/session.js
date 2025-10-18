// session.js
const sessions = new Map();
const baseRate = 1;
const boosterMultiplier = 2;

function startSession(wallet) {
  if (!wallet) throw new Error('wallet is required');
  const now = Date.now();
  sessions.set(wallet, { lastUpdate: now, accrued: 0, boost: false });
  return { wallet, startedAt: now };
}

function heartbeat(wallet) {
  const s = sessions.get(wallet);
  if (!s) throw new Error('no active session');
  const now = Date.now();
  const delta = (now - s.lastUpdate) / 1000;
  const rate = baseRate * (s.boost ? boosterMultiplier : 1);
  s.accrued += rate * delta;
  s.lastUpdate = now;
  return { wallet, accrued: s.accrued };
}

function finishSession(wallet) {
  const s = sessions.get(wallet);
  if (!s) throw new Error('no active session');
  const total = s.accrued;
  sessions.delete(wallet);
  return { wallet, finalBbp: total };
}

module.exports = { startSession, heartbeat, finishSession };
