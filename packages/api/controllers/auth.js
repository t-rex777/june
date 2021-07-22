const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

const CALLBACK_URL = !process.env.PROD
      ? `http://localhost:4000/api/auth/google/redirect`
      : `https://june-api.herokuapp.com/api/auth/google/redirect`;


exports.setupGoogleOauth = (passportInstance) => {
  passportInstance.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({
          email: profile.emails[0].value,
        });
        if (!user) {
          try {
            const newUser = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              ga_id: profile.id,
              username: profile.emails[0].value.split("@")[0],
            });
           const savedUser =  await newUser.save();
            done(null, newUser);
            return;
          } catch (error) {
            res.status(400).json({
              message: error.message,
            });
          }
        }
        if (!user.ga_id) user = user.ga_id = profile.id;
        await user.save();
        done(null, user);
      }
    )
  );

  passportInstance.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passportInstance.deserializeUser(async (id, cb) => {
    const user = await User.findOne({ _id: id });
    if (!user) return;
    cb(null, user);
  });
};
