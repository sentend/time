import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

import { cn } from "@/shared/libs";

const buttonVariants = cva("btn-base text-base bg-main gap-2", {
	variants: {
		variant: {
			default: "bg-gray-6 text-primary hover:bg-gray-10",
			primary: "bg-gray-90 text-white hover:bg-gray-90/80",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			outline: "border border-gray-10 bg-transparent hover:bg-gray-4",
			ghost: "hover:bg-gray-6 bg-transparent",
			link: "underline-offset-4 hover:underline",
			//todo add hover
		},
		size: {
			xs: "h-7 px-3 text-xs",
			sm: "h-8 px-3",
			md: "h-10 px-5 py-2",
			lg: "h-11 px-6 text-md",
			icon: "h-10 w-10",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
	loadingIndicator?: ReactNode;
	startIcon?: ReactNode;
	endIcon?: ReactNode;
	loadingPosition?: "start" | "end";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			children,
			loading,
			asChild = false,
			disabled,
			loadingIndicator,
			type = "button",
			startIcon,
			endIcon,
			loadingPosition,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";

		const effectiveDisabled = loading || disabled;

		const effectiveLoadingIndicator = loadingIndicator || "Loading...";

		let startContent = startIcon;
		if (loading && loadingPosition === "start") {
			startContent = effectiveLoadingIndicator;
		}

		let endContent = endIcon;
		if (loading && loadingPosition === "end") {
			endContent = effectiveLoadingIndicator;
		}

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={effectiveDisabled}
				type={type}
				{...props}
			>
				{startContent}
				{loading && !loadingPosition ? effectiveLoadingIndicator : children}
				{endContent}
			</Comp>
		);
	}
);

export { Button, buttonVariants };
