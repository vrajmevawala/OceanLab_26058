import { db } from "@codeopt/db";
import { users, teamMembers, workspaces } from "@codeopt/db/schema";
import { and, eq } from "drizzle-orm";
import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "@clerk/backend";

export type Context = {
  db: typeof db;
  user: { id: string; clerkId: string; plan: "free" | "pro" | "team" | "enterprise" } | null;
  workspaceId: string | null;
  memberRole: "owner" | "admin" | "developer" | "viewer" | null;
  req: FastifyRequest;
  reply: FastifyReply;
};

async function syncUser(clerkUserId: string): Promise<NonNullable<Context["user"]> | null> {
  let user: NonNullable<Context["user"]>;
  
  const [existing] = await db
    .select({ id: users.id, clerkId: users.clerkId, plan: users.plan })
    .from(users)
    .where(eq(users.clerkId, clerkUserId))
    .limit(1);

  if (existing) {
    user = existing;
  } else {
    console.log(`[Auth] Provisioning new user for Clerk ID: ${clerkUserId}`);
    const [newUser] = await db
      .insert(users)
      .values({
        clerkId: clerkUserId,
        email: `sync_${clerkUserId}@codeopt.dev`,
        name: "New User",
      })
      .returning({ id: users.id, clerkId: users.clerkId, plan: users.plan });
    user = newUser;
  }

  // Ensure user has at least one workspace
  const [firstMembership] = await db
    .select({ workspaceId: teamMembers.workspaceId })
    .from(teamMembers)
    .where(eq(teamMembers.userId, user.id))
    .limit(1);

  if (!firstMembership) {
    console.log(`[Auth] User ${user.id} has no workspace. Provisioning one...`);
    const [workspace] = await db
      .insert(workspaces)
      .values({
        name: "My Workspace",
        slug: `workspace-${user.id.slice(0, 8)}`,
        ownerId: user.id,
      })
      .returning({ id: workspaces.id });

    await db.insert(teamMembers).values({
      workspaceId: workspace.id,
      userId: user.id,
      role: "owner",
      status: "active",
      joinedAt: new Date(),
    });
  }

  return user;
}

export async function createContext({ req, res }: { req: FastifyRequest; res: FastifyReply }): Promise<Context> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  if (!token) {
    return { db, user: null, workspaceId: null, memberRole: null, req, reply: res };
  }

  let clerkUserId: string;
  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY ?? "",
    });
    clerkUserId = payload.sub;
  } catch (err) {
    console.error("[Auth] Token verification failed:", err);
    return { db, user: null, workspaceId: null, memberRole: null, req, reply: res };
  }

  const user = await syncUser(clerkUserId);
  if (!user) {
    return { db, user: null, workspaceId: null, memberRole: null, req, reply: res };
  }

  const workspaceId = ((req.headers["x-workspace-id"] as string | undefined) ?? null) || null;
  let memberRole: Context["memberRole"] = null;

  if (workspaceId) {
    const [membership] = await db
      .select({ role: teamMembers.role })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.workspaceId, workspaceId),
          eq(teamMembers.userId, user.id),
          eq(teamMembers.status, "active")
        )
      )
      .limit(1);

    if (membership) {
      memberRole = membership.role;
    }
  }

  return { db, user, workspaceId, memberRole, req, reply: res };
}
