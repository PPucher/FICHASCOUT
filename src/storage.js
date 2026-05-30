// Almacenamiento local con datos separados por usuario
// Cada usuario tiene sus propios datos aislados

const getUserId = () => window._currentUserId || 'guest'

const storage = {
  get: (key) => {
    try {
      const value = localStorage.getItem(`fichascout:${getUserId()}:${key}`)
      return value ? { value } : null
    } catch (e) {
      return null
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(`fichascout:${getUserId()}:${key}`, value)
      return { value }
    } catch (e) {
      return null
    }
  },
  delete: (key) => {
    try {
      localStorage.removeItem(`fichascout:${getUserId()}:${key}`)
      return { deleted: true }
    } catch (e) {
      return null
    }
  },
  list: (prefix = '') => {
    try {
      const userId = getUserId()
      const keys = Object.keys(localStorage)
        .filter(k => k.startsWith(`fichascout:${userId}:${prefix}`))
        .map(k => k.replace(`fichascout:${userId}:`, ''))
      return { keys }
    } catch (e) {
      return { keys: [] }
    }
  }
}

window.storage = storage
export default storage
