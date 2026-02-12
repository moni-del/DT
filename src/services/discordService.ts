interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordGuildMember {
  user: DiscordUser;
  roles: string[];
  joined_at: string;
}

import { discordConfig } from '../config';

class DiscordService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private botToken: string;
  private guildId: string;
  private channelId: string;
  private apiBase: string;
  private checkApiBase: string; // New: Bot API URL
  private guildCheckCache: { result: boolean; timestamp: number } | null = null;

  constructor() {
    this.clientId = discordConfig.DISCORD_CLIENT_ID;
    this.clientSecret = discordConfig.DISCORD_CLIENT_SECRET;
    this.redirectUri = discordConfig.DISCORD_REDIRECT_URI;
    this.botToken = discordConfig.DISCORD_BOT_TOKEN;
    this.guildId = discordConfig.DISCORD_GUILD_ID;
    this.channelId = discordConfig.DISCORD_CHANNEL_ID;
    this.apiBase = discordConfig.DISCORD_API_BASE;
    this.checkApiBase = discordConfig.DISCORD_CHECK_API;

    // Debug logging
    console.log('Discord Service initialized:', {
      clientId: this.clientId,
      hasClientSecret: !!this.clientSecret,
      redirectUri: this.redirectUri,
      guildId: this.guildId,
      hasBotToken: !!this.botToken,
      botTokenLength: this.botToken ? this.botToken.length : 0,
      checkApiBase: this.checkApiBase
    });
  }

  // Generate Discord OAuth URL
  getAuthUrl(): string {
    const scopes = ['identify', 'email', 'guilds.join'];
    
    // Use correct redirect URI with /DT/ path for GitHub Pages
    const currentOrigin = window.location.origin;
    const basePath = window.location.pathname.startsWith('/DT') ? '/DT' : '';
    const redirectUri = `${currentOrigin}${basePath}/auth/discord/callback`;
    
    console.log('Using redirect URI:', redirectUri);
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
    });

    return `${discordConfig.DISCORD_OAUTH_AUTHORIZE}?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
    // Use correct redirect URI with /DT/ path for GitHub Pages
    const currentOrigin = window.location.origin;
    const basePath = window.location.pathname.startsWith('/DT') ? '/DT' : '';
    const redirectUri = `${currentOrigin}${basePath}/auth/discord/callback`;
    
    console.log('Exchanging code with redirect URI:', redirectUri);
    
    const response = await fetch(`${discordConfig.DISCORD_OAUTH_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange error:', response.status, errorText);
      throw new Error('Failed to exchange code for token');
    }

    return response.json();
  }

  // Get user information from Discord
  async getUserInfo(accessToken: string): Promise<DiscordUser> {
    const response = await fetch(`${this.apiBase}/users/@me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  // Check if user is member of Discord server (using our bot API)
  async isUserInServer(userId: string): Promise<boolean> {
    try {
      console.log('Checking server membership via bot API:', userId);
      console.log('Bot API URL:', this.checkApiBase);
      
      // Use our bot API instead of direct Discord API
      const response = await fetch(`${this.checkApiBase}/api/member/${userId}`);
      
      if (!response.ok) {
        console.error('Bot API error:', response.status, response.statusText);
        return false;
      }
      
      const data = await response.json();
      console.log('Bot API response:', data);
      
      return !!data.isMember;
    } catch (error) {
      console.error('Error checking membership via bot API:', error);
      return false;
    }
  }

  // Check if user is member of specific Discord channel (using our bot API)
  async isUserInChannel(userId: string): Promise<boolean> {
    try {
      console.log('Checking channel membership via bot API:', userId);
      console.log('Bot API URL:', this.checkApiBase);
      
      // Use our bot API instead of direct Discord API
      const response = await fetch(`${this.checkApiBase}/api/member/${userId}`);
      
      if (!response.ok) {
        console.error('Bot API error:', response.status, response.statusText);
        return false;
      }
      
      const data = await response.json();
      console.log('Bot API response:', data);
      
      return !!data.isMember;
    } catch (error) {
      console.error('Error checking channel membership via bot API:', error);
      return false;
    }
  }

  // Complete authentication flow
  async authenticate(code: string): Promise<{ user: DiscordUser; isInChannel: boolean }> {
    const tokenResponse = await this.exchangeCodeForToken(code);
    const user = await this.getUserInfo(tokenResponse.access_token);
    const isInChannel = await this.isUserInChannel(user.id);

    return { user, isInChannel };
  }

  // Store authentication data in localStorage
  storeAuthData(user: DiscordUser, isInChannel: boolean): void {
    localStorage.setItem('discord_user', JSON.stringify(user));
    localStorage.setItem('is_in_channel', JSON.stringify(isInChannel));
    localStorage.setItem('auth_timestamp', Date.now().toString());
  }

  // Retrieve stored authentication data
  getStoredAuthData(): { user: DiscordUser | null; isInChannel: boolean } {
    try {
      const userStr = localStorage.getItem('discord_user');
      const isInChannelStr = localStorage.getItem('is_in_channel');
      const timestampStr = localStorage.getItem('auth_timestamp');

      if (!userStr || !isInChannelStr || !timestampStr) {
        return { user: null, isInChannel: false };
      }

      // Check if auth is still valid (24 hours)
      const timestamp = parseInt(timestampStr);
      const now = Date.now();
      const hoursDiff = (now - timestamp) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        this.clearAuthData();
        return { user: null, isInChannel: false };
      }

      return {
        user: JSON.parse(userStr),
        isInChannel: JSON.parse(isInChannelStr),
      };
    } catch (error) {
      console.error('Error retrieving auth data:', error);
      this.clearAuthData();
      return { user: null, isInChannel: false };
    }
  }

  // Clear authentication data
  clearAuthData(): void {
    localStorage.removeItem('discord_user');
    localStorage.removeItem('is_in_channel');
    localStorage.removeItem('auth_timestamp');
    this.guildCheckCache = null; // Clear cache too
  }

  // Clear guild check cache (useful for testing)
  clearGuildCache(): void {
    console.log('Clearing guild check cache...');
    this.guildCheckCache = null;
  }
}

export const discordService = new DiscordService();
export type { DiscordUser, DiscordTokenResponse, DiscordGuildMember };
