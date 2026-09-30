import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import type { PageKey } from '@/components/Sidebar';
import { Store, Star, Send, Save, Loader2, Check, AlertCircle, Plus, Trash2, User, Phone } from 'lucide-react';
import type { Customer } from '@/types/database';

interface Props {
  onNavigate: (page: PageKey) => void;
}

export default function SettingsPage({ onNavigate }: Props) {
  const { merchant, user, refreshMerchant, signOut } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Customer management
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [addingCustomer, setAddingCustomer] = useState(false);

  useEffect(() => {
    if (merchant) {
      setBusinessName(merchant.business_name);
      setGooglePlaceId(merchant.google_place_id || '');
    }
  }, [merchant]);

  useEffect(() => {
    if (!user) return;
    const fetchCustomers = async () => {
      const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      setCustomers((data as Customer[]) || []);
    };
    fetchCustomers();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error: updateError } = await supabase
      .from('merchants')
      .update({
        business_name: businessName,
        google_place_id: googlePlaceId || null,
      })
      .eq('user_id', user!.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      await refreshMerchant();
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleAddCustomer = async () => {
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) return;
    setAddingCustomer(true);
    const { data, error } = await supabase
      .from('customers')
      .insert({ name: newCustomerName.trim(), phone: newCustomerPhone.trim() })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setCustomers((prev) => [data as Customer, ...prev]);
      setNewCustomerName('');
      setNewCustomerPhone('');
    }
    setAddingCustomer(false);
  };

  const handleDeleteCustomer = async (id: string) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) {
      console.error(error.message);
      return;
    }
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <Layout
      current="settings"
      onNavigate={onNavigate}
      title="Paramètres"
      subtitle="Gérez votre profil commerce et vos contacts clients."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — settings forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business profile */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Profil du commerce</h2>
                <p className="text-xs text-slate-500">Informations affichées publiquement</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nom du commerce
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Google Place ID
                </label>
                <input
                  type="text"
                  value={googlePlaceId}
                  onChange={(e) => setGooglePlaceId(e.target.value)}
                  placeholder="ChIJ..."
                  className="input"
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  Connectez votre fiche Google pour synchroniser automatiquement vos avis.
                </p>
              </div>

              {error && (
                <div className="rounded-xl bg-error-50 border border-error-200 px-4 py-3 text-sm text-error-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saved ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saved ? 'Enregistré' : 'Enregistrer'}
                </button>
                {saved && (
                  <span className="text-sm text-success-600 font-medium animate-fade-in">
                    Modifications enregistrées
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Customer contacts */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Contacts clients</h2>
                <p className="text-xs text-slate-500">{customers.length} contact(s) enregistré(s)</p>
              </div>
            </div>

            {/* Add customer */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Nom du client"
                    className="input pl-11"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="input pl-11"
                    />
                  </div>
                  <button
                    onClick={handleAddCustomer}
                    className="btn btn-primary shrink-0"
                    disabled={addingCustomer || !newCustomerName.trim() || !newCustomerPhone.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Customer list */}
            {customers.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                Aucun client enregistré. Ajoutez vos premiers contacts ci-dessus.
              </p>
            ) : (
              <div className="space-y-2">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-semibold text-sm shrink-0">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.phone}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-400 hover:text-error-600 hover:bg-error-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — account summary */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4">Compte</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Email</span>
                <span className="text-sm font-semibold text-slate-900 truncate max-w-[60%]">
                  {user?.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Membre depuis</span>
                <span className="text-sm font-semibold text-slate-900">
                  {merchant ? new Date(merchant.created_at).toLocaleDateString('fr-FR') : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Note Google</h2>
                <p className="text-xs text-slate-500">Synchronisée depuis Google</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {(merchant?.average_rating ?? 0).toFixed(1)}
              </span>
              <span className="text-lg text-slate-400 font-semibold">/5</span>
              <div className="flex items-center gap-0.5 ml-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(merchant?.average_rating ?? 0)
                        ? 'fill-accent-400 text-accent-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Crédits SMS</h2>
                <p className="text-xs text-slate-500">Solde disponible</p>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{merchant?.sms_credits ?? 0}</p>
            <p className="text-xs text-slate-400 mt-1">SMS restants à envoyer</p>
          </div>

          <button
            onClick={signOut}
            className="btn btn-danger w-full"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </Layout>
  );
}
