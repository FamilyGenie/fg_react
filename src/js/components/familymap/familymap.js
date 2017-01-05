import React from 'react';
import { connect } from "react-redux"
import moment from 'moment';

import { fetchPeople } from '../../actions/peopleActions';
import { addToArray } from '../../actions/functions';

@connect(
	(store, ownProps) => {
		// console.log("in familymap @connect, with: ", store);
			return {
				star_id:
					ownProps.params.star_id,
				people:
					store.people.people,
				pairBondRelationships:
					store.pairBondRels.pairBondRels,
				parentalRelationships:
					store.parentalRels.parentalRels,
			};
		// }
	},
	(dispatch) => {
		return {
			fetchPeople: () => {
				dispatch(fetchPeople());
			},
		};
	}
)
export default class FamilyMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			star_id: this.props.star_id,
			peopleCount: this.props.people.length,
			starAge: 0,
			parents: [],
			parentRels: [],
			children: [],
			pairBonds: [],
			alreadyDrawn: [],
			drawnCoords: [],
			dateFilterString: "",
		};
	}
	// starAge: number;
	// parents = [];
	// parentRels = [];
	// children = [];
	// pairBonds = [];
	// alreadyDrawn = [];
	// drawnCoords = [];
	// this stores how far below the parents the first child is drawn. This number gets bigger if there is an adoptive parent pair on the map.
	// there are some constants at the top it he ngOnInit function call
	// firstChildYDistance: number;
	// firstChildYWithAdoptions: number;
	// // this is a constant value for all text spacing written on the map
	// textLineSpacing: number = 18;
	// textSize: string = ".9em";
	// fullName;
	// // dateFilterString;

	render = () => {
		console.log("in Family Map Render, with state: ", this.state);

		if (this.props.people) {
			return (<div>
				<div class="container">
					<h1>Family Map</h1>
					<button onClick={this.drawMap}>
						Draw map
					</button>
					<div>
						{this.state.peopleCount}
					</div>
				</div>
				<svg class="svg-map">
				</svg>
			</div>)
		}
	}

	componentDidMount = () => {
		// there are some constants at the top of the component class definition as well.
		// these constants determine where to start drawing the map
		const startX = 775;
		const startY = 200;
		const parentDistance = 220;
		const childDistance = 120;

		// this.render();
		console.log("In componentDidMount: ", this.state);
		// this.dateFilterString = '1947-08-29';
		// I can't get setState to work here. Setting the dateFilterString to a value for testing purposes
		// this.setState({dateFilterString: "1947-08-29"});
		this.state.dateFilterString = '1990-01-27';


		this.initializeVariables();
		this.drawTicks();
		// this function removes all the keys from the objects that contain information that is generated while creating the map. Clearing it all here because during Family Time Lapse, we want to be able to start a new map fresh without having to refresh the data from the database (so that it is faster).
		this.clearMapData();

		// push the star onto the empty children array, because we know they will be a child on the map
		this.state.children.push(this.getPersonById(this.state.star_id));
		// then call getAllParentsOfChildren to get all of the Stars parents on the Map
		// this.getAllStarParents();
		this.getAllParentsOfChildren();
		console.log("After getAllParents: ", this.state.parents);
		debugger;
		if (this.state.parents.length === 0) {
			alert("No parents for this person, map will not be drawn.");
			// this.router.navigate([
			//     "peoplesearch"
			// ]);
		}

		// call function to find all the parents for childre that are in the children array
		this.getAllChildrenOfParents();
		console.log("children:", this.state.children);

		// then call getAllParents of Children again to get all the parents of all the children, not just parents of the star.
		this.getAllParentsOfChildren();
		console.log("After getAllParents second call: ", this.state.parents);


	}

	getAllParentsOfChildren = () => {
		let parentalRelTemp = [];

		// for each child
		for (let child of this.state.children) {
			// console.log("in getAllParents children loop with child: ", child);
			// get all parental relationships
			// debugger;
			parentalRelTemp = this.props.parentalRelationships.filter(
				function(parentalRel) {
					return parentalRel.child_id === child._id &&
					parentalRel.startDate.substr(0,10) <= this.state.dateFilterString;
				}.bind(this)
			);
			// console.log("in getAllParents, parentalRelTemp: ", parentalRelTemp);
			// for each parental relationship of each child
			for (let parentRel of parentalRelTemp) {
				// first, push parentRel onto array of relationships to track
				// this.parentRels = this.addToArray(this.parentRels, parentRel);
				if (!this.state.parentRels.includes(parentRel)) {
						this.state.parentRels.push(parentRel);
					}
				// find the parent
				let parent = this.getPersonById(parentRel.parent_id);
				// put the parent into the parents array, if they don't yet exist
				// this.parents = this.dataService.addToArray(this.parents, parent);
				if (!this.state.parents.includes(parent)) {
						this.state.parents.push(parent);
					}
			}
		}
	}

	getAllChildrenOfParents = () => {

		// console.log("in getAllChildrenOfStarParents", this.state, this.props);
		let parentalRelTemp = [];

		// for each parent of star
		for (let parent of this.state.parents) {
			// find every parental relationship (including those that do not have the star as child)
			parentalRelTemp = this.props.parentalRelationships.filter(
				function(parentalRel) {
					return parentalRel.parent_id === parent._id &&
					parentalRel.startDate.substr(0,10) <= this.state.dateFilterString;
				}.bind(this)
			);

			// console.log("Parent & ParentalRelTemp: ", parent, parentalRelTemp);
			// for every parental relationship of each parent
			for (let parentRel of parentalRelTemp) {
				// find the child
				let child = this.getPersonById(parentRel.child_id);
				// console.log("Child Found: ", child);
				// if child was born on or before the dateFilter
				if (child.birthDate.substr(0,10) <= this.state.dateFilterString) {
					// console.log("Child Found with birthdate: ", child);
					// if child does not yet exist in children array, push onto it
					// this.state.children = addToArray(this.state.children, child);
					if (!this.state.children.includes(child)) {
						this.state.children.push(child);
					}
				}
			}
		}
	}

	// addToArray = (arr, element) => {
	// 	console.log("in addToArray with ", arr, element);
	// 	if ( !arr.includes(element) ) {
	// 		arr.push(element);
	// 	}
	// 	return arr;
	// }

	getAllStarParents = () => {
		this.state.parentRels = this.props.parentalRelationships.filter(
			function(parentRel) {
				return parentRel.child_id === this.state.star_id &&
				parentRel.startDate.substr(0,10) <= this.state.dateFilterString;
			}.bind(this)
		);

		for (let parentRel of this.state.parentRels){
			this.state.parents.push(this.getPersonById(parentRel.parent_id));
		}
	}

	clearMapData = () => {
		// this function removes all the keys from the objects that contain information that is generated while creating the map. Clearing it all here because during Family Time Lapse, we want to be able to start a new map fresh without having to refresh the data from the database (so that it is faster).
		for (let person of this.props.people) {
			delete person["d3CircleHash1"];
			delete person["d3CircleHash2"];
			delete person["d3CircleHash3"];
			delete person["d3CircleHash4"];
			delete person["mapXPos"];
			delete person["mapYPos"];
			delete person["d3Circle"];
			delete person["d3Symbol"];
			delete person["d3Text"];
			delete person["d3TextBox"];
			delete person["d3DadLine"];
			delete person["d3MomLine"];
			delete person["d3Star"];
		}

		for (let pairBond of this.props.pairBondRelationships) {
			delete pairBond["subTypeToStar"];
			delete pairBond["color"];
		}
	}

	initializeVariables = () => {
		// do we need to initialize the xPos and yPos of each person?
		// remove d3 drawn objects
		d3.select("svg").selectAll("*").remove();
		this.parents = [];
		this.parentRels = [];
		this.children = [];
		this.pairBonds = [];
		this.alreadyDrawn = [];
		this.drawnCoords = [];
		// this stores how far below the parents the first child is drawn. This number gets bigger if there is an adoptive parent pair on the map.
		this.firstChildYDistance = 20;
		this.firstChildYWithAdoptions = 130;
		// console.log("in initializeVariables", this.state.star_id);
		var star = this.getPersonById(this.state.star_id);
		console.log("star: ", star);
		this.fullName = star.fName + " " + star.lName;
		console.log("in initializeVariables with date ", this.state.dateFilterString);
		// if dateFilter not yet set, set it to Star's 18th birthday
		if (!this.state.dateFilterString) {
			this.starAge = 18;
			// this.dateFilterString = this.dataService.dateCalculator(star.birthDate, "addYear", this.starAge);
			// I can't get moment to add 18 years to the birthdate here. Ask Eddie about this.
			// moment(star.birthDate);
			// console.log("birthDate: ", star.birthDate);
			var newDate = moment("12/01/1970", "MM/DD/YYYY");
			console.log("newDate: ", newDate);
			newDate.add(18, 'y');
			console.log('newDate + 18 ', newDate);
		}
	}

	getPersonById = (_id) => {
		return this.props.people.find(function(person){
			return person._id === _id;
		});
	}

	drawTick (cx, cy, tickText) {
		console.log("in draw tick");
		var textData;
		textData = [
			// text
			{"x": cx, "y": cy, "txt": tickText}
		];

		// append the person_id so that the text we are appending is unique and
		// doesn't prevent any other text to be written
		let text = d3.select("svg").selectAll("text" + tickText)
			.data(textData)
			.enter()
			.append("text");

		text
			.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; })
			.text(function(d)     { return d.txt; })
			.attr("font-family", "sans-serif")
			.attr("font-size", ".75em")
			.attr("fill", "black");
	}

	drawTicks() {
		console.log("in drawTicks");
		this.drawTick(100, 20, "100");
		this.drawTick(200, 20, "200");
		this.drawTick(300, 20, "300");
		this.drawTick(400, 20, "400");
		this.drawTick(500, 20, "500");
		this.drawTick(600, 20, "600");
		this.drawTick(700, 20, "700");
		this.drawTick(800, 20, "800");
		this.drawTick(900, 20, "900");
		this.drawTick(1000, 20, "1000");
	}
}
