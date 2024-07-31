import request from "supertest";
import app from "../src/server";

let token: string = "";

test("POST /auth/login", async () => {
  const res = await request(app)
    .post("/auth/login")
    .accept("application/json")
    .send({
      email: "super.admin@admin.com",
      password: "password",
    });

  expect(res.statusCode).toBe(200);
  token = res.body.token;
});

test("GET /permissions", async () => {
  const res = await request(app)
    .get("/permissions")
    .accept("application/json")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
});

test("PUT /permissions", async () => {
  const res = await request(app)
    .put("/permissions")
    .accept("application/json")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "permissions-readx",
    });

  expect(res.statusCode).toBe(200);
});

test("PATCH /permissions", async () => {
  const res = await request(app)
    .patch("/permissions")
    .accept("application/json")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "permissions-readx",
      new_name: "permission-redx2",
    });

  expect(res.statusCode).toBe(200);
});

test("DELETE /permissions", async () => {
  const res = await request(app)
    .delete("/permissions")
    .accept("application/json")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "permission-redx2",
    });

  expect(res.statusCode).toBe(200);
});
