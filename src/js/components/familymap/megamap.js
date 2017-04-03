import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import moment from 'moment';

import SingleMap from './singlemap';
import Legend from './legend';

@connect(
	(store, ownProps) => {
		return {
			star_id:
				ownProps.params.star_id,
			people:
				store.people.people.map(function(person) {
					// set the values from the actual person record to null, so they are not used in maps. We really shouldn't have this problem after March 17, 2017, because this is for backward compatiblity. Going forward, all new users should only have these events from the events table.
					// So, if you do a search on the entire database and no person record has a birthDate or deathDate as a field in any document, then we can remove these next two lines of code.
					person.birthDate = '';
					person.deathDate = '';

					 var birth = store.events.events.find(function(e) {
							return person._id === e.person_id && e.eventType === "Birth";
					 });
					 if (birth) {
						person.birthDate = birth.eventDate;
						person.birthDateUser = birth.eventDateUser;
						person.birthPlace = birth.eventPlace;
					 }

					 var death = store.events.events.find(function(e) {
							return person._id === e.person_id && e.eventType === "Death";
					 });

					 if (death) {
						person.deathDate = death.eventDate;
						person.deathDateUser = death.eventDateUser;
						person.deathPlace = death.eventPlace;
					 }

					return person;
				}),
		};
	},
)
export default class MegaMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// store this state value for display purposes
			vDate: '',
			starAge: 18,
			legendShowing: false,
			star_id: '',
			zoom: 100,
			mapArray: [],
		};
	}

	componentDidUpdate = (prevProps, prevState) => {
		console.log('in mega componentDidUpdate');
		if (prevProps !== this.props) {
			const star = this.getPersonById(this.props.star_id);
			if (star) {
				var vDate = moment(star.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD');
				this.setState({
					vDate: vDate,
					star_id: star._id,
					starAge: 18,
					fullName: star.fName + ' ' + star.lName,
				});
			}
			this.createMapArray();
		}
		ReactDOM.findDOMNode(this).scrollIntoView();
	}

	getPersonById = (_id) => {
		// want to find the person in the local person array, in case a person has been added by this map function. this.people is a copy of the store.people.people at the beginning of the function. This function may add people (the star's parents most germainly) to the local people copy.
		return this.props.people.find(function(person){
			return person._id === _id;
		});
	}

	zoomOut = () => {
		var zoom = this.state.zoom - 1;
		this.setState({
			zoom: zoom
		});
	}

	zoomIn = () => {
		var zoom = this.state.zoom + 1;
		this.setState({
			zoom: zoom
		});
	}

	createMapComponent = (star_id, vDate, scale, xPosTranslate, yPosTranslate) => {
		return <SingleMap star_id={star_id} vDate={vDate} scale={scale} key={star_id} xPosTranslate={xPosTranslate} yPosTranslate={yPosTranslate}/>
	}

	createMapArray = () => {
		// var star = this.getPersonById('57d639cdd9a9db9e36353c9a');
		var star = this.getPersonById('580594d381aa12e493d03435');
		var newComp = this.createMapComponent(star._id, moment(star.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD'), .25, 0, 0);
		this.state.mapArray.push(newComp);

		star = this.getPersonById('57d31c66b189048209d53d6f');
		newComp = this.createMapComponent(star._id, moment(star.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD'), .25, 300, 300);
		this.state.mapArray.push(newComp);

		star = this.getPersonById('57d38829ddcdc72d349f927a');
		newComp = this.createMapComponent(star._id, moment(star.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD'), .25, 600, 600);
		this.state.mapArray.push(newComp);

		this.setState({
			mapArray: this.state.mapArray
		})

	}

	componentDidMount = () => {
		console.log('in mega componentDidMount');
		this.createMapArray();
	}

	render = () => {
		console.log('in megamap render with state: ', this.state);

		return(
			<div class="mainDiv">
				<div>
					<h1 class="map-header">{this.state.fullName}'s Family Map </h1>
				</div>
				{this.state.mapArray}
			</div>
		)
	}
}
