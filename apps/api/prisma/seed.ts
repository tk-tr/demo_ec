import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Classic T-shirt",
      description: "Comfortable cotton shirt for daily use.",
      price: 2500,
      stock: 50,
    },
    {
      name: "City Cap",
      description: "Lightweight cap with adjustable strap.",
      price: 1800,
      stock: 40,
    },
    {
      name: "Canvas Tote Bag",
      description: "Reusable tote for shopping and travel.",
      price: 3200,
      stock: 30,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(product) + 1 },
      update: product,
      create: product,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
