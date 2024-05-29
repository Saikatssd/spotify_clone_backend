const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/song');
const playlistRoutes = require('./routes/playlist');
const cors=require("cors");

const app = express();
// var port = 5000;
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "Spotify"
})
    .then(() => console.log("Database Connected"))
    .catch((e) => console.log(e));



//Setup passport jwt 

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secretkey';
// passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
//     User.findOne({ id: jwt_payload.sub }, function (err, user) {
//         //error or does not exists
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//             // or you could create a new account
//         }
//     });
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findOne({ _id: jwt_payload.identifier });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    } catch (err) {
        return done(err, false);
    }

}));


app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT} `);
});

