export type Channel = 'sms' | 'whatsapp';
export type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'failed';

export interface Merchant {
  id: string;
  user_id: string;
  business_name: string;
  google_place_id: string | null;
  average_rating: number;
  sms_credits: number;
  created_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  author_name: string;
  rating: number;
  text: string;
  google_review_id: string | null;
  reply: string | null;
  created_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  message: string;
  channel: Channel;
  status: CampaignStatus;
  recipient_count: number;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}
