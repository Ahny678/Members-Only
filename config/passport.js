const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models/user"); // Sequelize User model

// Passport's verify callback, using bcrypt and the User model's verify method
const verifyCallback = async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    // Use the User model's verify method to check the password
    const isValid = await user.verify(password);

    if (!isValid) {
      return done(null, false, { message: "Invalid password" });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize by user ID
});

passport.deserializeUser(async (id, done) => {
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
