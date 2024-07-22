import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";

import { FormControl, FormDescription, FormItem, FormLabel, Input } from "../..";

type InputFormFieldProps = {
	label?: string | ReactNode;
	description?: string | ReactNode;
} & ComponentPropsWithoutRef<typeof Input>;

const InputField = forwardRef<HTMLInputElement, InputFormFieldProps>(
	({ label, description, ...rest }, ref) => {
		return (
			<FormItem>
				{label && <FormLabel>{label}</FormLabel>}
				<FormControl>
					<Input ref={ref} {...rest} />
				</FormControl>
				{description && <FormDescription>{description}</FormDescription>}
			</FormItem>
		);
	}
);

export default InputField;
