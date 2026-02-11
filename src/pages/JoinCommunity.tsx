import { motion } from "framer-motion";
import { Users, ExternalLink, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JoinCommunity = () => {
  const navigate = useNavigate();
  const discordInviteUrl = import.meta.env.VITE_DISCORD_INVITE_URL || "https://discord.gg/dtc";

  const handleJoinDiscord = () => {
    // Open Discord invite in new tab
    window.open(discordInviteUrl, '_blank');
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass neon-border rounded-2xl p-8 text-center max-w-md w-full"
      >
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleBackToLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">رجوع</span>
        </motion.button>

        {/* Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full gradient-primary"
        >
          <Users className="h-10 w-10 text-primary-foreground" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-orbitron text-2xl font-bold text-foreground mb-3"
        >
          انضمام للسيرفر
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-8 text-sm leading-relaxed"
        >
          انضم إلى سيرفر Discord الخاص بنا لتكون جزءاً من مجتمع DT_STORE واحصل على أحدث العروض والمنتجات الحصرية والدعم الفوري.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 mb-8 text-right"
        >
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span className="text-sm text-foreground">عروض حصرية للأعضاء</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <div className="h-2 w-2 rounded-full bg-neon-purple"></div>
            <span className="text-sm text-foreground">دعم فني 24/7</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <div className="h-2 w-2 rounded-full bg-neon-gold"></div>
            <span className="text-sm text-foreground">منتجات جديدة أولاً</span>
          </div>
        </motion.div>

        {/* Join Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleJoinDiscord}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,58%)] text-foreground font-bold py-4 px-6 transition-all duration-300 shadow-[0_0_20px_hsl(235,86%,65%,0.4)]"
        >
          <ExternalLink className="h-5 w-5" />
          <span>انضم إلى السيرفر</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default JoinCommunity;
