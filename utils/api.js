// API utilities using global supabase client
const api = {
  auth: {
    signIn: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        return data;
      } catch (error) {
        reportError(error);
        throw error;
      }
    },

    signUp: async (email, password, metadata) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata
          }
        });
        if (error) throw error;
        return data;
      } catch (error) {
        reportError(error);
        throw error;
      }
    },

    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        reportError(error);
        throw error;
      }
    }
  },

  properties: {
    list: async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        reportError(error);
        throw error;
      }
    },

    get: async (id) => {
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
        throw error;
      }
    },

    create: async (propertyData) => {
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
        throw error;
      }
    },

    update: async (id, updates) => {
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
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const { error } = await supabase
          .from('properties')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        reportError(error);
        throw error;
      }
    }
  },

  tenants: {
    list: async () => {
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        reportError(error);
        throw error;
      }
    },

    create: async (tenantData) => {
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
        throw error;
      }
    }
  },

  documents: {
    upload: async (file, path) => {
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
        throw error;
      }
    },

    delete: async (path) => {
      try {
        const { error } = await supabase.storage
          .from('documents')
          .remove([path]);

        if (error) throw error;
      } catch (error) {
        reportError(error);
        throw error;
      }
    }
  }
};
