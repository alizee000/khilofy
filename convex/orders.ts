import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all orders for the authenticated user, populated with rentals and party packs
export const getMyOrders = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
      
    if (!user) return [];

    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();

    // Sort by creation time (newest first)
    orders.sort((a, b) => b._creationTime - a._creationTime);

    // Populate each order with its items
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        // Fetch rentals for this order
        const rentals = await ctx.db
          .query("rentals")
          .filter((q) => q.eq(q.field("orderId"), order._id))
          .collect();

        // Populate toys for the rentals
        const rentalsWithToys = await Promise.all(
          rentals.map(async (rental) => {
            const toy = await ctx.db.get(rental.toyId);
            return { ...rental, toy };
          })
        );

        // Fetch party packs for this order
        const partyPacks = await ctx.db
          .query("party_reservations")
          .withIndex("by_order", (q) => q.eq("orderId", order._id))
          .collect();

        return {
          ...order,
          rentals: rentalsWithToys,
          partyPacks: partyPacks,
        };
      })
    );

    return populatedOrders;
  },
});
