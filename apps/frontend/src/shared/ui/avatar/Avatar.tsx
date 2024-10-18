import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { VariantProps, cva } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import { cn } from "@/shared/libs";

export const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
	variants: {
		size: {
			sm: "h-[30px] w-[30px]",
			md: "h-9 w-9",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export type AvatarProps = {
	imgSrc?: string;
	fallbackText?: string;
	fallbackProps?: ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>;
	avatarImageProps?: ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>;
} & VariantProps<typeof avatarVariants>;

export const Avatar = forwardRef<
	ElementRef<typeof AvatarPrimitive.Root>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & AvatarProps
>(({ className, imgSrc, fallbackText, fallbackProps, avatarImageProps, size, ...props }, ref) => {
	return (
		<AvatarPrimitive.Root ref={ref} className={avatarVariants({ size, className })} {...props}>
			<AvatarImage {...avatarImageProps} src={imgSrc} />
			<AvatarFallback {...fallbackProps}>{fallbackText}</AvatarFallback>
		</AvatarPrimitive.Root>
	);
});

const AvatarImage = forwardRef<
	ElementRef<typeof AvatarPrimitive.Image>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image
		ref={ref}
		className={cn("aspect-square h-full w-full", className)}
		{...props}
	/>
));

const AvatarFallback = forwardRef<
	ElementRef<typeof AvatarPrimitive.Fallback>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn(
			"flex h-full w-full items-center justify-center rounded-full bg-muted",
			className
		)}
		{...props}
	/>
));
