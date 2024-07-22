import Cookies from "js-cookie";
import { create } from "zustand";
import { apiClient } from "@/shared/api";
import { immer } from "zustand/middleware/immer";

import { TUser, TWorkspace, TUserWorkspaceData } from "~types/models";
import transformAxiosError from "../utils/transformAxiosError";
import { AxiosError } from "axios";
import { sid } from "../constants";

type StoreState = {
	currentUser: TUser | null;
	userWorkspaceData: TUserWorkspaceData | null;
	workspaces: TWorkspace[];
	currentWorkspace: TWorkspace | null;
	appError: string | null;
};

type StoreActions = {
	logout: () => void;
	getCurrentUser: () => TUser;
	initSession: (sessionId: string, lastUsedWorkspaceId?: number) => Promise<void>;
	updateWorkspaceNextProjectColor: () => number;
};

export const useAppStore = create(
	immer<StoreState & StoreActions>((set, getState) => ({
		currentUser: null,
		workspaces: [],
		currentWorkspace: null,
		userWorkspaceData: null,
		appError: null,

		logout: () =>
			set((state) => {
				state.currentUser = null;
				state.currentWorkspace = null;
				state.workspaces = [];
				Cookies.remove(sid);
				apiClient.setSessionId(null);
			}),

		getCurrentUser: () => {
			const state = getState();
			if (!state.currentUser) {
				throw new Error("no user");
			}

			return state.currentUser;
		},

		initSession: async (sessionId: string, workspaceId?: number) => {
			try {
				let effectiveWorkspaceId = undefined;
				if (workspaceId) {
					effectiveWorkspaceId = workspaceId;
				}
				const workspaceInCookie = Cookies.get("wid");
				if (workspaceInCookie) {
					effectiveWorkspaceId = parseInt(workspaceInCookie);
				}

				apiClient.setSessionId(sessionId);
				const data = await apiClient.getMe(effectiveWorkspaceId);
				console.log(data);
				const { user, workspaces, currentWorkspace, userWorkspaceData } = data;

				apiClient.setWorkspaceId(currentWorkspace.id);
				Cookies.set("wid", currentWorkspace.id.toString());

				set((state) => {
					state.workspaces = workspaces;
					state.currentWorkspace = currentWorkspace;
					state.currentUser = user;
					state.userWorkspaceData = userWorkspaceData;
				});
			} catch (err) {
				let message = String(err);
				if (err instanceof AxiosError) {
					message = transformAxiosError(err).message;
				}
				set((state) => {
					state.appError = message;
				});
			}
		},

		updateWorkspaceNextProjectColor: () => {
			const currentWorkspace = getState().currentWorkspace;
			if (currentWorkspace) {
				const nextProjectColorId = (currentWorkspace.nextProjectColorId + 1) % 18;
				set((state) => {
					if (state.currentWorkspace) {
						state.currentWorkspace.nextProjectColorId = nextProjectColorId;
					}
				});
				return nextProjectColorId;
			}
			return 0;
		},
	}))
);
