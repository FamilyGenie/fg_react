function relPath(starId, people, parentalRels, events) {

	let peopleMap = mapEventsToPeople(people, events);

	let star = {
		child: null,
		person: peopleMap.find((person) => {return person._id == starId}),
		dad: {},
		mom: {}
	};

	// let cont = true;
	// person = star;
	// while (cont) {
	//   getNodeParents()
	// }
	getNodeParents(star, people, parentalRels);
	let endNodes = getNodeEnds(star);


	console.log(endNodes);
	return star;

}

function getNodeEnds(startNode) {
	let nodeEnds = [];
	let cont = true;
	node = startNode;
	debugger;
	while (cont) {
		// if we are at a node where the dad line and mom line have been checked
		if (node.dc && node.mc) {
			// if both have been checked, and there is not a mom and not a dad, then we know we are at the end of a branch, so add node to nodeEnds
			if (!node.mom && !node.dad) {
				nodeEnds.push(node);
			}

			// if we are at the startNode, we are done checking the entire tree, so set continue to false
			if (node === startNode) {
				cont = false;
			} else {
				// else, we are done with both the mom line and dad line, so move up the tree.
				// first, find out if where we currently are is this child nodes mom or dad, so we can set that flag on the node's child
				if (node === node.child.mom) {
					node.child.mc = true;
				} else {
					node.child.dc = true;
				}
				// this is what moves us up the tree
				node = node.child;
			}
		// if the dad line for this node has not yet been checked
		} else if (!node.dc) {
			// then if there is a dad for this node, move down to that node
			if (node.dad) {
				node = node.dad;
			} else {
				// there is not a dad for this node, so we can set dad-check to true for this node
				node.dc = true;
			}
		// if the mom line for this node has not yet been checked
		} else if (!node.mc) {
			// then if there is a mom for this node, move down to that node
			if (node.mom) {
				node = node.mom;
			} else {
				// there is not a mom for this node, so we can set mom-check to true for this node
				node.mc = true;
			}
		}
	}
}

function getParent(star, people, parentalRels, parentType) {
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

function getNodeEnds(startNode, people, parentalRels) {
	let nodeEnds = [];

	getNodeParents(startNode.mom, people, parentalRels)
}

function getNodeParents(node, people, parentalRels) {

	let nodeFather = getParent(node.person, people, parentalRels, 'father');
	if (nodeFather) {
		node.dad.person = nodeFather;
	}

	let nodeMother = getParent(node.person, people, parentalRels, 'mother');
	if (nodeMother) {
		node.mom.person = nodeMother;
	}

	if (nodeFather || nodeMother) {
		return true;
	} else {
		return false;
	}

}

export { relPath };
