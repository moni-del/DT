// Configuration for different environments
export const config = {
  // Production values (GitHub Pages) - REMOVE SENSITIVE DATA
  DISCORD_CLIENT_ID: '1470099721900265704',
  DISCORD_CLIENT_SECRET: 'ji7AQcaaMT4NC37x7CFGG5neSMky0kNX',
  DISCORD_REDIRECT_URI: 'https://moni-del.github.io/DT/auth/discord/callback',
  DISCORD_GUILD_ID: '1409839526062460940',
  DISCORD_CHANNEL_ID: '1409839526062460940',
  DISCORD_BOT_TOKEN: 'REDACTED_FOR_SECURITY', // Remove token from code
  DISCORD_API_BASE: 'https://discord.com/api/v10',
  DISCORD_OAUTH_AUTHORIZE: 'https://discord.com/oauth2/authorize',
  DISCORD_OAUTH_TOKEN: 'https://discord.com/api/oauth2/token',
  DISCORD_CHECK_API: 'https://replit.com/@monif28mm/DT',
  DISCORD_INVITE_URL: 'https://discord.gg/dtc',
};

// Development values (localhost)
export const devConfig = {
  DISCORD_CLIENT_ID: import.meta.env.VITE_DISCORD_CLIENT_ID || config.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: import.meta.env.VITE_DISCORD_CLIENT_SECRET || config.DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI: import.meta.env.VITE_DISCORD_REDIRECT_URI || config.DISCORD_REDIRECT_URI,
  DISCORD_GUILD_ID: import.meta.env.VITE_DISCORD_GUILD_ID || config.DISCORD_GUILD_ID,
  DISCORD_CHANNEL_ID: import.meta.env.VITE_DISCORD_CHANNEL_ID || config.DISCORD_CHANNEL_ID,
  DISCORD_BOT_TOKEN: import.meta.env.VITE_DISCORD_BOT_TOKEN || config.DISCORD_BOT_TOKEN,
  DISCORD_API_BASE: import.meta.env.VITE_DISCORD_API_BASE || config.DISCORD_API_BASE,
  DISCORD_OAUTH_AUTHORIZE: import.meta.env.VITE_DISCORD_OAUTH_AUTHORIZE || config.DISCORD_OAUTH_AUTHORIZE,
  DISCORD_OAUTH_TOKEN: import.meta.env.VITE_DISCORD_OAUTH_TOKEN || config.DISCORD_OAUTH_TOKEN,
  DISCORD_CHECK_API: import.meta.env.VITE_DISCORD_CHECK_API || config.DISCORD_CHECK_API,
  DISCORD_INVITE_URL: import.meta.env.VITE_DISCORD_INVITE_URL || config.DISCORD_INVITE_URL,
};

// Use development config if environment variables exist, otherwise use production
export const discordConfig = import.meta.env.DEV ? devConfig : config;
