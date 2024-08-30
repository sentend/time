import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CirclePlus } from "@/shared/assets";
import { Button } from "@/shared/ui";

import { UserCard } from "@/entities/user";
import UserSearch from "../UserSearch/UserSearch";
import { GetProjectMembersSearch, GetProjectService } from "~types/services";

type UserBlockProps = {
	users?: GetProjectService.Member[] | null;
	onUserSelect?: (member: GetProjectService.Member) => void;
};

const UserBlock = ({ users, onUserSelect }: UserBlockProps) => {
	const { t } = useTranslation();

	const [isSearching, setIsSearching] = useState(false);

	return (
		<div>
			<h2 className="text-[16px] font-semibold mb-5">{t("members")}</h2>
			<div className="flex gap-2 flex-col mb-5">
				{users?.map((user) => {
					return <UserCard key={user.id} user={user} />;
				})}
			</div>

			{isSearching ? (
				<UserSearch
					notIncludeUserIds={users?.map((user) => user.id)}
					onSelect={(member) => {
						setIsSearching(false);
						onUserSelect?.(member);
					}}
				/>
			) : (
				<Button
					size={"xs"}
					className="gap-1"
					type="button"
					onClick={() => setIsSearching(true)}
					startIcon={<CirclePlus className="w-[14px] h-[14px]" />}
				>
					{t("addMember")}
				</Button>
			)}
		</div>
	);
};

export default UserBlock;
