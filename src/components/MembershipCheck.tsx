import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react";

interface MembershipCheckProps {
  onRejoinRequired: () => void;
  onRecheck: () => void;
  isVerifying: boolean;
}

const MembershipCheck = ({ onRejoinRequired, onRecheck, isVerifying }: MembershipCheckProps) => {
  const handleRejoin = () => {
    const inviteUrl = import.meta.env.VITE_DISCORD_INVITE_URL || "https://discord.gg/dtc";
    window.open(inviteUrl, '_blank');
    onRejoinRequired();
  };

  const handleRecheck = () => {
    onRecheck();
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass neon-border rounded-2xl p-8 text-center max-w-md w-full"
      >
        {/* Warning Icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/20"
        >
          <AlertTriangle className="h-10 w-10 text-yellow-500" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-orbitron text-2xl font-bold text-foreground mb-3"
        >
          انقطع الاتصال بالقناة
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-8 text-sm leading-relaxed"
        >
          يبدو أنك غادرت القناة المحددة في سيرفر Discord. البوت يتحقق من وجودك في القناة، وإذا لم تكن عضواً، يرجى الانضمام إلى القناة مرة أخرى للوصول إلى المتجر.
        </motion.p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Rejoin Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleRejoin}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,58%)] text-foreground font-bold py-4 px-6 transition-all duration-300 shadow-[0_0_20px_hsl(235,86%,65%,0.4)]"
          >
            <ExternalLink className="h-5 w-5" />
            <span>انضم إلى القناة</span>
          </motion.button>

          {/* Recheck Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleRecheck}
            disabled={isVerifying}
            whileHover={{ scale: isVerifying ? 1 : 1.03 }}
            whileTap={{ scale: isVerifying ? 1 : 0.97 }}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold py-3 px-6 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'جاري التحقق...' : 'تحقق من الانضمام'}</span>
          </motion.button>
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground text-xs mt-4"
        >
          بعد الانضمام، اضغط على "تحقق من الانضمام" لإعادة الوصول إلى المتجر
        </motion.p>
      </motion.div>
    </div>
  );
};

export default MembershipCheck;
