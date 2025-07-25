import { db } from "./db";
import { users, vrAssets } from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // Create sample users
  const sampleUsers = [
    { username: "cyberpunk_dev", walletAddress: "ic1234abcd", balance: "5.25" },
    { username: "workspace_pro", walletAddress: "ic5678efgh", balance: "3.80" },
    { username: "artsmith_vr", walletAddress: "ic9012ijkl", balance: "7.15" },
    { username: "nature_vr", walletAddress: "ic3456mnop", balance: "2.40" },
    { username: "space_explorer", walletAddress: "ic7890qrst", balance: "10.50" },
    { username: "fantasy_realm", walletAddress: "ic2468uvwx", balance: "4.95" },
    { username: "social_architect", walletAddress: "ic1357yzab", balance: "6.30" },
    { username: "ocean_edu", walletAddress: "ic9753cdef", balance: "1.75" },
  ];

  const insertedUsers = await db.insert(users).values(sampleUsers).returning();
  console.log(`✅ Created ${insertedUsers.length} users`);

  // Create sample VR assets
  const sampleAssets = [
    {
      title: "Neon Cyberpunk Arena",
      description: "High-tech gaming environment with interactive elements",
      category: "gaming",
      price: "2.5",
      previewUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      modelUrl: "/models/cyberpunk_arena.glb",
      fileSize: "15.2 MB",
      ownerId: insertedUsers[0].id,
    },
    {
      title: "Virtual Office Hub",
      description: "Modern workplace with collaborative tools",
      category: "workspace",
      price: "1.8",
      previewUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      modelUrl: "/models/office_hub.glb",
      fileSize: "8.7 MB",
      ownerId: insertedUsers[1].id,
    },
    {
      title: "Digital Art Gallery",
      description: "Immersive gallery showcasing digital masterpieces",
      category: "art",
      price: "3.2",
      previewUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      modelUrl: "/models/art_gallery.glb",
      fileSize: "22.1 MB",
      ownerId: insertedUsers[2].id,
    },
    {
      title: "Paradise Island",
      description: "Peaceful tropical getaway with crystal clear waters",
      category: "nature",
      price: "1.5",
      previewUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      modelUrl: "/models/paradise_island.glb",
      fileSize: "18.9 MB",
      ownerId: insertedUsers[3].id,
    },
    {
      title: "Space Station Alpha",
      description: "Advanced orbital facility with interactive systems",
      category: "sci-fi",
      price: "4.1",
      previewUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      modelUrl: "/models/space_station.glb",
      fileSize: "31.5 MB",
      ownerId: insertedUsers[4].id,
    },
    {
      title: "Dragon's Keep Castle",
      description: "Immersive medieval fortress with quest elements",
      category: "fantasy",
      price: "2.8",
      previewUrl: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      modelUrl: "/models/dragons_keep.glb",
      fileSize: "26.3 MB",
      ownerId: insertedUsers[5].id,
    },
    {
      title: "City Skyline Lounge",
      description: "Premium social space with stunning city views",
      category: "social",
      price: "1.9",
      previewUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      modelUrl: "/models/city_lounge.glb",
      fileSize: "14.6 MB",
      ownerId: insertedUsers[6].id,
    },
    {
      title: "Ocean Depths Explorer",
      description: "Interactive marine biology learning experience",
      category: "educational",
      price: "0.9",
      previewUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      modelUrl: "/models/ocean_depths.glb",
      fileSize: "12.8 MB",
      ownerId: insertedUsers[7].id,
    },
  ];

  const insertedAssets = await db.insert(vrAssets).values(sampleAssets).returning();
  console.log(`✅ Created ${insertedAssets.length} VR assets`);

  console.log("🎉 Database seeding completed!");
}

// Run the seeding immediately
seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

export { seedDatabase };