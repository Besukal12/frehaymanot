import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../setup.js";
import { setAuth } from "../helpers/auth.js";
import { PDF_BYTES, PNG_BYTES } from "../helpers/files.js";

async function createCategory() {
  setAuth("owner_1");
  const res = await request(app).post("/api/mezmur/categories-add").send({
    name: "Hymns",
    description: "General",
  });
  return res.body.category.id as number;
}

describe("Mezmur resources", () => {
  it("rejects unauthenticated create", async () => {
    const categoryId = await createCategory();
    clearAndStayLoggedOut();

    const res = await request(app)
      .post("/api/mezmur/add")
      .field("title", "Song")
      .field("categoryId", String(categoryId))
      .attach("thumbnail", PNG_BYTES, { filename: "t.png", contentType: "image/png" })
      .attach("pdf", PDF_BYTES, { filename: "s.pdf", contentType: "application/pdf" });

    expect(res.status).toBe(401);
    expect(await prisma.mezmur.count()).toBe(0);
  });

  it("validates missing fields and unknown category", async () => {
    setAuth("owner_1");
    const invalid = await request(app).post("/api/mezmur/add").send({});
    expect(invalid.status).toBe(400);

    const missingCategory = await request(app)
      .post("/api/mezmur/add")
      .field("title", "Song")
      .field("categoryId", "9999")
      .attach("thumbnail", PNG_BYTES, { filename: "t.png", contentType: "image/png" })
      .attach("pdf", PDF_BYTES, { filename: "s.pdf", contentType: "application/pdf" });

    expect(missingCategory.status).toBe(404);
    expect(await prisma.mezmur.count()).toBe(0);
  });

  it("creates, reads, updates, and deletes a mezmur with authz", async () => {
    const categoryId = await createCategory();
    setAuth("owner_1");

    const created = await request(app)
      .post("/api/mezmur/add")
      .field("title", "Selam")
      .field("description", "Peace")
      .field("categoryId", String(categoryId))
      .attach("thumbnail", PNG_BYTES, { filename: "t.png", contentType: "image/png" })
      .attach("pdf", PDF_BYTES, { filename: "s.pdf", contentType: "application/pdf" });

    expect(created.status).toBe(201);
    const id = created.body.mezmur.id as number;
    expect(await prisma.mezmur.findUnique({ where: { id } })).not.toBeNull();

    const listed = await request(app).get("/api/mezmur/get");
    expect(listed.status).toBe(200);
    expect(listed.body.mezmurs).toHaveLength(1);

    const byId = await request(app).get(`/api/mezmur/get/${id}`);
    expect(byId.status).toBe(200);
    expect(byId.body.mezmur.title).toBe("Selam");

    const missing = await request(app).get("/api/mezmur/get/9999");
    expect(missing.status).toBe(404);

    const invalidId = await request(app).get("/api/mezmur/get/abc");
    expect(invalidId.status).toBe(400);

    setAuth("intruder");
    const forbidden = await request(app)
      .patch(`/api/mezmur/update/${id}`)
      .field("title", "Hacked");
    expect(forbidden.status).toBe(403);
    expect((await prisma.mezmur.findUnique({ where: { id } }))?.title).toBe("Selam");

    const forbiddenDelete = await request(app).delete(`/api/mezmur/delete/${id}`);
    expect(forbiddenDelete.status).toBe(403);
    expect(await prisma.mezmur.findUnique({ where: { id } })).not.toBeNull();

    setAuth("admin_1", "org:admin");
    const updated = await request(app)
      .patch(`/api/mezmur/update/${id}`)
      .field("title", "Updated");
    expect(updated.status).toBe(200);
    expect(updated.body.mezmur.title).toBe("Updated");
    expect((await prisma.mezmur.findUnique({ where: { id } }))?.title).toBe(
      "Updated",
    );

    const deleted = await request(app).delete(`/api/mezmur/delete/${id}`);
    expect(deleted.status).toBe(200);
    expect(await prisma.mezmur.findUnique({ where: { id } })).toBeNull();
  });
});

function clearAndStayLoggedOut() {
  setAuth(null);
}
