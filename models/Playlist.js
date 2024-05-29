const { default: mongoose } = require("mongoose");


const Playlist = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    thumbnail: {
        type: String,
        require: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    songs: [{
        type: mongoose.Types.ObjectId,
        ref: "Song",
    },
    ],
    collaborators: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    ],

});

const playlistModel = mongoose.model("playlist", Playlist);

module.exports = playlistModel;
