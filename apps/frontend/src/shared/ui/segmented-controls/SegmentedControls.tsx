import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/shared/libs";

const Tabs = TabsPrimitive.Root;

const SegmentedControls = React.forwardRef<
	React.ElementRef<typeof Tabs>,
	Omit<React.ComponentPropsWithoutRef<typeof Tabs>, "defaultValue" | "value"> & {
		defaultValue?: string | number;
		value?: string | number;
	}
>(({ className, children, defaultValue, value, ...props }, ref) => {
	const effectiveDefaultValue = String(defaultValue);

	return (
		<Tabs {...props} value={String(value)} defaultValue={effectiveDefaultValue} ref={ref}>
			<TabsList className={className}>{children}</TabsList>
		</Tabs>
	);
});

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(
			"  inline-flex h-10 items-center justify-center rounded-md bg-gray-4 p-1 [&>*]:flex-grow",
			className
		)}
		{...props}
	/>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const Control = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>, "value"> & {
		value: number | string;
	}
>(({ className, value, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		type="button"
		value={String(value)}
		className={cn(
			"inline-flex text-semi-primary data-[state=active]:font-semibold data-[state=inactive]:opacity-50 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-base font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm active-bold disabled:cursor-not-allowed",
			className
		)}
		{...props}
	/>
));
Control.displayName = TabsPrimitive.Trigger.displayName;

export { Control, SegmentedControls };
