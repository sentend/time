import { useTranslation } from "react-i18next";
import { Logo, TimeentriesIcon, TimelineIcon, TimesheetIcon, SettingsIcon } from "@/shared/assets";
import { SidebarItem } from "./sidebar-item";
import { Separator } from "@/shared/ui/separator";
import { Avatar } from "@/shared/ui/avatar";
import { memo } from "react";
import { useUnit } from "effector-react";
import { $currentUser } from "@/entities/user";
import { $currentWorkspace } from "@/entities/workspace";
import { router } from "@/shared/router";

export const Sidebar = memo(() => {
	const { t } = useTranslation();
	const [currentUser, currentWorkspace] = useUnit([$currentUser, $currentWorkspace]);

	if (!currentUser || !currentWorkspace) {
		router.push("signin");
		return null;
	}

	return (
		<div className="w-sidebar flex-shrink-0 overflow-y-auto">
			<div className="fixed z-2 bg-main top-0 left-0 border-r-[1px] border-gray-6 px-[10px] py-[30px] w-sidebar h-full">
				<div className="relative h-full w-full">
					<Logo className="ml-[10px] mb-9 w-[30px] h-[30px]" />
					<div className="overflow-y-auto h-[calc(100%-120px)] space-y-2">
						{/* <SidebarItem
							Icon={TimelineIcon}
							name={t("sidebar.timeline")}
							// to={router.}
						/> */}
						<SidebarItem
							Icon={TimeentriesIcon}
							name={t("sidebar.timeEntries")}
							to={`${currentWorkspace.id}/timeentries`}
						/>
						<SidebarItem
							Icon={TimesheetIcon}
							name={t("sidebar.timesheet")}
							to={`${currentWorkspace.id}/timesheet`}
						/>
						<Separator className="bg-gray-6" />
						<SidebarItem
							Icon={TimelineIcon}
							name={t("sidebar.projects")}
							to={router.projects({ workspaceId: String(currentWorkspace.id) })}
						/>
						<SidebarItem
							Icon={TimeentriesIcon}
							name={t("sidebar.reports")}
							to={`${currentWorkspace.id}/reports`}
						/>
						<SidebarItem
							Icon={TimesheetIcon}
							name={t("sidebar.members")}
							to={`${currentWorkspace.id}/members`}
						/>
						<Separator className="bg-gray-6" />
						<SidebarItem
							Icon={SettingsIcon}
							name={t("sidebar.settings")}
							to={`${currentWorkspace.id}/settings`}
						/>
					</div>
					<div
						className="absolute bottom-0 left-0 px-[10px] flex items-center gap-2"
						// onClick={logout}
					>
						<Avatar fallbackText={currentUser.initials} size={"sm"} />
						<span>{currentUser.name}</span>
					</div>
				</div>
			</div>
		</div>
	);
});
