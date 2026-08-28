import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get user's active rentals (joined with toy data)
export const getMyRentals = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    const rentals = await ctx.db
      .query("rentals")
      .withIndex("by_renter", (q) => q.eq("renterId", user._id))
      .collect();

    // Join with toys
    const rentalsWithToys = await Promise.all(
      rentals.map(async (rental) => {
        const toy = await ctx.db.get(rental.toyId);
        return { ...rental, toy };
      })
    );

    return rentalsWithToys;
  },
});

export const checkout = mutation({
  args: {
    toyIds: v.array(v.id("toys")),
    paymentMethod: v.string(),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Create Order
    const orderId = await ctx.db.insert("orders", {
      userId: user._id,
      paymentMethod: args.paymentMethod,
      totalAmount: args.totalAmount,
      status: "placed",
    });

    // Create Rentals
    for (const toyId of args.toyIds) {
      await ctx.db.insert("rentals", {
        toyId,
        renterId: user._id,
        orderId,
        status: "active",
      });
      // Optionally mark toy as unavailable here:
      // await ctx.db.patch(toyId, { isAvailable: false });
    }

    return orderId;
  },
});
