import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../setup.js";
import { setAuth } from "../helpers/auth.js";

describe("Course categories", () => {
  it("requires auth to create", async () => {
    const res = await request(app).post("/api/course/categories").send({
      name: "Theology",
      description: "Core",
    });
    expect(res.status).toBe(401);
    expect(await prisma.courseCategory.count()).toBe(0);
  });

  it("rejects invalid payloads", async () => {
    setAuth("user_1");
    const res = await request(app).post("/api/course/categories").send({
      name: " ",
      description: "ok",
    });
    expect(res.status).toBe(400);
    expect(await prisma.courseCategory.count()).toBe(0);
  });

  it("creates, lists, updates, and deletes a course category", async () => {
    setAuth("user_1");
    const created = await request(app).post("/api/course/categories").send({
      name: "Bible",
      description: "Scripture",
    });
    expect(created.status).toBe(201);
    const id = created.body.category.id as number;
    expect(await prisma.courseCategory.findUnique({ where: { id } })).not.toBeNull();

    const list = await request(app).get("/api/course/categories");
    expect(list.status).toBe(200);
    expect(list.body.categories[0]._count.courses).toBe(0);

    const updated = await request(app)
      .patch(`/api/course/categories/${id}`)
      .send({ description: "Updated" });
    expect(updated.status).toBe(200);
    expect(
      (await prisma.courseCategory.findUnique({ where: { id } }))?.description,
    ).toBe("Updated");

    const deleted = await request(app).delete(`/api/course/categories/${id}`);
    expect(deleted.status).toBe(200);
    expect(await prisma.courseCategory.findUnique({ where: { id } })).toBeNull();
  });

  it("does not delete mezmur categories when removing a course category", async () => {
    setAuth("user_1");
    const mezmur = await request(app).post("/api/mezmur/categories-add").send({
      name: "Keep me",
      description: "Should remain",
    });
    const course = await request(app).post("/api/course/categories").send({
      name: "Remove me",
      description: "Course only",
    });

    await request(app).delete(`/api/course/categories/${course.body.category.id}`);

    expect(
      await prisma.mezmurCategory.findUnique({
        where: { id: mezmur.body.category.id },
      }),
    ).not.toBeNull();
  });
});
