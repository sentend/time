import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/shared/utils";

export const checkboxVariants = cva(
	"peer shrink-0 rounded-sm border-2 border-gray-10 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-white",
	{
		variants: {
			size: {
				sm: "h-4 w-4",
				md: "h-5 w-5",
				lg: "h-6 w-6",
			},
		},
		defaultVariants: {
			size: "md",
		},
	}
);

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
	VariantProps<typeof checkboxVariants>;

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
	({ className, size, ...props }, ref) => (
		<CheckboxPrimitive.Root
			ref={ref}
			className={cn(checkboxVariants({ size, className }))}
			{...props}
		>
			<CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
				<Check className="h-4 w-4" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
