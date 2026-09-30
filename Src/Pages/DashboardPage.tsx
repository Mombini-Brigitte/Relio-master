import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Review, Campaign } from '@/types/database';
import Layout from '@/components/Layout';
import type { PageKey } from '@/components/Sidebar';
import { Star, Send, TrendingUp, MessageSquare, ArrowUpRight, Calendar, Clock, Users } from 'lucide-react';

interface Props {
  onNavigate: (page: PageKey) => void;
}

export default function DashboardPage({ onNavigate }: Props) {
  const { merchant, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [{ data: reviewsData }, { data: campaignsData }] = await Promise.all([
        supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      setReviews((reviewsData as Review[]) || []);
      setCampaigns((campaignsData as Campaign[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const avgRating = merchant?.average_rating || 0;
  const smsSent = campaigns.filter((c) => c.status === 'sent').reduce((sum, c) => sum + c.recipient_count, 0);
  const newReviews = reviews.length;

  const stats = [
    {
      label: 'Note moyenne Google',
      value: avgRating > 0 ? avgRating.toFixed(1) : '—',
      suffix: '/5',
      icon: Star,
      color: 'bg-accent-50 text-accent-600',
      trend: avgRating > 0 ? `${reviews.length} avis` : 'Connectez Google',
    },
    {
      label: 'SMS envoyés',
      value: smsSent.toString(),
      icon: Send,
      color: 'bg-primary-50 text-primary-600',
      trend: `${campaigns.length} campagnes`,
    },
    {
      label: 'Nouveaux avis',
      value: newReviews.toString(),
      icon: MessageSquare,
      color: 'bg-success-50 text-success-600',
      trend: '30 derniers jours',
    },
    {
      label: 'Crédits SMS',
      value: (merchant?.sms_credits ?? 0).toString(),
      icon: TrendingUp,
      color: 'bg-slate-100 text-slate-700',
      trend: 'Restants',
    },
  ];

  return (
    <Layout
      current="dashboard"
      onNavigate={onNavigate}
      title="Dashboard"
      subtitle={`Bonjour, ${merchant?.business_name || 'commerçant'} — voici votre activité.`}
    >
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5 hover:shadow-soft transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">
              {stat.value}
              {stat.suffix && <span className="text-lg text-slate-400 font-semibold">{stat.suffix}</span>}
            </p>
            <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
            <p className="text-xs text-slate-400 mt-2">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent reviews */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900">Derniers avis</h2>
            <button
              onClick={() => onNavigate('reviews')}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Tout voir
            </button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500">Aucun avis pour le moment.</p>
              <p className="text-xs text-slate-400 mt-1">Connectez votre fiche Google pour les importer.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="flex gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-semibold text-sm shrink-0">
                    {review.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{review.author_name}</p>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= review.rating
                                ? 'fill-accent-400 text-accent-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{review.text}</p>
                    {!review.reply && (
                      <span className="badge bg-warning-50 text-warning-700 mt-2">Sans réponse</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent campaigns */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900">Campagnes récentes</h2>
            <button
              onClick={() => onNavigate('campaigns')}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Tout voir
            </button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse h-16 bg-slate-50 rounded-xl" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500">Aucune campagne pour le moment.</p>
              <button
                onClick={() => onNavigate('campaigns')}
                className="btn btn-primary mt-4 text-xs px-3 py-2"
              >
                Créer une campagne
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{campaign.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{campaign.message}</p>
                    </div>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {campaign.recipient_count} dest.
                    </span>
                    {campaign.scheduled_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(campaign.scheduled_at).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    <span className="flex items-center gap-1 capitalize">
                      <Clock className="w-3 h-3" />
                      {campaign.channel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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
