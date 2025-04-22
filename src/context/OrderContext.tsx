import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  shipping_address: string;
  payment_method: string;
  items: [];
  total_price: number;
  shipping_price: number;
  tax_price: number;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (order: Omit<Order, 'id'>) => Promise<void>;
//   updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
//   removeItem: (productId: string) => Promise<void>;
//   clearCart: () => Promise<void>;
//   syncCart: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
//   const [items, setItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { user } = useAuth();

//   // Load cart from localStorage on initial load
//   useEffect(() => {
//     const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
//     if (storedCart) {
//       try {
//         setItems(JSON.parse(storedCart));
//       } catch (err) {
//         console.error('Failed to parse cart from localStorage', err);
//         localStorage.removeItem(LOCAL_STORAGE_KEY);
//       }
//     }
//   }, []);

//   // Sync with backend when user logs in
//   useEffect(() => {
//     if (user) {
//       syncCart();
//     }
//   }, [user]);

//   // Save to localStorage whenever cart changes
//   useEffect(() => {
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
//   }, [items]);

//   const syncCart = async () => {
//     if (!user) return;

//     try {
//       setLoading(true);
//       setError(null);

//       // First, send the local cart to the server
//       if (items.length > 0) {
//         await axios.post('http://localhost:3001/api/cart/sync', { items }, { withCredentials: true });
//       }

//       // Then fetch the latest cart from the server
//       const response = await axios.get('http://localhost:3001/api/cart', { withCredentials: true });
//       setItems(response.data.items);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to sync cart');
//       console.error('Cart sync error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addItem = async (item: Omit<CartItem, 'id'>) => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Check if item already exists in cart
//       const existingItemIndex = items.findIndex((i) => i.productId === item.productId);

//       if (existingItemIndex >= 0) {
//         // Update quantity if item exists
//         const updatedItems = [...items];
//         updatedItems[existingItemIndex].quantity += item.quantity;
//         setItems(updatedItems);
//       } else {
//         // Add new item
//         const newItem = { ...item, id: `local-${Date.now()}` };
//         setItems([...items, newItem]);
//       }

//       // If user is logged in, sync with server
//       if (user) {
//         await axios.post('http://localhost:3001/api/cart/add', item, { withCredentials: true });
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to add item to cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateItemQuantity = async (productId: string, quantity: number) => {
//     try {
//       setLoading(true);
//       setError(null);

//       if (quantity <= 0) {
//         return removeItem(productId);
//       }

//       const updatedItems = items.map((item) =>
//         item.productId === productId ? { ...item, quantity } : item
//       );
//       setItems(updatedItems);

//       // If user is logged in, sync with server
//       if (user) {
//         await axios.put(`http://localhost:3001/api/cart/update/${productId}`, { quantity }, { withCredentials: true });
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to update item quantity');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeItem = async (productId: string) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const updatedItems = items.filter((item) => item.productId !== productId);
//       setItems(updatedItems);

//       // If user is logged in, sync with server
//       if (user) {
//         await axios.delete(`http://localhost:3001/api/cart/remove/${productId}`, { withCredentials: true });
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to remove item from cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearCart = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       setItems([]);

//       // If user is logged in, sync with server
//       if (user) {
//         await axios.delete('http://localhost:3001/api/cart/clear', { withCredentials: true });
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to clear cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate totals
//   const totalItems = items.reduce((total, item) => total + item.quantity, 0);
//   const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

//   const value = {
//     items,
//     totalItems,
//     totalPrice,
//     loading,
//     error,
//     addItem,
//     updateItemQuantity,
//     removeItem,
//     clearCart,
//     syncCart,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };


// export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [order, setOrder] = useState<Order | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
  
//     const fetchUserOrder = async () => {
//       try {
//         setLoading(true);   
//         const response = await axios.get('/api/auth/me', { withCredentials: true });
//         setOrder(response.data.user);
//       } catch (err) {
//         setOrder(null);
//         // Silent fail on initial load
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     useEffect(() => {
//         fetchUserOrder();
//     }, []);
// }
