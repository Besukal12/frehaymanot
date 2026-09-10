import { it, describe, expect } from "vitest";
import Request from "supertest";
import app from "../../src/app";

describe("Test the mezmur-category", () => {
  //arrange
  const endPoint = "/api/mezmur/categories-add";
  const categoryPayload = {
    name: "new category",
    description: "new category for testing",
  };

  it("Should create new category", async () => {
    //act
    const res = await Request(app).post(endPoint).send(categoryPayload);

    //assert
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: "new category",
      description: "new category for testing",
    });
    expect(res.body.id).toBeDefined();
  });
});
