// frontend/src/hooks/useSession.js
import { useEffect, useState, useCallback } from "react";

export function useSession() {
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState(null);

  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [mining, setMining] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);

  const api = import.meta.env.VITE_API_URL; // e.g. https://bridgebark-backend.onrender.com

  // Start session
  const startSession = useCallback(async (walletId) => {
    setStatus("loading");
    try {
      const res = await fetch(`${api}/api/session/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: walletId }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setWallet(data.wallet);
      setBalance(data.balance ?? 0);
      setMining(Boolean(data.mining));
      setLastCheckIn(data.lastCheckIn ?? null);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e.message);
    }
  }, [api]);

  // Start mining
  const startMining = useCallback(async () => {
    if (!wallet) return;
    try {
      const res = await fetch(`${api}/api/session/start-mining`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMining(Boolean(data.mining));
      setBalance(data.balance ?? balance);
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, [api, wallet, balance]);

  // Check-in
  const checkIn = useCallback(async () => {
    if (!wallet) return;
    try {
      const res = await fetch(`${api}/api/session/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setBalance(data.balance ?? balance);
      setLastCheckIn(data.lastCheckIn ?? Date.now());
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, [api, wallet, balance]);

  // Auto-start session on mount (example: using Telegram initData or a dummy wallet)
  useEffect(() => {
    // Replace with Telegram initData parsing if you want real user identity
    const dummyWallet = "demo-user"; 
    startSession(dummyWallet);
  }, [startSession]);

  return {
    status, error,
    wallet, balance, mining, lastCheckIn,
    actions: { startSession, startMining, checkIn },
  };
}