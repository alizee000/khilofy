import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(), // Links to Clerk Auth
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    locationAddress: v.optional(v.string()),
    toyLoopScore: v.number(),
    earnings: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  toys: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    ageRange: v.optional(v.string()),
    targetGender: v.optional(v.string()),
    condition: v.optional(v.string()),
    isCleaned: v.boolean(),
    oneDayRate: v.number(),
    deposit: v.number(),
    images: v.array(v.string()),
    isAvailable: v.boolean(),
  }),

  orders: defineTable({
    userId: v.id("users"),
    paymentMethod: v.string(),
    totalAmount: v.number(),
    status: v.string(),
  }),

  rentals: defineTable({
    toyId: v.id("toys"),
    renterId: v.id("users"),
    orderId: v.optional(v.id("orders")),
    status: v.string(), // e.g. "active", "delivered", "returned"
  }).index("by_renter", ["renterId"])
    .index("by_toy", ["toyId"]),

  party_reservations: defineTable({
    userId: v.id("users"),
    orderId: v.optional(v.id("orders")),
    childName: v.string(),
    ageTurning: v.number(),
    numberOfKids: v.number(),
    theme: v.string(),
    items: v.array(v.string()),
    totalAmount: v.number(),
    status: v.string(), // "reserved", "delivered", "returned"
  }).index("by_user", ["userId"])
    .index("by_order", ["orderId"]),
});
