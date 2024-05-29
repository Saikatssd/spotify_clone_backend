const express = require('express');
const router = express.Router();
const passport = require('passport');
const Song = require('../models/Song');
const User = require('../models/User');
const Playlist = require('../models/Playlist');


//Route 1 Create a playlist
router.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const currentUser = req.user;
    const { name, thumbnail, songs } = req.body;
    if (!name || !thumbnail || !songs) {
        return res
            .status(301)
            .json({ err: "Insufficient data" });
    }
    const playlistData = {
        name,
        thumbnail,
        songs,
        owner: currentUser._id,
        collaborators: [],
    };
    const playlist = await Playlist.create(playlistData);
    return res.status(200).json(playlist);
});

//Route 2 Get a playlist by Id
//we will get playlist id as a parameter and we will return the playlist
router.get("/get/playlist/:playlistId", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const playlistId = req.params.playlistId;
    const playlist = await Playlist.findOne({ _id: playlistId }).populate({ path: "songs", populate: { path: "artist" } });
    if (!playlist) {
        return res
            .status(301)
            .json({ err: "Invalid Id" });

    }
    return res.status(200).json(playlist);
});

//Get all playlists made by artist
router.get("/get/artist/:artistId", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const artistId = req.params.artistId;
    const artist = await User.findOne({ _id: artistId });
    if (!artist) {
        return res
            .status(304)
            .json({ err: "Invalid Artist" });

    }
    const playlists = await Playlist.find({ owner: artistId });
    return res.status(200).json({ data: playlists });
});

//Get all playlists made by me or user
router.get("/get/me", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const artistId = req.user._id;
    const playlists = await Playlist.find({ owner: artistId }).populate("owner");
    return res.status(200).json({ data: playlists });
});


//Add a song to a playlist 
router.post("/add/song", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const currentUser = req.user;
    const { playlistId, songId } = req.body;
    //Step 1: Get the playlist if valid
    const playlist = await Playlist.findOne({ _id: playlistId });
    if (!playlist) {
        return res
            .status(304)
            .json({ err: "Playlist does not Exit" });

    }
    //step 2:check if current user owns the playlist or is a collaborator
    if (!playlist.owner.equals(currentUser._id) &&
        !playlist.collaborators.includes(currentUser._id)) {
        return res
            .status(400)
            .json({ err: "Not allowed" });
    }
    //Step 3: check if the song is a valid song
    const song = await Song.findOne({ _id: songId });
    if (!song) {
        return res
            .status(304)
            .json({ err: "Song does not Exit" });
    }

    //Step 4: We can now simply add the songs to the playlist
    playlist.songs.push(songId);
    await playlist.save();
    return res.status(200).json(playlist);
})


module.exports = router;