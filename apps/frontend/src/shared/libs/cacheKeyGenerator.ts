export const cacheKeyGenerator = <Tag extends string>(tag: Tag) => {
	const cacheKeysGenerator = {
		all: () => [tag] as const,
		lists: () => [...cacheKeysGenerator.all(), "list"] as const,
		list: <TArg>(arg: TArg) => [...cacheKeysGenerator.lists(), arg] as const,
		details: () => [...cacheKeysGenerator.all(), "detail"] as const,
		detail: <TId extends number | string>(id: TId) =>
			[...cacheKeysGenerator.details(), id] as const,
		detailByParams: <TParams>(params: TParams) =>
			[...cacheKeysGenerator.details(), params] as const,
	};

	return cacheKeysGenerator;
};
