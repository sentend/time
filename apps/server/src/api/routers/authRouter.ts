import { authController } from "@/domains/auth";
import { Hono } from "hono";

const authRouter = new Hono();

authRouter.post("/signup", ctx => authController.signup(ctx));

authRouter.post("/signin", ctx => authController.signin(ctx));

export { authRouter };
