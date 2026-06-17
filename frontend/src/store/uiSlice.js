import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { searchFiltersOpen: false, mapView: false, theme: 'light' },
  reducers: {
    toggleSearchFilters: (s) => { s.searchFiltersOpen = !s.searchFiltersOpen; },
    toggleMapView:       (s) => { s.mapView = !s.mapView; },
    setTheme:            (s, a) => { s.theme = a.payload; },
  },
});

export const { toggleSearchFilters, toggleMapView, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
