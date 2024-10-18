import { ReactNode } from "react";
import { FieldPath, FieldValues } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "..";
import { Switch } from "../../switch";

import { FieldProps } from "./checkbox-field";

type SwitchFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
	description?: string | ReactNode;
	className?: string;
	onChange?: (value: boolean) => void;
} & FieldProps<TFieldValues, TName>;

export const SwitchField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
	control,
	name,
	render,
	label,
	description,
	className,
	onChange,
	...rest
}: SwitchFieldProps<TFieldValues, TName>) => {
	return (
		<FormField
			name={name}
			control={control}
			render={({ field, fieldState, formState }) => (
				<FormItem className={className}>
					<FormControl>
						<Switch
							checked={field.value}
							onCheckedChange={(val) => {
								field.onChange(val);
								onChange?.(val);
							}}
						/>
					</FormControl>
					<div className="space-y-1">
						<FormLabel className="text-md">{label}</FormLabel>
						<FormDescription>{description}</FormDescription>
					</div>
					{render?.({ field, fieldState, formState })}
				</FormItem>
			)}
			{...rest}
		/>
	);
};
