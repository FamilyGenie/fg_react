
// planning to use this in the store for other components, to implement DRY practice
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

// This code is currently used to color the chronology events, but all that code is currently not in use, so commenting it out
/***** DRY ******/
// function paternalRelPath(starId, people, parentalRels) {
//   /* return an array of _ids of the mothers of the star passed in */
//   let fathers = [];
//   let currentFather;
//   while (starId) {
//     let currentFatherRel = parentalRels.find((pr) => {
//       return (pr.child_id === starId && pr.relationshipType.toLowerCase() === 'father');
//     });
//     try {
//       currentFather = currentFatherRel.parent_id;
//     }
//     catch (TypeError) {
//       currentFather = null;
//     }

//     if (currentFather) {
//       fathers.push(currentFather);
//       starId = currentFather;
//     } else {
//       starId = null;
//       return fathers;
//     }
//   }
// }

// function getAndColorEvents(starId, color, events) {
//   console.log('in getandcolorevents')
//   events.find((event) => {
//     if (event.person_id === starId) {
//       // call a dispatch to update the store, instead of overwriting
//       event.color = color;
//     }
//   });
// }

export { createTree, treeFunctions, getLeft, getRight, getParent, paternalRelPath, maternalRelPath, getAndColorEvents };
