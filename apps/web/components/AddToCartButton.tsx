"use client";

import { useState } from "react";
import { addToCart } from "../lib/cart";

export default function AddToCartButton({ productId }: { productId: number }) {
  const [done, setDone] = useState(false);

  return (
    <button
      onClick={() => {
        addToCart(productId);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
      style={{ marginTop: 12 }}
    >
      {done ? "追加しました" : "カートに追加"}
    </button>
  );
}
