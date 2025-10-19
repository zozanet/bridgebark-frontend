import React from 'react';

export default function SessionPanel({
  bbp,
  onStart,
  onBoost,
  onFinish,
  isMining,
  boostEnabled,
}) {
  return (
    <section>
      <p>BBP: {bbp}</p>
      {!isMining ? (
        <button onClick={onStart}>Start Mining</button>
      ) : (
        <>
          <button onClick={onBoost}>
            {boostEnabled ? 'Disable Boost' : 'Enable Boost'}
          </button>
          <button onClick={onFinish}>Finish</button>
        </>
      )}
    </section>
  );
}