const https = require("https");
const { URL } = require("url");

// === НАСТРОЙКИ ===
const CHECK_URL = "";
const TELEGRAM_BOT_TOKEN = "7967934650:AAGYDUsli2txm6cal0AQdb6ewv4f4qIC39s";
const TELEGRAM_CHAT_ID = "-4812827339";

function sendTelegramMessage(message) {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}`;

  https
    .get(url, (res) => {
      if (res.statusCode === 200) {
        console.log("✅ Уведомление отправлено в Telegram");
      } else {
        console.error("❌ Ошибка Telegram:", res.statusCode);
      }
    })
    .on("error", (err) => {
      console.error("❌ Telegram error:", err.message);
    });
}

function checkDomain() {
  const parsedUrl = new URL(CHECK_URL);

  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.pathname,
    method: "GET",
    timeout: 10000,
  };

  const req = https.request(options, (res) => {
    const statusCode = res.statusCode;
    console.log(`[${new Date().toISOString()}] Статус: ${statusCode}`);

    if (statusCode >= 200 && statusCode < 300) {
      console.log("✅ Сайт работает");
    } else {
      sendTelegramMessage(`⚠️ ${CHECK_URL} отвечает с кодом ${statusCode}`);
    }
  });

  req.on("error", (e) => {
    console.error(`[${new Date().toISOString()}] ❌ Ошибка: ${e.message}`);
    sendTelegramMessage(`❌ Ошибка: ${CHECK_URL} недоступен. ${e.message}`);
  });

  req.end();
}

// ✅ Только одна проверка (Cron сам перезапустит каждый час)
checkDomain();
