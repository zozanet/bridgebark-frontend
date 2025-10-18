import LorePanel from "./components/LorePanel";
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SessionPanel from './components/SessionPanel';

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

  // Rotate lore every 10 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setLoreIndex(i => (i + 1) % loreSnippets.length);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  // Start session and enable mining
  const handleSaveWallet = async () => {
    await fetch(`${API_BASE}/api/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet }),
    });
    setIsMining(true);
  };

  // Poll heartbeat every 2 seconds
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

  // Finish session and show final BBP
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

  // Toggle booster locally (server logic is in session.js)
  const handleBoost = () => {
    setBoostEnabled(e => !e);
  };

  return (
    <div className="container">
      <Header wallet={wallet} onChange={setWallet} onSubmit={handleSaveWallet} />
      <SessionPanel
        bbp={bbp}
        onStart={handleSaveWallet}
        onBoost={handleBoost}
        onFinish={handleFinish}
        isMining={isMining}
        boostEnabled={boostEnabled}
      />
      <LorePanel snippet={loreSnippets[loreIndex]} />
    </div>
  );
}