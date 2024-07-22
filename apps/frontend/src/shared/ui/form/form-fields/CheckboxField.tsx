import React, { ReactNode } from "react";
import {
	ControllerFieldState,
	ControllerProps,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
	UseFormStateReturn,
} from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel } from "..";
import { Checkbox } from "../..";

export type FieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
	label?: string | ReactNode;
	render?: ({
		field,
		fieldState,
		formState,
	}: {
		field: ControllerRenderProps<TFieldValues, TName>;
		fieldState: ControllerFieldState;
		formState: UseFormStateReturn<TFieldValues>;
	}) => React.ReactNode;
} & Omit<ControllerProps<TFieldValues, TName>, "render">;

const CheckboxField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
	control,
	name,
	render,
	label,
	...rest
}: FieldProps<TFieldValues, TName>) => {
	return (
		<FormField
			name={name}
			control={control}
			render={({ field, fieldState, formState }) => (
				<FormItem orientation="horizontal" className="flex flex-row items-center cursor-pointer">
					<FormControl>
						<Checkbox checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
					<FormLabel className="font-medium">{label}</FormLabel>
					{render?.({ field, fieldState, formState })}
				</FormItem>
			)}
			{...rest}
		/>
	);
};

export default CheckboxField;
