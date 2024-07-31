import request from "supertest";
import app from "../src/server";

let token: string = "";

test("POST /auth/register", async () => {
  const res = await request(app)
    .post("/auth/register")
    .accept("application/json")
    .send({
      email: "syahrul@email.com",
      password: "password",
      name: "Syahrul",
    });

  expect(res.statusCode).toBe(200);
});

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

test("GET /auth/me", async () => {
  const res = await request(app)
    .get("/auth/me")
    .accept("application/json")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
});
