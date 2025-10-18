import React from 'react';

export default function Header({ wallet, onChange, onSubmit }) {
  return (
    <header>
      <h1>BridgeBark</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          type="text"
          placeholder="Enter wallet"
          value={wallet}
          onChange={e => onChange(e.target.value)}
        />
        <button type="submit">Start</button>
      </form>
    </header>
  );
}