export default function reducer(state={
    people: [],
    fetching: false,
    fetched: false,
    error: null,
  }, action) {

    switch (action.type) {
      case "FETCH_PEOPLE": {
        return {...state, fetching: true}
      }
      case "FETCH_PEOPLE_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_PEOPLE_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          people: action.payload,
        }
      }
      case "ADD_PERSON": {
        return {
          ...state,
          people: [...state.people, action.payload],
        }
      }
      case "UPDATE_PERSON": {
        // todo: throw error on invalid field???
        const { _id, field, value } = action.payload
        const oldPersonIndex = state.people.findIndex(person => person._id === _id);
        const oldPerson = state.people[oldPersonIndex];
        const newPerson = {...oldPerson};
        newPerson[field] = value;
        const newPeople = [...state.people.slice(0, oldPersonIndex), newPerson, ...state.people.slice(oldPersonIndex+1)];

        return {
          ...state,
          people: newPeople,
        }
      }
      case "DELETE_PERSON": {
        return {
          ...state,
          people: state.people.filter(person => person._id !== action.payload),
        }
      }
    }

    return state
}