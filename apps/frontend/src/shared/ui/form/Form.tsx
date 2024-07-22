import { Slot } from "@radix-ui/react-slot";
import {
	ComponentProps,
	ComponentPropsWithoutRef,
	ElementRef,
	HTMLAttributes,
	createContext,
	forwardRef,
	useContext,
	useId,
} from "react";
import {
	Controller,
	ControllerProps,
	FieldPath,
	FieldValues,
	FormProvider,
	SubmitHandler,
	UseFormReturn,
} from "react-hook-form";

import { cn } from "@/shared/utils";
import { Label } from "@/shared/ui";

export type FormProps<T extends FieldValues> = {
	onSubmit: SubmitHandler<T>;
	formMethods: UseFormReturn<T>;
	disabled?: boolean;
} & Omit<ComponentProps<"form">, "onSubmit">;

const Form = <T extends FieldValues = FieldValues>({
	formMethods,
	children,
	onSubmit,
	disabled,
	className,
	...props
}: FormProps<T>) => {
	return (
		<FormProvider<T> {...formMethods}>
			<form
				onSubmit={formMethods.handleSubmit(onSubmit)}
				className={className}
				{...props}
				noValidate
			>
				<fieldset disabled={disabled} className={className}>
					{children}
				</fieldset>
			</form>
		</FormProvider>
	);
};

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
	name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
};

const useFormField = () => {
	const fieldContext = useContext(FormFieldContext);
	const itemContext = useContext(FormItemContext);

	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>");
	}

	const { id } = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		// ...fieldState,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement> & { orientation?: "vertical" | "horizontal" }
>(({ className, orientation = "vertical", ...props }, ref) => {
	const id = useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div
				ref={ref}
				className={cn(orientation === "vertical" ? "space-y-[6px]" : "space-x-2", className)}
				{...props}
			/>
		</FormItemContext.Provider>
	);
});
FormItem.displayName = "FormItem";

const FormLabel = forwardRef<ElementRef<"label">, ComponentPropsWithoutRef<"label">>(
	({ className, ...props }, ref) => {
		const { formItemId } = useFormField();

		return (
			<Label
				ref={ref}
				className={cn("font-semibold text-base text-primary", className)}
				htmlFor={formItemId}
				{...props}
			/>
		);
	}
);
FormLabel.displayName = "FormLabel";

const FormControl = forwardRef<ElementRef<typeof Slot>, ComponentPropsWithoutRef<typeof Slot>>(
	({ ...props }, ref) => {
		const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

		return (
			<Slot
				ref={ref}
				id={formItemId}
				aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
				aria-invalid={!!error}
				{...props}
			/>
		);
	}
);
FormControl.displayName = "FormControl";

const FormDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
	({ className, ...props }, ref) => {
		const { formDescriptionId } = useFormField();

		return (
			<p
				ref={ref}
				id={formDescriptionId}
				className={cn("text-base text-semi-primary font-normal", className)}
				{...props}
			/>
		);
	}
);
FormDescription.displayName = "FormDescription";

const FormMessage = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
	({ className, children, ...props }, ref) => {
		const { error, formMessageId } = useFormField();
		const body = error ? String(error?.message) : children;

		if (!body) {
			return null;
		}

		return (
			<p
				ref={ref}
				id={formMessageId}
				className={cn("text-base font-medium text-destructive", className)}
				{...props}
			>
				{body}
			</p>
		);
	}
);
FormMessage.displayName = "FormMessage";

export {
	useFormField,
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	FormField,
};
