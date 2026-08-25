'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    nationalID: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
