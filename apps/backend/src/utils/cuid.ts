import { init } from "@paralleldrive/cuid2";

export const createId = init({
    length: 24,
    fingerprint: process.env.SALT || "xxXxx",
});
