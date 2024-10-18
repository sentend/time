import { VariantProps, cva } from "class-variance-authority";
import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@/shared/libs";
import { Slot } from "@radix-ui/react-slot";

export const textVariants = cva("", {
	variants: {
		variant: {
			secondary: " text-secondary",
			error: " text-red-600",
			default: " text-primary",
			subtle: " text-semi-primary",
			success: " text-green-400",
			warning: " text-orange-400",
			link: " text-blue-400",
			primary: " text-primary font-semibold",
			tertiary: " text-tertiary",
		},
		decoration: {
			underline: " underline",
		},
		size: {
			xs: "text-xs",
			sm: "text-sm",
			base: "text-base",
			md: " text-md",
			lg: " text-lg",
		},
	},
	defaultVariants: {
		size: "base",
		variant: "default",
	},
	compoundVariants: [
		{
			variant: "tertiary",
			size: "xs",
			className: " uppercase leading-3 font-bold",
		},
	],
});

export type TextProps = {
	asChild?: boolean;
	truncate?: boolean;
	highlighted?: boolean;
} & VariantProps<typeof textVariants> &
	HTMLAttributes<HTMLParagraphElement>;

const Text = forwardRef<HTMLParagraphElement, TextProps>(
	({ className, variant, size, decoration, asChild, truncate, highlighted, ...props }, ref) => {
		const Comp = asChild ? Slot : "p";

		return (
			<Comp
				ref={ref}
				className={cn(textVariants({ size, decoration, variant, className }), {
					truncate: truncate,
					"bg-tm-color-4": highlighted,
				})}
				{...props}
			>
				{props.children}
			</Comp>
		);
	}
);

export default Text;
