import { useState, useEffect } from 'preact/hooks';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export function Form() {
  const [token, setToken] = useState<string | null>(null);
  const [names, setNames] = useState<string[]>([]);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiBase = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      verifyToken(stored);
    }
  }, []);

  async function verifyToken(t: string) {
    try {
      const res = await fetch(`${apiBase}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(t);
        setNames(Array.isArray(data.names) ? data.names : []);
        localStorage.setItem('token', t);
      } else {
        setToken(null);
      }
    } catch (err) {
      console.error(err);
      setToken(null);
    }
  }

  function handleLoginSuccess(credentialResponse: any) {
    if (credentialResponse.credential) {
      verifyToken(credentialResponse.credential);
    }
  }

  if (!token) {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <div class="home">
          <GoogleLogin onSuccess={handleLoginSuccess} useOneTap />
        </div>
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div class="home">
        <h1>Formulario</h1>
        {names.length > 0 && (
          <ul>
            {names.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
        <form>
          <label>
            Nombre
            <input type="text" name="nombre" />
          </label>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
}
