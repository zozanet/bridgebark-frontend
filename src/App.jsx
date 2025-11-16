import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SessionPanel from './components/SessionPanel';
import LorePanel from './components/LorePanel';
import './App.css';
import { useSession } from "./hooks/useSession";

export default function App() {
  const { status, error, wallet, balance, mining, lastCheckIn, actions } = useSession();

  if (status === "loading") return <div>Loading session…</div>;
  if (status === "error") return <div>Error: {error}</div>;

  return (
    <div>
      <h1>BridgeBark 🐾</h1>
      <p>Wallet: {wallet}</p>
      <p>Balance: {balance} BBP</p>
      <p>Status: {mining ? "Mining" : "Not mining"}</p>

      {!mining && <button onClick={actions.startMining}>Start Mining</button>}
      <button onClick={actions.checkIn}>Check‑In</button>

      {lastCheckIn && <p>Last check‑in: {new Date(lastCheckIn).toLocaleString()}</p>}
    </div>
  );
}

const API_BASE = 'https://unacclimatized-ivan-bookless.ngrok-free.dev';

const loreSnippets = [
  'Every bark powers the bridge.',
  'Halving schedule in effect!',
  'Boosts give you extra BBP.',
  'Stay loyal to BridgeBark.'
];

export default function App() {
  const [wallet, setWallet] = useState('');
  const [bbp, setBbp] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [boostEnabled, setBoostEnabled] = useState(false);
  const [loreIndex, setLoreIndex] = useState(0);

  // Rotate lore every 10s
  useEffect(() => {
    const id = setInterval(() => {
      setLoreIndex(i => (i + 1) % loreSnippets.length);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  // Start session
  const handleSaveWallet = async () => {
    await fetch(`${API_BASE}/api/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet }),
    });
    setIsMining(true);
  };

  // Heartbeat
  useEffect(() => {
    let hb;
    if (isMining) {
      hb = setInterval(async () => {
        const res = await fetch(`${API_BASE}/api/session/heartbeat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet }),
        });
        const { accrued } = await res.json();
        setBbp(accrued);
      }, 2000);
    }
    return () => clearInterval(hb);
  }, [isMining, wallet]);

  // Finish session
  const handleFinish = async () => {
    const res = await fetch(`${API_BASE}/api/session/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet }),
    });
    const { finalBbp } = await res.json();
    setBbp(finalBbp);
    setIsMining(false);
    setBoostEnabled(false);
  };

  // Toggle booster
  const handleBoost = () => {
    setBoostEnabled(e => !e);
  };

  return (
    <div className="app">
      {/* Mascot Panel */}
      <header className="mascot-panel">
        <img src="/mascot.png" alt="BridgeBark Mascot" className="mascot" />
        <h1>BridgeBark</h1>
        <p>Bark to Bridge. Mine to Moon.</p>
      </header>

      {/* Wallet + Session */}
      <Header wallet={wallet} onChange={setWallet} onSubmit={handleSaveWallet} />
      <SessionPanel
        bbp={bbp}
        onStart={handleSaveWallet}
        onBoost={handleBoost}
        onFinish={handleFinish}
        isMining={isMining}
        boostEnabled={boostEnabled}
      />

      {/* Rotating Lore */}
      <LorePanel snippet={loreSnippets[loreIndex]} />
    </div>
  );
}