// this is just storing static values, so no need for actions
export default function reducer(
	state = {
		parentalRelTypes: [
			{ value: 'Mother', label: 'Mother' },
			{ value: 'Father', label: 'Father'}
		],
		fetched: true,
		fetching: false,
		error: null,
	},
	action = ""
) {
	return state;
}
