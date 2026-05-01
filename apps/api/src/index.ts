import newrelic from "newrelic";
import { serve } from "@hono/node-server";
import { Prisma, PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { cors } from "hono/cors";

const prisma = new PrismaClient();
const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3001"],
  }),
);

app.get("/", (c) => {
  return c.json({
    message: "EC API is running",
    health: "/healthz",
  });
});

app.get("/healthz", (c) => c.json({ ok: true }));

app.get("/api/products", async (c) => {
  const products = await newrelic.startSegment("Prisma/Product/findMany", true, () =>
    prisma.product.findMany({ orderBy: { id: "asc" } })
  );
  return c.json(products);
});

app.get("/api/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) {
    return c.json({ error: "Invalid product id" }, 400);
  }

  const product = await newrelic.startSegment("Prisma/Product/findUnique", true, () =>
    prisma.product.findUnique({ where: { id } })
  );
  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }
  return c.json(product);
});

type OrderRequest = {
  customerName: string;
  customerEmail: string;
  items: Array<{ productId: number; quantity: number }>;
};

type JsonObject = Record<string, unknown>;

app.post("/api/orders", async (c) => {
  const body = (await c.req.json()) as Partial<OrderRequest>;
  if (
    !body.customerName ||
    !body.customerEmail ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return c.json({ error: "Invalid order payload" }, 400);
  }

  const productIds = body.items.map((item) => item.productId);
  const products = (await newrelic.startSegment("Prisma/Product/findMany", true, () =>
    prisma.product.findMany({ where: { id: { in: productIds } } })
  )) as Array<{ id: number; name: string; price: number; stock: number }>;
  const productMap = new Map<number, (typeof products)[number]>(
    products.map((product) => [product.id, product]),
  );

  let total = 0;
  for (const item of body.items) {
    const product = productMap.get(item.productId);
    if (!product || item.quantity <= 0) {
      return c.json({ error: "Invalid items" }, 400);
    }
    if (product.stock < item.quantity) {
      return c.json({ error: `Insufficient stock for ${product.name}` }, 400);
    }
    total += product.price * item.quantity;
  }

  const order = await newrelic.startSegment("Prisma/Order/transaction", true, () =>
    prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const createdOrder = await tx.order.create({
      data: {
        customerName: body.customerName!,
        customerEmail: body.customerEmail!,
        total,
        paymentStatus: "mock_paid",
        items: {
          create: body.items!.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: product.price,
            };
          }),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    for (const item of body.items!) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

      return createdOrder;
    })
  );

  return c.json(
    {
      message: "Mock payment succeeded",
      order,
    },
    201,
  );
});

const requireBasicAuth = async (c: any, next: any) => {
  const expectedUser = process.env.BASIC_AUTH_USER ?? "admin";
  const expectedPass = process.env.BASIC_AUTH_PASS ?? "password";
  const authorization = c.req.header("Authorization");

  if (!authorization?.startsWith("Basic ")) {
    c.header("WWW-Authenticate", 'Basic realm="Admin"');
    return c.json({ error: "Authentication required" }, 401);
  }

  const [user, pass] = Buffer.from(authorization.slice(6), "base64")
    .toString("utf-8")
    .split(":");

  if (user !== expectedUser || pass !== expectedPass) {
    return c.json({ error: "Invalid credentials" }, 401);
  }
  await next();
};

const admin = new Hono();
admin.use("*", requireBasicAuth);

admin.get("/products", async (c) => {
  const products = await newrelic.startSegment("Prisma/Product/findMany", true, () =>
    prisma.product.findMany({ orderBy: { id: "asc" } })
  );
  return c.json(products);
});

admin.post("/products", async (c) => {
  const body = (await c.req.json()) as JsonObject;
  const created = await newrelic.startSegment("Prisma/Product/create", true, () =>
    prisma.product.create({
      data: {
        name: String(body.name ?? ""),
        description: String(body.description ?? ""),
        price: Number(body.price ?? 0),
        stock: Number(body.stock ?? 0),
      },
    })
  );
  return c.json(created, 201);
});

admin.put("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = (await c.req.json()) as JsonObject;
  const updated = await newrelic.startSegment("Prisma/Product/update", true, () =>
    prisma.product.update({
      where: { id },
      data: {
        name: String(body.name ?? ""),
        description: String(body.description ?? ""),
        price: Number(body.price ?? 0),
        stock: Number(body.stock ?? 0),
      },
    })
  );
  return c.json(updated);
});

admin.delete("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await newrelic.startSegment("Prisma/Product/delete", true, () =>
    prisma.product.delete({ where: { id } })
  );
  return c.json({ ok: true });
});

admin.get("/orders", async (c) => {
  const orders = await newrelic.startSegment("Prisma/Order/findMany", true, () =>
    prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    })
  );
  return c.json(orders);
});

admin.patch("/orders/:id/status", async (c) => {
  const id = Number(c.req.param("id"));
  const body = (await c.req.json()) as JsonObject;
  const updated = await newrelic.startSegment("Prisma/Order/update", true, () =>
    prisma.order.update({
      where: { id },
      data: { status: String(body.status ?? "pending") },
    })
  );
  return c.json(updated);
});

app.route("/admin", admin);

const port = Number(process.env.PORT ?? 3000);
console.log(`API server is running at http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
