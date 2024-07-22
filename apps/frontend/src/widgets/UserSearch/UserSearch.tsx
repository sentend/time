import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/shared/ui";

import { UserCard } from "@/entities/user";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDebounce } from "@/shared/hooks";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { GetProjectMembersSearch, GetProjectService } from "~types/services";

type UserSearch = {
	onSelect?: (user: GetProjectService.Member) => void;
	notIncludeUserIds?: GetProjectService.Member["id"][];
};

const UserSearch = ({ onSelect, notIncludeUserIds }: UserSearch) => {
	const { t } = useTranslation();

	const [search, setSearch] = useState("");
	const setDebounceSearch = useDebounce((val: string) => setSearch(val));

	const { data: members } = useQuery({
		queryKey: ["users", "project", search],
		queryFn: async () => {
			console.log("call search func", search);
			const res = await apiClient.getProjectMembersSearch(search);
			return res.filter((member) => !notIncludeUserIds?.includes(member.id));
		},
		enabled: !!search,
	});

	return (
		<Command className="rounded-lg border" shouldFilter={false}>
			<CommandInput
				autoFocus
				placeholder={t("findUsersOrTeam")}
				onValueChange={(val) => {
					setDebounceSearch(val);
				}}
			/>
			<CommandList>
				<CommandEmpty>{t("noResults")}</CommandEmpty>
				{!!members?.length && (
					<CommandGroup heading={t("user.plural")} className="flex flex-col gap-1">
						{members.map((user) => {
							console.log(user);
							return (
								<CommandItem
									value={user.id}
									key={user.id}
									onSelect={(value) => {
										const member = members.find((member) => member.id === value);
										onSelect?.(member!);
									}}
								>
									<UserCard user={user} />
								</CommandItem>
							);
						})}
					</CommandGroup>
				)}
			</CommandList>
		</Command>
	);
};

export default UserSearch;
