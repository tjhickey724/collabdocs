'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var FolderSchema = Schema( {
  name: String,
  fpath: String,
  fowner:String,
  shared:String,
  fcreatedAt:Date,
  parent:String,
} );

module.exports = mongoose.model( 'Folder', FolderSchema );
