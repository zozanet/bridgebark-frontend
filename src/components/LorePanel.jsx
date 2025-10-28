import React from 'react';
import './LorePanel.css';

export default function LorePanel({ snippet }) {
  return (
    <div className="lore-panel">
      <div className="ticker">
        <span>{snippet}</span>
      </div>
    </div>
  );
}