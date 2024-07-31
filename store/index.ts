import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import combinedReducer from "./reducer";
import storage from "redux-persist/lib/storage";
import thunk from 'redux-thunk'; // Import Redux Thunk

const config = {
  key: "rootx",
  storage,
  whitelist: [
    "delivery",
    "payment",
    "personal",
    "product",
    "payload",
    "page",
    "msisdn",
    "register",
    "uuid"
  ]
}

const persistedReducer = persistReducer(config, combinedReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
    return [...middleware, thunk]; // Apply Redux Thunk middleware
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>

const persistor = persistStore(store);

export { store, persistor };
