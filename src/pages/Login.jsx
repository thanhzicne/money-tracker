import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  MdEmail, MdLock, MdPerson, MdFingerprint, MdArrowBack, 
  MdTrendingUp, MdShield, MdCloudSync, MdVisibility, MdVisibilityOff 
} from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
  const [emailOrUser, setEmailOrUser] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithGoogle, loginWithEmail, loginWithUsername, signupWithEmail, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (view === 'login') {
        const isEmail = emailOrUser.includes('@');
        if (isEmail) {
          await loginWithEmail(emailOrUser, password);
        } else {
          await loginWithUsername(emailOrUser, password);
        }
      } else if (view === 'signup') {
        if (!name) throw new Error('Vui lòng nhập tên hiển thị');
        if (!username) throw new Error('Vui lòng nhập tên đăng nhập');
        if (password !== confirmPassword) throw new Error('Mật khẩu xác nhận không khớp');
        if (password.length < 6) throw new Error('Mật khẩu phải có ít nhất 6 ký tự');

        await signupWithEmail(email, password, name, username);
      } else if (view === 'forgot') {
        if (!email) throw new Error('Vui lòng nhập email');
        await resetPassword(email);
        setSuccess('Link đặt lại mật khẩu đã được gửi về email của bạn!');
        setTimeout(() => setView('login'), 5000);
      }
    } catch (err) {
      console.error(err);
      let msg = err.message;
      if (msg.includes('auth/invalid-credential')) msg = 'Thông tin đăng nhập không chính xác';
      if (msg.includes('auth/email-already-in-use')) msg = 'Email này đã được sử dụng';
      if (msg.includes('auth/weak-password')) msg = 'Mật khẩu quá yếu';
      if (msg.includes('auth/user-not-found')) msg = 'Email không tồn tại';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors font-sans overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-100">
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-zinc-200/20 dark:border-zinc-800/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-zinc-200/10 dark:border-zinc-800/10 rounded-full"></div>
      </div>

      <div className="max-w-6xl w-full flex glass rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 animate-fade-in border-white/40 dark:border-zinc-800/50">
        
        {/* Left Side: Hero (Desktop Only) */}
        <div className="hidden lg:flex w-5/12 bg-zinc-900 dark:bg-zinc-950 relative overflow-hidden p-12 flex-col justify-between text-white">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-10 transform hover:scale-110 transition-transform cursor-pointer">
              <span className="text-3xl font-black italic">M</span>
            </div>
            <h2 className="text-5xl font-black tracking-tight leading-[1.1] mb-6">
              Quản lý ví,<br/>
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent italic">Sống tự do.</span>
            </h2>
            <p className="text-zinc-400 font-medium text-lg max-w-sm leading-relaxed">
              Công cụ tối giản giúp bạn nắm bắt dòng tiền và đạt được các mục tiêu tài chính nhanh hơn.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            {[
              { icon: <MdTrendingUp size={24}/>, title: 'Báo cáo trực quan', desc: 'Theo dõi biến động tài sản theo thời gian real-time.' },
              { icon: <MdShield size={24}/>, title: 'An toàn dữ liệu', desc: 'Sử dụng nền tảng Firebase uy tín và bảo mật đa lớp.' },
              { icon: <MdCloudSync size={24}/>, title: 'Đồng bộ tức thì', desc: 'Mọi giao dịch được cập nhật trên tất cả thiết bị.' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group p-4 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="p-3 bg-white/5 rounded-xl text-emerald-400 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="w-full lg:w-7/12 p-8 md:p-14 lg:p-20 flex flex-col justify-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
          
          {/* Logo for mobile */}
          <div className="lg:hidden flex flex-col items-center mb-10 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-3">
              <span className="text-2xl font-black italic">M</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-800 dark:text-white">Money Tracker</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-3">
              {view === 'login' ? 'Đăng nhập' : view === 'signup' ? 'Tạo tài khoản' : 'Quên mật khẩu?'}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-[0.2em]">
              {view === 'login' ? 'Hãy tiếp tục hành trình tài chính của bạn' : view === 'signup' ? 'Bắt đầu quản lý chi tiêu hiệu quả ngay hôm nay' : 'Nhập email để nhận hướng dẫn khôi phục'}
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-xs font-black mb-8 animate-shake flex items-center gap-3">
              <div className="w-1 h-6 bg-rose-500 rounded-full"></div>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-xs font-black mb-8 animate-fade-in flex items-center gap-3">
              <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {view === 'forgot' ? (
              <div className="space-y-2 animate-slide-in-right">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Email khôi phục</label>
                <div className="relative group">
                  <MdEmail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-14 font-bold h-14 !bg-white/50 dark:!bg-zinc-800/50"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            ) : view === 'login' ? (
              <div className="space-y-5 animate-slide-in-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Tên đăng nhập / Email</label>
                  <div className="relative group">
                    <MdPerson className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      className="input-field pl-14 font-bold h-14 !bg-white/50 dark:!bg-zinc-800/50"
                      placeholder="Username hoặc Email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Mật khẩu</label>
                    <button 
                      type="button" 
                      onClick={() => { setView('forgot'); setError(''); setSuccess(''); }}
                      className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors uppercase tracking-widest"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative group">
                    <MdLock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-14 pr-14 font-bold h-14 !bg-white/50 dark:!bg-zinc-800/50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500 transition-colors"
                    >
                      {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-slide-in-right">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Họ và tên</label>
                    <div className="relative group">
                      <MdPerson className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field pl-14 font-bold h-14 !bg-white/50 dark:!bg-zinc-800/50"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Username</label>
                    <div className="relative group">
                      <MdFingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field pl-14 font-bold h-14 !bg-white/50 dark:!bg-zinc-800/50"
                        placeholder="user123"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative group">
                    <MdEmail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-14 font-bold h-14 !bg-white/50 dark:!bg-zinc-800/50"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Mật khẩu</label>
                    <div className="relative group">
                      <MdLock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field pl-14 pr-14 font-bold h-14 !bg-white/50 dark:!bg-zinc-800/50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Xác nhận</label>
                    <div className="relative group">
                      <MdLock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`input-field pl-14 font-bold h-14 !bg-white/50 dark:!bg-zinc-800/50 ${
                          confirmPassword && password !== confirmPassword 
                            ? 'border-rose-500 ring-4 ring-rose-500/10' 
                            : ''
                        }`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 mt-4 flex items-center justify-center gap-3 overflow-hidden group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>
                    {view === 'login' ? 'Đăng nhập' : 
                     view === 'signup' ? 'Tham gia ngay' : 'Gửi yêu cầu'}
                  </span>
                  <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:w-8 transition-all"></div>
                </>
              )}
            </button>
          </form>

          {view === 'forgot' ? (
            <button 
              onClick={() => { setView('login'); setError(''); setSuccess(''); }}
              className="w-full mt-8 flex items-center justify-center gap-2 text-xs font-black text-zinc-400 dark:text-zinc-500 hover:text-emerald-600 transition-colors uppercase tracking-widest"
            >
              <MdArrowBack size={18} />
              Quay lại đăng nhập
            </button>
          ) : (
            <>
              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800/50"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white/0 px-4 text-[10px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-[0.4em]">Hoặc</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-14 glass rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-4 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-all hover:shadow-lg active:scale-[0.98]"
              >
                <FaGoogle className="text-emerald-500" size={20} />
                Tiếp tục bằng Google
              </button>

              <div className="text-center mt-10">
                <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest inline-block">
                  {view === 'login' ? 'Bạn chưa có tài khoản?' : 'Bạn đã có tài khoản?'}
                </p>
                <button
                  onClick={() => {
                    setView(view === 'login' ? 'signup' : 'login');
                    setError('');
                    setSuccess('');
                    setShowPassword(false);
                  }}
                  className="ml-3 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                >
                  {view === 'login' ? 'Đăng ký miễn phí' : 'Đăng nhập ngay'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer Info (Optional) */}
      <div className="fixed bottom-6 text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.5em] pointer-events-none">
        Money Tracker v2.0 • 2026
      </div>
    </div>
  );
};

export default Login;
