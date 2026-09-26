// components/ModalAutenticacion.jsx
"use client";

import { useState, useEffect } from 'react';
import { useModal } from '@/contexto/ContextoModal';
import { useAuth } from '@/contexto/ContextoAuth';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaSpinner, FaTimes } from 'react-icons/fa';

// Traduce los códigos de error de Firebase a mensajes legibles para el usuario
const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'Ese correo ya está registrado. Intenta iniciar sesión.',
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
  'auth/network-request-failed': 'Problema de conexión. Revisa tu internet e inténtalo de nuevo.',
};

function getAuthErrorMessage(err) {
  return AUTH_ERROR_MESSAGES[err?.code] || 'Ocurrió un error. Inténtalo de nuevo.';
}

// Input reutilizable con estilo 2026 (fondo gris que se aclara al enfocar, anillo cyan de marca)
const AuthInput = ({ label, id, type = 'text', value, onChange, required, minLength, toggle, showValue, onToggle }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={toggle ? (showValue ? 'text' : 'password') : type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className="block w-full border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent transition-colors"
      />
      {toggle && (
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showValue ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  </div>
);

export default function ModalAutenticacion() {
  const { modalActivo, closeModal, authTab, setAuthTab } = useModal();
  const { signInWithGoogle } = useAuth();

  const [view, setView] = useState('login-register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsSubmitting(false);
  }, [authTab, view]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setIsSubmitting(true);
    try {
      const [{ createUserWithEmailAndPassword, sendEmailVerification }, { doc, setDoc }, { auth, db }] = await Promise.all([
        import('firebase/auth'),
        import('firebase/firestore'),
        import('@/lib/firebaseClient'),
      ]);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: new Date(),
      });
      const { mirrorUserByEmail } = await import('@/lib/userIndex');
      await mirrorUserByEmail({ uid: userCredential.user.uid, name, email });
      toast.success('¡Cuenta creada! Revisa tu correo para verificarla, luego inicia sesión.', { duration: 5000 });
      setAuthTab('login');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const [{ signInWithEmailAndPassword }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('@/lib/firebaseClient'),
      ]);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('¡Bienvenido de nuevo!');
      closeModal();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const [{ sendPasswordResetEmail }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('@/lib/firebaseClient'),
      ]);
      await sendPasswordResetEmail(auth, email);
      toast.success('Enlace enviado. Revisa tu correo.');
      setView('login-register');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (modalActivo !== 'auth') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn" onClick={closeModal}>
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-cyan-700" />
        <button
          onClick={closeModal}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-10"
        >
          <FaTimes />
        </button>

        {view === 'login-register' && (
          <div className="p-6 sm:p-8 pt-8">
            {/* Selector de pestañas estilo píldora */}
            <div className="flex bg-gray-100 rounded-full p-1 mb-6">
              <button
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${authTab === 'login' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${authTab === 'register' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Registrarse
              </button>
            </div>

            {authTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <AuthInput label="Correo electrónico" id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <AuthInput label="Contraseña" id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} required toggle showValue={showPassword} onToggle={() => setShowPassword((v) => !v)} />

                <div className="text-right">
                  <button type="button" onClick={() => setView('reset-password')} className="text-sm text-cyan-700 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-cyan-700 text-white py-2.5 rounded-xl hover:bg-cyan-800 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" />}
                  {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                </button>

                <div className="relative text-center text-xs text-gray-400 py-1">
                  <span className="bg-white px-2 relative z-10">o continúa con</span>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200" />
                </div>

                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="w-full border border-gray-200 text-gray-700 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 font-semibold transition-colors"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Logo de Google" />
                  Entrar con Google
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <AuthInput label="Nombre completo *" id="register-name" value={name} onChange={(e) => setName(e.target.value)} required />
                <AuthInput label="Correo electrónico *" id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div>
                  <AuthInput label="Contraseña *" id="register-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} toggle showValue={showPassword} onToggle={() => setShowPassword((v) => !v)} />
                  <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres.</p>
                </div>
                <AuthInput label="Confirmar contraseña *" id="register-confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required toggle showValue={showConfirmPassword} onToggle={() => setShowConfirmPassword((v) => !v)} />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-cyan-700 text-white font-bold py-3 rounded-xl hover:bg-cyan-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" />}
                  {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
              </form>
            )}
          </div>
        )}

        {view === 'reset-password' && (
          <div className="p-6 sm:p-8 pt-8">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-1">Restablecer Contraseña</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Te enviaremos un enlace a tu correo.</p>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <AuthInput label="Correo electrónico" id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cyan-700 text-white py-2.5 rounded-xl hover:bg-cyan-800 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting && <FaSpinner className="animate-spin" />}
                {isSubmitting ? 'Enviando...' : 'Enviar Enlace'}
              </button>
              <button type="button" onClick={() => setView('login-register')} className="w-full mt-1 text-center text-sm text-gray-500 hover:underline">
                Volver a Iniciar Sesión
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}