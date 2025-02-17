const request = require("supertest")

/*

What Does mock Do in Jest?
Mocking in Jest allows you to simulate functions, modules, or dependencies so you can control their behavior during tests. 
This helps you:

✅ Isolate your tests – Avoid actual database/API calls.
✅ Simulate different scenarios – E.g., force errors, return specific data.
✅ Improve test speed – No real network or database interactions.

*/

describe("User API", () => {
    const baseUrl = global.getServiceUrl().USER_SERVICE_URL;
    const authTokens = global.getAuthToken();

    it("success : returns list of users", async () => {
        const res = await request(baseUrl).get("/users/all");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("bloggers");
        expect(Array.isArray(res.body.bloggers)).toBe(true);
    });

    // REGISTER tests 
    it("success : should register a new user", async () => {
        const res = await request(baseUrl).post("/users/register").send({
            username: "John Doe",
            email: "johndoe@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("user");
        expect(typeof res.body.user).toBe("object");
        expect(Object.keys(res.body.user).length).toBeGreaterThan(0);
    });

    it("error : while registering, username has already taken", async () => {
        const res = await request(baseUrl).post("/users/register").send({
            username: "Nayan2002",
            email: "johndoe2@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(401);
    });

    it("error : while registering, email has already taken", async () => {
        const res = await request(baseUrl).post("/users/register").send({
            username: "abcd",
            email: "nayankumar200222@gmail.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(401);
    });

    it("error : while registering, fields are empty", async () => {
        const res = await request(baseUrl).post("/users/register").send({
            username: null,
            email: "johndoe2@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(400);
    });

    it("error : while registering, fields are null", async () => {
        const res = await request(baseUrl).post("/users/register").send({
            email: "johndoe2@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(400);
    });


    // LOGIN tests
    it("success : should login an existing user", async () => {
        const res = await request(baseUrl).post("/users/login").send({
            email: "johndoe@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    it("success : should login an admin", async () => {
        const res = await request(baseUrl).post("/users/login").send({
            email: "admin@gmail.com",
            password: "admin@123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("message", "Logged in as Admin!");
    });

    it("error : while logging, fields are empty", async () => {
        const res = await request(baseUrl).post("/users/login").send({
            email: null,
            password: "password123",
        });

        expect(res.statusCode).toBe(400);
    });

    it("error : while logging, fields are null", async () => {
        const res = await request(baseUrl).post("/users/login").send({
            password: "password123",
        });

        expect(res.statusCode).toBe(400);
    });

    it("error : while logging, user not found", async () => {
        const res = await request(baseUrl).post("/users/login").send({
            email: "masternayankumar.02@gmail.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(404);
    });

    it("error : while logging, password is not correct", async () => {
        const res = await request(baseUrl).post("/users/login").send({
            email: "johndoe@example.com",
            password: "password",
        });

        expect(res.statusCode).toBe(401);
    });


    // RETURN SINGLE USER 
    it("success : return single user by username", async () => {
        const res = await request(baseUrl).get("/users/user").set(
            "Authorization", `Bearer ${authTokens.user_1}`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("user");
        expect(typeof res.body.user).toBe("object");
        expect(Object.keys(res.body.user).length).toBeGreaterThan(0);
    });


    // TEST AUTHENTICATION ERRORS USING ABOVE API
    it("error : authorization header is missing", async () => {
        const res = await request(baseUrl).get("/users/user");

        expect(res.statusCode).toBe(401);
    });

    it("error : Token doesnot starts with Bearer", async () => {
        const res = await request(baseUrl).get("/users/user").set(
            "Authorization", `Random ${authTokens.user_1}`
        );

        expect(res.statusCode).toBe(401);
    });

    it("error : Token is not correct", async () => {
        const res = await request(baseUrl).get("/users/user").set(
            "Authorization", `Bearer ${authTokens.user_1 + "wa"}`
        );

        expect(res.statusCode).toBe(401);
    });


    // RESET PASSWORD test
    it("success : should reset password using email", async () => {
        const email = "nayankumar200222@gmail.com";
        const res = await request(baseUrl).post(`/users/reset-password/${email}`).send({
            password: "N@yan@2002"
        });

        expect(res.statusCode).toBe(201);
    });

    it("error : while reseting, password is null", async () => {
        const email = "nayankumar200222@gmail.com";
        const res = await request(baseUrl).post(`/users/reset-password/${email}`).send({
            password: null,
        });

        expect(res.statusCode).toBe(400);
    });

    it("error : while reseting, password is undefined", async () => {
        const id = "nayankumar200222@gmail.com";
        const res = await request(baseUrl).post(`/users/reset-password/${id}`);

        expect(res.statusCode).toBe(400);
    });

    it("error : while reseting, wrong email send, user not found", async () => {
        const email = "masternayankumar.02@gmail.com";
        const res = await request(baseUrl).post(`/users/reset-password/${email}`).send({
            password: "N@yan@2002"
        });

        expect(res.statusCode).toBe(404);
    });


    // GET DISABLE STATUS OF USER 
    it("success : return isDisabled status of user", async () => {
        const res = await request(baseUrl).get("/users/isDisabled").set(
            "Authorization", `Bearer ${authTokens.user_1}`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("isDisabled");
    });


});
