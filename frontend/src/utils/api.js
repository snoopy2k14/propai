import axios from 'axios'
import toast from 'react-hot-toast'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({ baseURL: `${BASE}/api/v1`, timeout: 15000 })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('propai_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('propai_token')
    window.location.href = '/login'
  } else if (err.response?.status >= 500) {
    toast.error('Something went wrong. Please try again.')
  }
  return Promise.reject(err)
})

export const propertyApi = {
  search:      (p) => api.get('/properties/search', { params: p }),
  getById:     (id) => api.get(`/properties/${id}`),
  getFeatured: () => api.get('/properties/featured'),
  getStats:    () => api.get('/properties/stats'),
  create:      (d) => api.post('/properties', d),
  update:      (id, d) => api.put(`/properties/${id}`, d),
  save:        (id) => api.post(`/properties/${id}/save`),
}

export const chatApi = {
  chat: (sessionId, message) => api.post('/chat/message', { sessionId, message }),
}

export const authApi = {
  login:    (d) => api.post('/auth/login', d),
  register: (d) => api.post('/auth/register', d),
  me:       () => api.get('/users/me'),
}

export const analyticsApi = {
  market:      (area, period) => api.get('/analytics/market', { params: { area, period } }),
  priceIndex:  (postcode) => api.get(`/analytics/price-index/${postcode}`),
  rentalYield: (postcode, price) => api.get('/analytics/rental-yield', { params: { postcode, price } }),
}

export const enquiryApi = {
  submit: (d) => api.post('/enquiries', d),
  my:     () => api.get('/enquiries/my'),
}

export default api
