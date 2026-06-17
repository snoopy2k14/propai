import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../utils/api';
import toast from 'react-hot-toast';

export const login = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try { const { data } = await authApi.login(creds); localStorage.setItem('propai_token', data.token); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});

export const register = createAsyncThunk('auth/register', async (d, { rejectWithValue }) => {
  try { const { data } = await authApi.register(d); localStorage.setItem('propai_token', data.token); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed'); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('propai_token'), loading: false, error: null },
  reducers: {
    logout: (s) => { s.user = null; s.token = null; localStorage.removeItem('propai_token'); toast.success('Signed out'); },
    clearError: (s) => { s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(login.pending,    (s) => { s.loading = true; s.error = null; })
     .addCase(login.fulfilled,  (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; toast.success(`Welcome back!`); })
     .addCase(login.rejected,   (s, a) => { s.loading = false; s.error = a.payload; toast.error(a.payload); })
     .addCase(register.fulfilled,(s,a) => { s.user = a.payload.user; s.token = a.payload.token; toast.success('Welcome to PropAI!'); });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
