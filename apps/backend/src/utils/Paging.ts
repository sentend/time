import { ParsedQs } from "qs";
import { parseQSToInt } from "./QueryStringUtils";

export class Paging {
	readonly limit: number;
	readonly offset: number;

	constructor(limit: number, offset: number) {
		this.limit = limit;
		this.offset = offset;
	}

	static fromQuery(query: ParsedQs | undefined | null): Paging | undefined {
		if (!query?.limit) {
			return undefined;
		}
		const effectiveLimit = parseQSToInt(query?.limit);
		const effectiveOffset = parseQSToInt(query?.offset);
		if (effectiveLimit !== undefined && effectiveOffset !== undefined) {
			return new Paging(effectiveLimit, effectiveOffset);
		}
		return undefined;
	}
}
