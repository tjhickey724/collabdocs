'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
//const ObjectId = mongoose.Schema.Types.ObjectId;

//var userSchema = mongoose.Schema( {any:{}})

var PrivilegeSchema = Schema( {
  //fileId: String,
  fileId:{ type: 'ObjectId', ref: 'File' },
  sharedwith: String,
  privilegetype:String,
} );

module.exports = mongoose.model( 'Privilege', PrivilegeSchema );
