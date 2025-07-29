import { useState, useEffect } from 'preact/hooks';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

interface MultiStepFormProps {
  names: string[];
}

function MultiStepForm({ names }: MultiStepFormProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    isNewPartner: 'yes',
    selectedPartner: '',
    partnerName: '',
    partnerLastName: '',
    partnerInstagram: '',
    partnerNickname: '',
    hasPlan: 'no',
    planType: '',
    planDetails: '',
    hasEncounter: 'no',
    encounterComment: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const next = () => setStep(s => Math.min(s + 1, 2));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <button type="button" disabled={step === 0} onClick={() => setStep(0)}>Pareja</button>
        <button type="button" disabled={step < 1} onClick={() => setStep(1)}>Plan</button>
        <button type="button" disabled={step < 2} onClick={() => setStep(2)}>Encuentro</button>
      </div>

      {step === 0 && (
        <div>
          <p>¿Es una pareja nueva?</p>
          <label><input type="radio" name="isNewPartner" value="yes" checked={form.isNewPartner==='yes'} onChange={() => handleChange('isNewPartner','yes')} /> Sí</label>
          <label><input type="radio" name="isNewPartner" value="no" checked={form.isNewPartner==='no'} onChange={() => handleChange('isNewPartner','no')} /> No</label>
          {form.isNewPartner === 'no' ? (
            <select value={form.selectedPartner} onChange={e => handleChange('selectedPartner', (e.target as HTMLSelectElement).value)}>
              <option value="">Seleccione una pareja</option>
              {names.map(n => <option value={n} key={n}>{n}</option>)}
            </select>
          ) : (
            <div>
              <input type="text" placeholder="Nombre" value={form.partnerName} onChange={e => handleChange('partnerName', (e.target as HTMLInputElement).value)} />
              <input type="text" placeholder="Apellido" value={form.partnerLastName} onChange={e => handleChange('partnerLastName', (e.target as HTMLInputElement).value)} />
              <input type="text" placeholder="Instagram" value={form.partnerInstagram} onChange={e => handleChange('partnerInstagram', (e.target as HTMLInputElement).value)} />
              <input type="text" placeholder="Apodo" value={form.partnerNickname} onChange={e => handleChange('partnerNickname', (e.target as HTMLInputElement).value)} />
            </div>
          )}
          <div style={{ marginTop: '1rem' }}>
            <button type="button" onClick={next}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <p>¿Hubo un plan?</p>
          <label><input type="radio" name="hasPlan" value="yes" checked={form.hasPlan==='yes'} onChange={() => handleChange('hasPlan','yes')} /> Sí</label>
          <label><input type="radio" name="hasPlan" value="no" checked={form.hasPlan==='no'} onChange={() => handleChange('hasPlan','no')} /> No</label>
          {form.hasPlan === 'yes' && (
            <div>
              <input type="text" placeholder="Tipo de plan" value={form.planType} onChange={e => handleChange('planType', (e.target as HTMLInputElement).value)} />
              <textarea placeholder="Detalles" value={form.planDetails} onChange={e => handleChange('planDetails', (e.target as HTMLTextAreaElement).value)} />
            </div>
          )}
          <div style={{ marginTop: '1rem' }}>
            <button type="button" onClick={prev}>Anterior</button>
            <button type="button" onClick={next}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p>¿Hubo un encuentro?</p>
          <label><input type="radio" name="hasEncounter" value="yes" checked={form.hasEncounter==='yes'} onChange={() => handleChange('hasEncounter','yes')} /> Sí</label>
          <label><input type="radio" name="hasEncounter" value="no" checked={form.hasEncounter==='no'} onChange={() => handleChange('hasEncounter','no')} /> No</label>
          {form.hasEncounter === 'yes' && (
            <div>
              <textarea placeholder="Comentario" value={form.encounterComment} onChange={e => handleChange('encounterComment', (e.target as HTMLTextAreaElement).value)} />
            </div>
          )}
          <div style={{ marginTop: '1rem' }}>
            <button type="button" onClick={prev}>Anterior</button>
            <button type="submit">Enviar</button>
          </div>
        </div>
      )}
    </form>
  );
}

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
        <MultiStepForm names={names} />
      </div>
    </GoogleOAuthProvider>
  );
}
