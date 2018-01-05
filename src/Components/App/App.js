import React, { Component } from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';
//import Testy from '../Testy/Testy';

class App extends Component {
  constructor(props){
    super(props);
    this.state = { 
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  search(term){
    Spotify.search(term).then(tracks => {
      this.setState({ searchResults: tracks });
      console.log(this.state.searchResults);
    });
  }
  addTrack(track){
    console.log('Going to add' + track);
    var doNotAdd = false;
    for(let i=0; i<this.state.playlistTracks.length; i++){
      if(this.state.playlistTracks[i].id === track.id ){
        doNotAdd = true;
      }
    }
    if (!doNotAdd){
      this.setState({ playlistTracks: [...this.state.playlistTracks, track]});
    }
  }
  removeTrack(track){
    let newPlaylist = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    this.setState({ playlistTracks: newPlaylist });
  }
  updatePlaylistName(name){
    this.setState({ playlistName: name});
    console.log(this.state.playlistName);
  }
  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    .then( finish => {
      this.setState({ playlistName: 'New Playlist', searchResults: [] })
    });
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        {/*<Testy />*/}
        <div className="App" onLoad={Spotify.getAccessToken()}>
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
