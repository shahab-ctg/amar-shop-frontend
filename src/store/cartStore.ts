import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  _id: string;
  title: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  // ✅ Consistent method names
  addItem: (item: CartItem) => void;
  addToCart: (item: CartItem) => void; // Alternative name for compatibility
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

      // ✅ Main add item method
      addItem: (newItem: CartItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item._id === newItem._id
          );

          if (existingItem) {
            // Update quantity if item exists
            const updatedItems = state.items.map((item) =>
              item._id === newItem._id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            );
            return { items: updatedItems };
          } else {
            // Add new item to cart
            return { items: [...state.items, newItem] };
          }
        });
      },

      // ✅ Alternative method name for compatibility
      addToCart: (item: CartItem) => {
        get().addItem(item);
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== id),
        }));
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item._id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
