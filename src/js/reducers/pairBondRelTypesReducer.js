// this is just storing static values, so no need for actions
export default function reducer(
	state = {
		pairBondRelTypes: [
			{ value: 'Marriage', label: 'Marriage' },
			{ value: 'Informal', label: 'Informal'}
		],
		fetching: false,
		error: null,
	},
	action = ""
) {
	return state;
}
