import type { Product, ProductsResponse, Category } from '../types';

const BASE_URL = 'https://dummyjson.com/products';

export async function fetchProducts(limit: number = 30, skip: number = 0): Promise<ProductsResponse> {
  const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function fetchProductsByCategory(category: string, limit: number = 30, skip: number = 0): Promise<ProductsResponse> {
  const response = await fetch(`${BASE_URL}/category/${category}?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error('Failed to fetch products by category');
  return response.json();
}

export async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}?limit=100`);
  if (!response.ok) throw new Error('Failed to fetch all products');
  const data = await response.json();
  return data.products;
}
