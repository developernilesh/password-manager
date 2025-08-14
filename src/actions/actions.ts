"use server";

import bcrypt from "bcryptjs";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

// Set the hashed master password in ClerkJS user metadata
export async function setMasterPassword(
  masterPassword: string
): Promise<boolean> {

  const user = await currentUser();
  if (!user) return false;

  const hash = bcrypt.hashSync(masterPassword, 10);
  const client = await clerkClient();

  await client.users.updateUserMetadata(user.id, {
    privateMetadata: {
      masterPasswordHash: hash,
    },
  });

  return true;
}

// Get the hashed master password from ClerkJS user metadata
export async function getMasterPasswordHash(): Promise<string | null> {
  const user = await currentUser();
  if (!user) return null;

  const hash = user.privateMetadata?.masterPasswordHash;
  return typeof hash === "string" ? hash : null;
}

// Verify the input master password against the stored hash
export async function verifyMasterPassword(input: string): Promise<boolean> {
  const hash = await getMasterPasswordHash();
  if (!hash) return false;

  return bcrypt.compareSync(input, hash);
}
