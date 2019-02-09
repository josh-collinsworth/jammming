import React from 'react';
import Spotify from '../../util/Spotify';

class Testy extends React.Component{
	constructor(props){
		super(props);
		this.testMethod = this.testMethod.bind(this);
	}
	testMethod(){
		//console.log('testing!');
	}
	render(){
		return (
			<button onClick={Spotify.savePlaylist}>Test!</button>
		)
	}
}

export default Testy;