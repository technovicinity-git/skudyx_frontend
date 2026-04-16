// lib/tokenGenerator.js - FIXED VERSION
import CryptoJS from "crypto-js";

export function generateToken(userID, roomID, effectiveTimeInSeconds = 7200) {
  const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
  const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

  if (!userID || !roomID || !appID || !serverSecret) {
    console.error("Missing required config for token generation");
    return "";
  }

  const TOKEN_VERSION = "04";
  const currentTime = Math.floor(Date.now() / 1000);
  const expireTime = currentTime + effectiveTimeInSeconds;

  // CRITICAL: You MUST include room_id in the payload
  const payloadObj = {
    app_id: appID,
    user_id: userID,
    room_id: roomID, // ← This is required!
    privilege: {
      // 1 = Login privilege, 2 = Publish stream privilege
      1: 1, // Enable login
      2: 1, // Enable publishing (1 = enable, 0 = disable)
    },
    stream_id_list: [], // Can be empty array
    ctime: currentTime,
    expire: expireTime,
    nonce: Math.floor(Math.random() * 2147483647),
  };

  // Convert payload to JSON string
  const payload = JSON.stringify(payloadObj);

  // Encrypt with AES-256-CBC
  const key = CryptoJS.enc.Utf8.parse(serverSecret);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(payload, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const ciphertext = CryptoJS.enc.Base64.parse(encrypted.toString());
  const ciphertextBytes = CryptoJS.enc.Base64.stringify(ciphertext);

  // Build token data
  const expireBytes = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    expireBytes[7 - i] = (expireTime >> (i * 8)) & 0xff;
  }

  const ivBytes = new Uint8Array(16);
  const ivWords = iv.words;
  for (let i = 0; i < 16; i++) {
    ivBytes[i] = (ivWords[Math.floor(i / 4)] >>> (24 - (i % 4) * 8)) & 0xff;
  }

  const ciphertextBytesArray = new Uint8Array(
    atob(ciphertextBytes)
      .split("")
      .map((ch) => ch.charCodeAt(0)),
  );

  const tokenData = new Uint8Array(
    8 + 2 + 16 + 2 + ciphertextBytesArray.length,
  );

  tokenData.set(expireBytes, 0);
  tokenData[8] = 0;
  tokenData[9] = 16;
  tokenData.set(ivBytes, 10);
  tokenData[26] = ciphertextBytesArray.length >> 8;
  tokenData[27] = ciphertextBytesArray.length & 0xff;
  tokenData.set(ciphertextBytesArray, 28);

  const token =
    TOKEN_VERSION + btoa(String.fromCharCode(...Array.from(tokenData)));

  return token;
}
