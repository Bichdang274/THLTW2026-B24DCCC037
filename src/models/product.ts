import { useState, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const STORAGE_KEY = 'products';

const initData: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

export default function useProductModel() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    setProducts(data ? JSON.parse(data) : initData);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(i => (i.id === p.id ? p : i)));
  };

  const changeQuantity = (id: number, delta: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, quantity: p.quantity + delta } : p,
      ),
    );
  };

  return { products, updateProduct, changeQuantity };
}
