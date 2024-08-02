import request from "supertest";
import app from "../src/server";

let token: string = "";
let token2: string = "";

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

  const res2 = await request(app)
    .post("/auth/login")
    .accept("application/json")
    .send({
      email: "admin@admin.com",
      password: "password",
    });

  expect(res2.statusCode).toBe(200);
  token2 = res2.body.token;
});

test("GET /roles", async () => {
  const res = await request(app)
    .get("/roles")
    .accept("application/json")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);

  const res2 = await request(app)
    .get("/roles")
    .accept("application/json")
    .set("Authorization", `Bearer ${token2}`);

  expect(res2.statusCode).toBe(200);
});

test("PUT /roles", async () => {
  const res = await request(app)
    .put("/roles")
    .accept("application/json")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "basic-user",
      level: 5,
    });

  expect(res.statusCode).toBe(200);

  const res2 = await request(app)
    .put("/roles")
    .accept("application/json")
    .set("Authorization", `Bearer ${token2}`)
    .send({
      name: "admin2",
      level: 1,
    });

  expect(res2.statusCode).toBe(400);

  const res3 = await request(app)
    .put("/roles")
    .accept("application/json")
    .set("Authorization", `Bearer ${token2}`)
    .send({
      name: "admin2",
      level: 0,
    });

  expect(res3.statusCode).toBe(400);
});

test("PATCH /roles", async () => {
  const res = await request(app)
    .patch("/roles")
    .accept("application/json")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "basic-user",
      new_name: "advanced-user",
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.data.name).toBe("advanced-user");

  const res2 = await request(app)
    .patch("/roles")
    .accept("application/json")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "advanced-user",
      new_name: "advanced-user",
      new_level: 1,
    });

  expect(res2.statusCode).toBe(200);
  expect(res2.body.data.name).toBe("advanced-user");
  expect(res2.body.data.level).toBe(1);

  const res3 = await request(app)
    .patch("/roles")
    .accept("application/json")
    .set("Authorization", `Bearer ${token2}`)
    .send({
      name: "advanced-user",
      new_name: "advanced-user",
      new_level: 0,
    });

  expect(res3.statusCode).toBe(400);
});

test("DELETE /roles", async () => {
  const res = await request(app)
    .delete("/roles")
    .accept("application/json")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "advanced-user",
    });

  expect(res.statusCode).toBe(200);

  const res2 = await request(app)
    .delete("/roles")
    .accept("application/json")
    .set("Authorization", `Bearer ${token2}`)
    .send({
      name: "super-admin",
    });

  expect(res2.statusCode).toBe(400);
});
