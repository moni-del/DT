import { useState, useEffect, useCallback } from 'react';
import { discordService } from '@/services/discordService';

interface VerificationResult {
  isMember: boolean;
  needsRejoin: boolean;
}

export const useDiscordVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerification, setLastVerification] = useState<number>(0);

  // Check if user is still in the channel
  const verifyMembership = useCallback(async (): Promise<VerificationResult> => {
    const storedData = discordService.getStoredAuthData();
    
    if (!storedData.user) {
      return { isMember: false, needsRejoin: false };
    }

    setIsVerifying(true);
    
    try {
      // Check channel membership instead of server membership
      const isMember = await discordService.isUserInChannel(storedData.user.id);
      
      if (!isMember) {
        // User left the channel, clear auth data
        discordService.clearAuthData();
        return { isMember: false, needsRejoin: true };
      }
      
      setLastVerification(Date.now());
      return { isMember: true, needsRejoin: false };
    } catch (error) {
      console.error('Verification error:', error);
      // If verification fails due to network issues, don't log out the user
      // Just assume they're still valid and let them continue
      return { isMember: true, needsRejoin: false };
    } finally {
      setIsVerifying(false);
    }
  }, []);

  // Automatic verification every 10 minutes (reduced from 5 to avoid rate limiting)
  useEffect(() => {
    const storedData = discordService.getStoredAuthData();
    
    if (!storedData.user) {
      return;
    }

    // Check immediately on mount
    verifyMembership();

    // Set up periodic verification
    const interval = setInterval(() => {
      verifyMembership();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [verifyMembership]);

  // Manual verification
  const manualVerify = useCallback(async () => {
    return await verifyMembership();
  }, [verifyMembership]);

  return {
    isVerifying,
    lastVerification,
    verifyMembership: manualVerify
  };
};
