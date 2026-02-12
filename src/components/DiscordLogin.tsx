import { motion } from "framer-motion";
import { Shield, Gamepad2, Car, Sword, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { discordService } from "@/services/discordService";

interface DiscordLoginProps {
  onLogin: () => void;
}

const features = [
  { icon: Sword, text: "سكنات أسلحة حصرية", color: "text-primary" },
  { icon: Car, text: "سكنات سيارات مميزة", color: "text-neon-purple" },
  { icon: Gamepad2, text: "شخصيات فريدة", color: "text-neon-gold" },
  { icon: Sparkles, text: "إكسسوارات نادرة", color: "text-primary" },
];

const DiscordLogin = ({ onLogin }: DiscordLoginProps) => {
  const navigate = useNavigate();

  const handleDiscordLogin = async () => {
    try {
      // Check if already authenticated
      const storedData = discordService.getStoredAuthData();
      if (storedData.user) {
        onLogin();
        return;
      }

      // Redirect to Discord OAuth
      const authUrl = discordService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Discord login error:', error);
    }
  };

  const handleJoinCommunity = () => {
    navigate('/join');
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <div className="glass neon-border rounded-2xl p-8 text-center">
          {/* Logo */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-orbitron text-5xl font-black neon-text text-primary mb-2">
              DT_STORE
            </h1>
            <p className="text-muted-foreground text-sm mb-8">متجرك المفضل للسكنات والمنتجات الرقمية</p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 rounded-xl bg-muted/50 p-3"
              >
                <feature.icon className={`h-5 w-5 ${feature.color} shrink-0`} />
                <span className="text-xs text-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Discord Login Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={handleDiscordLogin}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,58%)] text-foreground font-bold py-4 px-6 transition-all duration-300 shadow-[0_0_20px_hsl(235,86%,65%,0.4)] mb-3"
          >
            <Shield className="h-5 w-5" />
            <span>تسجيل الدخول عبر Discord</span>
          </motion.button>

          {/* Join Community Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={handleJoinCommunity}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold py-3 px-6 transition-all duration-300"
          >
            <Users className="h-5 w-5" />
            <span>انضمام للسيرفر</span>
          </motion.button>

          <p className="text-muted-foreground text-xs mt-4">
            بتسجيل الدخول، أنت توافق على شروط الاستخدام
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DiscordLogin;
