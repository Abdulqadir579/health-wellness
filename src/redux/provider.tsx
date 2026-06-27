"use client";

import { useEffect, useRef } from "react";
import { store } from "./store";
import { Provider } from "react-redux";
import { hydrateCart } from "./features/cart-slice";
import React from "react";

const CART_STORAGE_KEY = "cart_items";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Guard so we don't write to storage before the initial load completes.
  const hydrated = useRef(false);

  useEffect(() => {
    // Load the saved cart once on mount (client-only, avoids SSR mismatch).
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items)) {
          store.dispatch(hydrateCart(items));
        }
      }
    } catch {
      // Ignore corrupt/unavailable storage.
    }

    hydrated.current = true;

    // Persist the cart whenever it changes.
    const unsubscribe = store.subscribe(() => {
      if (!hydrated.current) return;
      try {
        const items = store.getState().cartReducer.items;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore storage write failures (e.g. private mode quota).
      }
    });

    return unsubscribe;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
