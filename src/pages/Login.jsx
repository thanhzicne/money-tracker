import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MdEmail, MdLock, MdPerson, MdFingerprint, MdArrowBack } from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
  const [emailOrUser, setEmailOrUser] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
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
        // Sau 3s quay lại login
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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-4 transition-colors font-sans">
      <div className="max-w-md w-full bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden border border-zinc-100 dark:border-zinc-800 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="p-10">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-3xl mb-6 shadow-inner">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
                <span className="text-2xl font-black">M</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-3 tracking-tighter">Money Tracker</h1>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {view === 'login' && 'Chào mừng trở lại'}
              {view === 'signup' && 'Tạo tài khoản mới'}
              {view === 'forgot' && 'Khôi phục truy cập'}
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-5 rounded-2xl text-xs font-black uppercase tracking-wider mb-8 border border-rose-100 dark:border-rose-800/50 animate-fade-in text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-5 rounded-2xl text-xs font-black uppercase tracking-wider mb-8 border border-emerald-100 dark:border-emerald-800/50 animate-fade-in text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {view === 'forgot' ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Email khôi phục</label>
                <div className="relative group">
                  <MdEmail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-14 font-bold"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
            ) : view === 'login' ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Tên đăng nhập / Email</label>
                  <div className="relative group">
                    <MdEmail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      className="input-field pl-14 font-bold"
                      placeholder="Email hoặc username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Mật khẩu bảo mật</label>
                  <div className="relative group">
                    <MdLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-14 font-bold"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Họ và tên</label>
                  <div className="relative group">
                    <MdPerson className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field pl-14 font-bold"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Tên đăng nhập</label>
                  <div className="relative group">
                    <MdFingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field pl-14 font-bold"
                      placeholder="username123"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Địa chỉ Email</label>
                  <div className="relative group">
                    <MdEmail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-14 font-bold"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Mật khẩu</label>
                  <div className="relative group">
                    <MdLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-14 font-bold"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Xác nhận lại</label>
                  <div className="relative group">
                    <MdLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`input-field pl-14 font-bold ${
                        confirmPassword && password !== confirmPassword 
                          ? 'border-rose-500 ring-4 ring-rose-500/10' 
                          : ''
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </>
            )}

            {view === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => { setView('forgot'); setError(''); setSuccess(''); }}
                  className="text-xs font-black text-blue-600 dark:text-blue-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 mt-4"
            >
              {loading ? 'Đang xử lý...' : (
                view === 'login' ? 'Đăng nhập ngay' : 
                view === 'signup' ? 'Tạo tài khoản' : 'Gửi mã khôi phục'
              )}
            </button>
          </form>

          {view === 'forgot' && (
            <button 
              onClick={() => { setView('login'); setError(''); setSuccess(''); }}
              className="w-full mt-6 flex items-center justify-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors"
            >
              <MdArrowBack size={18} />
              Quay lại
            </button>
          )}

          {view !== 'forgot' && (
            <>
              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-slate-900 px-6 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">Hoặc tiếp tục với</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
              >
                <FaGoogle className="text-blue-500" size={20} />
                Google Account
              </button>

              <p className="text-center mt-10 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {view === 'login' ? 'Bạn mới sử dụng?' : 'Đã có tài khoản?'}
                <button
                  onClick={() => {
                    setView(view === 'login' ? 'signup' : 'login');
                    setError('');
                    setSuccess('');
                  }}
                  className="ml-3 text-blue-600 dark:text-blue-400 font-black hover:underline"
                >
                  {view === 'login' ? 'Đăng ký' : 'Đăng nhập'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
