const clientID = 'faa172d35913415bb43050b492d95e54';
// const redirectURI = 'http://localhost:3000/';
const redirectURI = 'https://jamjam.now.sh/';
let accessToken;
let userID;

const Spotify = {
	getAccessToken(){
		if(accessToken){
			return accessToken;
		} else if(window.location.href.match(/access_token=([^&]*)/)) {
			let partialAccessToken = String(window.location.href.match(/access_token=([^&]*)/));
			accessToken = partialAccessToken.replace('access_token=', '');
			let partialExpiresIn = String(window.location.href.match(/expires_in=([^&]*)/)).replace('expires_in=', '');
			let expiresIn = parseInt(partialExpiresIn, 10);
			
			window.setTimeout(function() {
				accessToken = '';
			}, expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			const fullURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=playlist-modify-public`;
			window.location.href=fullURL;
		}
	},
	search(term){
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
		 headers: {
	        Authorization: `Bearer ${accessToken}`
	      }
   		})
    	.then(response => {
    		return response.json();
    	})
    	.then(jsonResponse => {
    		if(jsonResponse.tracks){
    			//('We got tracks!');
	    		let response = jsonResponse.tracks.items.map(track => ({
			        id: track.id,
			        name: track.name,
			    	artist: track.artists[0].name,
					album: track.album.name,
					uri: track.uri,
				}));
				if(response.length === 0){
					alert('Sorry, no results were found.');
				}
				return(response);
	    	}
		});
	},
	savePlaylist(playlistName, tracks){
		if( !playlistName || !tracks ){
			return;
		}
		// console.log(`Playlist name: ${playlistName}; tracks: ${tracks}`);
		const headers = {
	        Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		} 

			// console.log('Getting user ID!');
			return fetch('https://api.spotify.com/v1/me', { headers: headers })
			.then(response => {
				return response.json();
			})
			.then(jsonResponse => {
				userID = jsonResponse.id;
				return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, { 
					headers: headers,
					method: "POST",
					body: JSON.stringify({name: playlistName})
				}, wrong => {
					console.log("Whoops! Something went wrong:" + wrong);
				})
				.then(response => {
					if(response.ok){
						alert('Playlist created!');
						return response.json();
					}
				})
				.then(jsonResponse => {
					// console.log(jsonResponse);
					const playlistID = jsonResponse.id;
					return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, { 
						headers: headers,
						method: "POST",
						body: JSON.stringify({uris: tracks})
					}, wrong => {
						console.log("Whoops! Something went wrong:" + wrong);
						alert('Sorry, this playlist could not be created.' + wrong);
					});
				})
			})
	}
}

export default Spotify;