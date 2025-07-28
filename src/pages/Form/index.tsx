import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { StarRating } from '../../components/StarRating';

interface Location {
  lat: number | null;
  lng: number | null;
}

interface FormState {
  isNewPartner: string;
  selectedPartnerId: string;
  partnerName: string;
  partnerLastName: string;
  partnerInstagram: string;
  partnerNickname: string;
  hasPlan: string;
  planType: string;
  planDetails: string;
  planIsNow: boolean;
  planDate: string;
  planTime: string;
  planLocation: Location;
  isAtPlanLocation: string;
  hasEncounter: string;
  encounterStartDate: string;
  encounterStartTime: string;
  encounterEndDate: string;
  encounterEndTime: string;
  encounterRating: number;
  encounterWouldRepeat: boolean;
  encounterMemorable: boolean;
  encounterComment: string;
  isAtEncounterLocation: string;
  encounterLocation: Location;
  encounterInitiative: string;
}

export function Form() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const apiBase = import.meta.env.VITE_API_URL || '';

  const [token, setToken] = useState<string | null>(null);
  const [names, setNames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'pareja' | 'plan' | 'encuentro'>('pareja');

  const [formState, setFormState] = useState<FormState>({
    isNewPartner: '',
    selectedPartnerId: '',
    partnerName: '',
    partnerLastName: '',
    partnerInstagram: '',
    partnerNickname: '',
    hasPlan: '',
    planType: '',
    planDetails: '',
    planIsNow: true,
    planDate: '',
    planTime: '',
    planLocation: { lat: null, lng: null },
    isAtPlanLocation: '',
    hasEncounter: '',
    encounterStartDate: '',
    encounterStartTime: '',
    encounterEndDate: '',
    encounterEndTime: '',
    encounterRating: 0,
    encounterWouldRepeat: false,
    encounterMemorable: false,
    encounterComment: '',
    isAtEncounterLocation: '',
    encounterLocation: { lat: null, lng: null },
    encounterInitiative: '',
  });

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

  function handleLoginSuccess(resp: any) {
    if (resp.credential) {
      verifyToken(resp.credential);
    }
  }

  function updateState<K extends keyof FormState>(key: K, val: FormState[K]) {
    setFormState((s) => ({ ...s, [key]: val }));
  }

  function handleNext() {
    if (activeTab === 'pareja') setActiveTab('plan');
    else if (activeTab === 'plan') setActiveTab('encuentro');
  }

  function handlePrev() {
    if (activeTab === 'encuentro') setActiveTab('plan');
    else if (activeTab === 'plan') setActiveTab('pareja');
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    console.log('submit', formState);
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
      <div class="home" style={{ textAlign: 'left' }}>
        <h1>Formulario</h1>
        {names.length > 0 && (
          <ul>
            {names.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
        <form onSubmit={handleSubmit}>
          {activeTab === 'pareja' && (
            <section>
              <h2>Información de la Pareja</h2>
              <div>
                <label>
                  <input
                    type="radio"
                    name="isNewPartner"
                    value="yes"
                    checked={formState.isNewPartner === 'yes'}
                    onChange={() => updateState('isNewPartner', 'yes')}
                  />
                  Nueva pareja
                </label>
                <label>
                  <input
                    type="radio"
                    name="isNewPartner"
                    value="no"
                    checked={formState.isNewPartner === 'no'}
                    onChange={() => updateState('isNewPartner', 'no')}
                  />
                  Ya registrada
                </label>
              </div>
              {formState.isNewPartner === 'no' && names.length > 0 && (
                <select
                  value={formState.selectedPartnerId}
                  onChange={(e) => updateState('selectedPartnerId', (e.target as HTMLSelectElement).value)}
                >
                  <option value="">Selecciona</option>
                  {names.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              )}
              {formState.isNewPartner === 'yes' && (
                <div>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={formState.partnerName}
                    onChange={(e) => updateState('partnerName', (e.target as HTMLInputElement).value)}
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={formState.partnerLastName}
                    onChange={(e) => updateState('partnerLastName', (e.target as HTMLInputElement).value)}
                  />
                </div>
              )}
              <button type="button" onClick={handleNext}>
                Siguiente
              </button>
            </section>
          )}

          {activeTab === 'plan' && (
            <section>
              <h2>Información del Plan</h2>
              <div>
                <label>
                  <input
                    type="radio"
                    name="hasPlan"
                    value="yes"
                    checked={formState.hasPlan === 'yes'}
                    onChange={() => updateState('hasPlan', 'yes')}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="hasPlan"
                    value="no"
                    checked={formState.hasPlan === 'no'}
                    onChange={() => updateState('hasPlan', 'no')}
                  />
                  No
                </label>
              </div>
              {formState.hasPlan === 'yes' && (
                <div>
                  <select value={formState.planType} onChange={(e) => updateState('planType', (e.target as HTMLSelectElement).value)}>
                    <option value="">Tipo de plan</option>
                    <option value="comer">Comer</option>
                    <option value="bailar">Bailar</option>
                    <option value="pola">Pola</option>
                    <option value="netflix">Netflix</option>
                    <option value="ver-partido">Ver partido</option>
                    <option value="estudiar">Estudiar</option>
                    <option value="de-momento">De momento</option>
                  </select>
                  <textarea
                    placeholder="Detalles"
                    value={formState.planDetails}
                    onChange={(e) => updateState('planDetails', (e.target as HTMLTextAreaElement).value)}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={formState.planIsNow}
                      onChange={(e) => updateState('planIsNow', (e.target as HTMLInputElement).checked)}
                    />
                    El plan es ahora
                  </label>
                  {!formState.planIsNow && (
                    <div>
                      <input
                        type="date"
                        value={formState.planDate}
                        onChange={(e) => updateState('planDate', (e.target as HTMLInputElement).value)}
                      />
                      <input
                        type="time"
                        value={formState.planTime}
                        onChange={(e) => updateState('planTime', (e.target as HTMLInputElement).value)}
                      />
                    </div>
                  )}
                </div>
              )}
              <div>
                <button type="button" onClick={handlePrev}>
                  Anterior
                </button>
                <button type="button" onClick={handleNext}>
                  Siguiente
                </button>
              </div>
            </section>
          )}

          {activeTab === 'encuentro' && (
            <section>
              <h2>Información del Encuentro</h2>
              <div>
                <label>
                  <input
                    type="radio"
                    name="hasEncounter"
                    value="yes"
                    checked={formState.hasEncounter === 'yes'}
                    onChange={() => updateState('hasEncounter', 'yes')}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="hasEncounter"
                    value="no"
                    checked={formState.hasEncounter === 'no'}
                    onChange={() => updateState('hasEncounter', 'no')}
                  />
                  No
                </label>
              </div>
              {formState.hasEncounter === 'yes' && (
                <div>
                  <div>
                    <input
                      type="date"
                      value={formState.encounterStartDate}
                      onChange={(e) => updateState('encounterStartDate', (e.target as HTMLInputElement).value)}
                    />
                    <input
                      type="time"
                      value={formState.encounterStartTime}
                      onChange={(e) => updateState('encounterStartTime', (e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={formState.encounterEndDate}
                      onChange={(e) => updateState('encounterEndDate', (e.target as HTMLInputElement).value)}
                    />
                    <input
                      type="time"
                      value={formState.encounterEndTime}
                      onChange={(e) => updateState('encounterEndTime', (e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <StarRating value={formState.encounterRating} onChange={(v) => updateState('encounterRating', v)} />
                  <label>
                    <input
                      type="checkbox"
                      checked={formState.encounterWouldRepeat}
                      onChange={(e) => updateState('encounterWouldRepeat', (e.target as HTMLInputElement).checked)}
                    />
                    Repetiría
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formState.encounterMemorable}
                      onChange={(e) => updateState('encounterMemorable', (e.target as HTMLInputElement).checked)}
                    />
                    Memorable
                  </label>
                  <textarea
                    placeholder="Comentario"
                    value={formState.encounterComment}
                    onChange={(e) => updateState('encounterComment', (e.target as HTMLTextAreaElement).value)}
                  />
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="encounterInitiative"
                        value="gol"
                        checked={formState.encounterInitiative === 'gol'}
                        onChange={() => updateState('encounterInitiative', 'gol')}
                      />
                      Gol
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="encounterInitiative"
                        value="asistencia"
                        checked={formState.encounterInitiative === 'asistencia'}
                        onChange={() => updateState('encounterInitiative', 'asistencia')}
                      />
                      Asistencia
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="encounterInitiative"
                        value="auto-gol"
                        checked={formState.encounterInitiative === 'auto-gol'}
                        onChange={() => updateState('encounterInitiative', 'auto-gol')}
                      />
                      Auto Gol
                    </label>
                  </div>
                </div>
              )}
              <div>
                <button type="button" onClick={handlePrev}>
                  Anterior
                </button>
                <button type="submit">Enviar</button>
              </div>
            </section>
          )}
        </form>
      </div>
    </GoogleOAuthProvider>
  );
}
