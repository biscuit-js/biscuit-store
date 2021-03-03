

/**
 * Function for creating a channel
 */
export const makeChannel = () => {
	let chan = null;
	return {

		/**
         * The function writes data to the channel.
         * @param {object} payload the data for a send
         */
		include: (payload) => {
			if (chan?.resolve) {
				chan.resolve({ ...payload, ...chan.payload });
				chan = null;
			}
		},

		/**
         * Function for extracting data from a channel.
         * @param {object} payload the data for a mail merge
         * @return {Promise}
         */
		extract: (payload) => {
			return new Promise((resolve) => {
				chan = { payload, resolve };
			});
		},
	};
};