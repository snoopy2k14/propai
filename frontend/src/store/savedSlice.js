import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const savedSlice = createSlice({
  name: 'saved',
  initialState: { saved: JSON.parse(localStorage.getItem('propai_saved') || '[]') },
  reducers: {
    toggleSave: (s, a) => {
      const i = s.saved.indexOf(a.payload);
      if (i === -1) { s.saved.push(a.payload); toast.success('Property saved!'); }
      else { s.saved.splice(i, 1); toast('Removed from saved'); }
      localStorage.setItem('propai_saved', JSON.stringify(s.saved));
    },
  },
});

export const { toggleSave } = savedSlice.actions;
export default savedSlice.reducer;
