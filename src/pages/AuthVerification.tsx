import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { discordService } from "@/services/discordService";

const AuthVerification = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('جاري التحقق من عضويتك في القناة...');

  const verifyChannelMembership = async () => {
    try {
      const storedData = discordService.getStoredAuthData();
      
      if (!storedData.user) {
        setStatus('error');
        setMessage('لم يتم العثور على بيانات المستخدم');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      // Clear cache to force fresh check
      discordService.clearGuildCache();
      
      // Check if user is in the channel
      const isInChannel = await discordService.isUserInChannel(storedData.user.id);
      
      if (isInChannel) {
        setStatus('success');
        setMessage(`أهلاً بك ${storedData.user.username}! أنت عضو في القناة وجاري تحويلك إلى المتجر...`);
        setTimeout(() => navigate('/'), 1500);
      } else {
        setStatus('error');
        setMessage(`عذراً ${storedData.user.username}، أنت لست عضواً في القناة المطلوبة. جاري تحويلك لصفحة الانضمام...`);
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('حدث خطأ أثناء التحقق. جاري تحويلك لصفحة تسجيل الدخول...');
      setTimeout(() => navigate('/'), 2000);
    }
  };

  useEffect(() => {
    verifyChannelMembership();
  }, [navigate]);

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass neon-border rounded-2xl p-8 text-center max-w-md w-full"
      >
        {/* Icon */}
        <motion.div
          animate={{ 
            scale: status === 'loading' ? [1, 1.2, 1] : 1,
            rotate: status === 'loading' ? 360 : 0
          }}
          transition={{ 
            scale: { repeat: status === 'loading' ? Infinity : 0, duration: 2 },
            rotate: { repeat: status === 'loading' ? Infinity : 0, duration: 2 }
          }}
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            status === 'loading' ? 'bg-primary/20' :
            status === 'success' ? 'bg-green-500/20' :
            'bg-red-500/20'
          }`}
        >
          {status === 'loading' && <Shield className="h-10 w-10 text-primary" />}
          {status === 'success' && <CheckCircle className="h-10 w-10 text-green-500" />}
          {status === 'error' && <XCircle className="h-10 w-10 text-red-500" />}
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-orbitron text-2xl font-bold text-foreground mb-3"
        >
          {status === 'loading' && 'التحقق من العضوية'}
          {status === 'success' && 'تم التحقق بنجاح'}
          {status === 'error' && 'فشل التحقق'}
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm leading-relaxed"
        >
          {message}
        </motion.p>

        {/* Loading Spinner */}
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </motion.div>
        )}

        {/* Retry Button */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <motion.button
              onClick={verifyChannelMembership}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              إعادة التحقق
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthVerification;
