import React from 'react';
import AlertContainer from 'react-alert';
import { connect } from "react-redux"
import { hashHistory } from 'react-router'
import moment from 'moment';
import Modal from 'react-modal';
import Legend from './legend';

import { openNewPersonModal, setNewPersonModal } from '../../actions/modalActions';

import NewPerson from '../newperson/newperson';

@connect(
	(store, ownProps) => {
		return {
			star_id:
				ownProps.params.star_id,
			people:
				// make a deep copy of the people array - make an array that contains objects which are copies by value of the objects in the store.people.people array.
				// Do this because we want to be able to modify people and add values to a person object that is used to draw the map, and we don't want to alter the state of the store. If we copied to an array with a reference to the people objects, then when we added key/value pairs, we would also be modifying the objects in the store, and not maintaining mutability
				JSON.parse(JSON.stringify(store.people.people)),
			pairBondRelationships:
				// store.pairBondRels.pairBondRels,
				JSON.parse(JSON.stringify(store.pairBondRels.pairBondRels)),
			parentalRelationships:
				// store.parentalRels.parentalRels,
				JSON.parse(JSON.stringify(store.parentalRels.parentalRels)),
			newPersonModalIsOpen:
				store.modal.newPerson.modalIsOpen,
			events:
				store.events.events,
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
export default class FamilyMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// store this state value for display purposes
			dateFilterString: "",
			starAge: 18,
			legendShowing: false,
		};
	}

	// these next four arrays will store the records that should show up on the map. The source for each is desscribed below.
	// As people are found who need to show as parents on the map, they are added to this local array. The people come from the this.people local array, which is a copy of the this.props.people array from the store, with birth information mapped into it.
	parents = [];
	// As parental relationships are found that need to be included in the map, they are pushed onto this local array. The records come from this.props.parentalRelationships, which comes from the store. Sometimes parentRels are created and then pushed for the purposes of drawing the map.
	parentRels = [];
	// As we find people who are children that need to be included in the map, they are pushed onto this local array. The people come from the this.people local array, which is a copy of the this.props.people array from the store, with birth information mapped into it.
	children = [];
	// As pairBonds are found that need to be included in the map, they are pushed here. The records come from this.props.pairBondRelationships, which comes from the store.
	pairBonds = [];
	// This local array is used to push people onto once they are drawn on the map, so they don't get drawn twice. When drawing pairBonds, some people may be in more than one pairBond, and we still only want that person to show up once.
	alreadyDrawn = [];
	// This array is used to store the coordinates where some things are drawn, so when drawing other things, we don't draw over them.
	drawnCoords = [];
	// this is to store a copy of the people array from the store, so that we can manipulate it to accomodate for drawing the map when needed
	people = [];
	dateFilterString;
	fullName;
	// this are for storing starting points in drawing the map
	firstChildYDistance = 0;
	firstChildYWithAdoptions = 0;
	textLineSpacing = 18;
	textSize = '.9em';
	// this is to mark the beginning of where we look to draw the maps
	mapStartX = 500;
	// set this variable and every error should check to see if it is false, and display the error if this is still false. Once an error is shown, it should set this variable to true, so that no other errors are found. This way, we don't confuse the end user with multiple error messages.
	// TODO: Need to add to all error messages to see if an error has already been shown, so we don't show multiple errors to the end user, which may confuse them.
	errorShown = false;

	// global variables for svg / d3 map drawing
	svg;
	g;

	// this is for the alert box we are using. A lot of alerts still use the standard javascript alert box, and need to be migrated over.
	alertOptions = {
      offset: 15,
      position: 'middle',
      theme: 'light',
      time: 0,
      transition: 'scale'
    };

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

	// this function is to make the input box for the age a "controlled component". Good information about it here: https://facebook.github.io/react/docs/forms.html
	onAgeChange = (evt) => {
		console.log("onAgeChange", evt.target.value);
		var star = this.getPersonById(this.props.star_id);
		this.dateFilterString = moment(star.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(evt.target.value,'y').format('YYYY-MM-DD');

		// this.dateFilterString = moment(this.getPersonById(this.props.star_id).birthDate).add(evt.target.value,'year').format('YYYY-MM-DD');
		this.setState({
			// dateFilterString: moment(this.dateFilterString.toString().replace(/-/g, '\/').replace(/T.+/, '')).format('MM/DD/YYYY'),
			dateFilterString: moment(this.dateFilterString.toString()).format('MM/DD/YYYY'),
			starAge: evt.target.value
		});
		console.log('change date: ', this.dateFilterString, this.state.dateFilterString);
		this.drawMap(this.mapStartX);
	}
	// is this needed? Is componentDidUpdate enough?
	componentDidMount = () => {
		// this.drawMap(this.mapStartX);
	}

	componentDidUpdate = () => {
		this.drawMap(this.mapStartX);
	}

	render = () => {
		const { people, newPersonModalIsOpen } = this.props;
		if (people) {
			return (
			<div class="mainDiv">
				<div id="legend">
					<Legend toggleLegend={this.toggleLegend}/>
				</div>
				<div class="mainMap" id="mainMap">
					<div class="mapHeader">
						<div class="dateToggle">
							<div class="mapDate">
								<div class="mapDateContents">
									<p>Family Map As Of:</p>
									<p class="mapDateText">{this.state.dateFilterString}</p>
								</div>
								<div class="starAge">
									<p>Star's Age:</p>
									<input
										id="ageInput"
										class="form-control ageInput"
										type="text"
										value={this.state.starAge}
										onChange={this.onAgeChange}
									/>
									<button type="button" class="btn btn-default btn-PD" onClick={this.toggleLegend}>Legend</button>
								</div>
							</div>
							<div class="mapArrow">
								<i class="fa fa-arrow-circle-up buttonSize button2" onClick={this.addYear}></i>
								<i class="fa fa-arrow-circle-down buttonSize button2" onClick={this.subtractYear.bind(this)}></i>
							</div>
						</div>
						<div>
							<h1 class="family-header">{this.fullName}'s Family Map </h1>
						</div>
					</div>
					<svg
						width="1400"
						height="1400"
					>
					</svg>
				</div>

				<Modal
			      isOpen={newPersonModalIsOpen}
			      contentLabel="Modal"
			      className="detail-modal"
			    >
			      <NewPerson/>
			    </Modal>

			    <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
			</div>)
		}
	}

	// This is the main controlling function of the component. It calls all the others that are below the render function.
	drawMap = (startX) => {

		// there are some constants at the top of the component class definition as well.
		// these constants determine where to start drawing the map
		// TODO: need to standardize on where to store these constants
		// const startX = 500;
		const startY = 200;
		const parentDistance = 220;
		const childDistance = 120;

		this.initializeVariables();
		// this function removes all the keys from the objects that contain information that is generated while creating the map. Clearing it all here because during Family Time Lapse, we want to be able to start a new map fresh without having to refresh the data from the database (so that it is faster).
		this.clearMapData();

		console.log('startX is: ', startX);

		// for map drawing
		this.svg = d3.select('svg');
		this.g = this.svg.append('g');
		this.drawTicks();

		// push the star onto the empty children array, because we know they will be a child on the map
		this.children.push(this.getPersonById(this.props.star_id));
		// this function will add bio parent psuedo records for every child that is in the children array that doesn't have a bio parent record added.
		this.checkAllChildrenForBioParents();

		var stillNewChildren = true;
		// lastCount will be used to see if when we do a run through getting parents and children of parents
		var lastCount = this.children.length + this.parents.length + this.parentRels.length;

		// loop through finding parents and children until we know we are not finding any more children.
		while ( stillNewChildren ) {

			// call function to find all the parents for children that are in the children array. If it returns false, there was an error and the map should not be drawn. An erros alert was already displayed to the end user.
			if ( !this.getAllParentsOfChildren() ) {
				// function will already show an error, so don't need to show another one
				hashHistory.push('/');
				return;
			}
			console.log("After getAllParents, parents: ", this.parents);
			console.log('After getAllParents, parentRels: ', this.parentRels);

			// this function will get all the children of the parents in the parents array
			this.getAllChildrenOfParents();

			// this function will add bio parent psuedo records for every child that is in the children array that doesn't have a bio parent record added.
			this.checkAllChildrenForBioParents();

			console.log("After getAllChildren:", this.children);

			// TODO: Is this a suitable test?
			if ( this.children.length + this.parents.length + this.parentRels.length === lastCount) {
				stillNewChildren = false;
			}
			lastCount = this.children.length + this.parents.length + this.parentRels.length;
		}

		// check to see if there are any people who are in the children array and the parents array. If so, the function returns false, so exit out and redirect to peoplesearch page
		if ( !this.checkForChildrenWhoAreParents() ) {
			// there already was an error shown, so just exit
			hashHistory.push('/');
			return;
		}

		// getAllPairBonds will find all the pairbonds that the parents are in and push them onto the local this.pairBonds array. This array is then used in the drawAllPairBonds function to draw the parents on the map.
		if ( !this.getAllPairBonds() ) {
			alert("There was an error in drawing the map. You are being re-directed to the FamilyList page. You should have seen an error message previous to this to assist with the problem. If not, please contact support.");
			hashHistory.push('/');
			return;
		}
		console.log("all pair bonds:", this.pairBonds);

		// this function will add single parents to the local this.pairBonds array. It adds them as personOne, and sets personTwo as null. This way, the drawAllPairBonds array will draw these single parents.
		this.addParentsNotInPairBonds();
		console.log("all pair bonds after adding parents not in pairBonds:", this.pairBonds);

		// this includes drawing the parents in the pair bonds. this currently
		// if neither parent is biological or step, then draw both parents down a level vertically
		 if ( !this.drawAllPairBonds(startX, startY, parentDistance) ) {
			 alert("There was an error in drawing the map. You are being re-directid to the FamilyList page. You should have seen an error message previous to this to assist with the problem. If not, please contact support.");
			hashHistory.push('/');
			return;
		 }

		 // this function also draws the relationship lines to Biological parents
		this.drawAllChildren (startY, childDistance);

		this.drawNonBioParentLines();
		// the parental lines may be drawn over the children, so now draw them again so they come to the front.
		this.bringAllChildrenToFront();

		// check to see if we need to redraw the map. Do this by calling the function that gets the starting x position. The map was first drawn with a starting xPos of 0. If that is now different, than redraw the map with the new starting position. If no parent on the map has a calculated xPos that is negative, than the function returns 500;
		// console.log('about to check for draw again: ', startX, this.getStartXPos(parentDistance, startX, startStartX));
		if (startX === this.mapStartX) {
			this.drawMap(this.getStartXPos(parentDistance, startX));
		} else {
			// Last, we need to see about resizing the drawing
			this.scaleMap();
		}
	} // end of drawMap

	scaleMap = () => {

		var maxX = this.mapStartX;
		var minX = this.mapStartX
		for (let person of this.parents) {
				console.log('person ', person.fName, person.mapXPos);
				if (person.mapXPos > maxX) {
					maxX = person.mapXPos;
				}
				if (person.mapXPos < minX) {
					minX = person.mapXPos;
				}
		}
		console.log('in scale map: ', minX, maxX);
		if ( (maxX - minX) < 1000 ) {
			// do nothing
		} else {
			this.g.attr('transform', 'scale(.5)');
		}
	}

	getStartXPos = (parentDistance, startXFromMain) => {
		// if the parents array does not have people in it, then this is the first time through the draw maps function, so don't need to calculate the starting point, just return 0
		if (this.parents.length) {
			var startX = this.mapStartX;
			var minX = this.mapStartX;
			var maxX = this.mapStartX;
			// cycle through each parent and find the one with the smallest XPos
			for (let person of this.parents) {
				if (person.sexAtBirth === 'F') {
					startX -= parentDistance/2;
				}
				if (person.sexAtBirth === 'M') {
					startX += parentDistance/2;
				}
				if (person.mapXPos < minX) {
					minX = person.mapXPos;
				}
				if (person.mapXPos > maxX) {
					maxX = person.mapXPos;
				}
			}

			if (minX < 0) {
				return this.mapStartX + parentDistance + Math.abs(minX);
			} else {
				return startX + 1;
			}
		} else {
			return 0;
		}
	}

	checkAllChildrenForBioParents = () => {
		for (let child of this.children) {
			this.checkForBioParents(child._id);
		}
	}

	// this function will check to see if the star has a biological mother relationship and a biological father relationship. If there is not one, it will create it. It will also create the person (who is the mom and/or dad), if they don't exist.
	checkForBioParents = (child_id) => {
		// get the star, so we can use star's birthdate
		var child = this.getPersonById(child_id);
		var createPairBond = false;
		// look for the biological mother relationship in the store
		var momRel = this.props.parentalRelationships.find(function(parentRel){
			// the following line is to accomodate for the fact that the angular dropdown in parentalrelationship.component is making this value have a number in front of it.
			return /[Mm]other/.test(parentRel.relationshipType) &&
				/[Bb]iological/.test(parentRel.subType) &&
				parentRel.child_id === child_id;
		});
		// if we don't find the bio mom relationship in the store, see if it has yet been added to the local parentRels array
		if (!momRel) {
			momRel = this.parentRels.find(function(parentRel){
				// the following line is to accomodate for the fact that the angular dropdown in parentalrelationship.component is making this value have a number in front of it.
				return /[Mm]other/.test(parentRel.relationshipType) &&
				/[Bb]iological/.test(parentRel.subType) &&
				parentRel.child_id === child_id;
			});
		}

		// if there is not a momRel, then create one for the child.
		if (!momRel) {
			momRel = {
				_id: 'ZMom'+ child_id,
				child_id: child_id,
				endDate: '',
				parent_id: '',
				relationshipType: 'Mother',
				startDate: child.birthDate,
				startDateUser: child.birthDateUser,
				subType: 'Biological',
			}
			// push this relationship onto the local parentRels array, so it will be considered when drawing the map.
			this.parentRels.push(momRel);

			// set the boolean createPairBond to true, so that a pair bond record will be created between the mom and dad. We know one does not yet exist, because we are creating the mom relationship now
			createPairBond = true;
		}

		// if there is not a parent_id in the parental relationship found, add the person who will serve as a placeholder in the map as the star's biological mother. If the user clicks on this person, the person will be created.
		if (!momRel.parent_id) {
			parent = {
				// add a Z as the first character of this ID, as that will never be assigned as a real ID in Mongo, because Mongo uses hex characters.
				_id: "ZMom" + child_id,
				birthDate: null,
				birthPlace: "Click to Add Person",
				deathDate: null,
				deathPlace:"",
				fName: child.fName + "'s Mother",
				lName: "",
				mName: "",
				notes: null,
				sexAtBirth: "F"
			};
			this.people.push(parent);
			this.parents.push(parent);
			momRel.parent_id = "ZMom" + child_id;
		}

		// look for the biological father relationship in the store
		var dadRel = this.props.parentalRelationships.find(function(parentRel){
			// the following line is to accomodate for the fact that the angular dropdown in parentalrelationship.component is making this value have a number in front of it.
			return /[Ff]ather/.test(parentRel.relationshipType) &&
				/[Bb]iological/.test(parentRel.subType) &&
				parentRel.child_id === child_id;
		});
		// if we don't find the bio dad relationship in the store, see if it has yet been added to the local parentRels array
		if (!dadRel) {
			dadRel = this.parentRels.find(function(parentRel){
				// the following line is to accomodate for the fact that the angular dropdown in parentalrelationship.component is making this value have a number in front of it.
				return /[Ff]ather/.test(parentRel.relationshipType) &&
				/[Bb]iological/.test(parentRel.subType) &&
				parentRel.child_id === child_id;
			});
		}

		// if there is not a dadRel, then create one for the child.
		if (!dadRel) {
			dadRel = {
				_id: 'ZDad' + child_id,
				child_id: child_id,
				endDate: '',
				parent_id: '',
				relationshipType: 'Father',
				startDate: child.birthDate,
				startDateUser: child.birthDateUser,
				subType: 'Biological',
			}
			// push this relationship onto the local parentRels array, so it will be considered when drawing the map.
			this.parentRels.push(dadRel);

			// set the boolean createPairBond to true, so that a pair bond record will be created between the mom and dad. We know one does not yet exist, because we are creating the mom relationship now
			createPairBond = true;
		}

		// if there is not a parent_id in the parental relationship found, add the person who will serve as a placeholder in the map as the star's biological father. If the user clicks on this person, the person will be created.
		if (!dadRel.parent_id) {
			parent = {
				// add a Z as the first character of this ID, as that will never be assigned as a real ID in Mongo, because Mongo uses hex characters.
				_id: "ZDad" + child_id,
				birthDate: null,
				birthPlace: "Click to Add Person",
				deathDate: null,
				deathPlace:"",
				fName: child.fName + "'s Father",
				lName: "",
				mName: "",
				notes: null,
				sexAtBirth: "M"
			};
			this.people.push(parent);
			this.parents.push(parent);
			dadRel.parent_id = "ZDad" + child_id;
		}

		if (createPairBond) {
			// If there we had to create a momRel or dadRel in this function, then we also will create a pairBond between mom and dad. The idea is that the user will be able to click on the parent that shows up and fill in the missing information.
			// TODO: if there are pairBonds between adopted parents, then this function is not called. Is that a problem??? Maybe we shouldn't call it all, now that we can draw parents not in a pair bond - so that both mom and dad will show on the map without a relationship between them.

			var pairBond = {
				personOne_id : momRel.parent_id,
				personTwo_id : dadRel.parent_id,
				relationshipType : "???",
				startDate : null
			};

			this.pairBonds.push(pairBond);
		}
	}

	drawAllChildren (startY, childDistance): void {
		// note that we are assuming that each kid will have one and only one biological mother and one and only one biological father. Need to eventually accomodate for this not being true (like don't have some bio parent info)
		let nextChildY = startY + childDistance + this.firstChildYDistance;
		let mom, momRel, dad, dadRel;
		let momRels = [];
		let dadRels = [];
		let xPos: number;

		// sort children by birthdate
		this.children.sort(birthDateCompare);

		for (let child of this.children) {
			// find biological mother relationship
			// momRel = this.props.parentalRelationships.find(function(parentRel){
			momRel = this.parentRels.find(function(parentRel){

				// the following line is to accomodate for the fact that the angular dropdown in parentalrelationship.component is making this value have a number in front of it.
				return /[Mm]other/.test(parentRel.relationshipType) &&
					/[Bb]iological/.test(parentRel.subType) &&
					parentRel.child_id === child._id;
			});

			// find biological dad relationship record
			// dadRel = this.props.parentalRelationships.find(function(parentRel){
			dadRel = this.parentRels.find(function(parentRel){
				// the following line is to accomodate for the fact that the angular dropdown in parentalrelationship.component is making this value have a number in front of it.
				return /[Ff]ather/.test(parentRel.relationshipType) &&
					/[Bb]iological/.test(parentRel.subType) &&
					parentRel.child_id === child._id;
			});

			// if we found both bio mom and bio dad, draw child halfway between them
			if ( momRel && dadRel ) {
				mom = this.parents.find(function(parent){
					return parent._id === momRel.parent_id;
				});
				dad = this.parents.find(function(parent){
					return parent._id === dadRel.parent_id;
				});
				// calculate xPos of child
				// find the amount that is halfway between the two parents
				xPos = Math.abs(mom.mapXPos - dad.mapXPos) / 2;
				// whichever parent is further left, add the amount to their xPos to get xPos for child
				xPos = (mom.mapXPos < dad.mapXPos) ? mom.mapXPos + xPos : dad.mapXPos + xPos;

				// set x and y values inside of child object, they are used by the drawParentalLine functions
				child.mapXPos = xPos;
				child.mapYPos = nextChildY;

				// draw parental lines first, so the circle and text goes on top of the lines
				child.d3MomLine = this.drawParentalLine(mom, child, "mom", "0. Biological");
				// if there is an endDate of the mother relationship, draw hash marks in the middle of it
				if ((momRel.endDate ? momRel.endDate.substr(0,10) : '9999-99-99') <= this.dateFilterString) {
					this.drawParentRightHash (child, mom, 'blue');
				}

				child.d3DadLine = this.drawParentalLine(dad, child, "dad", "0. Biological");
				// if there is an endDate of the father relationship, draw hash marks in the middle of it
				if ((dadRel.endDate ? dadRel.endDate.substr(0,10) : '9999-99-99') <= this.dateFilterString) {
					this.drawParentLeftHash (child, dad, 'blue');
				}

				child.d3Circle = this.drawCircle(child);
				if ((child.deathDate ? child.deathDate.substr(0,10) : '9999-99-99') <= this.dateFilterString) {
					this.drawCircleHash(child);
				}

				if (child.sexAtBirth === "M") {
					child.d3Symbol = this.drawMaleSymbol(xPos, nextChildY);
				} else if (child.sexAtBirth === "F") {
					child.d3Symbol = this.drawFemaleSymbol(xPos, nextChildY);
				}
				// check to see if this is the star of the map. If so, draw the star inside of circle
				if (child._id === this.props.star_id) {
					child.d3Star = this.drawStar(xPos, nextChildY, child);
				}
				child.d3TextBox = this.drawTextBox(xPos, nextChildY);
				child.d3Text = this.drawCircleText(xPos + 50, nextChildY - 25, child);

				nextChildY += childDistance;

			} else {
				// if not both a mom and or a dad, print error message.
				if (!this.errorShown) {
					alert("There is a problem with the relationship between " + child.fName + " " + child.lName + " and one of their biological parents. Likely the start date of the relationship is set to after the date that this map is being drawn for, which is: " + this.dateFilterString + ". Go to the details page for " + child.fName + " " + child.lName + " and look at the relationship details with their biological parents.");
					this.errorShown = true;

				}
			}
		} // end of let child of this.children

		// this function is used to sort the children by birthDate
		function birthDateCompare(a, b) {
			if (a.birthDate < b.birthDate)
				return -1;
			if (a.birthDate > b.birthDate)
				return 1;
			return 0;
		}
	}

	drawAllPairBonds (startX, startY, parentDistance): boolean {
		let mom;
		let dad;
		var personOne, personTwo;
		let parent;
		let nextMaleX = startX - Math.floor(parentDistance / 3 * 2);
		let nextFemaleX = startX + Math.floor(parentDistance / 3 * 2);
		let colorArray = ["black", "green", "purple", "orange", "deeppink", "orchid", "orangered", "navy", "olivedrab"];
		let colorIndex: number = 0;
		let YPos;

		// sort pair bonds by start date
		this.pairBonds.sort(startDateCompare);
		// next, put the pair bonds where both parents are adopted at the end of the array, so they are drawn last, outside the other pair bonds
		this.pairBonds.sort(subTypeCompare);
		console.log('PairBonds after sort: ', this.pairBonds);
		for (let pairBond of this.pairBonds) {

			// if this is a pair bond that has been determined to go on the horizontal line with the adoptive parents, then set the YPos to be further down the page
			if ( /[Aa]dopted/.test(pairBond.subTypeToStar) ) {
				YPos = startY + 150;
			} else {
				YPos = startY;
			}

			// find personOne and draw them if they haven't been drawn yet
			personOne = null;
			var personOne = this.getPersonById(pairBond.personOne_id);
			if (personOne && !this.alreadyDrawn.includes(personOne)) {
				if (personOne.sexAtBirth === "M") {
					nextMaleX = this.drawDad(personOne, nextMaleX, YPos, parentDistance);
				} else if (personOne.sexAtBirth === 'F' ) {
					nextFemaleX = this.drawMom(personOne, nextFemaleX, YPos, parentDistance);
				}
			}

			// find personOne and draw them if they haven't been drawn yet
			personTwo = null;
			var personTwo = this.getPersonById(pairBond.personTwo_id);
			if (personTwo && !this.alreadyDrawn.includes(personTwo)) {
				if (personTwo.sexAtBirth === "M") {
					nextMaleX = this.drawDad(personTwo, nextMaleX, YPos, parentDistance);
				} else if (personTwo.sexAtBirth === 'F' ) {
					nextFemaleX = this.drawMom(personTwo, nextFemaleX, YPos, parentDistance);
				}
			}

			// if this pairBond record has two people, draw a relationship line between them
			if (personOne && personTwo) {
				// first, check to see if a relationship with these two people has already been drawn (for example, they may have been living together before they got married). If so, we need the color of that line, and make this line and text about this relationship the same color.
				// the checkForExistingRel function returns the color of the existing relationship if it is found
				pairBond.color = checkForExistingRel(pairBond, this.pairBonds);
				if ( !pairBond.color ) {
					// if there is no existing relationship, then set the color to the next color in the color index
					pairBond.color = colorArray[colorIndex];
				}

				// next, check to see if it is an adoptive relationship, because we'll draw the relationship line differently
				if ( /[Aa]dopted/.test(pairBond.subTypeToStar) ) {
					this.drawAdoptiveRelLine(personOne, personTwo, pairBond.color, pairBond.relationshipType);
					this.drawRelText(personOne, personTwo, pairBond);
					// if there is an endDate, then use it to compare to the dateFilterString. If there is not an end date, then the relationship did not end, and we want to put in "9999-99-99" so that it will always be greater than dateFilterString, thus returning false, and not drawing the hash marks
					if ((pairBond.endDate ? pairBond.endDate.substr(0,10) : "9999-99-99") <= this.dateFilterString) {
						this.drawAdoptiveRelHash(personOne, personTwo, pairBond, pairBond.color);
					}
				} else {
					// this is not adopted parents to the star
					this.drawRelLine(personOne, personTwo, pairBond.color, pairBond.relationshipType);
					this.drawRelText(personOne, personTwo, pairBond);
					// if there is an endDate, then use it to compare to the dateFilterString. If there is not an end date, then the relationship did not end, and we want to put in "9999-99-99" so that it will always be greater than dateFilterString, thus returning false, and not drawing the hash marks
					if ((pairBond.endDate ? pairBond.endDate.substr(0,10) : "9999-99-99") <= this.dateFilterString) {
						this.drawRelHash(personOne, personTwo, pairBond, pairBond.color);
					}
				}

				// move to next color in the color array.
				colorIndex++;
				// if beyond the array, then go back to 0
				if (colorIndex === colorArray.length) {
					colorIndex = 0;
				}
			}
		}  // end let pairBond of this.pairBonds

		// if we got here, everything was executed successfully, so return true so map drawing can continue.
		return true;

		// this function is used to sort the pairbonds by startdate
		function startDateCompare(a, b) {
			if (a.startDate < b.startDate)
				return -1;
			if (a.startDate > b.startDate)
				return 1;
			return 0;
		}

		// this function is used to put the adopted pair bonds at the end of the array
		function subTypeCompare(a, b) {
			if (a.subTypeToStar === "Adopted" && b.subTypeToStar !== "Adopted")
				return 1;
			if (b.subTypeToStar === "Adopted" && a.subTypeToStar !== "Adopted")
				return -1;
			return 0;
		}

		function checkForExistingRel(pairBond, pairBonds): string {
			// find all pairBonds that are not this pair bond AND do include the same two people
			let foundPairBonds = pairBonds.filter( function(pB) {
				return (pB.personOne_id === pairBond.personOne_id &&
				pB.personTwo_id === pairBond.personTwo_id &&
				pB._id !== pairBond._id)
				||
				(pB.personOne_id === pairBond.personTwo_id &&
				pB.personTwo_id === pairBond.personOne_id);
			});
			if ( foundPairBonds.length ) {
				// loop through each record found
				for (let pBFound of foundPairBonds) {
					// if there is a color already associated with it, the return that color
					if (pBFound.color ) {
						return pBFound.color;
					}
				}
				// if we get here, there were no colors assigned yet to any of the pair bond records, so return empty string
				return "";
			} else {
				// no records found, so return empty string
				return "";
			}
		} // end function checkForExistingRel
	} // end function drawAllPairBonds

		drawDad = (dad, nextMaleX, YPos, parentDistance) => {
			// The following two variables are stored in the array object, and don't go back to the database.
			dad.mapXPos = nextMaleX;
			dad.mapYPos = YPos;
			dad.d3Circle = this.drawCircle(dad);
			// if there is a deathDate and it is less than the date the map is being drawn for, then draw the CircleHash
			if (dad.deathDate) {
				if (dad.deathDate.substr(0,10) <= this.dateFilterString) {
					this.drawCircleHash(dad);
				}
			}
			dad.d3Symbol = this.drawMaleSymbol(nextMaleX, YPos);
			// dad.d3Text = this.drawCircleText(nextMaleX - 170, YPos - 25, dad);
			dad.d3Text = this.drawCircleText(nextMaleX - 45, YPos - 25, dad, 'right');

			// nextMaleX -= parentDistance;
			this.alreadyDrawn.push(dad);
			return nextMaleX - parentDistance;
		}

		drawMom = (mom, nextFemaleX, YPos, parentDistance) => {
			// The following two variables are stored in the array object, and don't go back to the database.
			mom.mapXPos = nextFemaleX;
			mom.mapYPos = YPos;
			mom.d3Circle = this.drawCircle(mom);
			// if there is a deathDate and it is less than the date the map is being drawn for, then draw the CircleHash
			if (mom.deathDate) {
				if (mom.deathDate.substr(0,10) <= this.dateFilterString) {
					this.drawCircleHash(mom);
				}
			}
			mom.d3Symbol = this.drawFemaleSymbol(nextFemaleX, YPos);
			mom.d3Text = this.drawCircleText(nextFemaleX + 45, YPos - 25, mom);
			// nextFemaleX += parentDistance;
			this.alreadyDrawn.push(mom);
			return nextFemaleX + parentDistance;
		}

	// this function will see if there are any people in the parents array and in the childrens array. If so, abort drawing the map and raise an alert.
	checkForChildrenWhoAreParents = () => {
		for (let parent of this.parents) {
			var found = this.children.find(function(child) {
				return child._id === parent._id;
			})
			if (found) {
				if (!this.errorShown) {
					alert('The person ' + parent.fName + ' ' + parent.lName + ' is a parent and a also a child of a parent in this map. This situation is not yet supported in map drawing. If this is an error, please correct it and redraw the map.');
					this.errorShown = true;
					return false;
				}
			}
		}
		// if made it through all parents and there are none who are also children, return true so rest of process will continue
		return true;
	}

	addParentsNotInPairBonds = () => {
		for (let child of this.children) {
			this.addParentsNotInPairBondsEach(child._id);
		}
	}

	// this function finds all parents who aren't in pairBonds and adds them to the local this.pairBonds array, so that they will be drawn when drawAllPairBonds is called. This could probably be cleaner if we added another function which would be to drawAllParentsNotInPairBonds, and then we wouldn't need this function.
	addParentsNotInPairBondsEach = (child_id) => {
		// check to see what parents are not in a pairBond
		for (let parent of this.parents) {
			// if the parent is not found in any of the existing pairBonds, then add that parent to the pairBond array. Add them as personOne, set personTwo to null
			if (!parentFound(parent, this.pairBonds)) {
				// find the parental record where this parent is the parent and the child passed into the function is the child. We will use the startDate of this relationship to put into the pairBond record we are going to create
				var parentalRel = this.props.parentalRelationships.find(function(p) {
					return p.parent_id === parent._id && p.child_id === child_id;
				});

				// if we don't find the parental rel in the store, check to see if it was added to the local parentRels array
				if (!parentalRel) {
					parentalRel = this.parentRels.find(function(p) {
					return p.parent_id === parent._id && p.child_id === child_id;
				});
				}

				if (!parentalRel) {
					// do nothing, there is no relationship between this parent and the child passed into the addParentsNotInPairBondsEach function. This is fine, it just means that this parent is a parent of another child in the map, and not this specific child.
				} else {
					// we found a parentalRel, so now add a pairBond record so the parent will be drawn in the drawAllPairBonds function.
					// if one of the single Parents is an adopted parent, then make sure that the first child drawn is below the parentalRel line
					if (/[Aa]dopted/.test(parentalRel.subType)) {
						this.firstChildYDistance = this.firstChildYWithAdoptions;
					}

					var newObject = {
						_id: 'Z' + parent._id,
						personOne_id: parent._id,
						startDate: parentalRel.startDate,
						startDateUser: parentalRel.startDateUser,
						subTypeToStar: parentalRel.subType
					}
					this.pairBonds.push(newObject);
				}
			}
		}

		function parentFound(parent, pairBonds) {
			var result = pairBonds.find(
				function(p) {
					return p.personOne_id === parent._id ||
					p.personTwo_id === parent._id;
				}.bind(this)
			);
			if (result) {
				return true;
			} else {
				return false;
			}
		}
	} // end addParentsNotInPairBondsEach

	getAllPairBonds(): boolean {
		let pairBondTemp = [];
		let oneRel, twoRel;

		// for each parent
		for (let parentObj of this.parents) {
			// get all pair bonds
			pairBondTemp = this.props.pairBondRelationships.filter(
				function(pairBond) {
					return (pairBond.personOne_id === parentObj._id ||
						pairBond.personTwo_id === parentObj._id) &&
						// if there is a startDate, then return the substr of it. If not, put in null, and then this test condition will evaluate true (null less than a string will evaluate to true), which is what we want. If the user did not put in a pairBond start date, then do show that relationship on the map
						(pairBond.startDate ? pairBond.startDate.substr(0,10) : null) <= this.dateFilterString;
				}.bind(this)
			);

			// for each pair bond of each parent
			for (let pairBond of pairBondTemp) {
				// check to see if both parents are adoptive parents of the star, if so, specify them as an adoptive pair bond, so they can be drawn appropriately
				// if both parents are adopted parents, then modify the Y position
				// first, get the mom Relationship and the dad relationship
				oneRel = this.parentRels.find(
					function(parentRel) {
					return parentRel.parent_id === pairBond.personOne_id &&
					parentRel.child_id === this.props.star_id;
					}.bind(this)
				);
				twoRel = this.parentRels.find(
					function (parentRel) {
					return parentRel.parent_id === pairBond.personTwo_id &&
					parentRel.child_id === this.props.star_id;
					}.bind(this)
				);

				// now, test to see if both the mom and dad in this pair bond are parents of the star (they may be parents of the star's half or step parents).
				if (oneRel && twoRel) {
					// if they are parents of the star, then check to see if they are both adoptive parents. If so, mark the pairBond record as adoptive and also modify the Y position of where the first child will be drawn so there is room for the adoptive parents to be drawn lower that the biological and step parents
					if ( /[Aa]dopted/.test(oneRel.subType) && /[Aa]dopted/.test(twoRel.subType) ) {
						pairBond.subTypeToStar = "Adopted";
						// if there is an adoptive parent, then move the first child drawn further down the map so there is room for the adoptive relationship to be below the other relationships
						this.firstChildYDistance = this.firstChildYWithAdoptions;
					}
				} else if (!oneRel && !twoRel) {
					// neither is a parent, this means that this is a pair bond that only has parental relationships with some of the children on the star's map, but not the star.
					// do nothing for now.
				} else if ( oneRel && !twoRel ) {
					// if only one in the pair is a parent of the star (and we wouldn't get here unless that is the case)
					// then if the one parent is an adopted parent, go on the adopted line. Also, since there is a parent on the adoptive line, move the first child drawn down.

					if ( /[Aa]dopted/.test(oneRel.subType) ) {
						pairBond.subTypeToStar = "Adopted";
						this.firstChildYDistance = this.firstChildYWithAdoptions;
					}
				} else if ( !oneRel && twoRel ) {
					// if only one in the pair is a parent of the star (and we wouldn't get here unless that is the case)
					// then if the one parent is an adopted parent, go on the adopted line. Also, since there is a parent on the adoptive line, move the first child drawn down.

					if ( /[Aa]dopted/.test(twoRel.subType) ) {
						pairBond.subTypeToStar = "Adopted";
						this.firstChildYDistance = this.firstChildYWithAdoptions;
					}
				}

				// put the pairBond into the array, if it doesn't yet exist
				// this.pairBonds = this.dataService.addToArray(this.pairBonds, pairBond);
				if (!this.pairBonds.includes(pairBond)) {
					this.pairBonds.push(pairBond);
				}
			} // end for pairbond
		} // end for parentObj

		// TODO: Maybe what we need to do here is to see if there is a pair bond between the bio mom and dad, and create that here?
		/*
		if (!this.pairBonds.length) {
			// if there are no pair bonds found, then we need to create one between the star's mom and the star's dad, so at least that shows up on the map. The idea is that the user will be able to click on the parent that shows up and fill in the missing information.
			// TODO: if there are pairBonds between adopted parents, then this function is not called. Is that a problem??? Maybe we shouldn't call it all, now that we can draw parents not in a pair bond - so that both mom and dad will show on the map without a relationship between them.

			let star = this.getPersonById(this.props.star_id);
			var momRel = this.parentRels.find(function(pr) {
				return pr.child_id === star._id && /[Mm]other/.test(pr.relationshipType) && /[Bb]iological/.test(pr.subType)
			});

			var dadRel = this.parentRels.find(function(pr) {
				return pr.child_id === star._id && /[Ff]ather/.test(pr.relationshipType) && /[Bb]iological/.test(pr.subType)
			});

			var pairBond = {
				personOne_id : momRel.parent_id,
				personTwo_id : dadRel.parent_id,
				relationshipType : "???",
				startDate : null
			};

			this.pairBonds.push(pairBond);
		}
		*/

		// if we got here, everything was executed successfully, so return true so map drawing can continue.
		return true;
	} // end function getAllPairBonds

	getAllParentsOfChildren = () => {
		let parentalRelTemp = [];

		// for each child
		for (let child of this.children) {
			// get all parental relationships. if there is no start date, then make value empty string, so that the test will return true. This way, if the user did not enter a startDate for the parental relationship, this relationship will still show up on the map.
			parentalRelTemp = this.props.parentalRelationships.filter(
			// parentalRelTemp = this.parentRels.filter(
				function(parentalRel) {
					return parentalRel.child_id === child._id &&
					(parentalRel.startDate ? parentalRel.startDate.substr(0,10) : '') <= this.dateFilterString;
				}.bind(this)
			);
			// for each parental relationship of each child
			for (let parentRel of parentalRelTemp) {
				// first, push parentRel onto array of relationships to track
				if (!this.parentRels.includes(parentRel)) {
						this.parentRels.push(parentRel);
					}
				// find the parent
				let parent = this.getPersonById(parentRel.parent_id);

				// if there is no parent, that means that the parentalRel record has a parent_id that does not exist (Perhaps that parent has been deleted and the parentalRel record was not). So, give an error message and exit.
				if ( !parent ) {
					if (!this.errorShown) {
						alert("The child " + child.fName + " " + child.lName + " has a parent record, but that parent has been removed. Go to this child's detail page and review the parental records. If there is an empty record, delete it. If there is not an empty record, please contact support.");
						this.errorShown = true;
						return false;
					}
					// TODO: We can instead just remove this record from the parentalRel array.
					// console.log('before splice ', this.parentRels);
					// var i = this.parentRels.indexOf(parentRel);
					// this.parentRels.splice(i, 1);
					// console.log('after splice ', this.parentRels);
					// alert("There was a parent record for child: " + child.fName + " " + child.lName + "that had a blank value. That parent is not appearing on this map.");
				}

				// put the parent into the parents array, if they don't yet exist
				if (!this.parents.includes(parent)) {
						this.parents.push(parent);
					}
			}
		}
		// if we made it here, there were no errors, so return true
		return true;
	}

	getAllChildrenOfParents = () => {

		let parentalRelTemp = [];

		// for each parent of star
		for (let parent of this.parents) {
			// find every parental relationship (including those that do not have the star as child)
			parentalRelTemp = this.props.parentalRelationships.filter(
				function(parentalRel) {
					return parentalRel.parent_id === parent._id &&
					(parentalRel.startDate ? parentalRel.startDate.substr(0,10) : null) <= this.dateFilterString;
				}.bind(this)
			);

			// for every parental relationship of each parent
			for (let parentRel of parentalRelTemp) {
				// find the child
				let child = this.getPersonById(parentRel.child_id);
				// if child was born on or before the dateFilter
				if ((child.birthDate ? child.birthDate.substr(0,10) : null) <= this.dateFilterString) {
					// if child does not yet exist in children array, push onto it
					// this.children = addToArray(this.children, child);
					if (!this.children.includes(child)) {
						this.children.push(child);
					}
				}
			}
		}
	}

	clearMapData = () => {
		// this function removes all the keys from the objects that contain information that is generated while creating the map. Clearing it all here because during Family Time Lapse, we want to be able to start a new map fresh without having to refresh the data from the database (so that it is faster).
		for (let person of this.people) {
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

	createLocalPeople = (people, events) => {
		var localPeople = people.map(function(person) {

			 var birth = events.find(function(e) {
					return person._id === e.person_id && e.eventType === "Birth";
			 });
			 if (birth) {
				person.birthDate = birth.eventDate;
				person.birthDateUser = birth.eventDateUser;
				person.birthPlace = birth.eventPlace;
			 }

			 var death = events.find(function(e) {
					return person._id === e.person_id && e.eventType === "Death";
			 });

			 if (death) {
				person.deathDate = death.eventDate;
				person.deathDateUser = death.eventDateUser;
				person.deathPlace = death.eventPlace;
			 }

			return person;
		});

		return localPeople;
	}

	initializeVariables = () => {
		// do we need to initialize the xPos and yPos of each person?
		// remove d3 drawn objects
		if (this.g) {
			this.g.selectAll("*").remove();
		}
		this.parents = [];
		this.parentRels = [];
		this.children = [];
		this.pairBonds = [];
		this.alreadyDrawn = [];
		this.drawnCoords = [];

		// this is the array that the rest of this component gets information from about the people to draw. So call a function that takes the people array from props and adds the birth and death info to each person. Note that the people array from props is a copy of the store.people.people array.
		this.people = this.createLocalPeople(this.props.people, this.props.events);

		// this stores how far below the parents the first child is drawn. This number gets bigger if there is an adoptive parent pair on the map.
		this.firstChildYDistance = 20;
		this.firstChildYWithAdoptions = 130;
		var star = this.getPersonById(this.props.star_id);
		this.fullName = star.fName + " " + star.lName;
		// if dateFilter not yet set, set it to Star's 18th birthday
		if (!this.dateFilterString) {
			if (!star.birthDate) {
				alert('Star does not have a birthdate, map will not be drawn');
				return;
			} else {
				// this.dateFilterString = moment(star.birthDate.toString().replace(/-/g, '\/').replace(/T.+/, '')).add(18,'y').format('YYYY-MM-DD');
				this.dateFilterString = moment(star.birthDate.replace(/T.+/, ''), 'YYYY-MM-DD').add(18,'y').format('YYYY-MM-DD');
				this.setState({
				dateFilterString: moment(this.dateFilterString.toString()).format('MM/DD/YYYY'),
				starAge: 18
				});
			}
		}
		console.log("Date: ", this.dateFilterString, star.birthDate);

	}

	getPersonById = (_id) => {
		// want to find the person in the local person array, in case a person has been added by this map function. this.people is a copy of the store.people.people at the beginning of the function. This function may add people (the star's parents most germainly) to the local people copy.
		return this.people.find(function(person){
			return person._id === _id;
		});
	}

	drawCircle(person) {
		if (person.fName === 'Thomas') {
			console.log('draw thomas at: ', person.mapXPos);
		}
		let circle = this.g
			.append("svg:a")
			.append("circle")
			.attr("cx", person.mapXPos)
			.attr("cy", person.mapYPos)
			.attr("r", 40)
			.attr("id", person._id)
			.attr("class", "can-click")
			.on("click", this.personClick(person))
			.style("stroke", "black")
			.style("stroke-width", 3)
			.style("fill", "white");

		return circle;
	}

	// when a person on the map is clicked, check to see if that person has a Z to start their ID. If not, then go to their peopledetails page. If they do, then we know this person is a parent that is not yet created of a child in the map. We know this because that is the only way a person would get a Z. In this case, we set it up and call the openNewPersonModal, so the user can create this person
	personClick(person) {
		return() => {
			if (person._id.substr(0,1) === "Z") {
				// if the person_id starts with a Z, then we the maps component created that person locally. We then want to find out who the child was for this person, so when we create the person in the backend, we also set them as a parent to the child. Note also that if they have a Z (and were created locally), they will only be a parent to one child on the map.
				var parentalRel = this.parentRels.find(function(parentRel) {
					return parentRel.parent_id === person._id;
				});

				// when we get the parental rel where this person is the parent, we can get the child_id. Then, we set the store.modal.newPerson.child to this child so that when the new person modal is opened, it creates a parent child relationship record between this parent and this child just found.
				if (parentalRel) {
					this.props.setNewPersonModal(this.getPersonById(parentalRel.child_id));
				} else {
					// this should never happen, and having a message to the user come up, just in case.
					if (!this.errorShown) {
						alert("Error creating a parent. Call support.");
						this.errorShown = true;
					}
				}
				// Open the new person modal
				this.props.openNewPersonModal();
			} else {
				// if this person does not have a Z, then they already exist in the backend, and just take the user to their details page.
				hashHistory.push('/peopledetails/' + person._id);
			}
		}
	}

	drawCircleText(cx, cy, person, justify) {
		var textData = [];
		// if there is a user entered birthDate, use that, else check to see if there is a value in the eventDate field, if so format that. If there is no value in the eventDate field, then use the empty string
		var birthDate = (person.birthDateUser ? person.birthDateUser : (person.birthDate ? moment(person.birthDate.toString().replace(/T.+/, '')).format('MM/DD/YYYY') : ""));
		// only include death info if there is a deathDate
		if (person.deathDate) {
			var deathDate = (person.deathDateUser ? person.deathDateUser : (person.deathDate ? moment(person.deathDate.toString().replace(/T.+/, '')).format('MM/DD/YYYY') : ""));
			textData = [
				// name
				{"x": cx, "y": cy, "txt": person.fName + " " + person.lName},
				// birth info
				{"x": cx, "y": cy + this.textLineSpacing, "txt": "Birth: " + birthDate},
				{"x": cx, "y": cy + (this.textLineSpacing * 2), "txt": person.birthPlace},
				// death info
				{"x": cx, "y": cy + (this.textLineSpacing * 3), "txt": "Death: " + deathDate},
				{"x": cx, "y": cy + (this.textLineSpacing * 4), "txt": person.deathPlace}
			];
		} else {
			textData = [
				// name
				{"x": cx, "y": cy, "txt": person.fName + " " + person.lName},
				// birth info
				// {"x": cx, "y": cy + this.textLineSpacing, "txt": "DOB: " + (person.birthDate ? moment(person.birthDate.toString().replace(/-/g, '\/').replace(/T.+/, '')).format('MM/DD/YYYY') : "")},
				{"x": cx, "y": cy + this.textLineSpacing, "txt": "Birth: " + birthDate},
				{"x": cx, "y": cy + (this.textLineSpacing * 2), "txt": person.birthPlace}
			];
		}

		// append the person_id so that the text we are appending is unique and
		// doesn't prevent any other text to be written
		var vText = this.g.selectAll("text" + person._id)
			.data(textData)
			.enter()
			.append("text")
			.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; })
			.text(function(d)     { return d.txt; })
			.attr("font-family", "sans-serif")
			.attr("font-size", this.textSize)
			.attr("fill", "black")
			.attr("font-weight", "600");

		// if the parameter 'right' is passed into the justify variable for the function, then right justify the text on the map
		if (justify === 'right') {
			vText.attr('text-anchor', 'end');
		}

		// draw the text
		return vText;
	}

	drawMaleSymbol(cx, cy) {
		let lineData = [
			{"x": cx + 28, "y": cy - 28}, {"x": cx + 40, "y": cy - 40},
			{"x": cx + 30, "y": cy - 40}, {"x": cx + 40, "y": cy - 40},
			{"x": cx + 40, "y": cy - 30}
		];

		let lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		return this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", "black")
			.attr("stroke-width", 3)
			.attr("fill", "none");
	}

	drawTextBox(cx, cy) {
		let lineData = [
			{"x": cx + 45, "y": cy - 45}, {"x": cx + 175, "y": cy - 45},
			{"x": cx + 175, "y": cy + 20}, {"x": cx + 45, "y": cy + 20},
			{"x": cx + 45, "y": cy - 45}
		];

		let lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		return this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", "black")
			.attr("stroke-width", 0)
			.attr("fill", "#E9EBEE");
	}

	drawRelText(mom, dad, pairBondRel) {
		let prefix;
		let endPrefix;
		let textData = [];
		let cx, cy;

		// xPos is halfway between mom and dad, and then minus a few pixels for rough centering
		cx = Math.abs(mom.mapXPos - dad.mapXPos) / 2 + (mom.mapXPos < dad.mapXPos ? mom.mapXPos : dad.mapXPos) - 45;

		// if this pair bond shows up on the adopted line, the curve is different, so calculate the y position differently
		if (pairBondRel.subTypeToStar === "Adopted") {
			cy = (mom.mapYPos) - 50;
		} else {
			// yPos needs to account for the curve of the rel line
			cy = (mom.mapYPos - 160);
		}

		// check to see if there is already a text box drawn near here
		let coord = this.drawnCoords.find(
				function(coord) {
					return Math.abs(cx - coord.x) < 120 && Math.abs(cy - coord.y) < 25;
				}
			);
		// until there is not a text box here, continue to push the text box until there is room for it
		while ( coord ) {
			cx += 1;
			coord = this.drawnCoords.find(
				function(coord) {
					return Math.abs(cx - coord.x) < 120 && Math.abs(cy - coord.y) < 25;
				}
			);
		}

		// only show start date and end date if both of them exist
		if ( pairBondRel.startDate && pairBondRel.endDate ) {
			textData = [
				// together info
				{
					"x": cx,
					"y": cy,
					"txt": this.getRelTextPrefix(pairBondRel.relationshipType) +
					moment(pairBondRel.startDate).format("MM/DD/YYYY")
				},
				// apart info
				{
					"x": cx + 3,
					"y": cy + this.textLineSpacing,
					"txt": this.getRelTextEndPrefix(pairBondRel.relationshipType) +
					moment(pairBondRel.endDate).format("MM/DD/YYYY")
				},
			];
		} else if ( pairBondRel.startDate ) {
			// only show startDate if one exists.
			textData = [
				// together info
				{
					"x": cx,
					"y": cy,
					"txt": this.getRelTextPrefix(pairBondRel.relationshipType) +
					moment(pairBondRel.startDate).format("MM/DD/YYYY")
				}
			];
		}

		// push the box coordinates that will be drawn
		this.drawnCoords.push(
			{
				x: cx,
				y: cy
			}
		);

		// append the pairBond ID so that the text we are appending is unique and
		// doesn't prevent any other text to be written
		 return this.g.selectAll("text" + pairBondRel._id)
			.data(textData)
			.enter()
			.append("text")
			.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; })
			.text(function(d)     { return d.txt; })
			.attr("font-family", "sans-serif")
			.attr("font-size", this.textSize)
			.attr("fill", pairBondRel.color)
			.attr("font-weight", "600");
	}

	getRelTextPrefix(relType) {
		if ( /[Mm]arriage/.test(relType) ) {
			return "m: ";
		} else {
			return "s: ";
		}
	}

	getRelTextEndPrefix(relType) {
		if ( /[Mm]arriage/.test(relType) ) {
			return "d: ";
		} else {
			return "e: ";
		}
	}

	drawFemaleSymbol(cx, cy) {
		let lineData = [
			{"x": cx, "y": cy + 40}, {"x": cx, "y": cy + 50},
			{"x": cx - 8, "y": cy + 50}, {"x": cx + 8, "y": cy + 50},
			{"x": cx, "y": cy + 50}, {"x": cx, "y": cy + 60}
		];

		let lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		return this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", "black")
			.attr("stroke-width", 3)
			.attr("fill", "none");
	}

	drawCircleHash (person) {
		let lineData = [
			{"x": person.mapXPos + 25, "y": person.mapYPos - 33},
			{"x": person.mapXPos - 33, "y": person.mapYPos + 25},
		];

		let lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		person.d3CircleHash1 = this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.attr("fill", "black");

		lineData = [
			{"x": person.mapXPos + 33, "y": person.mapYPos - 25},
			{"x": person.mapXPos - 25, "y": person.mapYPos + 33},
		];

		lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		person.d3CircleHash2 = this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.attr("fill", "black");

		// draw second hash mark
		lineData = [
			{"x": person.mapXPos - 25, "y": person.mapYPos - 33},
			{"x": person.mapXPos + 33, "y": person.mapYPos + 25},
		];

		lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		person.d3CircleHash3 = this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.attr("fill", "black");

		lineData = [
			{"x": person.mapXPos - 33, "y": person.mapYPos - 25},
			{"x": person.mapXPos + 25, "y": person.mapYPos + 33},
		];

		lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		person.d3CircleHash4 = this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.attr("fill", "black");
	}

	drawRelLine(p1, p2, color, relType) {
		var lineStrArr = [];
		var yControlPoint: number;
		var line;
		var personOne, personTwo;

		// find out which person p1 or p2, is further to the left (has the lower mapXPos), that is the one to set as person1, so that the Bezier curve is drawn correctly. We set four point for the line, going from left to right.
		if (p1.mapXPos < p2.mapXPos) {
			personOne = p1;
			personTwo = p2;
		} else {
			personOne = p2;
			personTwo = p1;
		}

		lineStrArr.push("M");
		lineStrArr.push(personOne.mapXPos);
		lineStrArr.push(personOne.mapYPos - 40);
		lineStrArr.push("C");
		// the smaller the Y coordinate of the control point, the higher the control point is on the map, and thus the more arc in the line.
		// check to see if the two people in the relationship are greater than 250 pixels from each other and change the equation for the line if so - so it arcs correctly
		if (Math.abs(personOne.mapXPos - personTwo.mapXPos) > 250 ) {
			yControlPoint = (personTwo.mapYPos - 60) / ((personTwo.mapXPos - personOne.mapXPos) / 250);
		} else {
			yControlPoint = (personTwo.mapYPos - 60) / ((personTwo.mapXPos - personOne.mapXPos) / 250 * 1.25);
		}
		lineStrArr.push((personTwo.mapXPos - personOne.mapXPos) / 8 * 2 + personOne.mapXPos);
		lineStrArr.push( yControlPoint + ",");
		lineStrArr.push((personTwo.mapXPos - personOne.mapXPos) / 8 * 6 + personOne.mapXPos);
		lineStrArr.push( yControlPoint + ",");
		// this is the ending point of the line
		lineStrArr.push(personTwo.mapXPos);
		lineStrArr.push(personTwo.mapYPos - 40);

		line = this.g
		.append("path")
		.attr("id","relline" + personTwo._id + personOne._id)
		.attr("d", lineStrArr.join(" "))
		.attr("fill", "transparent");

		if ( /[Mm]arriage/.test(relType) ) {
			// if it is a marriage, leave the line as a solid line
			line = line
			.attr("stroke", color)
			.attr("stroke-width", 2);
		} else if ( /\?/.test(relType) ) {
			// get here if there is a ? at the beginning of the relationship type, which is what is inserted if the parents did not exist when the map is drawn, and were created by the map algorithm locally so that the map could be drawn
			line = line
			this.g
			.append("text")
			.append("textPath")
			.attr("xlink:href", "#relline" + personTwo._id + personOne._id)
			.style("text-anchor","middle") //place the text halfway on the arc
			.style("fill", color)
			.attr("startOffset", "50%")
			.text("? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?");
		} else if ( /Extra-Marital-Mated/.test(relType) ) {
			// get here if there is a ? at the beginning of the relationship type, which is what is inserted if the parents did not exist when the map is drawn, and were created by the map algorithm locally so that the map could be drawn
			line = line
			this.g
			.append("text")
			.append("textPath")
			.attr("xlink:href", "#relline" + personTwo._id + personOne._id)
			.style("text-anchor","middle") //place the text halfway on the arc
			.style("fill", color)
			.attr("startOffset", "50%")
			.text("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-");
		} else if ( /Extra-Marital/.test(relType) ) {
			// get here if there is a ? at the beginning of the relationship type, which is what is inserted if the parents did not exist when the map is drawn, and were created by the map algorithm locally so that the map could be drawn
			line = line
			this.g
			.append("text")
			.append("textPath")
			.attr("xlink:href", "#relline" + personTwo._id + personOne._id)
			.style("text-anchor","middle") //place the text halfway on the arc
			.style("fill", color)
			.attr("startOffset", "50%")
			.text("********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************");
		} else if ( /Stranger/.test(relType) ) {
			// get here if there is a ? at the beginning of the relationship type, which is what is inserted if the parents did not exist when the map is drawn, and were created by the map algorithm locally so that the map could be drawn
			line = line
			this.g
			.append("text")
			.append("textPath")
			.attr("xlink:href", "#relline" + personTwo._id + personOne._id)
			.style("text-anchor","middle") //place the text halfway on the arc
			.style("fill", color)
			.attr("startOffset", "50%")
			.text("oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
		} else if ( /Coersive/.test(relType) ) {
			// get here if there is a ? at the beginning of the relationship type, which is what is inserted if the parents did not exist when the map is drawn, and were created by the map algorithm locally so that the map could be drawn
			line = line
			this.g
			.append("text")
			.append("textPath")
			.attr("xlink:href", "#relline" + personTwo._id + personOne._id)
			.style("text-anchor","middle") //place the text halfway on the arc
			.style("fill", color)
			.attr("startOffset", "50%")
			.text("<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>");
		} else if ( /Restitution/.test(relType) ) {
			// get here if there is a ? at the beginning of the relationship type, which is what is inserted if the parents did not exist when the map is drawn, and were created by the map algorithm locally so that the map could be drawn
			line = line
			this.g
			.append("text")
			.append("textPath")
			.attr("xlink:href", "#relline" + personTwo._id + personOne._id)
			.style("text-anchor","middle") //place the text halfway on the arc
			.style("fill", color)
			.attr("startOffset", "50%")
			.text("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		} else if ( /Mated/.test(relType) ) {
			// get here if it is a mated relationship
			line = line
			.attr("stroke", color)
			.attr("stroke-width", 2)
			.style("stroke-dasharray", ("2,8"));
		} else {
			// get here Casual or Informal (need to move all Informals to Casual)
			line = line
			this.g
			.append("text")
			.append("textPath")
			.attr("xlink:href", "#relline" + personTwo._id + personOne._id)
			.style("text-anchor","middle") //place the text halfway on the arc
			.style("fill", color)
			.attr("startOffset", "50%")
			.text("-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o");
		}

		return line;
	}

	drawAdoptiveRelLine(p1, p2, color, relType) {
		var lineStrArr = [];
		var line;
		var yControlPoint: number;
		var personOne, personTwo;

		// find out which person p1 or p2, is further to the left (has the lower mapXPos), that is the one to set as person1, so that the Bezier curve is drawn correctly. We set four point for the line, going from left to right.
		if (p1.mapXPos < p2.mapXPos) {
			personOne = p1;
			personTwo = p2;
		} else {
			personOne = p2;
			personTwo = p1;
		}

		// yControlPoint is the control point of the Bezier curve that connects the adoptive parents. The higher it is on the map, the higher the arc of the curve.
		// the smaller the Y coordinate of the control point, the higher the control point is on the map, and thus the more arc in the line.
		// check to see if the two people in the relationship are greater than 250 pixels from each other and change the equation for the line if so - so it arcs correctly
		if (Math.abs(personOne.mapXPos - personTwo.mapXPos) > 250 ) {
			yControlPoint = 625 / Math.log10((personTwo.mapXPos - personOne.mapXPos) / 2);
		} else {
			// yControlPoint = (personTwo.mapYPos - 60) / ((personTwo.mapXPos - personOne.mapXPos) / 250 * 1.25);
			yControlPoint = 625 / Math.log10((personTwo.mapXPos - personOne.mapXPos) / 1);

		}
		// yControlPoint = 625 / Math.log10((personTwo.mapXPos - personOne.mapXPos) / 2);
		lineStrArr.push("M");
		// This is the beginning of the line, at the top of dad
		lineStrArr.push(personOne.mapXPos + 0);
		lineStrArr.push(personOne.mapYPos - 40);
		lineStrArr.push("C");

		// var lower = (mom.mapXPos < dad.mapXPos ? mom.mapXPos : dad.mapXPos);
		// var value = Math.abs(mom.mapXPos - dad.mapXPos) / 8 * 2 + (mom.mapXPos < dad.mapXPos ? mom.mapXPos : dad.mapXPos);
		lineStrArr.push((personTwo.mapXPos - personOne.mapXPos) / 8 * 2 + personOne.mapXPos);
		lineStrArr.push(yControlPoint);

		lineStrArr.push((personTwo.mapXPos - personOne.mapXPos) / 8 * 6 + personOne.mapXPos);
		lineStrArr.push(yControlPoint);

		// This is the end point of the line, at the top of mom
		lineStrArr.push(personTwo.mapXPos - 0);
		lineStrArr.push(personTwo.mapYPos - 40);

		line = this.g
		.append("path")
		.attr("d", lineStrArr.join(" "))
		.attr("fill", "transparent")
		.attr("stroke", color)
		.attr("stroke-width", 2);

		if ( /[Mm]arriage/.test(relType) ) {
			// leave the line as is
		} else {
			line = line.style("stroke-dasharray", ("4,8"));
		}

		// draw the line
		return line;
	}

	drawParentalLine(parent, child, momOrDad, subType) {
		let lineData = [];

		// var tip = d3.tip()
		// 	.attr('class', 'd3-tip')
		// 	.offset([-10, 0])
		// 	.html(function(d) {
		// 	// return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
		// 	return "<strong>Frequency:</strong>";
		// });

		// Define the div for the tooltip
		var div = d3.select("body").append("div")
		    .attr("class", "tooltip")
		    .attr("fill", "white")
		    .style("opacity", 0);

		if (momOrDad === "mom") {
			lineData = [
				{"x": parent.mapXPos, "y": parent.mapYPos + 40},
				{"x": child.mapXPos + 40, "y": child.mapYPos},
			];
		} else if (momOrDad === "dad") {
			lineData = [
				{"x": parent.mapXPos, "y": parent.mapYPos + 40},
				{"x": child.mapXPos - 40, "y": child.mapYPos},
			];
		}

		let lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		var line = this.g
				.append("path")
				.attr("d", lineFunction(lineData))
				// the on mouseover is to show the parent and child's name when you hover over the line. Base code for this was found here: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
				.on("mouseover", function(d) {
		            div.transition()
		                .duration(200)
		                .style("opacity", 1);
		            div.html("<span class='relToolTip'>" + parent.fName + " and " + child.fName +
		            	"</span>")
		                .style("left", (d3.event.pageX) + "px")
		                .style("top", (d3.event.pageY - 28) + "px");
		            })
		        .on("mouseout", function(d) {
		            div.transition()
		                .duration(500)
		                .style("opacity", 0);
		            }
			);

		if ( /[Bb]iological/.test(subType) ) {
			return line
				.attr("stroke", "blue")
				.attr("stroke-width", 2)
				.attr("fill", "none")
		} else if ( /[Ss]tep/.test(subType) ) {
			return line
				.attr("stroke", "blue")
				.attr("stroke-width", 2)
				.style("stroke-dasharray", ("12,8"))
				.attr("fill", "none");
		} else if ( /[Aa]dopted/.test(subType) ) {
			return line
				.attr("stroke", "blue")
				.attr("stroke-width", 2)
				.style("stroke-dasharray", ("4,8"))
				.attr("fill", "none");
		} else if ( /Foster/.test(subType) ) {
			return line
				.attr("stroke", "blue")
				.attr("stroke-width", 2)
				.style("stroke-dasharray", ("2,8"))
				.attr("fill", "none");
		} else if ( /Legal/.test(subType) ) {
			// get here if there is a ? at the beginning of the relationship type, which is what is inserted if the parents did not exist when the map is drawn, and were created by the map algorithm locally so that the map could be drawn
			// line = line
			return this.g
			.append("text")
			.append("textPath")
			.attr("d", lineFunction(lineData))
			.style("text-anchor","middle") //place the text halfway on the arc
			.style("fill", "blue")
			.attr("startOffset", "50%")
			.text("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		} else {
			if (!this.errorShown) {
				alert("Parental subtype does not have type of line defined to draw: " + subType + ". This is for the parental relationship between: " + parent.fName + " " + parent.lName + " and " + child.fName + " " + child.lName);
				this.errorShown = true;
			}
		}
	}

	drawNonBioParentLines(): void {
		let momRels = [];
		let dadRels = [];
		let mom, dad, momRel, dadRel;

		for (let child of this.children) {
			// find parents that are not biological parents and draw those relationship lines
			// find non-biological mother relationships
			// momRels = this.dataService.parentalRelationships.filter(function(parentRel){
			momRels = this.parentRels.filter(function(parentRel){
			   return /[Mm]other/.test(parentRel.relationshipType) &&
					!/[Bb]iological/.test(parentRel.subType) &&
					parentRel.child_id === child._id;
			});

			// for each mom relationship, draw parental line
			for (momRel of momRels) {
				mom = this.getPersonById(momRel.parent_id);
				// draw parental line only if the mom in the relationship has been drawn. Sometimes, if the mom has not been drawn, then give a warning to the user
				if ( this.alreadyDrawn.includes(mom) ) {
					this.drawParentalLine(mom, child, "mom", momRel.subType);
					// if the relationship has an end date, and the relationship has an end date <= the filterDate, put hash mark on line
					if ((momRel.endDate ? momRel.endDate.substr(0,10) : '9999-99-99') <= this.dateFilterString) {
						this.drawParentRightHash (child, mom, "blue");
					}
				} else {
					// mom is not drawn, so tell the user there is something fishy, and continue
					if (!errorShown) {
						alert("There may be a problem with the parental relationship between " + child.fName + " " + child.lName + " and " + mom.fName + " " + mom.lName + ". Most likely, "  + mom.fName + " " + mom.lName + " does not have a gender assigned to them.");
						this.errorShown = true;
					}
				}
			}

			// find non-bio father relationships
			// dadRels = this.dataService.parentalRelationships.filter(function(parentRel){
			dadRels = this.parentRels.filter(function(parentRel){
				return /[Ff]ather/.test(parentRel.relationshipType) &&
					!/[Bb]iological/.test(parentRel.subType) &&
					parentRel.child_id === child._id;
			});
			// for each mom relationship, draw parental line
			for (dadRel of dadRels) {
				dad = this.getPersonById(dadRel.parent_id);
				// draw parental line only if the mom in the relationship has been drawn. Sometimes, if the mom has not been drawn, then give a warning to the user
				if ( this.alreadyDrawn.includes(dad) ) {
					this.drawParentalLine(dad, child, "dad", dadRel.subType);
					// if the relationship has an end date, and the relationship has an end date <= the filterDate, put hash mark on line
					if ((dadRel.endDate ? dadRel.endDate.substr(0,10) : '9999-99-99') <= this.dateFilterString) {
						this.drawParentRightHash (child, dad, "blue");
					}
				} else {
					// dad is not drawn, so tell the user there is something fishy, and continue
					if (!errorShown) {
						alert("There may be a problem with the parental relationship between " + child.fName + " " + child.lName + " and " + dad.fName + " " + dad.lName + ". Most likely, "  + dad.fName + " " + dad.lName + " does not have a gender assigned to them.");
						this.errorShown = true;
					}
				}
			}
		}
	}

	drawRelHash (mom, dad, pairBondRel, color) {
		// xPos is halfway between mom and dad, and then minus a few pixels for rough centering
		let cx = (mom.mapXPos - dad.mapXPos) / 2 + dad.mapXPos;

		// yPos needs to account for the curve of the rel line
		// controlPoint is the controlPoint of the Bezier line that is drawn between the male and female of the relationship. I use it to calculate the y coordinate to draw the relationship hash. It was very experimental to figure out the equation that works
		const yControlPoint = (mom.mapYPos - 60) / (Math.abs(mom.mapXPos - dad.mapXPos) / 250);

		// dad.mapYPos - 40 is the Y position of where the relationship line begins and ends.
		// What I do is take the control point and then push the hash mark down a little. Push it down by taking the amount of space between the control point and the beginning of the line and then take a fraction of that.
		let cy = yControlPoint + ( (dad.mapYPos - 40) - yControlPoint ) / 4;
		let lineData = [
			{"x": cx - 7, "y": cy + 5}, {"x": cx + 7, "y": cy - 5},
		];

		let lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", color)
			.attr("stroke-width", 2)
			.attr("fill", color);

		// draw second hash mark
		lineData = [
			{"x": cx + 2, "y": cy + 5}, {"x": cx + 16, "y": cy - 5},
		];

		lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", color)
			.attr("stroke-width", 2)
			.attr("fill", color);
	}

	drawAdoptiveRelHash (mom, dad, pairBondRel, color) {
		// xPos is halfway between mom and dad, and then minus a few pixels for rough centering
		const cx = (mom.mapXPos - dad.mapXPos) / 2 + dad.mapXPos;

		// yPos needs to account for the curve of the rel line
		// let cy = mom.mapYPos - 65;
		// yPos needs to account for the curve of the rel line
		// controlPoint is the controlPoint of the Bezier line that is drawn between the male and female of the relationship. I use it to calculate the y coordinate to draw the relationship hash. It was very experimental to figure out the equation that works
		// const yControlPoint = 225;
		const yControlPoint = 625 / Math.log10((mom.mapXPos - dad.mapXPos) / 2);
		// dad.mapYPos - 40 is the Y position of where the relationship line begins and ends.
		// What I do is take the control point and then push the hash mark down a little. Push it down by taking the amount of space between the control point and the beginning of the line and then take a fraction of that.
		let cy = yControlPoint + ( (dad.mapYPos - 40) - yControlPoint ) / 4;

		let lineData = [
			{"x": cx - 7, "y": cy + 5}, {"x": cx + 7, "y": cy - 5},
		];

		let lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", color)
			.attr("stroke-width", 2)
			.attr("fill", color);

		// draw second hash mark
		lineData = [
			{"x": cx + 2, "y": cy + 5}, {"x": cx + 16, "y": cy - 5},
		];

		lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", color)
			.attr("stroke-width", 2)
			.attr("fill", color);
	}

	drawParentLeftHash (child, parent, color) {
		let cx, cy: number;

		// check to see if the child is to the right or left of the parent, and then accomodate for the fact that the relationship line ends on the child away from the child's mapXPos by a length equal to the radius of the circle.
		if (child.mapXPos > parent.mapXPos) {
			cx = (child.mapXPos - 40 + parent.mapXPos) / 2;
		} else {
			cx = (child.mapXPos + 40 + parent.mapXPos) / 2;
		}

		// yPos
		cy = (child.mapYPos + parent.mapYPos + 40) / 2;

		let lineData = [
			{"x": cx - 7, "y": cy + 5}, {"x": cx + 7, "y": cy - 5},
		];

		let lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", color)
			.attr("stroke-width", 1)
			.attr("fill", color);

		// draw second hash mark
		lineData = [
			{"x": cx - 5, "y": cy + 8}, {"x": cx + 9, "y": cy - 2},
		];

		lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", color)
			.attr("stroke-width", 1)
			.attr("fill", color);
	}

	drawParentRightHash (child, parent, color) {
		let cx, cy: number;

		// check to see if the child is to the right or left of the parent, and then accomodate for the fact that the relationship line ends on the child away from the child's mapXPos by a length equal to the radius of the circle.
		if (child.mapXPos > parent.mapXPos) {
			cx = (child.mapXPos - 40 + parent.mapXPos) / 2;
		} else {
			cx = (child.mapXPos + 40 + parent.mapXPos) / 2;
		}

		// yPos
		cy = (child.mapYPos + parent.mapYPos + 40) / 2;

		let lineData = [
			{"x": cx + 7, "y": cy + 5}, {"x": cx - 7, "y": cy - 5},
		];

		let lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", color)
			.attr("stroke-width", 1)
			.attr("fill", color);

		// draw second hash mark
		lineData = [
			{"x": cx + 5, "y": cy + 8}, {"x": cx - 9, "y": cy - 2},
		];

		lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		this.g
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", color)
			.attr("stroke-width", 1)
			.attr("fill", color);
	}

	drawStar (cx, cy, person) {
		let lineData = [
			{"x": cx - 35, "y": cy - 15}, {"x": cx + 33, "y": cy - 13},
			{"x": cx - 25, "y": cy + 25}, {"x": cx, "y": cy - 35},
			{"x": cx + 25, "y": cy + 25}, {"x": cx - 35, "y": cy - 15}
		];

		let lineFunction = d3.line()
							.x(function(d) {return d.x; })
							.y(function(d) {return d.y; });

		return this.g
			.append("svg:a")
			// .attr("xlink:href", "/#/peopledetails/" + person._id)
			.append("path")
			.attr("d", lineFunction(lineData))
			.attr("id", person._id)
			.attr("class", "can-click")
			.on("click", this.personClick(person))
			.attr("stroke", "gray")
			.attr("stroke-width", 3)
			.attr("fill", "gray");
	}

	bringAllChildrenToFront (): void {

		// this is needed to move d3 elements to the front of the drawing. Found here: http://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3
		d3.selection.prototype.moveToFront = function() {
		    return this.each(function(){
		        this.parentNode.appendChild(this);
		    });
		};

		for (let child of this.children) {
			// bringing the circle to front is not working, so going to draw it again
			if (child.mapXPos && child.mapYPos) {
				this.drawCircle(child);
				if ((child.deathDate ? child.deathDate.substr(0,10) : '9999-99-99') <= this.dateFilterString) {
					this.drawCircleHash(child);
				}
				if (child.d3Symbol) { child.d3Symbol.moveToFront(); }
				// bringing Star to the front did not work with it being a hyper-link, so re-drawing it
				if (child._id === this.props.star_id) { this.drawStar(child.mapXPos, child.mapYPos, child); }
				child.d3TextBox.moveToFront();
				child.d3Text.moveToFront();
			}
		}
	}

	drawTick (cx, cy, tickText) {
		var textData;
		textData = [
			// text
			{"x": cx, "y": cy, "txt": tickText}
		];

		// append the person_id so that the text we are appending is unique and
		// doesn't prevent any other text to be written
		let text = this.g.selectAll("text" + tickText)
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
