
let box = null;
export const container = {
	include: (actions) => {
		for (let key in actions) {
			box = { ...box, [actions[key].name]: actions };
		}
	},
	extract: (storeName) => {
		return box[storeName];
	},
};