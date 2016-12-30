// this is just storing static values, so no need for actions
export default function reducer(state={
		parentalRelSubTypes: [
			{ value: 'Biological', label: 'Biological' },
			{ value: 'Step', label: 'Step'},
			{ value: 'Adopted', label: 'Adopted'}
		],
		fetched: true,
		fetching: false,
		error: null,
	}, action) {
	return state;
}
