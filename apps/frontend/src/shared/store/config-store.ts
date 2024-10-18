import { createEvent, createStore } from "effector";
import { initUserDataFx } from "../init";

export const $isInitDataLoaded = createStore(false);
export const $isInitialized = createStore(false);

$isInitialized.on(initUserDataFx.finally, () => true);
$isInitDataLoaded.on(initUserDataFx.doneData, () => true);
