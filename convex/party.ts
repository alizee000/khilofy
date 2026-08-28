import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new party pack reservation
export const reservePack = mutation({
  args: {
    clerkId: v.string(),
    childName: v.string(),
    ageTurning: v.number(),
    numberOfKids: v.number(),
    theme: v.string(),
    items: v.array(v.string()),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {

    let dbUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
      
    if (!dbUser) {
      const newUserId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        name: "User",
        email: "",
        avatarUrl: "",
        toyLoopScore: 0,
        earnings: 0,
      });
      const insertedUser = await ctx.db.get(newUserId);
      if (!insertedUser) throw new Error("Failed to create user");
      dbUser = insertedUser;
    }

    // Generate Order
    const orderId = await ctx.db.insert("orders", {
      userId: dbUser._id,
      paymentMethod: "cod", // Party packs currently default to cod
      totalAmount: args.totalAmount,
      status: "placed",
    });

    const reservationId = await ctx.db.insert("party_reservations", {
      userId: dbUser._id,
      orderId: orderId,
      childName: args.childName,
      ageTurning: args.ageTurning,
      numberOfKids: args.numberOfKids,
      theme: args.theme,
      items: args.items,
      totalAmount: args.totalAmount,
      status: "reserved", // Initial status
    });

    return reservationId;
  },
});

// Get user's party pack reservations (auth bypassed)
export const getMyPacks = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
      
    if (!user) return [];

    const packs = await ctx.db
      .query("party_reservations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Sort by creation time, newest first
    return packs.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Admin ONLY: update pack status
export const updatePackStatus = mutation({
  args: {
    packId: v.id("party_reservations"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real app, verify admin role here
    await ctx.db.patch(args.packId, { status: args.status });
  },
});
