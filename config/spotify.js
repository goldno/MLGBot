const SpotifyWebApi = require('spotify-web-api-node');
const spotifyUri = require('spotify-uri');
const dayjs = require('dayjs')

let spotifyLastRequestedToken = null

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})

const setup = async () => spotifyApi.clientCredentialsGrant()
    .then(data => data.body.access_token, console.err)

const setToken = (token) => spotifyApi.setAccessToken(token)

const refreshToken = async () => {
    return (spotifyLastRequestedToken === null || dayjs().diff(spotifyLastRequestedToken, 'm') > 58)
    ? setup().then(setToken)
    : Promise.resolve()
}

const isType = (query, type) => {
    try {
        return spotifyUri.parse(query[0]).type === type
    } catch (err) {
        return false
    }
}

const isTrack = (query) => isType(query, 'track')
module.exports.isTrack = isTrack

const isPlaylist = (query) => isType(query, 'playlist')
module.exports.isPlaylist = isPlaylist

const getSpotifyId = (query) => spotifyUri.parse(query[0]).id
module.exports.getSpotifyId = getSpotifyId

const getTrack = async (trackId) => {
    return refreshToken().then(() => spotifyApi.getTrack(trackId))
}
module.exports.getTrack = getTrack

const getPlaylist = async (playlistId) => {
    return refreshToken().then(() => spotifyApi.getPlaylist(playlistId))
}
module.exports.getPlaylist = getPlaylist

const getPlaylistTracks = async (playlistId) => {
    await refreshToken()

    const tracks = []
    let total = 0
    let offset = 0

    do {
        const playlistTracks = await spotifyApi.getPlaylistTracks(playlistId, { offset })
        playlistTracks.body.items.forEach(trackInfo => tracks.push(trackInfo))

        total = playlistTracks.body.total
        offset += playlistTracks.body.limit
    } while (total > offset)
    // console.log(tracks[0].name)
    // for(let i=0; i<tracks.length; i++) {
    //     console.log(`Song ${i} `+tracks[i].name)
    // }
    // console.log(tracks)
    // console.log('TRACKS END HERE')
    return tracks
}
module.exports.getPlaylistTracks = getPlaylistTracks
