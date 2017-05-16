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
		ReactDOM.findDOMNode(this).scrollIntoView();
	}

	componentDidMount = () => {
		console.log('in megamap, componentDidMount');
		this.setNewState();
	}

	shouldComponentUpdate = (prevProps, prevState) => {
		// if the mapArray has data, render the page
		if (this.state.mapArray.length) {
			return true;
		} else if (this.props.people.length && this.props.events.length && this.
			props.parentalRels.length && this.props !== prevProps) {
			// else if there is enough data to create the mapArray, do that (and if props are different, so there is new data to create the map array with)
			this.setNewState();
			return false;
		} else {
			// else do not render
			return false;
		}
	}

	setNewState = () => {

		const star = this.getPersonById(this.props.star_id);
			if (star) {
				var vDate = moment(star.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD');

				// all of this is to select the svg element from the render and pass it to singlemap.js. The childSvg and the call/zoom is to allow all the maps that will be drawn on the mega map dragable and zoomable. I could have put all this in the single map, but then it was a jittery exeperience. I found this solution and implemented it below: http://stackoverflow.com/questions/10988445/d3-behavior-zoom-jitters-shakes-jumps-and-bounces-when-dragging?rq=1
				let svg = d3.select('svg');
				let childSvg = svg.append('g');
				svg.call(d3.zoom().on('zoom', function () {
					console.log('zoom', d3.event);
					var transform = d3.zoomTransform(this);
					childSvg.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
				}));
				this.setState({
					vDate: vDate,
					star_id: star._id,
					starAge: 18,
					fullName: star.fName + ' ' + star.lName,
					mapArray: this.createMapArray(star._id, childSvg),
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
	}

	zoomIn = () => {
		console.log('in zoom: ', this.state.scale);
		this.setState({
			scale: 1
		});
	}

	createMapComponent = (star_id, vDate, scale, xPosTranslate, yPosTranslate, svg) => {
		// the svg is passed into this function is actually a child g to the svg in the render. This is then passed to the singlemap component, so that component will put every map that is drawn onto the same g child. See the setNewState function comments for reasons why
		return <SingleMap star_id={star_id} vDate={vDate} scale={this.state.scale} key={star_id} xPosTranslate={xPosTranslate} yPosTranslate={yPosTranslate} svg={svg}/>
	}

	createMapArray = (star_id, svg) => {
		let mapArray = [];
		const startX = 500;
		let moveX = 200;
		let moveY = 200;

		let tree = createTree(star_id, this.props.people, this.props.parentalRels, this.props.events);
		console.log("Tree: ", tree);

		// set node to the start of the tree, and then draw the single map for the head of the tree (which is the ID passed into this component through props)
		let node = tree;
		// first, draw the map for person whose megaMap it is
		mapArray.push(this.createMapComponent(node.person._id, moment(node.person.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD'), .33, startX, yPos, svg));
		// set node to start of tree, and then getLeft, which gets node's mother

		node = getLeft(node)
		let newComp;
		let xPos = startX + moveX;
		let yPos = moveY;
		while (node) {
			newComp = this.createMapComponent(node.person._id, moment(node.person.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD'), .33, xPos, yPos, svg);
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
			newComp = this.createMapComponent(node.person._id, moment(node.person.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD'), .33, xPos, yPos, svg);
			mapArray.push(newComp);
			xPos -= moveX;
			yPos += moveY;
			node = getRight(node);
		}
		return mapArray;
	}



	render = () => {

		// if (!this.state.mapArray.length) {
		// 	return(
		// 		<div class="mainDiv">
		// 			<h3>Map Rendering</h3>
		// 		</div>
		// 	)
		// } else {
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
		// }
	}
}
