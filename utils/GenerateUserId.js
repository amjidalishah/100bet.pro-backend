function GenerateUserId(username, length = 7) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    const char = username.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }

  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let userId = "";
  for (let i = 0; i < length; i++) {
    const charIndex = Math.abs(hash + i) % characters.length;
    userId += characters[charIndex];
  }

  return userId;
}
module.exports = { GenerateUserId };
