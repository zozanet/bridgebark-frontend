import React from 'react';
import './SessionPanel.css';

export default function SessionPanel({
  bbp,
  onStart,
  onBoost,
  onFinish,
  isMining,
  boostEnabled
}) {
  return (
    <div className="session-panel">
      {/* Stats Section */}
      <div className="stats-panel">
        <div className="stat">
          <h2>BBP Mined</h2>
          <p>{bbp}</p>
        </div>
        <div className="stat">
          <h2>Boost</h2>
          <p>{boostEnabled ? '+25%' : 'Off'}</p>
        </div>
        <div className="stat">
          <h2>Status</h2>
          <p>{isMining ? 'Mining…' : 'Idle'}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions">
        {!isMining && (
          <button onClick={onStart}>
            🦴 Check In
          </button>
        )}
        {isMining && (
          <>
            <button onClick={onBoost}>
              ⚡ {boostEnabled ? 'Disable Boost' : 'Enable Boost'}
            </button>
            <button onClick={onFinish}>
              🐾 Finish Session
            </button>
          </>
        )}
      </div>
    </div>
  );
}