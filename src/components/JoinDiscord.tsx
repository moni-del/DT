import { motion } from "framer-motion";
import { Users, ExternalLink, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { discordService } from "@/services/discordService";

interface JoinDiscordProps {
  onJoin: () => void;
  onVerified: () => void;
}

const JoinDiscord = ({ onJoin, onVerified }: JoinDiscordProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [discordInviteUrl] = useState(`https://discord.com/api/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`);

  useEffect(() => {
    // Check if user is already verified
    const checkVerification = () => {
      const storedData = discordService.getStoredAuthData();
      if (storedData.user && storedData.isInChannel) {
        onVerified();
      }
    };

    checkVerification();
    const interval = setInterval(checkVerification, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [onVerified]);

  const handleJoinDiscord = () => {
    // Open Discord invite in new tab
    window.open(discordInviteUrl, '_blank');
    onJoin();
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      const storedData = discordService.getStoredAuthData();
      if (storedData.user) {
        // Re-verify channel membership
        const isInChannel = await discordService.isUserInChannel(storedData.user.id);
        if (isInChannel) {
          discordService.storeAuthData(storedData.user, true);
          onVerified();
        } else {
          discordService.storeAuthData(storedData.user, false);
        }
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass neon-border rounded-2xl p-8 text-center max-w-md w-full"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full gradient-primary"
        >
          <Users className="h-10 w-10 text-primary-foreground" />
        </motion.div>

        <h2 className="font-orbitron text-2xl font-bold text-foreground mb-3">
          انضم إلى مجتمعنا
        </h2>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          للوصول إلى المتجر، يجب الانضمام إلى سيرفر Discord الخاص بنا والحصول على تصريح القناة للحصول على أحدث العروض والمنتجات الحصرية.
        </p>

        <div className="space-y-3">
          <motion.button
            onClick={handleJoinDiscord}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,58%)] text-foreground font-bold py-4 px-6 transition-all duration-300 shadow-[0_0_20px_hsl(235,86%,65%,0.4)]"
          >
            <ExternalLink className="h-5 w-5" />
            <span>انضم إلى السيرفر</span>
          </motion.button>

          <motion.button
            onClick={handleCheckVerification}
            disabled={isChecking}
            whileHover={{ scale: isChecking ? 1 : 1.03 }}
            whileTap={{ scale: isChecking ? 1 : 0.97 }}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold py-3 px-6 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'جاري التحقق...' : 'تحقق من الانضمام'}</span>
          </motion.button>
        </div>

        <p className="text-muted-foreground text-xs mt-4">
          بعد الانضمام، اضغط على "تحقق من الانضمام" للوصول إلى المتجر
        </p>
      </motion.div>
    </div>
  );
};

export default JoinDiscord;
