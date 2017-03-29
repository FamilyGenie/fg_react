import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import SingleMap from './singlemap';
import Legend from './legend';

export default class OneMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// store this state value for display purposes
			date: "1988-12-03",
			starAge: 18,
			legendShowing: false,
			star_id: '57d427c1d9a9db9e36353c91'
		};
	}

    // this function will be called when the user hits the button to subtract a year and then re-draw the map
	subtractYear = () => {
		this.dateFilterString = moment(this.dateFilterString).subtract(1,'year').format('YYYY-MM-DD');
		var vStarAge = parseInt(this.state.starAge) - 1;
		// also set the state variable
		this.setState({
			dateFilterString: moment(this.dateFilterString.toString().replace(/T.+/, '')).format('MM/DD/YYYY'),
			starAge: vStarAge
		});
		this.drawMap(this.mapStartX);
	}

    // this function will be called when the user hits the button to add a year and then re-draw the map
	addYear = () => {
		this.dateFilterString = moment(this.dateFilterString).add(1,'year').format('YYYY-MM-DD');
		var vStarAge = parseInt(this.state.starAge) + 1;
		// also set the state variable
		this.setState({
			dateFilterString: moment(this.dateFilterString.toString().replace(/T.+/, '')).format('MM/DD/YYYY'),
			starAge: vStarAge
		});
		this.drawMap(this.mapStartX);
	}

	render = () => {
		console.log('in onemap render with state: ', this.state);

		return(
			<div class="mainDiv2">
				<div id="legend">
					<Legend toggleLegend={this.toggleLegend}/>
				</div>
				<div class="mainMap" id="mainMap">
					<div class="mapHeader">
						<div class="dateToggle">
							<div class="mapDate">
								<div class="mapDateContents">
									<p class="mapDateHeader">Family Map As Of:</p>
									<p class="mapDateText">{this.state.dateFilterString}</p>
								</div>
								<div class="starAgeLegend">
									<p class="starAge">Star's Age:</p>
									<input
										id="ageInput"
										class="form-control ageInput"
										type="text"
										defaultValue={this.state.starAge}
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
						<h1 class="map-header">{this.fullName}'s Family Map </h1>
					</div>
				</div>
				<SingleMap star_id={this.state.star_id} date={this.state.date}/>
			</div>
		)
	}
}
