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
				// '57d38829ddcdc72d349f927a',
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
	(dispatch) => {
		return {
			openNewPersonModal: () => {
				dispatch(openNewPersonModal());
			},
			setNewPersonModal: (child) => {
				dispatch(setNewPersonModal(child));
			}
		}
	}
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

    // this function will be called when the user hits the button to subtract a year and then re-draw the map
	subtractYear = () => {
		var vDate = moment(this.state.vDate).subtract(1,'year').format('YYYY-MM-DD');
		var vStarAge = parseInt(this.state.starAge) - 1;
		// also set the state variable
		this.setState({
			vDate: vDate,
			starAge: vStarAge
		});
		// this.drawMap(this.mapStartX);
	}

    // this function will be called when the user hits the button to add a year and then re-draw the map
	addYear = () => {
		var vDate = moment(this.state.vDate).add(1,'year').format('YYYY-MM-DD');
		var vStarAge = parseInt(this.state.starAge) + 1;
		// also set the state variable
		this.setState({
			vDate: vDate,
			starAge: vStarAge
		});
		// this.drawMap(this.mapStartX);
	}

	// this function is to make the input box for the age a "controlled component". Good information about it here: https://facebook.github.io/react/docs/forms.html
	onAgeChange = (evt) => {
		var star = this.getPersonById(this.props.star_id);
		var vDate = moment(star.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(evt.target.value,'y').format('YYYY-MM-DD');

		this.setState({
			vDate: vDate,
			starAge: evt.target.value,
			mapArray: []
		});
		// this.drawMap(this.mapStartX);
	}

	toggleLegend = () => {
		if(this.state.legendShowing === false) {
			$("#legend").css({"display": "flex"});
			$("#mainMap").css({"min-height": "1100px"});
			this.setState({legendShowing: true});
		}
		if (this.state.legendShowing === true) {
			$("#legend").css({"display": "none"});
			$("#mainMap").css({"min-height": "800px"});
			this.setState({legendShowing: false});
		}
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

	createMapComponent = (star_id, vDate, scale) => {
		return <SingleMap star_id={star_id} vDate={vDate} scale={scale} key={star_id}/>
	}

	createMapArray = () => {
		var star = this.getPersonById('57d639cdd9a9db9e36353c9a');
		var newComp = this.createMapComponent(star._id, moment(star.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD'), .75);
		this.state.mapArray.push(newComp);
		this.setState({
			mapArray: this.state.mapArray
		})

		// var star = this.getPersonById('57d31c66b189048209d53d6f');
		// mappArray.push(createMapComponent(star._id, moment(star.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(evt.target.value,'y').format('YYYY-MM-DD'), .25));

	}

	componentDidMount = () => {
		this.createMapArray();
	}

	render = () => {
		console.log('in megamap render with state: ', this.state);

		return(
			<div class="mainDiv">
				<div id="legend">
					<Legend toggleLegend={this.toggleLegend}/>
				</div>
				<div class="mainMap" id="mainMapHead">
					<div class="mapHeader">
						<div class="dateToggle">
							<div class="mapDate">
								<div class="mapDateContents">
									<p class="mapDateHeader">Family Map As Of:</p>
									<p class="mapDateText">{this.state.vDate}</p>
								</div>
								<div class="starAgeLegend">
									<p class="starAge">Star's Age:</p>
									<input
										id="ageInput"
										class="form-control ageInput"
										type="text"
										value={this.state.starAge}
										onChange={this.onAgeChange}
									/>
								<p class="starAge2">{this.state.starAge}</p>
								<button type="button" class="btn btn-default btn-Legend" onClick={this.toggleLegend}>Legend</button>
								</div>
							</div>
							<div class="mapArrow">
								<i class="fa fa-arrow-circle-up buttonSize2 button2" onClick={this.addYear}></i>
								<i class="fa fa-arrow-circle-down buttonSize2 button2" onClick={this.subtractYear.bind(this)}></i>
							</div>
							<div class="zoom">
								<p class="zoomHead">Zoom</p>
								<i class="fa fa-plus buttonSize3 button2" onClick={this.zoomIn}></i>
								<i class="fa fa-minus buttonSize3 button2" onClick={this.zoomOut}></i>
							</div>
						</div>
						<h1 class="map-header">{this.state.fullName}'s Family Map </h1>
					</div>
				</div>
				{this.state.mapArray}
			</div>
		)
	}
}
