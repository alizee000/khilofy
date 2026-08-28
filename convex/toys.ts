import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Return all available toys by default, descending order
    const toys = await ctx.db.query("toys").order("desc").collect();
    return toys;
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    ageRange: v.optional(v.string()),
    condition: v.optional(v.string()),
    oneDayRate: v.number(),
    deposit: v.number(),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found in DB");

    return await ctx.db.insert("toys", {
      ownerId: user._id,
      name: args.name,
      description: args.description,
      category: args.category,
      ageRange: args.ageRange,
      condition: args.condition,
      isCleaned: true,
      oneDayRate: args.oneDayRate,
      deposit: args.deposit,
      images: args.images,
      isAvailable: true,
      targetGender: "Unisex",
    });
  },
});
