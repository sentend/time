import { TTimeEntry } from "~types/models";
import { TimeEntry } from "../timeEntry";
import pick from "lodash/pick";

export default (timeEntry: TimeEntry): TTimeEntry => {
	const effectiveTask = timeEntry.task!;

	const effectiveTimeEntry: TTimeEntry = {
		...timeEntry,
		task: {
			...pick<typeof effectiveTask, Exclude<keyof TTimeEntry["task"], "parentName">>(
				effectiveTask,
				["id", "colorId", "name"],
			),
			parentName: effectiveTask.parent?.name ?? null,
		},
		effectiveColor: effectiveTask.colorId ?? effectiveTask.cachedColorId,
		createdAt: timeEntry.createdAt.getTime(),
		updatedAt: timeEntry.updatedAt.getTime(),
		beginDate: timeEntry.beginDate?.getTime() ?? null,
		endDate: timeEntry.endDate?.getTime() ?? null,
	};

	return effectiveTimeEntry;
};
