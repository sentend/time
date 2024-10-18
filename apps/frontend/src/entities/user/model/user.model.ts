import type { UserDTO } from "server/user";
import { initUserDataFx } from "@/shared/init";
import { createStore } from "effector";

export const $currentUser = createStore<UserDTO | null>(null);

$currentUser.on(initUserDataFx.doneData, (_, data) => data.user);
