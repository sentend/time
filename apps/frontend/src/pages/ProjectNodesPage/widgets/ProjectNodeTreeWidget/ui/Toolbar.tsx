import { useRef } from "react";

import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { cn } from "@/shared/utils";
import { useKeyboard } from "@/shared/hooks";
import { IconArrowRight, NewFolderIcon } from "@/shared/assets";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Input,
	Text,
} from "@/shared/ui";

type ToolbarProps = {
	onNewFolderButtonClick: () => void;
};

const Toolbar = ({ onNewFolderButtonClick }: ToolbarProps) => {
	const { t } = useTranslation();

	const inputRef = useRef<HTMLInputElement>(null);

	const [queryParams, setQueryParams] = useSearchParams();

	const initialInputValue = queryParams.get("q") ?? "";

	const onEnter = () => {
		if (document.activeElement === inputRef.current) {
			setQueryParams((prev) => {
				prev.set("q", inputRef.current!.value);
				return prev;
			});
		}
	};

	const onEsc = () => {
		inputRef.current?.blur();
	};

	useKeyboard({ key: "Enter", callback: onEnter });
	useKeyboard({ key: "Escape", callback: onEsc });

	const currentQueryState = queryParams.get("completed");

	let buttonText: string = t("all");
	if (currentQueryState === "true") {
		buttonText = t("completed");
	} else if (currentQueryState === "false") {
		buttonText = t("open");
	}

	return (
		<div className="w-full">
			<div className="flex justify-end gap-3">
				<Button size={"sm"} onClick={onNewFolderButtonClick}>
					<NewFolderIcon className="stroke-gray-70" />
					{t("folder.new")}
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="font-medium" size={"sm"}>
							{buttonText}
							<IconArrowRight className="rotate-90 stroke-gray-30" height={20} width={20} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						<DropdownMenuItem
							selected={currentQueryState === "false"}
							textValue={t("open")}
							className="cursor-pointer"
							onSelect={() => {
								setQueryParams((prev) => {
									prev.set("completed", "false");
									return prev;
								});
							}}
						>
							<Text>{t("open")}</Text>
						</DropdownMenuItem>
						<DropdownMenuItem
							selected={currentQueryState === "true"}
							textValue={t("completed")}
							className="cursor-pointer"
							onSelect={() =>
								setQueryParams((prev) => {
									prev.set("completed", "true");
									return prev;
								})
							}
						>
							<Text>{t("completed")}</Text>
						</DropdownMenuItem>
						<DropdownMenuItem
							selected={!currentQueryState}
							textValue={t("all")}
							className="cursor-pointer"
							onSelect={() =>
								setQueryParams((prev) => {
									prev.delete("completed");
									return prev;
								})
							}
						>
							<Text>{t("all")}</Text>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<div className={cn("relative flex items-center bg-gray-4 rounded-md ", {})}>
					<Input
						defaultValue={initialInputValue}
						ref={inputRef}
						className="w-sidebar focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
						size={"sm"}
						placeholder={t("searchAndFilters")}
					/>
					{/*
					//todo rewrite when design ready
					 */}
					<div>
						<Button
							size={"xs"}
							variant={"default"}
							className=" bg-gray-4"
							onClick={() => {
								if (queryParams.get("q")) {
									setQueryParams((prev) => {
										prev.delete("q");
										return prev;
									});
								}
								if (inputRef.current) {
									inputRef.current.value = "";
								}
							}}
						>
							&#x2717;
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Toolbar;
