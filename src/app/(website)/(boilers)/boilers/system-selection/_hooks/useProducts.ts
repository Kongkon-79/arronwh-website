"use client";

import { useQuery } from "@tanstack/react-query";

export interface ApiProductFeature {
  title: string;
  value: string;
}

export interface ApiProduct {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  badges: string[];
  images: string[];
  price: number;
  discountPrice: number;
  payablePrice: number;
  monthlyPrice: number;
  boilerAbility: string;
  boilerFeatures: ApiProductFeature[];
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  data: ApiProduct[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const json: ApiResponse = await res.json();
  return json.data;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}
