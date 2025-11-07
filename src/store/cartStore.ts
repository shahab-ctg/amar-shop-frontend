/* store/cartStore.ts */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  _id: string;
  title: string;
  slug?: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((i) => i._id === newItem._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i._id === newItem._id
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            };
          } else {
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i._id !== id) }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i._id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((s, it) => s + it.price * it.quantity, 0);
      },

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((s, it) => s + it.quantity, 0);
      },
    }),
    { name: "cart-storage" }
  )
);
