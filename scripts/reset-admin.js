/*
 * Admin password reset utility.
 *
 * Usage:
 *   node scripts/reset-admin.js <email> <new-password>
 *
 * If the email doesn't exist, a new admin is created with that email + password.
 * If it exists, its password is rehashed and updated.
 *
 * Requires MONGO_URL in .env.
 */

require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

async function main() {
  const [, , email, newPassword] = process.argv;

  if (!email || !newPassword) {
    console.error("Usage: node scripts/reset-admin.js <email> <new-password>");
    process.exit(1);
  }

  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is not set in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");

  const hash = await bcrypt.hash(newPassword, 12);
  const existing = await Admin.findOne({ email });

  if (existing) {
    existing.password = hash;
    await existing.save();
    console.log(`Password updated for admin: ${email}`);
  } else {
    await Admin.create({ email, password: hash });
    console.log(`New admin created: ${email}`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(async (err) => {
  console.error("Failed:", err);
  try { await mongoose.disconnect(); } catch (_) {}
  process.exit(1);
});
