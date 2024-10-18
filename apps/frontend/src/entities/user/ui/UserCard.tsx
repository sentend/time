import React from "react";

import { Avatar } from "@/shared/ui/avatar";

import { useTranslation } from "react-i18next";
import { GetProjectService } from "~types/services";

export type UserCardProps = {
	user: GetProjectService.Member;
};

const UserCard = ({ user }: UserCardProps) => {
	const { t } = useTranslation();
	return (
		<div className="flex items-center gap-4 font-medium">
			<Avatar size={"sm"} fallbackText={user.initials} />
			{user.name}
			<div className="ml-8">{user.isManager && t("project.manager")}</div>
		</div>
	);
};

export { UserCard };
