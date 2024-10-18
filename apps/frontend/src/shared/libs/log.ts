export const log = {
	success(message: string) {
		console.log(`%c ${message} `, "background: #138d75; color: white;");
	},
	info(message: string) {
		console.log(`%c ${message} `, "background: #ABCEFF; color: black;");
	},
	error(message: string) {
		console.error(`%c ${message} `, "background: #FF3333; color: white;");
	},
};
