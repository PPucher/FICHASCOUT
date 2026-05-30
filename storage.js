// Adaptador de almacenamiento local
// Reemplaza window.storage de Claude con localStorage estándar del navegador
// En el futuro esto se conectará a Supabase para multi-usuario

const storage = {
  get: (key) => {
    try {
      const value = localStorage.getItem(`scout-latino:${key}`);
      return value ? { value } : null;
    } catch (e) {
      console.warn('storage.get error:', e);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(`scout-latino:${key}`, value);
      return { value };
    } catch (e) {
      console.warn('storage.set error:', e);
      return null;
    }
  },

  delete: (key) => {
    try {
      localStorage.removeItem(`scout-latino:${key}`);
      return { deleted: true };
    } catch (e) {
      return null;
    }
  },

  list: (prefix = '') => {
    try {
      const keys = Object.keys(localStorage)
        .filter(k => k.startsWith(`scout-latino:${prefix}`))
        .map(k => k.replace('scout-latino:', ''));
      return { keys };
    } catch (e) {
      return { keys: [] };
    }
  }
};

// Exponer globalmente para compatibilidad con el código existente
window.storage = storage;

export default storage;
