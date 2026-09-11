import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../setup.js";
import { setAuth } from "../helpers/auth.js";

describe("Feedback", () => {
  it("creates public feedback and persists it", async () => {
    const payload = {
      name: "Abebe Kebede",
      email: "abebe@example.com",
      message: "Great course content!",
    };

    const res = await request(app).post("/api/feedback").send(payload);
    expect(res.status).toBe(201);
    expect(res.body.feedback).toMatchObject(payload);

    const stored = await prisma.feedback.findUnique({
      where: { id: res.body.feedback.id },
    });
    expect(stored).toMatchObject(payload);
  });

  it("rejects invalid and empty feedback", async () => {
    const missing = await request(app).post("/api/feedback").send({});
    expect(missing.status).toBe(400);

    const invalidEmail = await request(app).post("/api/feedback").send({
      name: "Sara",
      email: "not-an-email",
      message: "Hello",
    });
    expect(invalidEmail.status).toBe(400);

    const emptyMessage = await request(app).post("/api/feedback").send({
      name: "Sara",
      email: "sara@example.com",
      message: "   ",
    });
    expect(emptyMessage.status).toBe(400);
    expect(await prisma.feedback.count()).toBe(0);
  });

  it("returns an empty list for authorized admins", async () => {
    setAuth("admin_1", "org:admin");
    const res = await request(app).get("/api/feedback");
    expect(res.status).toBe(200);
    expect(res.body.feedbacks).toEqual([]);
    expect(res.body.pagination.total).toBe(0);
  });

  it("blocks unauthenticated and non-admin listing", async () => {
    await request(app).post("/api/feedback").send({
      name: "Abebe",
      email: "abebe@example.com",
      message: "Please keep this private",
    });

    const anonymous = await request(app).get("/api/feedback");
    expect(anonymous.status).toBe(401);

    setAuth("member_1", "org:member");
    const member = await request(app).get("/api/feedback");
    expect(member.status).toBe(403);
  });

  it("lets admins read, sort, and delete feedback", async () => {
    const first = await request(app).post("/api/feedback").send({
      name: "One",
      email: "one@example.com",
      message: "First",
    });
    const second = await request(app).post("/api/feedback").send({
      name: "Two",
      email: "two@example.com",
      message: "Second",
    });
    const firstId = first.body.feedback.id as number;
    const secondId = second.body.feedback.id as number;

    setAuth("admin_1", "org:admin");
    const list = await request(app).get("/api/feedback?sort=desc");
    expect(list.status).toBe(200);
    expect(list.body.feedbacks).toHaveLength(2);

    const detail = await request(app).get(`/api/feedback/${secondId}`);
    expect(detail.status).toBe(200);
    expect(detail.body.feedback.message).toBe("Second");

    setAuth("member_1", "org:member");
    const forbiddenDelete = await request(app).delete(`/api/feedback/${firstId}`);
    expect(forbiddenDelete.status).toBe(403);
    expect(await prisma.feedback.findUnique({ where: { id: firstId } })).not.toBeNull();

    setAuth("admin_1", "org:admin");
    const deleted = await request(app).delete(`/api/feedback/${firstId}`);
    expect(deleted.status).toBe(200);
    expect(await prisma.feedback.findUnique({ where: { id: firstId } })).toBeNull();
    expect(await prisma.feedback.findUnique({ where: { id: secondId } })).not.toBeNull();
  });

  it("returns 400/404 for invalid and missing delete targets", async () => {
    setAuth("admin_1", "org:admin");
    expect((await request(app).delete("/api/feedback/abc")).status).toBe(400);
    expect((await request(app).delete("/api/feedback/9999")).status).toBe(404);
  });
});
