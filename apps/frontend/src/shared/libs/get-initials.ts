export const getInitials = (value: string) => {
	const name = value;
	let initials = name.charAt(0);
	if (name.split(" ").length > 1) {
		const splitedName = name.split(" ");
		initials = splitedName[0]!.charAt(0) + splitedName[1]!.charAt(0);
	} else if (name.length > 1) {
		const nameLength = name.length;
		initials = name.slice(0, nameLength / 2)[0]! + name.slice(nameLength / 2, nameLength)[0];
	}

	return initials;
};
