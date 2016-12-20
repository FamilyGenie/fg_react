import React from 'react';
import { connect } from "react-redux";

@connect(
	(store, ownProps) => {
		// Since we are passing the person in from the parent object, just map the component's props to the props that have come in (for now).
		console.log("in events lineitem, @connect, with: ", ownProps);
		return ownProps;
	}
)
export default class EventsLineItem extends React.Component {
	render = () => {
		const { events } = this.props;

		if (events) {
			return (
				<div class="row person-item">
					<div class="col-xs-4 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={events.eventDate}
						/>
					</div>
					<div class="col-xs-4 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={events.type}
						/>
					</div>
					<div class="col-xs-4 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={events.place}
						/>
					</div>
				</div>)
		} else {
			return (<p>Loading Events...</p>);
		}
	}
}
