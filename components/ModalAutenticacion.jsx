// components/ModalAutenticacion.jsx
"use client";

import { useState, useEffect } from 'react';
import { useModal } from '@/contexto/ContextoModal';
// CAMBIO: Importamos el contexto de Auth para usar la función de Google
import { useAuth } from '@/contexto/ContextoAuth'; 
import { auth, db } from '@/lib/firebaseClient.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function ModalAutenticacion() {
  const { modalActivo, closeModal, authTab, setAuthTab } = useModal();
  // CAMBIO: Obtenemos la función para iniciar sesión con Google
  const { signInWithGoogle } = useAuth();
  
  const [view, setView] = useState('login-register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [authTab, view]);


  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        createdAt: new Date()
      });
      alert('¡Registro exitoso! Por favor, inicia sesión.');
      setAuthTab('login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('¡Inicio de sesión exitoso!');
      closeModal();
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  const handlePasswordReset = async (e) => {
      e.preventDefault();
      setError('');
      try {
          await sendPasswordResetEmail(auth, email);
          alert('Se ha enviado un enlace a tu correo para restablecer la contraseña.');
          setView('login-register');
      } catch (err) {
          setError(err.message);
      }
  };

  if (modalActivo !== 'auth') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn" onClick={closeModal}>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-md relative overflow-hidden transform transition-all duration-300 ease-out scale-100" onClick={(e) => e.stopPropagation()}>
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl z-10">×</button>
        
        <div className={view === 'login-register' ? '' : 'hidden'}>
          <div className="p-6">
            <div className="flex border-b mb-4">
              <button onClick={() => setAuthTab('login')} className={`tab-button flex-1 py-2 font-semibold text-center ${authTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Iniciar Sesión</button>
              <button onClick={() => setAuthTab('register')} className={`tab-button flex-1 py-2 font-semibold text-center ${authTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Registrarse</button>
            </div>
            
            <div className={authTab === 'login' ? '' : 'hidden'}>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                  <input type="email" id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="login-password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="auth-input pr-10" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <a href="#" onClick={(e) => { e.preventDefault(); setView('reset-password'); }} className="text-sm text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold">Ingresar</button>
                
                {/* --- CAMBIO: AQUÍ AÑADIMOS EL BOTÓN DE GOOGLE --- */}
                <button 
                  type="button" 
                  onClick={signInWithGoogle} 
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 font-semibold"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Logo de Google" />
                  Entrar con Google
                </button>
              </form>
            </div>
            {/* ... (El resto del formulario de registro no cambia) ... */}
            <div className={authTab === 'register' ? '' : 'hidden'}>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="register-name">Nombre completo *</label>
                        <input type="text" id="register-name" value={name} onChange={(e) => setName(e.target.value)} required className="auth-input"/>
                    </div>
                    <div>
                        <label htmlFor="register-email">Correo electrónico *</label>
                        <input type="email" id="register-email" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input"/>
                    </div>
                    <div>
                        <label htmlFor="register-password">Contraseña *</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="register-password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="auth-input pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="register-confirm-password">Confirmar Contraseña *</label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                id="register-confirm-password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                className="auth-input pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Crear Cuenta</button>
                </form>
            </div>
          </div>
        </div>
        
        {/* ... (El resto del modal de reseteo no cambia) ... */}
        <div className={view === 'reset-password' ? '' : 'hidden'}>
           <div className="p-6">
              <h3 className="text-xl font-bold text-center mb-4">Restablecer Contraseña</h3>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                      <label htmlFor="reset-email">Correo electrónico</label>
                      <input type="email" id="reset-email" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">Enviar Enlace</button>
                  <button type="button" onClick={() => setView('login-register')} className="w-full mt-2 text-center text-sm text-gray-600 hover:underline">Volver a Iniciar Sesión</button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}