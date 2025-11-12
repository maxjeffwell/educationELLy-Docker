// Local definition of exactly what a user is so we can tell Mongoose what a model is and how it should handle that for us

import mongoose from 'mongoose'; // Schema is what we use to tell Mongoose about the particular fields our model is going to have

import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

// Define our model

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// On Save Hook, encrypt password
// before saving model, run this function

userSchema.pre('save', function save(next) {
  const user = this; // get access to user model; user is an instance of the user model at this point

  // generate a salt (takes time, so then run callback)

  bcrypt.genSalt(10, (genSaltErr, salt) => {
    if (genSaltErr) {
      return next(genSaltErr);
    }

    // hash password using the salt

    bcrypt.hash(user.password, salt, (hashErr, hash) => {
      if (hashErr) {
        return next(hashErr);
      }

      // overwrite plain text password with encrypted password

      user.password = hash;
      return next();
    });
    return null; // Explicitly return null for this path
  });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (compareErr, isMatch) => {
    if (compareErr) {
      return callback(compareErr);
    }
    return callback(null, isMatch);
  });
};

// Create the model class (what we're going to use to create new users) - represents all users, not just a particular user

const User = mongoose.models.user || mongoose.model('user', userSchema);

// Loads schema into Mongoose and tells it there's a new schema and that it's about a user and it
// corresponds to a collection named 'user'

export default User;
