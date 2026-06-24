-- Claude Travel Hub Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  user_type TEXT DEFAULT 'user' CHECK (user_type IN ('user', 'admin'))
);

-- Tour types/categories
CREATE TABLE IF NOT EXISTS tour_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  icon TEXT
);

-- Tours table
CREATE TABLE IF NOT EXISTS tours (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  country TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  image_url TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  rating DECIMAL(2, 1) DEFAULT 0,
  tour_type_id UUID REFERENCES tour_types(id),
  creator_id TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  provider_name TEXT,
  provider_link TEXT
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, tour_id)
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, tour_id)
);

-- News articles table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  author_id TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE
);

-- Feedback/contact form submissions
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Tour types policies (public read)
CREATE POLICY "Tour types are viewable by everyone" ON tour_types
  FOR SELECT USING (true);

-- Tours policies (public read)
CREATE POLICY "Tours are viewable by everyone" ON tours
  FOR SELECT USING (true);

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own cart" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can view own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist" ON wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist" ON wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- News policies (public read)
CREATE POLICY "Published news is viewable by everyone" ON news
  FOR SELECT USING (published = true);

-- Feedback policies
CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT WITH CHECK (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default tour types
INSERT INTO tour_types (name, icon) VALUES
  ('Beach & Resort', 'umbrella-beach'),
  ('Adventure', 'mountain'),
  ('Cultural', 'landmark'),
  ('City Break', 'building'),
  ('Cruise', 'ship'),
  ('Safari', 'binoculars')
ON CONFLICT DO NOTHING;

-- Insert sample tours (optional)
INSERT INTO tours (name, description, country, price, start_date, end_date, image_url, rating, tour_type_id, creator_id, featured) VALUES
  ('Tropical Paradise Bali', 'Experience the magic of Bali with pristine beaches, ancient temples, and lush rice terraces.', 'Indonesia', 1299, '2024-04-15', '2024-04-22', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 4.8, (SELECT id FROM tour_types WHERE name = 'Beach & Resort'), 'admin', true),
  ('Swiss Alps Adventure', 'Conquer the majestic Swiss Alps with guided hikes and breathtaking mountain views.', 'Switzerland', 2499, '2024-05-01', '2024-05-08', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800', 4.9, (SELECT id FROM tour_types WHERE name = 'Adventure'), 'admin', true),
  ('Ancient Rome Explorer', 'Walk through history in the Eternal City with visits to the Colosseum and Vatican.', 'Italy', 1899, '2024-04-20', '2024-04-27', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', 4.7, (SELECT id FROM tour_types WHERE name = 'Cultural'), 'admin', true)
ON CONFLICT DO NOTHING;

-- Insert sample news
INSERT INTO news (title, content, excerpt, image_url, author_id, published) VALUES
  ('Top 10 Destinations for 2024', 'Discover the most exciting travel destinations for 2024.', 'Discover the most exciting travel destinations for 2024.', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', 'admin', true),
  ('Travel Tips: How to Pack Light', 'Master the art of minimalist travel with our expert packing tips.', 'Master the art of minimalist travel with our expert packing tips.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'admin', true)
ON CONFLICT DO NOTHING;

-- Migration: Add provider details to tours table
-- Run this if the tours table already exists in your Supabase project
ALTER TABLE tours ADD COLUMN IF NOT EXISTS provider_name TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS provider_link TEXT;
