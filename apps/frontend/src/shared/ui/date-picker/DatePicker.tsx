import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { cn, formatDate } from "@/shared/libs";
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";

//todo refactor
export function DatePickerDemo({ value, onChangeDate }) {
	const [date, setDate] = React.useState<Date>();

	console.log(value);
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal",
						!value && "text-muted-foreground"
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{value ? formatDate(value, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar mode="single" selected={value} onSelect={onChangeDate} initialFocus />
			</PopoverContent>
		</Popover>
	);
}
