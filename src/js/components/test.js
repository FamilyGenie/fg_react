import React from 'react';

export default class Test extends React.Component {

	componentDidMount() {
		console.log('test');
		const p = new Promise(
		    function (resolve, reject) { // (A)
		    	resolve("success");
		        // if (1 === 1) {
		        //     resolve('success'); // success
		        // } else {
		        //     reject('failure'); // failure
		        // }
		    }
	    );

	    p
	    .then(val => {console.log(".then: ", val)})
	    .catch(val => {console.log(".catch: ", val)});

	    function do_a( callback ){
		  setTimeout( function(){
		    // simulate a time consuming function
		    console.log( '`do_a`: this takes longer than `do_b`' );

		    // if callback exist execute it
		    // callback && callback();
		    callback();
		  }, 3000 );
		}

		function do_b(){
		  console.log( '`do_b`: now we can make sure `do_b` comes out after `do_a`' );
		}

		do_a( function(){
		  do_b();
		});
	}

	render = () => {
		return(<div>
			Test
		</div>
		)
	}
}