'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var FileSchema = Schema( {
  name: String,
  path: String,
  owner:String,
  shared:String,
  privilage:String,
  createdAt:Date,
  text: String,
  lastmodified:Date
} );

module.exports = mongoose.model( 'File', FileSchema );
