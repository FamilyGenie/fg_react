import React from "react"
import { connect } from "react-redux"

import { fetchUser } from "../actions/userActions"
import { fetchPeople } from "../actions/peopleActions"

@connect((store) => {
  console.log("in Layout.js, @connect");
  return {
    user: store.user.user,
    userFetched: store.user.fetched,
    people: store.people.people,
  };
})
export default class Layout extends React.Component {
  componentWillMount() {
    // console.log("in Layout, componentWillMount, with this.props: ", this.props);
    this.props.dispatch(fetchPeople());
  }

  render() {
    console.log("in layout, with props: ", this.props);
    const { user, people } = this.props;

    const mappedPeople = people.map(person => 
        <div key={person._id} class="row person-item">
            <div class="col-xs-2 custom-input">
                <input
                    class="form-control"
                    type="text"
                    defaultValue={person.fName}
                />
            </div>
            <div class="col-xs-2 custom-input">
                <input
                    class="form-control"
                    type="text"
                    defaultValue={person.mName}
                />
            </div>
        </div>
    );

    console.log("just before Layout.js return html");

    return <div>
        <div class="container">
            <h1>Family Members</h1>
        </div>
        <div>
            <div class="row">
                <div class="col-xs-2 title bold can-click">
                    First Name
                </div>
                <div class="col-xs-2 title bold can-click">
                    Middle Name
                </div>
            </div>
        </div>
        <div>
            {mappedPeople}
        </div>
    </div>
  }
}
