import { useTranslation } from "react-i18next";
import { ColorPalette } from "@/shared/ui/color-palette";
import { Separator } from "@/shared/ui/separator";
import {
	submitForm,
	$formErrors,
	colorIdChanged,
	nameChanged,
	$name,
	$colorId,
	$members,
} from "../model";
import { useUnit } from "effector-react";
import { Input } from "@/shared/ui/input";

export const CreateProjectForm = () => {
	const { t } = useTranslation();

	const [name, colorId, members, formErrors] = useUnit([$name, $colorId, $members, $formErrors]);

	const [handleSubmit, handleNameChange, handleColorChange] = useUnit([
		submitForm,
		nameChanged,
		colorIdChanged,
	]);

	console.log(formErrors);

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-full" id="project-form">
			<div className="space-y-4">
				<div className="flex gap-7">
					<div className="flex-1">
						<Input placeholder={t("name")} value={name} onChange={handleNameChange} />
					</div>
					<div>
						<ColorPalette selectedColorId={colorId} onColorSelect={handleColorChange} />
					</div>
				</div>
			</div>
			<Separator />
		</form>
	);
};

{
	/* <div>
					<FormField
						control={control}
						name="client"
						render={({ field }) => {
							return (
								<Popover open={isClientPopoverOpen} modal onOpenChange={setIsClientPopoverOpen}>
									<PopoverTrigger asChild>
										<Text
											size={"md"}
											decoration={"underline"}
											className="cursor-pointer"
											onClick={() => {
												setIsClientPopoverOpen(true);
											}}
										>
											{field.value?.name || t("project.selectClient")}
										</Text>
									</PopoverTrigger>
									<PopoverAnchor />
									<PopoverPortal />
									<PopoverContent align="start">
										<Command shouldFilter={false}>
											<CommandInput
												onValueChange={(val) => {
													console.log(val);
													debounceSetClientsSearch(val);
												}}
												placeholder={t("searchClient")}
											/>
											<CommandEmpty>No clients found.</CommandEmpty>
											{clients?.map((client) => {
												return (
													<CommandItem
														key={client.id}
														value={client.id}
														onSelect={() => {
															field.onChange(client);
															// setValue("client", client);
															setIsClientPopoverOpen(false);
														}}
													>
														{client.name}
													</CommandItem>
												);
											})}
										</Command>
									</PopoverContent>
								</Popover>
							);
						}}
					/>
				</div> */
}
{
	/* <div className="flex gap-3 flex-col">
					<CheckboxField
						name="isNotedRequired"
						control={control}
						label={t("project.requireNotes")}
					/>
					<CheckboxField name="isTagsRequired" control={control} label={t("project.requireTag")} />
				</div> */
}

{
	/* <div>
				<SwitchField
					name="isBillable"
					control={control}
					description={t("project.billable.description")}
					label={t("project.billable.title")}
					className="grid grid-cols-auto items-start gap-x-8 gap-y-5 space-y-0"
					render={() => {
						return (
							<>
								{watchIsBillable && (
									<div className="col-start-2 col-end-3 flex items-end gap-7">
										<div className="flex flex-col gap-[6px]">
											{
												//?what items place here?
											}
											<span className="text-base font-semibold">
												{t("project.hourlyRate.title")}
											</span>
											<Select defaultValue="userRate">
												<SelectTrigger className="w-[220px]">
													<SelectValue defaultValue={"userRate"} />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="specificRate">
														{t("project.hourlyRate.specificRate")}
													</SelectItem>
													<SelectItem value="userRate">
														{t("project.hourlyRate.userRate")}
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="flex gap-3 items-center">
											<label className="text-semi-primary" htmlFor="">
												{t("perHour")}
											</label>
										</div>
									</div>
								)}
							</>
						);
					}}
				/>
			</div>
			<Separator /> */
}
{
	/* <div>
				<SwitchField
					name="isBudgetSet"
					control={control}
					onChange={(val) => {
						if (val) {
							setValue("budgetType", getValues("budgetType") ?? 2);
							setValue("budgetInterval", getValues("budgetInterval") ?? 1);
						}
					}}
					description={t("project.enableBudget.description")}
					label={t("project.enableBudget.title")}
					className="grid grid-cols-auto items-start gap-x-8 gap-y-5 space-y-0"
					render={({ field }) => {
						if (!field.value) {
							return null;
						}
						return (
							<div className="flex gap-5 flex-col col-start-2">
								<div className="flex gap-7 flex-[1]">
									<div>
										<label className="block text-primary mb-[6px] font-semibold" htmlFor="">
											{t("project.budgetType.title")}
										</label>
										<FormField
											name="budgetType"
											control={control}
											render={({ field: { onChange, value: budgetTypeValue } }) => {
												return (
													<SegmentedControls
														className="w-[220px]"
														value={budgetTypeValue!}
														onValueChange={(val) => {
															let effectiveValue: string | number = val;

															if (!isNaN(Number(val))) {
																effectiveValue = Number(val);

																// budgetTypeLastValueUsed.current = effectiveValue;
															}
															onChange(effectiveValue);
														}}
													>
														{typeBudgetSegments.map(({ name, value, disabledContent, ...rest }) => {
															let content = (
																<Control key={value} value={value} {...rest}>
																	{name}
																</Control>
															);

															if (rest.disabled) {
																content = (
																	<Tooltip key={value}>
																		{
																			<TooltipContent>
																				<div className="flex flex-col gap-1 justify-center items-center">
																					<Text>{disabledContent}</Text>
																					<Text
																						className="cursor-pointer hover:underline"
																						onClick={handleTooltipTextClick}
																						variant={"primary"}
																					>
																						{t("project.setBillableAndRevenue")}
																					</Text>
																				</div>
																			</TooltipContent>
																		}
																		<TooltipTrigger className="[&>*]:w-full">
																			{content}
																		</TooltipTrigger>
																	</Tooltip>
																);
															}
															return content;
														})}
													</SegmentedControls>
												);
											}}
										/>
									</div>
									<div className="flex-[1]">
										<InputField
											{...register("budgetValue")}
											placeholder="$ 0,00"
											label={t("project.budgetAmount")}
										/>
									</div>
								</div>
								<div className="flex flex-row items-center space-x-[6px]">
									<Checkbox
										checked={isRecurring}
										id="isReccuring"
										onCheckedChange={handleRecurringChange}
									/>
									<label htmlFor="tags">{t("project.isRecurring")}</label>
								</div>
								{isRecurring && (
									<div className="flex gap-7">
										<div>
											<label className="block text-primary mb-[6px] font-semibold" htmlFor="">
												{t("interval")}
											</label>
											<Controller
												name="budgetInterval"
												control={control}
												render={({ field: { onChange, value: budgetIntervalValue } }) => {
													return (
														<SegmentedControls
															className="w-[220px]"
															value={budgetIntervalValue!}
															onValueChange={(val) => {
																let effectiveValue: string | number = val;

																if (!isNaN(Number(val))) {
																	effectiveValue = Number(val);
																	// budgetIntervalLastValueUsed.current = effectiveValue;
																}
																onChange(effectiveValue);
															}}
														>
															{intervalBudgetSegments.map((segment) => (
																<Control key={segment.value} value={segment.value}>
																	{segment.name}
																</Control>
															))}
														</SegmentedControls>
													);
												}}
											/>
										</div>
										<div className="flex gap-4 w-full">
											<div className="flex-[1]">
												<label className="block text-primary mb-[6px] font-semibold" htmlFor="">
													{t("startDate")}
												</label>
												<Controller
													control={control}
													name="budgetStartDate"
													render={({ field }) => {
														return (
															<DatePickerDemo
																value={field.value}
																onChangeDate={(e: Date) => {
																	field.onChange(new Date(e));
																}}
															/>
														);
													}}
												/>
											</div>
											//todo add formField date picker
											<div className="flex-[1]">
												<label className="block text-primary mb-[6px] font-semibold" htmlFor="">
													{t("endDate")}
												</label>
												<DatePickerDemo />
											</div>
										</div>
									</div>
								)}
							</div>
						);
					}}
				/>
			</div> */
}
{
	/* <Separator /> */
}
{
	/* <FormField
								control={control}
								name="members"
								render={({ field }) => {
									console.log(field.value);

									return (
										<UserBlock
											users={field.value}
											onUserSelect={(val) => {
												console.log(field.value, val);
												field.onChange([...field.value!, { ...val, isManager: false }]);
											}}
										/>
									);
								}}
							/> */
}
