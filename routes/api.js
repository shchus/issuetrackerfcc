/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
var db;
MongoClient.connect(CONNECTION_STRING, function(err, DB) {
  if (!err) {
    db = DB;
  } else {
    console.log(err)
  }
});

//make object for db
var makeObject = (query, d) => {
  Object.keys(query).forEach((e) => {
    if (['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text'].includes(e)) {
      d[e] = query[e]
    } 
    else if (['created_on', 'updated_on'].includes(e)) {
      d[e] = new Date(query[e])
    }
    else if (e == 'open' && query[e] == 'true') {
      d['open'] = true
    }
    else if (e == 'open' && query[e] == 'false') {
      d['open'] = false
    }
  });
};

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      let d = {"project": project};
      makeObject(req.query, d);
      db.collection('projects').find(d).toArray((err, data) => { 
        if (!err) {
          res.json(data)
        }
      });
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var issue_title = req.body.issue_title;
      var issue_text = req.body.issue_text;
      var created_by = req.body.created_by;
      var assigned_to = req.body.assigned_to;
      var status_text = req.body.status_text;
      // add an issue to the db
      if (issue_title && issue_text && created_by) { 
        db.collection('projects').insertOne(
          {project:project,
           issue_title:issue_title,
           issue_text:issue_text,
           created_by:created_by,
           created_on: new Date(),
           updated_on: new Date(),
           assigned_to:assigned_to,
           status_text:status_text,
           open: true
          }, (err, data) => {
            if (!err) {
              res.json(data.ops[0])
            }            
          }
        )
      } else { // empty fields
        res.type('txt').send('missing fields');
      }
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var id = req.body._id;
      let d = {};
      Object.keys(req.body).forEach((e) => {
        if (!req.body[e]) {
          delete req.body[e]
        }
      });
      makeObject(req.body, d);
          
      if (Object.keys(d).length > 0 && ObjectId.isValid(id)) {
        d['updated_on'] = new Date(); // add current data
        db.collection('projects').update(
          {project:project, _id: ObjectId(id)}, // find
          {$set: d}, // update
          (err, data) => { //callback
            if (!err) {
              res.type('txt').send('successfully updated');
            } else {
              res.type('txt').send('could not update ' + id);
            }
          }
        );
      } else { // if no fields are sent 
        res.type('txt').send('no updated field sent'); 
      }
      
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      let id = req.body._id;
      console.log(id)
      if (ObjectId.isValid(id)) {
        db.collection('projects').deleteOne({project:project, _id:ObjectId(id)}, (err, data) => {
          if (!err) { // success
            res.type('txt').send('deleted ' + id)
          } else { // failed
            res.type('txt').send('could not delete ' + id)
          }
        })        
      } else { // invalid id
        res.type('txt').send('_id error')
      }
    });
    
};


