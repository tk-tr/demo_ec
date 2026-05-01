import type { CartItem, Product } from "./types";

const BROWSER_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
const SERVER_API_BASE = process.env.API_BASE_URL ?? BROWSER_API_BASE;

function getApiBase() {
  return typeof window === "undefined" ? SERVER_API_BASE : BROWSER_API_BASE;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${getApiBase()}/api/products`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`${getApiBase()}/api/products/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
}

export async function createOrder(input: {
  customerName: string;
  customerEmail: string;
  items: CartItem[];
}) {
  const response = await fetch(`${getApiBase()}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.error ?? "Failed to create order");
  }
  return response.json();
}

export async function adminRequest(
  path: string,
  auth: { user: string; pass: string },
  options: RequestInit = {},
) {
  const token = btoa(`${auth.user}:${auth.pass}`);
  const response = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
      ...(options.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error ?? "Request failed");
  }
  return response.json();
}
