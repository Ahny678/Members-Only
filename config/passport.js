const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// Passport's verify callback, using bcrypt and the User model's verify method
const verifyCallback = async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      //console.log("User not found");
      return done(null, false, { message: "User not found" });
    }

    // Use the User model's verify method to check the password
    const isValid = await user.verify(password);

    if (!isValid) {
      //console.log("Invalid password");
      return done(null, false, { message: "Invalid password" });
    }

    //console.log("Sucessful");
    return done(null, user);
  } catch (err) {
    //console.log(err.message);
    return done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
  //console.log("Serializing user:", user.id); // Check the ID
  done(null, user.id); // Serialize by user ID
});

passport.deserializeUser(async (id, done) => {
  //console.log("Deserializing user ID:", id); // Check the ID

  try {
    const user = await User.findByPk(id); // Use Sequelize to find user by ID
    if (!user) {
      return done(null, false, { message: "User not found" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
