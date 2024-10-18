import {
	ColumnDef,
	Row,
	SortingState,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { cn } from "@/shared/libs";
import { useState } from "react";
import { IconFullArrowUp } from "@/shared/assets";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onRowClick?: (row: Row<TData>) => void;
	cellClassName?: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	onRowClick,
	cellClassName,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const { getHeaderGroups, getRowModel } = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
	});

	const rows = getRowModel().rows;

	return (
		<Table className="border-separate table-fixed border-spacing-y-2">
			<TableHeader>
				{getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map(({ id, isPlaceholder, column, getContext, ...rest }) => {
							console.log(column);
							return (
								<TableHead key={id} className={cn("", column.columnDef.meta?.header?.className)}>
									{isPlaceholder ? null : (
										<div className="inline-flex items-center gap-2">
											{flexRender(column.columnDef.header, getContext())}
											{column?.columnDef.enableSorting && sorting[0]?.id === column.id ? (
												<IconFullArrowUp
													className={cn("fill-tertiary", {
														"rotate-180": sorting[0].desc,
													})}
													height={11}
												/>
											) : null}
										</div>
									)}
								</TableHead>
							);
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody className="cursor-pointer">
				{rows.length ? (
					rows.map((row) => (
						<TableRow
							key={row.id}
							data-state={row.getIsSelected() && "selected"}
							onClick={(e) => {
								onRowClick?.(row);
							}}
						>
							{row.getVisibleCells().map((cell) => {
								return (
									<TableCell
										key={cell.id}
										className={cn(
											"first-of-type:rounded-s-xl last-of-type:rounded-e-xl bg-white px-5 py-[10px]",
											cellClassName,
											cell.column.columnDef.meta?.cell?.className
										)}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								);
							})}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} className="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
