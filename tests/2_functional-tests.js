/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

var id;

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          id = res.body._id; 
          assert.isOk(res.body.issue_title, 'has issue_title');
          assert.isOk(res.body.issue_text, 'has issue_text');
          assert.isOk(res.body.created_by, 'has created_by');
          assert.isOk(res.body.assigned_to, 'has assigned_to');
          assert.isOk(res.body.status_text, 'has status_text');
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isOk(res.body.issue_title, 'has issue_title');
          assert.isOk(res.body.issue_text, 'has issue_text');
          assert.isOk(res.body.created_by, 'has created_by');
          done();
        });        
      });
      
      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send()
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.equal(res.text, 'missing fields');   
          done();
        });        
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send()
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no updated field sent');   
          done();
        });        
      });
      
      test('One field to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({_id:id, issue_title: 'UPDATE ONE!'})
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.equal(res.text, 'successfully updated');   
          done();
        });         
      });
      
      test('Multiple fields to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({_id:id, issue_title: 'UPDATE NULTIPLE!', issue_text: 'UPDATE MULTIPLE'})
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.equal(res.text, 'successfully updated');   
          done();
        });        
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
       chai.request(server)
        .get('/api/issues/test')
        .query({issue_text : 'UPDATE MULTIPLE'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].issue_text, 'UPDATE MULTIPLE');
          done();
        });        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_text : 'UPDATE MULTIPLE', open : 'true'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].issue_text, 'UPDATE MULTIPLE');
          assert.isTrue(res.body[0].open);
          done();
        });        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send()
        .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, '_id error');
            done();
        });       
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id:id})
        .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'deleted ' + id);  
            done();
        });          
      });
      
    });

});
