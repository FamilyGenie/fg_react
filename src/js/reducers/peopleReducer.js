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
      // case "UPDATE_PERSON": {
      //   const { id, text } = action.payload
      //   const newPeople = [...state.people]
      //   const personToUpdate = newPeople.findIndex(tweet => tweet.id === id)
      //   newpeople[tweetToUpdate] = action.payload;

      //   return {
      //     ...state,
      //     people: newpeople,
      //   }
      // }
      case "DELETE_PERSON": {
        return {
          ...state,
          people: state.people.filter(person => person._id !== action.payload),
        }
      }
    }

    return state
}