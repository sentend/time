import { DurationDisplay } from "@/entities/node";
import { IconFullArrowUp, IconTimeEntriesArrowMark } from "@/shared/assets";
import { config } from "@/shared/config";
import { Text } from "@/shared/ui";
import { cn, formatDate } from "@/shared/utils";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { SetURLSearchParams } from "react-router-dom";

import { TTimeEntry } from "~types/models";
import TimeEntriesDropDownWidget from "./widgets/DropDown/TimeEntriesDropDownWidget";

export const getColumns = (
	t: TFunction,
	searchParams: URLSearchParams,
	setSearchParams: SetURLSearchParams
): ColumnDef<TTimeEntry>[] => [
	{
		id: "toFrom",
		enableSorting: true,
		header: ({ column, table }) => {
			return (
				<div
					className="flex items-center gap-2 cursor-pointer"
					onClick={() => {
						column.toggleSorting(column.getIsSorted() === "asc");
						setSearchParams((prev) => {
							prev.set("sort", `${column.id}+${column.getIsSorted() === "asc" ? "asc" : "desc"}`);
							return prev;
						});
					}}
				>
					<div className="inline-flex flex-col items-end">
						<Text variant={"tertiary"} size={"xs"}>
							{t("timeEntries.to")}
						</Text>
						<Text variant={"tertiary"} size={"xs"}>
							{t("timeEntries.from")}
						</Text>
					</div>
				</div>
			);
		},
		cell({ row }) {
			const timeEntry = row.original;
			return (
				<div className="space-y-3 w-[20px]">
					{timeEntry.beginDate && (
						<Text className="font-bold text-[11px] leading-[13px]">
							{formatDate(new Date(timeEntry.beginDate), "HH:MM")}
						</Text>
					)}
					{timeEntry.endDate && (
						<Text variant={"secondary"} className="font-bold text-[11px] leading-[13px]">
							{formatDate(new Date(timeEntry.endDate), "HH:MM")}
						</Text>
					)}
				</div>
			);
		},
		meta: {
			header: {
				className: "w-[80px]",
			},
		},
	},
	{
		id: "mark",
		cell({ row }) {
			const colorId = row.original.effectiveColor;
			return (
				<IconTimeEntriesArrowMark height={47} className={cn("", config.colors[colorId]?.stroke)} />
			);
		},
		meta: {
			cell: {
				className: "px-0 w-10",
			},
			header: {
				className: "p-0 w-[14px]",
			},
		},
	},
	{
		id: "projectTasks",
		enableSorting: true,
		header: ({ column }) => (
			<Text
				variant={"tertiary"}
				size={"xs"}
				className="cursor-pointer"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{t("timeEntries.projectTasks")}
			</Text>
		),
		cell({ row }) {
			const timeEntry = row.original;
			return (
				<div>
					{timeEntry.task.parentName && (
						<Text variant={"secondary"} size={"xs"} className="font-bold">
							{timeEntry.task.parentName}
						</Text>
					)}
					<Text size={"md"} className="font-semibold">
						{timeEntry.task.name}
					</Text>
				</div>
			);
		},
	},
	{
		id: "notes",
		header: () => (
			<Text variant={"tertiary"} size={"xs"} className="cursor-pointer">
				{t("timeEntries.notes")}
			</Text>
		),
		cell({ row }) {
			const timeEntry = row.original;
			return (
				<Text variant={"secondary"} className="text-[13px] line-clamp-2 whitespace-pre-wrap">
					{timeEntry.notes}
				</Text>
			);
		},
		meta: {
			cell: {
				className: "truncate",
			},
		},
	},
	{
		id: "revenue",
		header: () => (
			<Text variant={"tertiary"} size={"xs"} className="cursor-pointer">
				{t("timeEntries.revenue")}
			</Text>
		),
		cell({ row }) {
			const timeEntry = row.original;
			return <Text>{timeEntry.confirmedRevenue}</Text>;
		},
		meta: {
			header: {
				className: "w-[80px]",
			},
		},
	},
	{
		id: "trackedTime",
		header: () => (
			<Text variant={"tertiary"} size={"xs"} className="cursor-pointer whitespace-nowrap">
				{t("timeEntries.trackedTime")}
			</Text>
		),
		cell({ row, column }) {
			const timeEntry = row.original;
			return (
				<>
					<DurationDisplay
						variant={"default"}
						duration={timeEntry.confirmedDuration ?? 0}
						formatTemplate={4}
						className=""
					/>
					<div className="absolute right-0 h-full top-0 flex items-center justify-center translate-x-full pl-4">
						<TimeEntriesDropDownWidget />
					</div>
				</>
			);
		},
		meta: {
			header: {
				className: "w-[100px]",
			},
		},
	},
];
