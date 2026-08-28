import { mutation } from "./_generated/server";
// values removed

const MOCK_TOYS = [
  {
    name: "Mega Castle Magnetic Tiles Set",
    description: "Build towering castles and beautiful structures with 100+ colorful magnetic tiles. Enhances spatial awareness and creativity.",
    category: "Magnetic Tiles",
    ageRange: "3-8",
    condition: "Excellent",
    oneDayRate: 150,
    deposit: 1200,
    images: ["/images/toys/magnetic_tiles.jpg"],
  },
  {
    name: "LEGO City Space Station",
    description: "Highly detailed LEGO space station with astronaut mini-figures and shuttle. Perfect for long weekends.",
    category: "LEGO / Construction",
    ageRange: "6-12",
    condition: "Like New",
    oneDayRate: 200,
    deposit: 2500,
    images: ["/images/toys/lego_construction.jpg"],
  },
  {
    name: "Indestructible Chew Ring",
    description: "A heavy-duty rubber ring designed specifically for aggressive power chewers.",
    category: "Pet Toys (Dogs)",
    ageRange: "Adult Dogs",
    condition: "Good",
    oneDayRate: 40,
    deposit: 300,
    images: ["/images/toys/dog_chew_ring_1787896734072.jpg"],
  },
  {
    name: "iFetch Automatic Ball Launcher",
    description: "The ultimate luxury playtime experience for high-energy dogs. Automatically launches tennis balls for endless fetch.",
    category: "Top Picks for Pets",
    ageRange: "All Ages",
    condition: "Excellent",
    oneDayRate: 199,
    deposit: 3500,
    images: ["/images/toys/dog_ball_launcher_1787896756758.jpg"],
  },
  {
    name: "Traxxas Off-Road RC Truck",
    description: "High-performance, rugged remote control off-road truck. Reaches speeds up to 30mph!",
    category: "RC Cars",
    ageRange: "8+",
    condition: "Good",
    oneDayRate: 250,
    deposit: 4000,
    images: ["/images/toys/rc_car.jpg"],
  },
  {
    name: "Codie STEM Coding Robot",
    description: "An adorable, interactive robot that teaches kids the fundamentals of block-coding and logic.",
    category: "STEM + Robotics",
    ageRange: "5-10",
    condition: "Like New",
    oneDayRate: 180,
    deposit: 2000,
    images: ["/images/toys/stem_robot.jpg"],
  },
  {
    name: "Jumbo Rainbow Tumbling Tower",
    description: "Giant wooden blocks party game! Perfect for kids' birthdays, family barbecues, and outdoor fun.",
    category: "Birthday/Party",
    ageRange: "All Ages",
    condition: "Excellent",
    oneDayRate: 350,
    deposit: 1500,
    images: ["/images/toys/party_game.jpg"],
  }
];

export const seedToys = mutation({
  args: {},
  handler: async (ctx) => {
    // We are allowing re-seeding here by not returning early if toys exist,
    // so the new data can be added on top of existing data.
    
    let user = await ctx.db.query("users").first();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkId: "mock_clerk_id",
        email: "demo@khelondedo.com",
        name: "Admin User",
        avatarUrl: "",
        toyLoopScore: 0,
        earnings: 0,
      });
      user = await ctx.db.get(userId);
    }

    if (!user) {
      throw new Error("Failed to create mock user");
    }

    for (const toy of MOCK_TOYS) {
      await ctx.db.insert("toys", {
        ownerId: user._id,
        name: toy.name,
        description: toy.description,
        category: toy.category,
        ageRange: toy.ageRange,
        condition: toy.condition,
        isCleaned: true,
        oneDayRate: toy.oneDayRate,
        deposit: toy.deposit,
        images: toy.images,
        isAvailable: true,
        targetGender: "Unisex",
      });
    }
    
    return "Successfully seeded 7 beautiful categories!";
  },
});
