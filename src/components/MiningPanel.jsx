import { useState, useEffect } from 'react';

export default function MiningPanel({ onStart, onHeartbeat, onFinish, session, accrued, bbp }) {
  const [wallet, setWallet] = useState('');
  useEffect(() => {
    if (session && onHeartbeat) {
      const i = setInterval(() => onHeartbeat(), 60000);
      return () => clearInterval(i);
    }
  }, [session]);

  return (
    <div className="mining-panel">
      {!session ? (
        <>
          <input className="wallet-input" placeholder="Enter wallet" value={wallet} onChange={(e)=>setWallet(e.target.value)} />
          <button className="start-button" onClick={() => onStart(wallet)}>START MINING</button>
        </>
      ) : (
        <>
          <div className="earned-display">
            <div className="earned-value">{accrued || '0.000000'}</div>
            <div className="earned-label">NEP EARNED</div>
          </div>
          <button className="finish-button" onClick={onFinish}>FINISH SESSION</button>
        </>
      )}
      {bbp && <div className="final-balance">Total BBP: {bbp}</div>}
    </div>
  );
}
