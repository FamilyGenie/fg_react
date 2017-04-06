function makeTreeFunctions(getLeft, getRight, getParent) {

	function getLeftLineage(startNode) {
		let node = startNode;
		let leftArray = [];
		while (node) {
			leftArray.push(node.person)
			node = getLeft(node);
		}

		return leftArray;
	}

	return {
		getLeftLineage
	}
}


function getLeft(node) {
	return (node.mom ? node.mom : null);
}

function getRight(node) {
	return (node.dad ? node.dad : null);
}

function getParent(node) {
	return (node.child ? node.child : null);
}

const treeFunctions = makeTreeFunctions(getLeft, getRight, getParent);

export { treeFunctions };
