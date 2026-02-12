# Discord Integration Setup Guide

## Overview
The DT_STORE website now includes Discord OAuth authentication and channel membership verification. Users must:
1. Login with Discord
2. Join your Discord server
3. Be a member of the specified channel to access the store

## Setup Instructions

### 1. Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "DT Store Auth")
4. Go to "OAuth2" → "General"
5. Add the redirect URI: `http://localhost:8080/auth/discord/callback`
6. Save changes

### 2. Create Discord Bot
1. In your Discord application, go to "Bot" → "Add Bot"
2. Enable "Server Members Intent" and "Server Members Intent" under "Privileged Gateway Intents"
3. Copy the Bot Token

### 3. Get Server and Channel IDs
1. Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
2. Right-click your server → Copy Server ID
3. Right-click the channel you want to verify membership for → Copy Channel ID

### 4. Configure Environment Variables
Update the `.env` file with your Discord credentials:

```env
# Discord Configuration
VITE_DISCORD_CLIENT_ID=your_discord_client_id_here
VITE_DISCORD_CLIENT_SECRET=your_discord_client_secret_here
VITE_DISCORD_REDIRECT_URI=http://localhost:8080/auth/discord/callback
VITE_DISCORD_BOT_TOKEN=your_discord_bot_token_here
VITE_DISCORD_GUILD_ID=your_discord_server_id_here
VITE_DISCORD_CHANNEL_ID=your_discord_channel_id_here

# Discord API Endpoints
VITE_DISCORD_API_BASE=https://discord.com/api/v10
VITE_DISCORD_OAUTH_AUTHORIZE=https://discord.com/oauth2/authorize
VITE_DISCORD_OAUTH_TOKEN=https://discord.com/api/oauth2/token
```

### 5. Invite Bot to Server
1. Go to "OAuth2" → "URL Generator"
2. Select scopes: `bot` and `applications.commands`
3. Under "Bot Permissions", select:
   - Read Messages/View Channels
   - Read Message History
   - Server Members
4. Copy the generated URL and paste it in your browser
5. Invite the bot to your Discord server

## How It Works

### Authentication Flow
1. User clicks "تسجيل الدخول عبر Discord"
2. Redirects to Discord OAuth
3. User authorizes the application
4. Discord redirects back with authorization code
5. Exchange code for access token
6. Get user information and verify channel membership
7. Store authentication data in localStorage (24-hour expiry)

### Channel Verification
- The bot checks if the user is a member of your Discord server
- If yes, grants access to the store
- If no, shows the "Join Discord" screen
- Users can manually trigger verification with the "تحقق من الانضمام" button

### Security Features
- OAuth 2.0 authentication
- Token-based API calls
- LocalStorage encryption (consider adding encryption for production)
- 24-hour session expiry
- Automatic logout on token expiry

## Testing
1. Start the development server: `npm run dev`
2. Open http://localhost:8080
3. Click "تسجيل الدخول عبر Discord"
4. Complete the Discord OAuth flow
5. Verify the authentication works correctly

## Production Considerations
- Use HTTPS for production
- Add proper error handling
- Implement rate limiting
- Add encryption for localStorage data
- Use environment-specific configurations
- Consider using a backend service for better security

## Troubleshooting
- **"Invalid Client"**: Check CLIENT_ID and CLIENT_SECRET
- **"Redirect URI Mismatch"**: Ensure redirect URI matches Discord Developer Portal
- **"Missing Access Token"**: Check bot permissions and server membership
- **"Channel Verification Failed"**: Ensure bot has proper permissions and user is in the specified channel
