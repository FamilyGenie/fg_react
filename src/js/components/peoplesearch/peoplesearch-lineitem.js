import React from 'react';

export default class PeopleSearchLineItem extends React.Component {
	render = () => (
		<div class="row person-item">
            <div class="col-xs-2 custom-input">
                <input
                    class="form-control"
                    type="text"
                    defaultValue={this.props.person.fName}
                />
            </div>
            <div class="col-xs-2 custom-input">
                <input
                    class="form-control"
                    type="text"
                    defaultValue={this.props.person.mName}
                />
            </div>
        </div>
	);
}
