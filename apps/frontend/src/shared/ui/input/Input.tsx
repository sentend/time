import * as React from "react";

import { VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
	"flex w-full rounded-md px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-tertiary bg-gray-4",
	{
		variants: {
			size: {
				xs: "h-7",
				sm: "h-8 ",
				md: "h-10",
				lg: "h-11 ",
			},
		},
		defaultVariants: {
			size: "md",
		},
	}
);

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
		VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, size, ...props }, ref) => {
		return (
			<input type={type} className={inputVariants({ size, className })} ref={ref} {...props} />
		);
	}
);
