// Function executed when a POST request is received
function doPost(e) {
  const postData = JSON.parse(e.postData.contents).events[0];
  const message = postData.message;

  switch (message.type) {
    case 'text':
      sendDiscord({ content: message.text });
      break;
    case 'image':
    case 'video':
    case 'audio':
    case 'file':
      forwardMediaToDiscord(message);
      break;
    case 'sticker':
      forwardStickerToDiscord(message);
      break;
    default:
      sendDiscord({ content: `[Unsupported message type: ${message.type}]` });
  }

  return ContentService
    .createTextOutput(JSON.stringify({ message: 'OK' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Send a JSON payload to a Discord webhook (text only)
function sendDiscord(payload) {
  const url = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL');
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  const res = UrlFetchApp.fetch(url, options);
  if (res.getResponseCode() !== 204) {
    console.error('Discord send failure: ' + res.getResponseCode(), res.getContentText());
  }
}

// Upload LINE media (image/video/audio/file) to Discord
function forwardMediaToDiscord(message) {
  const lineToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const mediaRes = UrlFetchApp.fetch(
    'https://api-data.line.me/v2/bot/message/' + message.id + '/content',
    { headers: { 'Authorization': 'Bearer ' + lineToken }, muteHttpExceptions: true }
  );
  if (mediaRes.getResponseCode() !== 200) {
    console.error('Failed to fetch LINE media: ' + mediaRes.getResponseCode());
    return;
  }

  const blob = mediaRes.getBlob();
  const ext = blob.getContentType().split('/')[1] || 'bin';
  const fileName = (message.type === 'file' && message.fileName)
                   ? message.fileName
                   : (message.id + '.' + ext);
  blob.setName(fileName);

  const discordUrl = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL');
  const formData = { file: blob };
  const options = { method: 'post', payload: formData, muteHttpExceptions: true };
  const discordRes = UrlFetchApp.fetch(discordUrl, options);
  if (discordRes.getResponseCode() < 200 || discordRes.getResponseCode() >= 300) {
    console.error('Discord file send failure: ' + discordRes.getResponseCode(), discordRes.getContentText());
  }
}

// Retrieve and upload LINE sticker to Discord
function forwardStickerToDiscord(message) {
  // Sticker images can be directly retrieved using the following URL pattern:
  // https://stickershop.line-scdn.net/stickershop/v1/sticker/{stickerId}/ANDROID/sticker.png
  const url = 'https://stickershop.line-scdn.net/stickershop/v1/sticker/'
              + message.stickerId + '/ANDROID/sticker.png';
  const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) {
    console.error('Failed to fetch sticker: ' + res.getResponseCode());
    return;
  }

  const blob = res.getBlob().setName(message.stickerId + '.png');
  const discordUrl = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL');
  const formData = { file: blob };
  const options = { method: 'post', payload: formData, muteHttpExceptions: true };
  const discordRes = UrlFetchApp.fetch(discordUrl, options);
  if (discordRes.getResponseCode() < 200 || discordRes.getResponseCode() >= 300) {
    console.error('Discord sticker send failure: ' + discordRes.getResponseCode(), discordRes.getContentText());
  }
}
