export default function reducer(
	state={
		status: null,
		fetching: false,
		error: null,
	},
	action = ""
) {

	switch (action.type) {
		case "IMPORT_PERSON": {
			return {
				...state,
				fetching: true
			};
		}
		case "IMPORT_PERSON_REJECTED": {
			return {
				...state,
				fetching: false
			};
		}
		case "IMPORT_PERSON_FULFILLED": {
			return {
				...state,
				fetching: false
			};
		}
    case "RUN_IMPORT": {
      return {
        ...state,
        fetching: true
      };
    }
    case "RUN_IMPORT REJECTED": {
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    }
    case "RUN_IMPORT_FULFILLED": {
      return {
        ...state,
        fetching: false,
      };
    }
	}

	return state
}
