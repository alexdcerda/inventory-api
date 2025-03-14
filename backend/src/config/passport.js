import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';

// Configure local strategy for use by Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find the user by username
      const user = await User.findByUsername(username);
      
      // If user doesn't exist
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      
      // Check if password is correct
      const isMatch = await User.verifyPassword(password, user.password);
      
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      
      // Return user if authentication is successful
      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport; 