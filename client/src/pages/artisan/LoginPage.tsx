import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Alert from '@/components/common/Alert';
import { Wrench } from 'lucide-react';
import { isEmail, isRequired } from '@/utils/validation';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!isRequired(email)) errors.email = 'Email obligatoire';
    else if (!isEmail(email)) errors.email = 'Email invalide';

    if (!isRequired(password)) errors.password = 'Mot de passe obligatoire';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate('/artisan/dashboard');
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-doctolib-blue-light to-white flex flex-col justify-center py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Wrench className="h-12 w-12 text-doctolib-blue" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Espace Artisan
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connectez-vous pour gérer vos rendez-vous
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card>
          {error && (
            <div className="mb-6">
              <Alert
                type="error"
                message={error}
                dismissible
                onDismiss={() => setError(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFormErrors((s) => ({ ...s, email: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-lg ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="artisan@example.com"
              />
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormErrors((s) => ({ ...s, password: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-lg ${
                  formErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>

          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-doctolib-blue">
              ← Retour à l'accueil
            </Link>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
            <p className="font-semibold">Comptes de test :</p>
            <p>jean.dupont@example.com</p>
            <p>marie.laurent@example.com</p>
            <p className="mt-1">Mot de passe : password123</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
