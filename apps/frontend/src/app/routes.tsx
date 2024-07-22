import { Navigate, RouteObject } from "react-router";

import {
	MembersPage,
	ProjectsPage,
	SigninPage,
	SignupPage,
	ProjectDetailsPage,
	ProjectReportPage,
	ProjectNodesPage,
	ProjectTimeEntriesPage,
} from "@/pages";

import { MainLayout, AuthLayout } from "./layouts";
import LocalNavigate from "./LocalNavigate";
import Root from "./Root";

export const getRoutes = (children: RouteObject[]): RouteObject[] => {
	return [
		{
			Component: Root,
			children,
		},
	];
};

export const getPublicRoutes = (): RouteObject[] => [
	{
		Component: AuthLayout,
		children: [
			{
				path: "/signin",
				Component: SigninPage,
			},
			{
				path: "/signup",
				Component: SignupPage,
			},
			{
				//todo replace on relative path
				path: "*",
				element: <Navigate to={"/signin"} replace />,
			},
		],
	},
];

export const getPrivateRoutes = (): RouteObject[] => [
	{
		Component: MainLayout,
		children: [
			{
				path: "/:workspaceId/projects",
				Component: ProjectsPage,
			},
			{
				Component: ProjectDetailsPage,
				children: [
					{
						path: "/:workspaceId/projects/:projectId/tasks",
						Component: ProjectNodesPage,
					},
					{
						path: "/:workspaceId/projects/:projectId/timeEntries",
						Component: ProjectTimeEntriesPage,
					},
					{
						path: "/:workspaceId/projects/:projectId/report",
						Component: ProjectReportPage,
					},
				],
			},
			{
				path: "/:workspaceId/timeline",
				element: <div>timeline</div>,
			},
			{
				path: "/:workspaceId/timesheet",
				element: <div>timesheet</div>,
			},
			{
				path: "/:workspaceId/members",
				Component: MembersPage,
			},
			{
				path: "/:workspaceId/timeentries",
				element: <div>entries</div>,
			},
			{
				path: "/:workspaceId/reports",
				element: <div>reports</div>,
			},
			{
				path: "/:workspaceId/settings",
				element: <div>reports</div>,
			},
		],
	},
	{
		path: "*",
		Component: LocalNavigate,
	},
];
