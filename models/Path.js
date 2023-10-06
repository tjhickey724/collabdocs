'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var pathSchema = Schema( {
  path: String,
  newFileCount: Number,
  NewFoldercount:Number,
  
} );

module.exports = mongoose.model( 'Path', PathSchema );
