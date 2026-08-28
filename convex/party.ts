import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new party pack reservation
export const reservePack = mutation({
  args: {
    childName: v.string(),
    ageTurning: v.number(),
    numberOfKids: v.number(),
    theme: v.string(),
    items: v.array(v.string()),
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

    const reservationId = await ctx.db.insert("party_reservations", {
      userId: user._id,
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

// Get user's party pack reservations
export const getMyPacks = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
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
