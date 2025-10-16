// store/cartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  _id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Add item to cart
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i._id === item._id);

        if (existingItem) {
          // Increment quantity if item exists
          set({
            items: items.map((i) =>
              i._id === item._id
                ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                : i
            ),
          });
        } else {
          // Add new item
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }
      },

      // Remove item from cart
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item._id !== productId),
        });
      },

      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item._id === productId
              ? { ...item, quantity: Math.min(quantity, item.stock) }
              : item
          ),
        });
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [] });
      },

      // Calculate total price
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      // Calculate total items count
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "shodaigram-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
