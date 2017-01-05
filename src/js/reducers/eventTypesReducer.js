// this is just storing static values, so no need for actions
export default function reducer(
	state = {
		eventTypes: [
			{ value: 'Birth', label: 'Birth' },
			{ value: 'Death', label: 'Death'},
			{ value: 'Custom', label: 'Custom'},
		],
		fetched: true,
		fetching: false,
		error: null,
	},
	action = ""
) {
	return state;
}
