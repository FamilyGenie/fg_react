export function addToArray(arr, element) {
			console.log("in addToArray with ", arr, element);
			if ( !arr.includes(element) ) {
				arr.push(element);
			}
			return arr;
}
