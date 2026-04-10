import { db } from "@codeopt/db";
import { users, teamMembers, workspaces } from "@codeopt/db/schema";
import { and, eq } from "drizzle-orm";
import type { FastifyReply, FastifyRequest } from "fastify";
import { createClerkClient } from "@clerk/backend";
import { verifyToken } from "@clerk/backend";

export type Context = {
  db: typeof db;
  user: { id: string; clerkId: string; plan: "free" | "pro" | "team" | "enterprise" } | null;
  workspaceId: string | null;
  memberRole: "owner" | "admin" | "developer" | "viewer" | null;
  req: FastifyRequest;
  reply: FastifyReply;
};

const clerk = createClerkClient({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY ?? "",
  secretKey: process.env.CLERK_SECRET_KEY ?? "",
});

// Simple cache
const sessionCache = new Map<
  string,
  { user: any; memberRole: any; workspaceId: any; expiresAt: number }
>();
const CACHE_TTL = 5 * 60 * 1000;

async function syncUser(
  clerkUserId: string
): Promise<NonNullable<Context["user"]> | null> {
  try {
    let user: NonNullable<Context["user"]>;

    const dbRes = await db
      .select({ id: users.id, clerkId: users.clerkId, name: users.name, plan: users.plan })
      .from(users)
      .where(eq(users.clerkId, clerkUserId))
      .limit(1);

    const existing = dbRes[0];

    if (existing && existing.name !== "New User") {
      user = existing;
    } else {
      const clerkUser = await clerk.users.getUser(clerkUserId);

      const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;

      const name = clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
        : clerkUser.username || "Anonymous";

      if (existing) {
        await db
          .update(users)
          .set({
            name,
            email: primaryEmail || undefined,
            avatarUrl: clerkUser.imageUrl,
          })
          .where(eq(users.id, existing.id));

        user = {
          id: existing.id,
          clerkId: existing.clerkId,
          plan: existing.plan,
        };
      } else {
        const [newUser] = await db
          .insert(users)
          .values({
            clerkId: clerkUserId,
            email: primaryEmail || `sync_${clerkUserId}@codeopt.dev`,
            name,
            avatarUrl: clerkUser.imageUrl,
          })
          .returning({
            id: users.id,
            clerkId: users.clerkId,
            plan: users.plan,
          });

        user = newUser;
      }
    }

    // Ensure workspace exists
    const [membership] = await db
      .select({ workspaceId: teamMembers.workspaceId })
      .from(teamMembers)
      .where(eq(teamMembers.userId, user.id))
      .limit(1);

    if (!membership) {
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
  } catch (err) {
    console.error("[Auth] syncUser failed:", err);
    return null;
  }
}

export async function createContext({
  req,
  res,
}: {
  req: FastifyRequest;
  res: FastifyReply;
}): Promise<Context> {
  // 🔐 AUTH
  const token = req.headers.authorization?.replace("Bearer ", "");

  let clerkUserId: string | null = null;

  if (token) {
    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
        jwtKey: process.env.CLERK_JWT_KEY,
      });
      clerkUserId = payload.sub;
    } catch (err) {
      console.error("Auth failed:", err);
    }
  }

  // 🚨 if not logged in
  if (!clerkUserId) {
    return {
      db,
      user: null,
      workspaceId: null,
      memberRole: null,
      req,
      reply: res,
    };
  }

  // 🧾 workspace id
  let workspaceId =
    ((req.headers["x-workspace-id"] as string | undefined) ?? null) || null;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (workspaceId && !uuidRegex.test(workspaceId)) {
    workspaceId = null;
  }

  const cacheKey = `${clerkUserId}:${workspaceId ?? "none"}`;
  const cached = sessionCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return {
      db,
      user: cached.user,
      workspaceId,
      memberRole: cached.memberRole,
      req,
      reply: res,
    };
  }

  // 🔎 Fetch user + role
  let result;

  try {
    const dbRes = await db
      .select({
        user: {
          id: users.id,
          clerkId: users.clerkId,
          plan: users.plan,
        },
        role: teamMembers.role,
      })
      .from(users)
      .leftJoin(
        teamMembers,
        and(
          eq(teamMembers.userId, users.id),
          workspaceId ? eq(teamMembers.workspaceId, workspaceId) : undefined,
          eq(teamMembers.status, "active")
        )
      )
      .where(eq(users.clerkId, clerkUserId))
      .limit(1);

    result = dbRes[0];
  } catch (err) {
    console.error("[Context] DB error:", err);
    result = undefined;
  }

  // 🆕 First-time user
  if (!result) {
    const user = await syncUser(clerkUserId);

    if (!user) {
      return {
        db,
        user: null,
        workspaceId: null,
        memberRole: null,
        req,
        reply: res,
      };
    }

    sessionCache.set(cacheKey, {
      user,
      memberRole: null,
      workspaceId,
      expiresAt: Date.now() + CACHE_TTL,
    });

    return {
      db,
      user,
      workspaceId,
      memberRole: null,
      req,
      reply: res,
    };
  }

  sessionCache.set(cacheKey, {
    user: result.user,
    memberRole: result.role,
    workspaceId,
    expiresAt: Date.now() + CACHE_TTL,
  });

  return {
    db,
    user: result.user,
    workspaceId,
    memberRole: result.role,
    req,
    reply: res,
  };
}