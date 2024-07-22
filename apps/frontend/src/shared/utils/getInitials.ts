export default (value: string) => {
	let name = value;
	if (name.split(" ").length > 1) {
		const splitedName = name.split(" ");
		name = splitedName[0]!.charAt(0) + splitedName[1]!.charAt(0);
	} else if (name.length > 1) {
		const nameLength = name.length;
		name = name.slice(0, nameLength / 2)[0]! + name.slice(nameLength / 2, nameLength)[0];
	} else {
		name = name.charAt(0);
	}

	return name;
};
