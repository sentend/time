import isString from "lodash/isString";
import { ParsedQs } from "qs";

export class Sorting {
	by: string;
	asc: boolean;

	constructor(by: string, asc: boolean) {
		this.by = by;
		this.asc = asc;
	}

	static fromQuery(query: ParsedQs | undefined | null, defaultBy: string): Sorting {
		let effectiveBy = defaultBy;
		let effectiveAsc = true;

		if (defaultBy.startsWith("-")) {
			effectiveBy = defaultBy.substring(1);
			effectiveAsc = false;
		}

		if (query) {
			if (isString(query.sortBy)) {
				effectiveBy = query.sortBy;
			}
			if (query.sortAsc) {
				effectiveAsc = query.sortAsc === "false" ? false : true;
			}
		}

		return new Sorting(effectiveBy, effectiveAsc);
	}

	toOrderBy() {
		return (t: any, { asc, desc }: { asc: (t: any) => any; desc: (t: any) => any }) => {
			const col = this.by;
			const keys = Object.keys(t);
			if (!keys.includes(col)) {
				return undefined;
			}
			if (this.asc) {
				return asc(t[col]);
			}
			return desc(t[col]);
		};
	}
}
