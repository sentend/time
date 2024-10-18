import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/shared/libs";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";

type ComboboxProps = {
	placeholder?: string;
	value?: string;
	onInputChange: () => void;
	data: any[];
} & React.ComponentProps<typeof Popover>;
export function Combobox({ value, onInputChange, data, open, ...props }: ComboboxProps) {
	return (
		<Popover {...props}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value
						? data.find((framework) => framework.value === value)?.label
						: "Select framework..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search framework..." />
					<CommandEmpty>No framework found.</CommandEmpty>
					<CommandGroup>
						{data.map((framework) => (
							<CommandItem
								key={framework.value}
								value={framework.value}
								onSelect={(currentValue) => {
									setValue(currentValue === value ? "" : currentValue);
									setOpen(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										value === framework.value ? "opacity-100" : "opacity-0"
									)}
								/>
								{framework.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
