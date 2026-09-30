import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Campaign, Channel, Customer } from '@/types/database';
import Layout from '@/components/Layout';
import type { PageKey } from '@/components/Sidebar';
import { Send, Plus, Calendar, Users, Loader2, MessageSquare, Clock, Check, X, Trash2 } from 'lucide-react';

interface Props {
  onNavigate: (page: PageKey) => void;
}

export default function CampaignsPage({ onNavigate }: Props) {
  const { user, merchant } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<Channel>('sms');
  const [scheduledAt, setScheduledAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [{ data: campaignsData }, { data: customersData }] = await Promise.all([
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
      ]);
      setCampaigns((campaignsData as Campaign[]) || []);
      setCustomers((customersData as Customer[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleCreate = async () => {
    setError(null);
    if (!name.trim() || !message.trim()) {
      setError('Le nom et le message sont requis.');
      return;
    }
    setSaving(true);

    const recipientCount = customers.length;
    const status = scheduledAt ? 'scheduled' : 'draft';

    const { data, error: insertError } = await supabase
      .from('campaigns')
      .insert({
        name: name.trim(),
        message: message.trim(),
        channel,
        status,
        recipient_count: recipientCount,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    setCampaigns((prev) => [data as Campaign, ...prev]);
    setShowForm(false);
    setName('');
    setMessage('');
    setChannel('sms');
    setScheduledAt('');
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('campaigns').delete().eq('id', id);
    if (error) {
      console.error(error.message);
      return;
    }
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const messagePreview = message || 'Votre message apparaîtra ici...';
  const charCount = message.length;
  const smsSegments = Math.max(1, Math.ceil(charCount / 160));

  return (
    <Layout
      current="campaigns"
      onNavigate={onNavigate}
      title="Campagnes SMS"
      subtitle="Rédigez et programmez vos envois SMS ou WhatsApp."
      actions={
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Nouvelle campagne
        </button>
      }
    >
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{campaigns.length}</p>
            <p className="text-xs text-slate-500">Campagnes totales</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{customers.length}</p>
            <p className="text-xs text-slate-500">Clients enregistrés</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{merchant?.sms_credits ?? 0}</p>
            <p className="text-xs text-slate-500">Crédits SMS restants</p>
          </div>
        </div>
      </div>

      {/* Campaigns list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse h-24" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <Send className="w-7 h-7 text-slate-300" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Aucune campagne pour le moment</h3>
          <p className="text-sm text-slate-500 mb-4">
            Créez votre première campagne pour envoyer des SMS à vos clients.
          </p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Créer une campagne
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="card p-5 hover:shadow-soft transition-shadow group">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{campaign.message}</p>
                  <div className="flex items-center gap-5 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {campaign.recipient_count} destinataires
                    </span>
                    <span className="flex items-center gap-1.5 capitalize">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {campaign.channel}
                    </span>
                    {campaign.scheduled_at && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(campaign.scheduled_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                    {campaign.sent_at && (
                      <span className="flex items-center gap-1.5 text-success-600">
                        <Check className="w-3.5 h-3.5" />
                        Envoyée {new Date(campaign.sent_at).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-400 hover:text-error-600 hover:bg-error-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create campaign modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowForm(false)}
        >
          <div
            className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Nouvelle campagne</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nom de la campagne
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Promotion de la semaine"
                  className="input"
                />
              </div>

              {/* Channel */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Canal d'envoi
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['sms', 'whatsapp'] as Channel[]).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setChannel(ch)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                        channel === ch
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        channel === ch ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {ch === 'sms' ? <MessageSquare className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold capitalize text-slate-900">{ch === 'sms' ? 'SMS' : 'WhatsApp'}</p>
                        <p className="text-xs text-slate-500">{ch === 'sms' ? '160 car./segment' : 'Illimité'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Bonjour, c'est [Nom du commerce] ! Profitez de -20% sur tout le magasin ce week-end..."
                  rows={4}
                  className="input resize-none"
                />
                <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                  <span>{charCount} caractères</span>
                  <span>{smsSegments} SMS / destinataire</span>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Programmer l'envoi (optionnel)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="input"
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  Laissez vide pour enregistrer comme brouillon.
                </p>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Aperçu du message
                </label>
                <div className="rounded-2xl bg-slate-900 p-4">
                  <div className="max-w-[75%] rounded-2xl rounded-tl-md bg-primary-600 px-4 py-2.5">
                    <p className="text-sm text-white whitespace-pre-wrap">{messagePreview}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Maintenant
                  </p>
                </div>
              </div>

              {/* Recipients info */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {customers.length} destinataires
                  </p>
                  <p className="text-xs text-slate-500">
                    {customers.length * smsSegments} SMS seront débités de vos crédits
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-error-50 border border-error-200 px-4 py-3 text-sm text-error-700">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="btn btn-secondary">
                  Annuler
                </button>
                <button onClick={handleCreate} className="btn btn-primary" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {scheduledAt ? 'Programmer' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    scheduled: 'bg-primary-50 text-primary-700',
    sent: 'bg-success-50 text-success-700',
    failed: 'bg-error-50 text-error-700',
  };
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    scheduled: 'Programmée',
    sent: 'Envoyée',
    failed: 'Échec',
  };
  return <span className={`badge ${styles[status] || styles.draft}`}>{labels[status] || status}</span>;
}
