import Cookies from "js-cookie";
import { create } from "zustand";
import { apiClient } from "@/shared/api";
import { immer } from "zustand/middleware/immer";
import transformAxiosError from "../utils/transformAxiosError";
import { AxiosError } from "axios";
import { sid } from "../constants";
import type { WorkspaceDTO } from "@/server/workspace";
import type { WorkspaceMember } from "@/server/workspace-member";
import type { UserDTO } from "@/server/user";
import { atom } from "jotai";

type StoreState = {
	currentUser: UserDTO | null;
	userWorkspaceData: WorkspaceMember | null;
	workspaces: WorkspaceDTO[];
	currentWorkspace: WorkspaceDTO | null;
	appError: string | null;
};

type StoreActions = {
	logout: () => void;
	getCurrentUser: () => UserDTO;
	initSession: (sessionId: string, lastUsedWorkspaceId?: number) => Promise<void>;
	updateWorkspaceNextProjectColor: () => number;
};

export const currentWorkspace = atom;

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
