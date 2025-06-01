# LINE Message to Discord

A Google Apps Script project that forwards messages from LINE to Discord using webhooks. Supports text messages, images, videos, audio files, documents, and stickers.

## Features

- Forward text messages from LINE to Discord
- Forward media files (images, videos, audio, documents) from LINE to Discord
- Forward LINE stickers to Discord as images

## Prerequisites

- Google account
- LINE Developer account
- Discord server with webhook permissions

## Setup Instructions

### 1. Discord Webhook Setup

1. Open your Discord server
2. Go to **Server Settings** → **Integrations** → **Webhooks**
3. Click **Create Webhook**
4. Choose the channel where you want to receive LINE messages
5. Copy the **Webhook URL** (you'll need this later)

### 2. LINE Bot Setup

1. Go to [LINE Developers Console](https://developers.line.biz/console/)
2. Log in with your LINE account
3. Create a new provider (if you don't have one)
4. Click **Create a new channel** → **Messaging API**
5. Fill in the required information:
   - Channel name: Choose any name (e.g., "Discord Forwarder")
   - Channel description: Brief description
   - Category: Choose appropriate category
   - Subcategory: Choose appropriate subcategory
6. Click **Create**

#### Configure LINE Bot Settings

1. In your newly created channel, go to the **Messaging API** tab
2. **Channel Access Token**:
   - Click **Issue** to generate a long-lived access token
   - Copy this token (you'll need it later)
3. **Webhook Settings**:
   - Enable **Use webhook**
   - Set **Webhook URL** to your Google Apps Script deployment URL (see step 3)
   - Enable **Redelivery** (optional)
4. **Bot Settings**:
   - Disable **Auto-reply messages**
   - Disable **Greeting messages**

### 3. Google Apps Script Setup

1. Go to [Google Apps Script](https://script.google.com/)
2. Click **New Project**
3. Replace the default code with the contents of `main.gs`
4. Save the project with a meaningful name (e.g., "LINE Message to Discord")

#### Configure Script Properties

1. In Google Apps Script, go to **Project Settings** (gear icon)
2. Scroll down to **Script Properties**
3. Add the following properties:
   - **Property**: `DISCORD_WEBHOOK_URL`
     **Value**: Your Discord webhook URL from step 1
   - **Property**: `LINE_CHANNEL_ACCESS_TOKEN`
     **Value**: Your LINE channel access token from step 2

#### Deploy the Script

1. Click **Deploy** → **New deployment**
2. Click the gear icon next to **Type** and select **Web app**
3. Configure the deployment:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Important**: Copy the **Web app URL** - this is your webhook URL for LINE

#### Update LINE Webhook URL

1. Go back to [LINE Developers Console](https://developers.line.biz/console/)
2. Select your channel
3. Go to **Messaging API** tab
4. In **Webhook settings**, paste your Google Apps Script Web app URL
5. Click **Update**
6. Click **Verify** to test the connection

### 4. Add Bot to LINE

1. In LINE Developers Console, go to your channel's **Messaging API** tab
2. Scan the **QR code** with your LINE app or search for your bot using the **Bot basic ID**
3. Add the bot as a friend

### 5. Test the Setup

1. Send a text message to your LINE bot
2. Check if the message appears in your Discord channel
3. Try sending different types of content:
   - Images
   - Videos
   - Audio files
   - Documents
   - Stickers

## Supported Message Types

| LINE Message Type | Discord Output                     |
| ----------------- | ---------------------------------- |
| Text              | Direct text message                |
| Image             | Image file upload                  |
| Video             | Video file upload                  |
| Audio             | Audio file upload                  |
| File              | File upload with original filename |
| Sticker           | PNG image of the sticker           |

## Troubleshooting

### Common Issues

1. **Messages not appearing in Discord**:

   - Check that the Discord webhook URL is correct
   - Verify the webhook permissions in Discord
   - Check Google Apps Script execution logs

2. **LINE webhook verification fails**:

   - Ensure the Google Apps Script is deployed correctly
   - Check that the deployment permissions are set to "Anyone"
   - Verify the webhook URL in LINE console

3. **Media files not forwarding**:
   - Check that the LINE Channel Access Token is correct
   - Verify file size limits (Discord has upload limits)
   - Check execution logs for error messages

### Redeploying Changes

If you make changes to the script:

1. Save the changes
2. Go to **Deploy** → **Manage deployments**
3. Click the edit icon next to your deployment
4. Update the version to **New version**
5. Click **Deploy**

## Security Considerations

- Keep your LINE Channel Access Token and Discord Webhook URL secret
- Regularly monitor the bot's activity
- Consider implementing rate limiting for production use
- Review Google Apps Script execution permissions periodically

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
