'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Mode = 'login' | 'register';

type Role = 'admin' | 'operador';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<Role>('operador');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Error al iniciar sesión');
        } else {
          router.replace('/dashboard');
          router.refresh();
        }
      } else {
        const registerRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ nombre, email, password, rol })
        });
        const registerData = await registerRes.json();
        if (!registerRes.ok) {
          setError(registerData.error || 'Error al crear la cuenta');
        } else {
          setNotice('Cuenta creada con éxito. Inicia sesión con tus credenciales.');
          setMode('login');
          setPassword('');
        }
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(circle_at_10%_20%,#fafb8a_0,#f6fbc2_22%,#edf9f5_50%,#e5f3ff_100%)]">
      <div className="card w-full max-w-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-mint/25 to-primary/15 pointer-events-none" />
        <div className="relative flex flex-col items-center text-center mb-6 space-y-2">
          <div className="w-20 h-20 relative">
            <Image src="/kiwi-logo.svg" alt="Logo Kiwi System" className="object-contain" fill priority sizes="80px" />
          </div>
          <h1 className="text-3xl font-semibold tracking-wide text-secondary">Kiwi System</h1>
          <p className="text-sm text-slate-600 max-w-sm">
            {isLogin ? 'Accede con tu cuenta' : 'Crea una cuenta para empezar'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-sm text-secondary/80">Nombre</label>
              <input
                className="input"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-secondary/80">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-secondary/80">Contraseña</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Usa al menos 8 caracteres con mayúsculas, minúsculas, números y un símbolo especial.
              </p>
            )}
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm text-secondary/80">Rol</label>
              <select
                className="input"
                value={rol}
                onChange={(e) => setRol(e.target.value as Role)}
              >
                <option value="operador">Operador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          )}
          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-md p-2">{error}</p>}
          {notice && <p className="text-emerald-700 text-sm bg-emerald-50 border border-emerald-100 rounded-md p-2">{notice}</p>}
          <button className="btn-primary w-full" disabled={loading} type="submit">
            {loading ? (isLogin ? 'Entrando...' : 'Creando cuenta...') : isLogin ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <div className="relative mt-6 text-center text-sm text-secondary/80">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            type="button"
            className="text-primary-deep hover:underline font-semibold"
            onClick={() => {
              setMode(isLogin ? 'register' : 'login');
              setError('');
            }}
          >
            {isLogin ? 'Crear una cuenta' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
