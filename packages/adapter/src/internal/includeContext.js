const ctxTempl = { send: 1, getAction: 1, payload: 1, state: 1 };

/**
 * Allows you to include the dataset in the adapter context
 * can get data from asynchronous asynchronous function
 * @param {function} ctxCreator context creator function
 * @param {object} options behavioral options
 * @async
 */
export function includeContext(ctxCreator, options = { catche: true }) {
	let counter = 0;

	const ctxWork = async () => {
		let check = true;
		if (options.catche) {
			check = counter === 0;
		}

		if (check) {
			const ctx = await ctxCreator();
			if (Object.keys(ctx).some((el) => ctxTempl[el])) {
				throw new Error(
					'An attempt to overwrite the standard context fields was detected.'
				);
			}

			return ctx;
		}

		counter += 1;
	};

	this.modify = ctxWork;
};