import type { Context, Next } from "hono";
import { SignupData, type SigninData } from "./auth.model";
import { authService, type AuthService } from "./auth.service";
import { sendResult } from "@/libs/sendResult";
import { setCookie } from "hono/cookie";

export class AuthController {
	constructor(private authService: AuthService) {}

	async signup(ctx: Context) {
		const { email, name, password, initialWorkspaceName } =
			await ctx.req.json<SignupData>();

		const result = await this.authService.signup({
			email,
			name,
			password,
			initialWorkspaceName,
		});

		setCookie(ctx, "sid", result.sessionId, {
			httpOnly: true,
			secure: true,
		});

		return sendResult(ctx, result);
	}

	//todo add lucia or another auth lib

	async signin(ctx: Context) {
		const { email, password } = await ctx.req.json<SigninData>();

		const result = await this.authService.signin({ email, password });

		setCookie(ctx, "sid", result.sessionId, {
			httpOnly: true,
			secure: true,
		});

		return sendResult(ctx, result);
	}

	async me(ctx: Context) {
		const workspaceId = Number(ctx.req.query("workspaceId"));

		const { currentUser } = ctx.__internalState;

		const result = await this.authService.me({
			currentUser: currentUser,
			resolvedWorkspaceId: workspaceId,
		});

		return sendResult(ctx, result);
	}
}

export const authController = new AuthController(authService);
