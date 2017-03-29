export default function reducer(
  state={
    status: null,
    fetching: false,
    error: null,
  },
  action = ''
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
    case "IMPORT_PARENTALRELATIONSHIPS": {
      return {
        ...state,
        fetching: true
      };
    }
    case "IMPORT_PARENTALRELATIONSHIPS_REJECTED": {
      return {
        ...state,
        fetching: false,
        error: action.payload
      }
    }
    case "IMPORT_PARENTALRELATIONSHIPS_FULFILLED": {
      return {
        ...state,
        fetching: false,
      }
    }
    case "IMPORT_PAIRBONDRELATIONSHIPS": {
      return {
        ...state,
        fetching: true
      };
    }
    case "IMPORT_PAIRBONDRELATIONSHIPS_REJECTED": {
      return {
        ...state,
        fetching: false,
        error: action.payload
      }
    }
    case "IMPORT_PAIRBONDRELATIONSHIPS_FULFILLED": {
      return {
        ...state,
        fetching: false,
      }
    }
    case "IMPORT_PEOPLEANDEVENTS" : {
      return {
        ...state,
        fetching: true
      };
    }
    case "IMPORT_PEOPLEANDEVENTS_REJECTED": {
      return {
        ...state, 
        fetching: false,
        error: action.payload
      };
    }
    case "IMPORT_PEOPLEANDEVENTS_FULFILLED": {
      return {
        ...state,
        fetching: false
      };
    }
    case "CLEAR_STAGEDRECORDS": {
      return {
        ...state,
        fetching: true
      };
    }
    case "CLEAR_STAGEDRECORDS_REJECTED": {
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    }
    case "CLEAR_STAGEDRECORDS_FULFILLED": {
      return {
        ...state,
        fetching: false,
      }
    }
    case "CLEAR_ALLRECORDS": {
      return {
        ...state,
        fetching: true
      };
    }
    case "CLEAR_ALLRECORDS_REJECTED": {
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    }
    case "CLEAR_ALLRECORDS_FULFILLED": {
      return {
        ...state,
        fetching: false,
      }
    }
    case "AUTOIMPORT": {
      return {
        ...state,
        fetching: true
      };
    }
    case "AUTOIMPORT_REJECTED": {
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    }
    case "AUTOIMPORT_FULFILLED": {
      return {
        ...state,
        fetching: false,
      }
    }

  }
  return state;
}
