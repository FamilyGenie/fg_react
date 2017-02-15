export default function reducer(
	state = {
		parentalRels: [],
		fetching: false,
		error: null,
	},
	action = ""
) {
	switch (action.type) {
		case "FETCH_PARENTALRELS": {
			return {
				...state,
				fetching: true
			};
		}
		case "FETCH_PARENTALRELS_REJECTED": {
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		}
		case "FETCH_PARENTALRELS_FULFILLED": {
			return {
				...state,
				fetching: false,
				parentalRels: action.payload,
			};
		}
		case "UPDATE_PARENTALREL": {
			return {
				...state,
				fetching: true
			};
		}
		case "UPDATE_PARENTALREL_FULFILLED": {
			// todo: throw error on invalid field???
			const newParentalRel = action.payload;
			const oldParentalRelIndex = state.parentalRels.findIndex(
				rel => rel._id === newParentalRel._id
			);
			const newParentalRels = [
				...state.parentalRels.slice(0, oldParentalRelIndex),
				newParentalRel,
				...state.parentalRels.slice(oldParentalRelIndex+1)
			];

			return {
				...state,
				fetching: false,
				parentalRels: newParentalRels,
			};
		}
		case "UPDATE_PARENTALREL_REJECTED": {
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		}
		case "CREATE_PARENTALREL": {
			return {
				...state,
				fetching: true
			};
		}
		case "CREATE_PARENTALREL_FULFILLED": {
			return {
				...state,
				fetching: false,
				parentalRels: [
					...state.parentalRels,
					action.payload
				]
			};
		}
		case "CREATE_PARENTALREL_REJECTED": {
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		}
		case "DELETE_PARENTALREL": {
			return {
				...state,
				fetching: true
			};
		}
		case "DELETE_PARENTALREL_FULFILLED": {
			// todo: throw error on invalid field???
			// the delete person api returns all people, so just set the
			// newPeople array to the payload that is returned
			return {
				...state,
				fetching: false,
				parentalRels: action.payload,
			};
		}
		case "DELETE_PARENTALREL_REJECTED": {
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		}
		case "CLEAR_PARENTALRELS": {
			return {
				...state,
				fetching: false,
				parentalRels: []
			};
		}
	}
	return state
}
