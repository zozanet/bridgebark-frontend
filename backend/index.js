// index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');
const sessionManager = require('./session'); // make sure session.js exists

// Load environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const WEB_APP_BASE = process.env.WEB_APP_BASE;

if (!BOT_TOKEN || !WEBHOOK_URL || !WEB_APP_BASE) {
  console.error('❌ Missing TELEGRAM_BOT_TOKEN, WEBHOOK_URL, or WEB_APP_BASE in .env');
  process.exit(1);
}

const app = express();
app.use(bodyParser.json());

// Initialize bot
const bot = new Telegraf(BOT_TOKEN);

// Debug log every incoming update
bot.use((ctx, next) => {
  console.log('📩 Incoming update:', JSON.stringify(ctx.update, null, 2));
  return next();
});

// /start handler
bot.start((ctx) => {
  console.log('🚀 /start received from', ctx.from?.username || ctx.from?.id);
  ctx.reply('Welcome to BridgeBark! Tap below to open the Mini App.', {
    reply_markup: {
      keyboard: [[{ text: 'Open BridgeBark', web_app: { url: WEB_APP_BASE } }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

// Mount webhook callback so Telegram can deliver updates
app.use(bot.webhookCallback('/telegraf/webhook'));

// Session API routes
app.post('/api/session/start', (req, res) => {
  try {
    const { wallet } = req.body;
    const session = sessionManager.startSession(wallet);
    res.json(session);
  } catch (err) {
    console.error('❌ Error in /api/session/start:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/session/heartbeat', (req, res) => {
  try {
    const { wallet } = req.body;
    const session = sessionManager.heartbeat(wallet);
    res.json(session);
  } catch (err) {
    console.error('❌ Error in /api/session/heartbeat:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/session/finish', (req, res) => {
  try {
    const { wallet } = req.body;
    const session = sessionManager.finishSession(wallet);
    res.json(session);
  } catch (err) {
    console.error('❌ Error in /api/session/finish:', err);
    res.status(500).json({ error: err.message });
  }
});

// Error logging middleware (catches webhook crashes)
app.use((err, req, res, next) => {
  console.error('❌ Error handling request:', err.stack || err);
  res.status(500).send('Internal Server Error');
});

// Start server
const PORT = 4000;
app.listen(PORT, async () => {
  console.log(`✅ Backend listening on port ${PORT}`);
  await bot.telegram.setWebhook(`${WEBHOOK_URL}/telegraf/webhook`);
  console.log(`✅ Webhook set to ${WEBHOOK_URL}/telegraf/webhook`);
});