/*
# Relio - Core schema for local merchant SaaS

Creates the tables needed for the Relio MVP: merchant profiles, customer reviews,
SMS/WhatsApp campaigns, and customers. All tables are owner-scoped to the
authenticated merchant via user_id and protected with row-level security.

1. New Tables
- `merchants` — one row per merchant account (extends auth.users). Holds business
  name, Google Place ID, average Google rating, and SMS credit balance.
- `customers` — a merchant's customer contacts (name + phone), used as recipients
  for campaigns.
- `reviews` — customer reviews pulled from Google (or entered manually). Stores
  author, rating, text, Google review ID, and an optional merchant reply.
- `campaigns` — SMS/WhatsApp campaigns a merchant writes and schedules. Stores
  message body, channel (sms/whatsapp), status, scheduled time, and recipient count.

2. Security
- RLS enabled on every table.
- Owner-scoped CRUD policies (select/insert/update/delete) for `authenticated`
  using `auth.uid() = user_id`.
- `merchants.user_id` defaults to `auth.uid()` so inserts that omit it succeed.
- `customers.user_id`, `reviews.user_id`, `campaigns.user_id` all default to
  `auth.uid()` for the same reason.
*/

-- merchants: one row per merchant account
CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  google_place_id text,
  average_rating numeric(2,1) DEFAULT 0,
  sms_credits integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_merchants" ON merchants;
CREATE POLICY "select_own_merchants" ON merchants FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_merchants" ON merchants;
CREATE POLICY "insert_own_merchants" ON merchants FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_merchants" ON merchants;
CREATE POLICY "update_own_merchants" ON merchants FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_merchants" ON merchants;
CREATE POLICY "delete_own_merchants" ON merchants FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- customers: merchant's customer contacts
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_customers" ON customers;
CREATE POLICY "select_own_customers" ON customers FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_customers" ON customers;
CREATE POLICY "insert_own_customers" ON customers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_customers" ON customers;
CREATE POLICY "update_own_customers" ON customers FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_customers" ON customers;
CREATE POLICY "delete_own_customers" ON customers FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- reviews: customer reviews (Google + manual)
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL DEFAULT '',
  google_review_id text,
  reply text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reviews" ON reviews;
CREATE POLICY "select_own_reviews" ON reviews FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reviews" ON reviews;
CREATE POLICY "insert_own_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reviews" ON reviews;
CREATE POLICY "update_own_reviews" ON reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reviews" ON reviews;
CREATE POLICY "delete_own_reviews" ON reviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- campaigns: SMS/WhatsApp campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  message text NOT NULL,
  channel text NOT NULL DEFAULT 'sms' CHECK (channel IN ('sms','whatsapp')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','sent','failed')),
  recipient_count integer NOT NULL DEFAULT 0,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_campaigns" ON campaigns;
CREATE POLICY "select_own_campaigns" ON campaigns FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_campaigns" ON campaigns;
CREATE POLICY "insert_own_campaigns" ON campaigns FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_campaigns" ON campaigns;
CREATE POLICY "update_own_campaigns" ON campaigns FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_campaigns" ON campaigns;
CREATE POLICY "delete_own_campaigns" ON campaigns FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled_at ON campaigns(user_id, scheduled_at);
