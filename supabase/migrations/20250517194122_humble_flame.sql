/*
  # Cosmetics Store Schema

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text)
      - phone_number (text)
      - full_name (text)
      - created_at (timestamp)
    
    - products
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (numeric)
      - image_url (text)
      - category (text)
      - stock (integer)
      - is_featured (boolean)
      - is_popular (boolean)
      - discount_percentage (numeric)
      - created_at (timestamp)
    
    - cart_items
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - product_id (uuid, foreign key)
      - quantity (integer)
      - created_at (timestamp)
    
    - orders
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - total_amount (numeric)
      - status (text)
      - created_at (timestamp)
    
    - order_items
      - id (uuid, primary key)
      - order_id (uuid, foreign key)
      - product_id (uuid, foreign key)
      - quantity (integer)
      - price_at_time (numeric)
      - created_at (timestamp)
    
    - support_tickets
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - subject (text)
      - message (text)
      - status (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create tables
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  phone_number text,
  full_name text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  category text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_popular boolean DEFAULT false,
  discount_percentage numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  price_at_time numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage products" ON products
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM users WHERE email IN ('admin@example.com')
  ));

CREATE POLICY "Users can manage their cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their support tickets" ON support_tickets
  FOR ALL USING (auth.uid() = user_id);