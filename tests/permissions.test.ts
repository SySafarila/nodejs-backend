import request from "supertest";
import app from "../src/server";

let token: string = "";

describe("Login by autorized user", () => {
  it("Should success", async () => {
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
});

describe("READ permissions", () => {
  it("Should success", async () => {
    const res = await request(app)
      .get("/permissions")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});

describe("CREATE permission", () => {
  it("Should success", async () => {
    const res = await request(app)
      .put("/permissions")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "permissions-readx",
      });

    expect(res.statusCode).toBe(200);
  });
});

describe("UPDATE permission", () => {
  it("Should success", async () => {
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
});

describe("DELETE permission", () => {
  it("Should success", async () => {
    const res = await request(app)
      .delete("/permissions")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "permission-redx2",
      });

    expect(res.statusCode).toBe(200);
  });
});
