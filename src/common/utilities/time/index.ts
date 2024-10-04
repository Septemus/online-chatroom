import {
	differenceInDays,
	differenceInMinutes,
	differenceInWeeks,
	differenceInYears,
} from "date-fns";
export function dateDiffSimpleString(d1: Date, d2: Date): string {
	const tmp: Record<string, string> = {
		diff_year: differenceInYears(d1, d2) + "y",
		diff_week: differenceInWeeks(d1, d2) + "w",
		diff_day: differenceInDays(d1, d2) + "d",
		diff_min: differenceInMinutes(d1, d2) + "m",
	};
	for (const i in tmp) {
		if (tmp[i][0] !== "0") {
			return tmp[i];
		}
	}
	return "";
}
