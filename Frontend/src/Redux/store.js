import { combineReducers, configureStore } from "@reduxjs/toolkit";

import productReducer from "./Slice/productSlice";
import { default as userReducer } from "./Slice/userSlice";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import createWebStorage from "redux-persist/es/storage/createWebStorage";

const storage = createWebStorage("local");

const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
});

// Persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
