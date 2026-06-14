import React, { useState, useEffect } from 'react';
import { Mail, Shield, Phone, Key, HelpCircle, Check, Loader, UserMinus } from 'lucide-react';
import { UserRole } from '../types';
import GlassCard from './GlassCard';

interface AuthViewProps {
  onLogin: (email: string, pass: string, role: UserRole) => Promise<any>;
  onSignup: (name: string, email: string, phone: string, pass: string) => Promise<any>;
  onVerifyOtp: (email: string, otp: string) => Promise<any>;
  onNavigate: (page: string) => void;
}

export default function AuthView({ onLogin, onSignup, onVerifyOtp, onNavigate }: AuthViewProps) {
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('customer');

  // Signup states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);

  // OTP view trigger states
  const [showOtpView, setShowOtpView] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(59);
  const [otpTargetEmail, setOtpTargetEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Ticking countdown effect for verification resend
  useEffect(() => {
    let interval: any;
    if (showOtpView && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpView, otpTimer]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice('');
    setSuccessNotice('');
    setIsLoading(true);

    try {
      const result = await onLogin(loginEmail, loginPass, loginRole);
      setSuccessNotice(`Welcome back ${result.user.name}!`);
      setTimeout(() => {
        if (result.user.role === 'manager') onNavigate('manager');
        else onNavigate('dashboard');
      }, 1000);
    } catch (err: any) {
      setErrorNotice(err.message || 'Invalid email or password parameters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice('');
    setSuccessNotice('');

    if (!termsChecked) {
      setErrorNotice("Please accept the Dikshu's Cafe terms explicitly first");
      return;
    }

    setIsLoading(true);

    try {
      const result = await onSignup(signupName, signupEmail, signupPhone, signupPass);
      if (result.directLoggedIn && result.user) {
        setSuccessNotice(`Welcome ${result.user.name}! Your account has been registered successfully.`);
        setTimeout(() => {
          if (result.user.role === 'manager') onNavigate('manager');
          else onNavigate('dashboard');
        }, 1500);
      } else {
        setOtpTargetEmail(signupEmail);
        setOtpTimer(59);
        setShowOtpView(true);
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Registration constraints failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice('');
    setIsLoading(true);

    try {
      await onVerifyOtp(otpTargetEmail, otpCode);
      setSuccessNotice('Account verified successfully! Logging you in...');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1500);
    } catch (err: any) {
      setErrorNotice(err.message || 'Incorrect OTP or timed out. Feel free to use 1234');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (otpTimer === 0) {
      setOtpTimer(59);
      alert('Mock OTP resent! Please check simulated terminal. Key is: 1234');
    }
  };

  return (
    <div id="auth-lounge-view" className="bg-transparent min-h-screen pt-32 pb-24 font-sans text-cafe-smoky relative z-10">
      <div className="max-w-md mx-auto px-4">
        
        {/* Page Titles */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] uppercase font-bold text-cafe-bronze tracking-widest font-mono">
            / ENTRANCE SECURITY
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase text-cafe-charcoal font-sans tracking-tight">
            Dikshu's Cafe Lounge
          </h1>
          <p className="text-xs text-cafe-charcoal/60">Registered users unlock exclusive loyalty rewards multiplier coefficients.</p>
        </div>

        {/* Master Glass Form */}
        <GlassCard theme="light" className="p-8 relative" hoverEffect={false}>
          
          {/* Error Notices Block */}
          {errorNotice && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-xl font-bold font-mono">
              🚧 NOTICE: {errorNotice}
            </div>
          )}

          {/* Success Notices Block */}
          {successNotice && (
            <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs rounded-xl font-bold font-mono flex items-center space-x-1.5">
              <Check className="w-4.5 h-4.5 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {!showOtpView ? (
            <div>
              {/* Login signup tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-cafe-smoky/5 rounded-full border border-cafe-smoky/10 text-center text-xs mb-6 font-bold uppercase tracking-widest font-mono">
                <button
                  type="button"
                  onClick={() => { setAuthTab('login'); setErrorNotice(''); }}
                  className={`py-2 px-1 rounded-full cursor-pointer transition-all ${authTab === 'login' ? 'bg-cafe-smoky text-white' : 'text-cafe-charcoal/50 hover:text-cafe-smoky'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthTab('signup'); setErrorNotice(''); }}
                  className={`py-2 px-1 rounded-full cursor-pointer transition-all ${authTab === 'signup' ? 'bg-cafe-smoky text-white' : 'text-cafe-charcoal/50 hover:text-cafe-smoky'}`}
                >
                  Register
                </button>
              </div>

              {/* LOGIN VIEW PANEL */}
              {authTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  {/* Role Selector Chips */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Identity Classification</label>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <button
                        type="button"
                        onClick={() => setLoginRole('customer')}
                        className={`py-2 rounded-xl border font-bold transition-all ${
                          loginRole === 'customer'
                            ? 'bg-cafe-smoky/10 border-cafe-smoky text-cafe-smoky'
                            : 'bg-white border-[#deb887]/20 text-cafe-charcoal/40 hover:border-cafe-smoky/30'
                        }`}
                      >
                        Visitor Rewards
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginRole('manager')}
                        className={`py-2 rounded-xl border font-bold transition-all ${
                          loginRole === 'manager'
                            ? 'bg-cafe-smoky/10 border-cafe-smoky text-cafe-smoky'
                            : 'bg-white border-[#deb887]/20 text-cafe-charcoal/40 hover:border-cafe-smoky/30'
                        }`}
                      >
                        Manager Desk
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-cream" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-cafe-smoky outline-none"
                        placeholder="elena@cafevista.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-cafe-charcoal font-sans">Password Signature</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-cream" />
                      <input
                        type="password"
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-cafe-smoky outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>


                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-cafe-smoky hover:bg-cafe-gold text-white hover:text-cafe-smoky text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Establishing Tunnel...</span>
                    ) : (
                      <span>Step inside secure lounge</span>
                    )}
                  </button>

                </form>
              ) : (
                /* REGISTRATION SIGNUP VIEW PANEL */
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-cafe-charcoal font-sans">Full Name</label>
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none"
                      placeholder="Elena Rostova"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Email Address</label>
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none"
                        placeholder="elena@outlook.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-cafe-charcoal font-sans">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none"
                        placeholder="+44 7911 123"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Security Password</label>
                    <input
                      type="password"
                      required
                      value={signupPass}
                      onChange={(e) => setSignupPass(e.target.value)}
                      className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none"
                      placeholder="e.g. at least 6 characters"
                    />
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start space-x-2 pt-1 font-sans">
                    <input
                      id="termscheck"
                      type="checkbox"
                      checked={termsChecked}
                      onChange={(e) => setTermsChecked(e.target.checked)}
                      className="mt-0.5 rounded text-cafe-smoky border-[#deb887]/40 focus:ring-cafe-smoky cursor-pointer"
                    />
                    <label htmlFor="termscheck" className="text-[10px] text-cafe-charcoal/65 leading-tight select-none cursor-pointer">
                      I explicitly accept the <strong>Artisanal Sourcing pact</strong> of unhurried dining and agree to register.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-cafe-smoky hover:bg-cafe-gold text-white hover:text-cafe-smoky text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-md disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Creating Credentials Entry...</span>
                    ) : (
                      <span>Request verified lounge entry</span>
                    )}
                  </button>

                </form>
              )}
            </div>
          ) : (
            /* ================= OTP VERIFICATION PANE LAYOUT ================= */
            <form onSubmit={handleOtpVerifySubmit} className="space-y-6 text-center animate-scaleUp">
              
              <div className="w-14 h-14 bg-[#a38059]/15 border border-[#a38059]/35 text-[#a38059] rounded-full flex items-center justify-center mx-auto shadow-md">
                <Shield className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-lg font-bold uppercase text-cafe-charcoal">
                  Verify verification key
                </h3>
                <p className="text-xs text-cafe-charcoal/65 max-w-sm mx-auto leading-relaxed">
                  We have simulated transmitting an OTP pin key. Type code <span className="font-mono font-bold text-cafe-bronze bg-white px-1.5 py-0.5 border border-white/5 rounded">1234</span> to unlock immediately.
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-28 bg-white border border-[#deb887]/40 rounded-xl py-3 px-2 text-center text-lg font-mono font-bold font-mono tracking-[0.5em] text-cafe-smoky outline-none focus:border-cafe-smoky"
                  placeholder="0000"
                />
              </div>

              {/* Timer & Resend states */}
              <div className="text-[10px] text-cafe-charcoal/60 uppercase font-mono space-y-2">
                {otpTimer > 0 ? (
                  <p>OTP request expires in: <strong>00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</strong></p>
                ) : (
                  <div>
                    <span className="block leading-none">Session expired.</span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-cafe-bronze font-bold hover:underline mt-1"
                    >
                      Resend dynamic SMS key
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowOtpView(false); setErrorNotice(''); }}
                  className="flex-1 py-3 bg-white hover:bg-cafe-cream text-cafe-smoky border border-cafe-smoky/10 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Cancel signup
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-cafe-smoky hover:bg-cafe-gold text-white hover:text-cafe-smoky text-xs font-bold uppercase rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Verify code
                </button>
              </div>

            </form>
          )}

        </GlassCard>

      </div>
    </div>
  );
}
