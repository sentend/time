import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { apiClient } from "@/shared/api/apiClient";
import { useAppStore } from "@/shared/store";
import {
	Button,
	CheckboxField,
	ColorPalette,
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	Control,
	DatePickerDemo,
	Dialog,
	DialogContent,
	DialogHeader,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	InputField,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SegmentedControls,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	SwitchField,
	Text,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/ui";
import { Checkbox } from "@/shared/ui/checkbox";

import { getIntervalBudgetSegments, getTypeBudgetSegments } from "./constants";
import UserBlock from "./UserBlock";

import useCurrentWorkspace from "@/shared/hooks/useCurrentWorkspace";
import useCurrentUser from "@/shared/hooks/useCurrentUser";

import keys from "lodash/keys";
import pick from "lodash/pick";

import { PopoverAnchor, PopoverPortal } from "@radix-ui/react-popover";
import { useDebounce } from "@/shared/hooks";
import type { TProject } from "~types/models";
import type { GetProjectsService } from "~types/services";

const memberSchema = z.object({
	isManager: z.boolean(),
	userId: z.string(),
});

const projectSchema = z.object({
	name: z
		.string()
		.min(1, { message: "nameIsRequired" })
		.refine((value) => value.trim(), { message: "invalid name" }),
	colorId: z.number(),
	isNotedRequired: z.boolean(),
	isTagsRequired: z.boolean(),
	isBillable: z.boolean(),
	// rateValue: z.number(),
	isBudgetSet: z.boolean(),
	budgetType: z.coerce.number().nullable(),
	budgetValue: z.coerce.number().nullable(),
	budgetInterval: z.coerce.number().nullable(),
	budgetStartDate: z.coerce
		.date()
		.nullable()
		.transform((date) => date?.getTime() ?? null),
	budgetEndDate: z.coerce
		.date()
		.nullable()
		.transform((date) => date?.getTime() ?? null),
	members: z.array(memberSchema).nullable(),
	client: z
		.object({
			name: z.string(),
			id: z.string(),
		})
		.nullable()
		.optional(),
});

export type ProjectFormInputs = z.infer<typeof projectSchema>;

type ProjectEditorProps = {
	projectId?: TProject;
	closeDialog: () => void;
	onCloseDialog?: () => void;
};

const ProjectEditor = ({ projectId, closeDialog, onCloseDialog }: ProjectEditorProps) => {
	const { t } = useTranslation();

	const [isDialogOpen, setIsDialogOpen] = useState(true);
	const [isClientPopoverOpen, setIsClientPopoverOpen] = useState(false);
	const [isRecurring, setIsRecurring] = useState(false);
	const [clientsSearch, setClientsSearch] = useState("");

	const debounceSetClientsSearch = useDebounce((val: string) => setClientsSearch(val), 150);

	const { updateWorkspaceNextProjectColor } = useAppStore();
	const currentWorkspace = useCurrentWorkspace();
	const currentUser = useCurrentUser();

	const { isPending, data: clients } = useQuery({
		queryKey: ["clients", clientsSearch],
		queryFn: async () => {
			const res = await apiClient.getClients(clientsSearch);
			console.log(res);
			return res;
		},
		enabled: !!clientsSearch,
	});

	const {
		isSuccess: isProjectSuccessLoaded,
		isLoading: isProjectLoading,
		data: project,
	} = useQuery({
		queryKey: ["project", projectId],
		queryFn: async () => {
			const res = await apiClient.getOneProject(projectId!);
			return res;
		},
		enabled: !!projectId,
		gcTime: 0,
	});

	const formMethods = useForm<ProjectFormInputs>({
		defaultValues: {
			name: "",
			colorId: currentWorkspace.nextProjectColorId,
			isNotedRequired: false,
			isTagsRequired: false,
			isBillable: false,
			isBudgetSet: false,
			budgetEndDate: null,
			budgetInterval: null,
			budgetStartDate: null,
			budgetType: null,
			budgetValue: null,
			members: [{ userId: currentUser.id, isManager: true }],
		},
		values: project,
		resolver: zodResolver(projectSchema),
	});
	const { register, formState, control, setValue, watch, getValues, reset, setFocus } = formMethods;

	const { errors } = formState;
	console.log("formstate ", formState);

	const measuredRef = useCallback(() => {
		setFocus("name");
	}, [setFocus]);

	useEffect(() => {
		if (isProjectSuccessLoaded) {
			if (project.budgetStartDate || project.budgetEndDate) {
				setIsRecurring(true);
			}

			setFocus("name", { shouldSelect: true });
		}
	}, [isProjectSuccessLoaded, project, reset, setFocus]);

	useEffect(() => {
		if (isRecurring) {
			let date = new Date();
			if (project?.id && project.budgetStartDate) {
				date = new Date(project.budgetStartDate);
			}
			setValue("budgetStartDate", date.getTime());
			getValues("budgetInterval") === null && setValue("budgetInterval", 1);
		}
	}, [isRecurring, setValue, project, getValues]);

	useEffect(() => {
		return () => {
			onCloseDialog?.();
		};
	}, [onCloseDialog]);

	const watchIsBillable = watch("isBillable", false);

	useEffect(() => {
		const subscription = watch((value, { name, type }) => console.log(value, name, type));

		return () => subscription.unsubscribe();
	}, [watch]);

	useEffect(() => {
		if (!watchIsBillable && getValues("budgetType") === 1) {
			setValue("budgetType", 2);
		}
	}, [watchIsBillable, getValues, setValue]);

	const typeBudgetSegments = useMemo(
		() => getTypeBudgetSegments(t, watchIsBillable),
		[watchIsBillable, t]
	);

	const intervalBudgetSegments = useMemo(() => {
		return getIntervalBudgetSegments(t);
	}, [t]);

	const queryClient = useQueryClient();

	const { isPending: isLoading, mutate: create } = useMutation({
		mutationKey: ["create", "project"],
		mutationFn: async (data: ProjectFormInputs) => {
			console.log("DATA", data);
			const project = await apiClient.createProject({
				...data,
				workspaceId: currentWorkspace.id,
				createdBy: currentUser.id,
				updatedBy: currentUser.id,
			});

			return project;
		},

		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["projects"] });

			onOpenChange();
			setTimeout(() => {
				updateWorkspaceNextProjectColor();
			}, 200);
		},
	});

	const { isPending: isLoadingUpdate, mutate: update } = useMutation({
		mutationKey: ["update", "project"],
		mutationFn: async (data: ProjectFormInputs) => {
			const updatedProject = await apiClient.updateProject(project!.id, {
				...data,
				workspaceId: currentWorkspace.id,
				updatedBy: currentUser.id,
			});

			return updatedProject;
		},

		onSuccess(data) {
			queryClient.setQueriesData(
				{ queryKey: ["projects"] },
				(oldData: GetProjectsService.ProjectItem[] | undefined) => {
					let res = oldData;
					if (oldData?.length) {
						const effectiveOldData = [...oldData];
						const index = effectiveOldData.findIndex((project) => project.id === data.id);

						const project = effectiveOldData.at(index)!;

						const updatedProject = {
							...project,
							...pick(data, keys(project)),
							clientName: data.client?.name ?? null,
						};

						effectiveOldData.splice(index, 1, updatedProject);
						res = effectiveOldData;
					}

					return res;
				}
			);

			onOpenChange();
		},
	});

	const onSubmit: SubmitHandler<ProjectFormInputs> = (data) => {
		if (!data.isBudgetSet) {
			data.budgetType = null;
			data.budgetInterval = null;
			data.budgetValue = null;
			data.budgetStartDate = null;
			data.budgetEndDate = null;
		}

		if (!isRecurring) {
			data.budgetInterval = null;
			data.budgetStartDate = null;
			data.budgetEndDate = null;
		}
		project?.id ? update(data) : create(data);
	};

	console.log("ERRORS", errors);

	const onOpenChange = () => {
		setIsDialogOpen(false);
		setTimeout(() => {
			closeDialog();
		}, 200);
	};

	const onTooltipTextClick = () => {
		setValue("isBillable", true);
		setValue("budgetType", 1);
	};

	return (
		<Dialog defaultOpen open={isDialogOpen} onOpenChange={onOpenChange}>
			<DialogContent className="p-8 max-w-[760px]">
				{projectId && isProjectLoading ? (
					"Loading project..."
				) : (
					<>
						<DialogHeader className="font-bold text-xl">
							{project?.id ? t("project.edit") : t("project.new")}
						</DialogHeader>
						<Form
							formMethods={formMethods}
							onSubmit={onSubmit}
							className="flex flex-col gap-8 max-w-full"
							disabled={isLoadingUpdate || isLoading}
						>
							<div ref={measuredRef} className="space-y-4">
								<div className="flex gap-7">
									<div className="flex-1">
										<InputField
											{...register("name", { required: true })}
											label={t("project.name")}
											placeholder={t("name")}
											description={errors.name?.message}
										/>
									</div>
									<div>
										<FormField
											name="colorId"
											control={control}
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t("color")}</FormLabel>
													<FormControl>
														<ColorPalette
															selectedColorId={field.value}
															onClick={(_, colors) => {
																field.onChange(colors.colorIndex);
															}}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
								</div>
								<div>
									<FormField
										control={control}
										name="client"
										render={({ field }) => {
											return (
												<Popover
													open={isClientPopoverOpen}
													modal
													onOpenChange={setIsClientPopoverOpen}
												>
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
								</div>
								<div className="flex gap-3 flex-col">
									<CheckboxField
										name="isNotedRequired"
										control={control}
										label={t("project.requireNotes")}
									/>
									<CheckboxField
										name="isTagsRequired"
										control={control}
										label={t("project.requireTag")}
									/>
								</div>
							</div>
							<Separator />
							<div>
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
															{
																//todo create NumericInput and replace it
															}
															{/* <Input className="w-[132px]" {...register("rateValue")} /> */}
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
								<div></div>
							</div>
							<Separator />
							<div>
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
																		{typeBudgetSegments.map(
																			({ name, value, disabledContent, ...rest }) => {
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
																											onClick={onTooltipTextClick}
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
																			}
																		)}
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
														onCheckedChange={(checked: boolean) => setIsRecurring(checked)}
													/>
													<label htmlFor="tags">{t("project.isRecurring")}</label>
												</div>
												{isRecurring && (
													<div className="flex gap-7">
														<div>
															<label
																className="block text-primary mb-[6px] font-semibold"
																htmlFor=""
															>
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
																<label
																	className="block text-primary mb-[6px] font-semibold"
																	htmlFor=""
																>
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
																<label
																	className="block text-primary mb-[6px] font-semibold"
																	htmlFor=""
																>
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
							</div>
							<Separator />
							<FormField
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
							/>
							<div className="flex justify-end mt-9 gap-4">
								<Button
									loading={isLoading || isLoadingUpdate}
									type="reset"
									onClick={() => onOpenChange()}
								>
									{" "}
									{t("cancel")}
								</Button>
								<Button
									variant={"primary"}
									loading={isLoading || isLoadingUpdate}
									type="submit"
									disabled={!!project?.id && !formState.isDirty}
								>
									{project?.id ? t("update") : t("create")}
								</Button>
							</div>
						</Form>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default ProjectEditor;
