'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var OperationsSchema = Schema( {
  fileId: String,
  msg: String,
} );

module.exports = mongoose.model( 'Operations', OperationsSchema );
