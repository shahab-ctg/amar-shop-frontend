
import { configureStore } from "@reduxjs/toolkit";
import { catalogApi } from "@/services/catalog.api";
import { promocardApi } from "./promocardApi";


export const store = configureStore({
  reducer: {
    [catalogApi.reducerPath]: catalogApi.reducer,
    [promocardApi.reducerPath]: promocardApi.reducer,
   
  },
  middleware: (getDefault) =>
    getDefault().concat(catalogApi.middleware, promocardApi.middleware),
});

// exported types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
