import { createClient } from '@supabase/supabase-js';

// Remplacer ces valeurs par vos identifiants Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas définies');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Properties
export const getProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    reportError(error);
    throw new Error(`Error fetching properties: ${error.message}`);
  }
};

export const getProperty = async (id) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    reportError(error);
    throw new Error(`Error fetching property: ${error.message}`);
  }
};

export const createProperty = async (propertyData) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    reportError(error);
    throw new Error(`Error creating property: ${error.message}`);
  }
};

export const updateProperty = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    reportError(error);
    throw new Error(`Error updating property: ${error.message}`);
  }
};

export const deleteProperty = async (id) => {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    reportError(error);
    throw new Error(`Error deleting property: ${error.message}`);
  }
};

// Tenants
export const getTenants = async () => {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    reportError(error);
    throw new Error(`Error fetching tenants: ${error.message}`);
  }
};

export const createTenant = async (tenantData) => {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .insert([tenantData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    reportError(error);
    throw new Error(`Error creating tenant: ${error.message}`);
  }
};

// Documents
export const uploadDocument = async (file, path) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    return { path: filePath, url: publicUrl };
  } catch (error) {
    reportError(error);
    throw new Error(`Error uploading document: ${error.message}`);
  }
};

export const deleteDocument = async (path) => {
  try {
    const { error } = await supabase.storage
      .from('documents')
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    reportError(error);
    throw new Error(`Error deleting document: ${error.message}`);
  }
};

// Profile
export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    reportError(error);
    throw new Error(`Error fetching profile: ${error.message}`);
  }
};

export const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    reportError(error);
    throw new Error(`Error updating profile: ${error.message}`);
  }
};
