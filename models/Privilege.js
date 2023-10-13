'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var PrivilegeSchema = Schema( {
  fileId: String,
  sharedwith: String,
  privilegetype:String,
} );

module.exports = mongoose.model( 'Privilege', PrivilegeSchema );
