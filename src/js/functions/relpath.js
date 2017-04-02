function relPath(starId, people, parentalRels, events) {

  let peopleMap = mapEventsToPeople(people, events);

  let star = {
    child: null,
    person: peopleMap.find((person) => {return person._id == starId}),
    dad: {},
    mom: {}
  };

  let cont = true;
  person = star;
  while (cont) {
    getNodeParents()
  }
  getNodeParents(star, people, parentalRels);

  console.log(star)
  return star

}

function getParent(star, people, parentalRels, parentType) {
  let parentRel = parentalRels.find((parentalRel) => {
    return (parentalRel.child_id === star._id && parentalRel.relationshipType.toLowerCase() === parentType && parentalRel.subType.toLowerCase() === 'biological');
  })

  let _parent = people.find((person) => {
    return (person._id === parentRel.parent_id)
  })
  
  return _parent;
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
