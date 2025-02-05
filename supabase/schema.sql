-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    account_type TEXT CHECK (account_type IN ('individual', 'professional')),
    company_name TEXT,
    siret TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create properties table
CREATE TABLE properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('appartement', 'maison', 'commerce', 'garage')),
    address TEXT,
    price DECIMAL(12,2),
    rent_amount DECIMAL(10,2),
    surface DECIMAL(8,2),
    rooms INTEGER,
    status TEXT CHECK (status IN ('disponible', 'loué', 'en travaux')),
    charges JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tenants table
CREATE TABLE tenants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    property_id UUID REFERENCES properties ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    rent_amount DECIMAL(10,2),
    lease_start DATE,
    lease_end DATE,
    deposit DECIMAL(10,2),
    payment_method TEXT,
    guarantor JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    property_id UUID REFERENCES properties ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('contract', 'invoice', 'tax', 'insurance', 'other')),
    category TEXT,
    size INTEGER,
    path TEXT,
    url TEXT,
    extracted_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    property_id UUID REFERENCES properties ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants ON DELETE CASCADE,
    type TEXT CHECK (type IN ('revenu', 'depense')),
    category TEXT,
    amount DECIMAL(10,2),
    date DATE,
    accounting_month DATE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Users can view own properties" 
    ON properties FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create properties" 
    ON properties FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties" 
    ON properties FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own properties" 
    ON properties FOR DELETE 
    USING (auth.uid() = user_id);

-- Tenants policies
CREATE POLICY "Users can view own tenants" 
    ON tenants FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create tenants" 
    ON tenants FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tenants" 
    ON tenants FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tenants" 
    ON tenants FOR DELETE 
    USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view own documents" 
    ON documents FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create documents" 
    ON documents FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" 
    ON documents FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" 
    ON documents FOR DELETE 
    USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" 
    ON transactions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions" 
    ON transactions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" 
    ON transactions FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" 
    ON transactions FOR DELETE 
    USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
