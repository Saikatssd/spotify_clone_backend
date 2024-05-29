const { default: mongoose } = require("mongoose");


const Song = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    thumbnail: {
        type: String,
        require: true,
    },
    track: {
        type: String,
        require: true,
    },
   artist: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },

});

const songModel = mongoose.model("Song", Song);

module.exports = songModel;
