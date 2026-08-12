import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/axios';

export default function Home() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, login, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    const clean = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(clean)) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/auth/send-otp', { phone: clean });
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      setError('Enter the OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/verify-otp', {
        phone: phone.replace(/\D/g, ''),
        otp
      });
      if (data.success) login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick Match → backend finds other players or fills bots (Indian names)
  const handleQuickMatch = () => {
    navigate('/game/quick?mode=match');
  };

  return (
    <div className="p-6 bg-gray-900 rounded-3xl border border-gray-800 w-[90%] max-w-md text-center shadow-2xl">
      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ludoRed via-ludoYellow to-ludoGreen mb-6">
        LUDO PRO
      </h1>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      {!user ? (
        step === 1 ? (
          <div className="space-y-4">
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-gray-800 border border-gray-700 px-4 py-3 rounded-xl text-white outline-none"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-ludoGreen py-3 rounded-xl font-bold text-white active:scale-95 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Get OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">OTP sent to +91{phone}</p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-gray-800 border border-gray-700 px-4 py-3 rounded-xl text-center text-xl tracking-widest text-white outline-none"
            />
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-ludoBlue py-3 rounded-xl font-bold text-white active:scale-95 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              onClick={() => { setStep(1); setError(''); setOtp(''); }}
              className="w-full text-xs text-gray-500 underline"
            >
              Change number
            </button>
          </div>
        )
      ) : (
        <div className="space-y-4">
          <p className="text-gray-300">
            Hi <span className="font-bold text-ludoYellow">{user.username || user.phone}</span>
          </p>
          <button
            onClick={handleQuickMatch}
            className="w-full bg-gradient-to-r from-ludoGreen to-ludoBlue py-4 rounded-2xl font-black text-lg text-white shadow-xl active:scale-95 transition"
          >
            PLAY NOW 🎮
          </button>
          <p className="text-xs text-gray-500">
            Match with other players. If none are online, you still get a full table.
          </p>
          <button onClick={logout} className="text-xs text-gray-500 underline">
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
