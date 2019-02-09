import React from 'react';
import './Track.css';

class Track extends React.Component {
	constructor(props){
		super(props);
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
	}
	renderAction(){
		if (this.props.onAdd){
			return (
				<button className="Track-action" onClick={this.addTrack}>+</button>
			);
		} else {
			return (
				<button className="Track-action" onClick={this.removeTrack}>-</button>
			);
		}
	}
	addTrack(track){
		//console.log('in .addTrack now');
		let currentTrack = this.props.track;
		//console.log(this.props.track);
		this.props.onAdd(currentTrack);
	}
	removeTrack(track){
		let currentTrack = this.props.track;
		this.props.onRemove(currentTrack);
	}
	render(){
		return(
			<div className="Track">
			  <div className="Track-information">
			    <h3>{this.props.track.name}</h3>
			    <p>{this.props.track.artist} | {this.props.track.album}</p>
			  </div>
			  {this.renderAction()}
			</div>
		);
	}
}

export default Track;