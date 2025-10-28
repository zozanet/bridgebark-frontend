import React from 'react';
import './Header.css';

export default function Header({ wallet, onChange, onSubmit }) {
  return (
    <div className="header-panel">
      <input
        type="text"
        placeholder="🔗 Connect TON Address"
        value={wallet}
        onChange={e => onChange(e.target.value)}
      />

      {wallet ? (
        <>
          <div className="wallet-display">
            ✅ Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </div>
          <button onClick={onSubmit}>
            🎮 Start Session
          </button>
        </>
      ) : (
        <button disabled className="disabled-btn">
          🎮 Start Session
        </button>
      )}
    </div>
  );
}