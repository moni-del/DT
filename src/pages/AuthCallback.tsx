import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { discordService } from "@/services/discordService";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('جاري تسجيل الدخول...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage('فشل تسجيل الدخول: ' + error);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('رمز المصادقة غير موجود');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        setStatus('loading');
        setMessage('جاري التحقق من حسابك...');
        
        console.log('Starting authentication with code:', code?.substring(0, 10) + '...');
        
        const { user, isInChannel } = await discordService.authenticate(code);
        console.log('Authentication successful:', user.username, 'In channel:', isInChannel);
        
        discordService.storeAuthData(user, isInChannel);
        
        setStatus('success');
        setMessage('تم تسجيل الدخول بنجاح! جاري التحقق من عضويتك...');
        
        setTimeout(() => {
          navigate('/verify');
        }, 1500);
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        
        // Provide more specific error messages
        if (error.message.includes('Failed to exchange code for token')) {
          setMessage('فشل في تبادل رمز المصادقة. يرجى المحاولة مرة أخرى.');
        } else if (error.message.includes('CORS')) {
          setMessage('مشكلة في الاتصال. يرجى المحاولة مرة أخرى.');
        } else {
          setMessage('حدث خطأ أثناء المصادقة. يرجى المحاولة مرة أخرى.');
        }
        
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <div className="glass neon-border rounded-2xl p-8 text-center max-w-md w-full">
        <div className="mb-6">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          )}
          {status === 'success' && (
            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        
        <h2 className="font-orbitron text-2xl font-bold text-foreground mb-3">
          {status === 'loading' && 'جاري المصادقة'}
          {status === 'success' && 'نجحت المصادقة'}
          {status === 'error' && 'فشلت المصادقة'}
        </h2>
        
        <p className="text-muted-foreground text-sm">
          {message}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
