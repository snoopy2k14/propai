import { configureStore } from '@reduxjs/toolkit';
import authReducer  from './authSlice';
import savedReducer from './savedSlice';
import uiReducer    from './uiSlice';

export default configureStore({
  reducer: { auth: authReducer, saved: savedReducer, ui: uiReducer },
  middleware: (g) => g({ serializableCheck: false }),
});
