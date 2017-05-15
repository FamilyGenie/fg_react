import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import moment from 'moment';

import SingleMap from './singlemap';
import Legend from './legend';
import { createTree, treeFunctions, getLeft, getRight } from '../../functions/relpath';

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
			events:
				store.events.events,
			parentalRels:
				store.parentalRels.parentalRels,
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
			fullName: '',
			mapArray: [],
			scale: .33,
		};
	}

	componentDidUpdate = (prevProps, prevState) => {
		console.log('in componentDidUpdate');
		if (this.props.people.length && this.props != prevProps) {
			console.log('in componentDidUpdate 2');
			this.setNewState();
		} else if (this.state.scale != prevState.scale) {
			console.log('in componentDidUpdate 3');
			this.setState({
				mapArray: this.createMapArray(this.state.star_id)
			})
		}
		ReactDOM.findDOMNode(this).scrollIntoView();
	}

	componentDidMount = () => {
		console.log('in megamap, componentDidMount');
		this.setNewState();
	}

	setNewState = () => {
		const star = this.getPersonById(this.props.star_id);
			if (star) {
				var vDate = moment(star.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD');
				this.setState({
					vDate: vDate,
					star_id: star._id,
					starAge: 18,
					fullName: star.fName + ' ' + star.lName,
					mapArray: this.createMapArray(star._id),
					scale: .33,
				});
			}
	}

	getPersonById = (_id) => {
		// want to find the person in the local person array, in case a person has been added by this map function. this.people is a copy of the store.people.people at the beginning of the function. This function may add people (the star's parents most germainly) to the local people copy.
		return this.props.people.find(function(person){
			return person._id === _id;
		});
	}

	zoomOut = () => {
		var zoom = this.state.zoom - 1;
		// this.setState({
		// 	zoom: zoom
		// });
	}

	zoomIn = () => {
		console.log('in zoom: ', this.state.scale);
		this.setState({
			scale: 1
		});
		// var zoom = this.state.zoom + 1;
		// this.setState({
		// 	zoom: zoom
		// });
	}

	createMapComponent = (star_id, vDate, scale, xPosTranslate, yPosTranslate) => {
		return <SingleMap star_id={star_id} vDate={vDate} scale={this.state.scale} key={star_id} xPosTranslate={xPosTranslate} yPosTranslate={yPosTranslate}/>
	}

	createMapArray = (star_id) => {
		let mapArray = [];
		const startX = 500;
		let moveX = 200;
		let moveY = 200;

		let tree = createTree(star_id, this.props.people, this.props.parentalRels, this.props.events);
		console.log("Tree: ", tree);

		// set node to the start of the tree, and then draw the single map for the head of the tree (which is the ID passed into this component through props)
		let node = tree;
		// first, draw the map for person whose megaMap it is
		mapArray.push(this.createMapComponent(node.person._id, moment(node.person.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD'), .33, startX, yPos));
		// set node to start of tree, and then getLeft, which gets node's mother

		node = getLeft(node)
		let newComp;
		let xPos = startX + moveX;
		let yPos = moveY;
		while (node) {
			newComp = this.createMapComponent(node.person._id, moment(node.person.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD'), .33, xPos, yPos);
			mapArray.push(newComp);
			xPos += moveX;
			yPos += moveY;
			node = getLeft(node);
		}

		// go back to head of tree, and draw the father lines
		node = tree;
		node = getRight(node);
		xPos = startX - moveX;
		yPos = moveY;
		while (node) {
			newComp = this.createMapComponent(node.person._id, moment(node.person.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD'), .33, xPos, yPos);
			mapArray.push(newComp);
			xPos -= moveX;
			yPos += moveY;
			node = getRight(node);
		}
		return mapArray;
	}



	render = () => {

		// d3.select("body")
		// 	.append("svg")
		// 	.attr("width", "100%")
		// 	.attr("height", "100%")
		// 	.call(d3.behavior.zoom().on("zoom", function () {
		// 	svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
		// 	}))
		// 	.append("g");

		return(
			<div class="mainDiv">
				<div class="mainMap" id="mainMapHead">
					<div class="mapHeader">
						<div class="dateToggle">
							<div class="zoom">
								<p class="zoomHead">Zoom</p>
								<i class="fa fa-plus buttonSize3 button2" onClick={this.zoomIn}></i>
								<i class="fa fa-minus buttonSize3 button2" onClick={this.zoomOut}></i>
							</div>
						</div>
						<h1 class="map-header">{this.state.fullName}'s Family Map </h1>
					</div>
				</div>
				<div class="mainMap" id="mainMap">
					<svg
						width="1400"
						height="1400"
					>
					</svg>
				</div>
				{this.state.mapArray}
			</div>
		)
	}
}
