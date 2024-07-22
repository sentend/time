import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";

import { config } from "@/shared/config";
import { cn, getInitials } from "@/shared/utils";
import { Avatar, AvatarGroup, Text } from "@/shared/ui";

import { GetProjectsService } from "~types/services";
import { ProjectDropdownButton } from "..";

export const getColumns = (t: TFunction): ColumnDef<GetProjectsService.ProjectItem>[] => [
	{
		id: "name/client",
		header: () => (
			<Text variant={"tertiary"} size={"xs"}>
				{t("nameClient")}
			</Text>
		),
		cell({ row }) {
			const project = row.original;
			const name = getInitials(project.name);

			const bgColor = config.colors[project.colorId]!.bg;

			return (
				<div className="flex items-center gap-7">
					<Avatar
						className={bgColor}
						fallbackProps={{
							className: cn("text-white opacity-75 font-bold text-[1rem]", bgColor),
						}}
						fallbackText={name}
					/>
					<div className="flex flex-col min-w-0">
						{row.original.clientName && (
							<Text variant={"secondary"} size={"xs"} className="font-bold" truncate>
								{project.clientName}
							</Text>
						)}
						<Text variant={"primary"}>{project.name}</Text>
					</div>
				</div>
			);
		},
		meta: {
			cell: {
				className: "truncate",
			},
		},
	},
	{
		id: "members",
		header: () => (
			<Text variant={"tertiary"} size="xs">
				{t("members")}
			</Text>
		),
		cell: ({ row }) => {
			return (
				<AvatarGroup max={2}>
					{row.original.members?.map((user) => (
						<Avatar key={user.id} fallbackText={user.initials} />
					))}
				</AvatarGroup>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return <ProjectDropdownButton projectId={row.original.id!} />;
		},
		meta: {
			header: {
				className: "w-[60px]",
			},
			cell: {
				className: "w-[60px] p-0 pr-5",
			},
		},
	},
];
