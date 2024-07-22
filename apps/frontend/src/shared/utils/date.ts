import dayjs, { ConfigType } from "dayjs";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";

const date = dayjs;
date.extend(duration);
date.extend(localizedFormat);

const getDuration = (duration: number) => {
	const seconds = dayjs.duration(duration, "milliseconds").seconds();
	const minutes = dayjs.duration(duration, "milliseconds").format("mm");
	const hours = dayjs.duration(duration, "milliseconds").asHours().toFixed();

	return {
		hours,
		minutes,
		seconds,
	} as const;
};

const formatDate = (date: ConfigType, template: string | undefined = "L") => {
	return dayjs(date).format(template);
};

export { getDuration, formatDate };
