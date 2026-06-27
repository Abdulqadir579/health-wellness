"use client";

import { useEffect } from "react";
import { store, CART_STORAGE_KEY } from "./store";
import { Provider } from "react-redux";
import React from "react";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Persist the cart to localStorage whenever it changes.
    const unsubscribe = store.subscribe(() => {
      try {
        const items = store.getState().cartReducer.items;
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore storage write failures (e.g. private mode / quota).
      }
    });

    return unsubscribe;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
