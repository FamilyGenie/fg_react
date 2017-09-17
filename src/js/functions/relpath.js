// this file contains code that is currently under test

import { treeFunctions, getLeft, getRight, getParent } from './treeHelpers';

function createTree(starId, people, parentalRels, events) {

	let peopleMap = mapEventsToPeople(people, events);

	let star = {
		person: peopleMap.find((person) => {return person._id == starId}),
	};

	populateTree(star, people, parentalRels);
	return star;

}

function populateTree(startNode, people, parentalRels) {
	let cont = true;
	let node = startNode;
	// array to store nodes that have their dad line fully traversed
	let dadCheck = [];
	// array to store nodes that have their mom line fully traversed
	let momCheck = [];
	while (cont) {
		// if we are at a node where the dad line and mom line have been checked
		if (inDadCheck(node) && inMomCheck(node)) {

			// if we are at the startNode, we are done checking the entire tree, so set continue to false
			if (node === startNode) {
				cont = false;
			} else {
				// else, we are done with both the mom line and dad line, so move up the tree.
				// first, find out if where we currently are is this child nodes mom or dad, so we can add the node's child to the correct array, signifying that side being completely traversed
				if (node === node.child.mom) {
					momCheck.push(node.child);
				} else {
					dadCheck.push(node.child);
				}
				// this is what moves us up the tree
				node = node.child;
			}
		// if the dad line for this node has not yet been checked
		} else if (!inDadCheck(node)) {
			// then if there is a dad for this node, move down to that node
			if (node.dad) {
				node = node.dad;
			} else {
				// there is not a dad for this node set yet, so, see if there is a dad for this node
				if (getNodeParent(node, people, parentalRels, 'father')) {
					// if there is a dad, then set the node for the next time through the loop to the dad
					node = node.dad;
				} else {
					// if there is not a dad, then put this node in the array that the dad line for this node has been checked
					dadCheck.push(node);
				}
			}
		// if the mom line for this node has not yet been checked
		} else if (!inMomCheck(node)) {
			// then if there is a mom for this node, move down to that node
			if (node.mom) {
				node = node.mom;
			} else {
				// there is not a mom for this node, so, see if there is a mom for this node
				if (getNodeParent(node, people, parentalRels, 'mother')) {
					// if there is a mom, then set the node for the next time through the loop to the mom
					node = node.mom;
				} else {
					// if there is not a mom, then put this node in the array that the mom line for this node has been checked
					momCheck.push(node);
				}
			}
		}
	}

	function inMomCheck(node) {
		let _in = momCheck.find((n) => {
			return n == node;
		})
		return !!_in;
	}

	function inDadCheck(node) {
		let _in = dadCheck.find((n) => {
			return n == node;
		})
		return !!_in;
	}
}

function getParentLocal(star, people, parentalRels, parentType) {
	let parentRel = parentalRels.find((parentalRel) => {
		return (parentalRel.child_id === star._id && parentalRel.relationshipType.toLowerCase() === parentType && parentalRel.subType.toLowerCase() === 'biological');
	})

	if (parentRel) {
		let _parent = people.find((person) => {
			return (person._id === parentRel.parent_id)
		});

		return _parent;
	} else {
		return false;
	}
}

function mapEventsToPeople(people, events) {

	return (
		people.map(function(person) {
			// set the values from the actual person record to null, so they are not used in maps. We really shouldn't have this problem after March 17, 2017, because this is for backward compatiblity. Going forward, all new users should only have these events from the events table.
			// So, if you do a search on the entire database and no person record has a birthDate or deathDate as a field in any document, then we can remove these next two lines of code.
			person.birthDate = '';
			person.deathDate = '';

			let birth = events.find(function(e) {
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
		})
	)

}

function getNodeParent(node, people, parentalRels, parentType) {

	if (parentType.toLowerCase() == 'father') {
		let nodeFather = getParentLocal(node.person, people, parentalRels, 'father');

		if (nodeFather) {
			node.dad = {};
			node.dad.person = nodeFather;
			node.dad.child = node;
			return true;
		} else {
			return false;
		}
	}

	if (parentType.toLowerCase() == 'mother') {
		let nodeMother = getParentLocal(node.person, people, parentalRels, 'mother');

		if (nodeMother) {
			node.mom = {};
			node.mom.person = nodeMother;
			node.mom.child = node;
			return true;
		} else {
			return false;
		}
	}

	return false;
}

function getNodeParents(node, people, parentalRels) {

	let nodeFather = getParentLocal(node.person, people, parentalRels, 'father');

	if (nodeFather) {
		node.dad.person = nodeFather;
		node.dad.child = node;
	}

	let nodeMother = getParentLocal(node.person, people, parentalRels, 'mother');

	if (nodeMother) {
		node.mom.person = nodeMother;
		node.mom.child = node;
	}

	// if there is a nodeFather or a nodeMother found and set, then return true
	if (nodeFather || nodeMother) {
		return true;
	} else {
		return false;
	}

}

/***** DRY ******/
function maternalRelPath(starId, people, parentalRels) {
  /* return an array of _ids of the mothers of the star passed in */
  let mothers = [];
  let currentMother;
  while (starId) {
    let currentMotherRel = parentalRels.find((pr) => {
      return (pr.child_id === starId && pr.relationshipType.toLowerCase() === 'mother');
    });
    try {
      currentMother = currentMotherRel.parent_id;
    }
    catch (TypeError) {
      currentMother = null;
    }

    if (currentMother) {
      mothers.push(currentMother);
      starId = currentMother;
    } else {
      starId = null;
      return mothers;
    }
  }
}

/***** DRY ******/
function paternalRelPath(starId, people, parentalRels) {
  /* return an array of _ids of the mothers of the star passed in */
  let fathers = [];
  let currentFather;
  while (starId) {
    let currentFatherRel = parentalRels.find((pr) => {
      return (pr.child_id === starId && pr.relationshipType.toLowerCase() === 'father');
    });
    try {
      currentFather = currentFatherRel.parent_id;
    }
    catch (TypeError) {
      currentFather = null;
    }

    if (currentFather) {
      fathers.push(currentFather);
      starId = currentFather;
    } else {
      starId = null;
      return fathers;
    }
  }
}

function getAndColorEvents(starId, color, events) {
  console.log('in getandcolorevents')
  events.find((event) => {
    if (event.person_id === starId) {
      // call a dispatch to update the store, instead of overwriting
      event.color = color;
    }
  });
}

export { createTree, treeFunctions, getLeft, getRight, getParent, paternalRelPath, maternalRelPath, getAndColorEvents };
