import { useState, useEffect } from 'react';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const STORAGE_KEY = 'orders';

const initOrders: Order[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 },
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15',
  },
];

export default function useOrderModel() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    setOrders(data ? JSON.parse(data) : initOrders);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (o: Order) => setOrders(prev => [...prev, o]);

  const updateStatus = (id: string, status: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o)),
    );
  };

  return { orders, addOrder, updateStatus };
}
