'use strict';

var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
chai.use(chaihttp);

describe('app testing', function() {

	var token, token1, token2, token3, server;

	before(function(done) {
		require('../server')(true, function(srv) {
			server = srv;
			done();
		});
	});

	it('should fail auth without token', function(done) {
		chai.request(server)
		.get('/api/user/username')
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(403);
			expect(res.body).to.eql({msg: 'could not authenticate - no token'});
			done();
		});
	});

	it('should fail auth with a bad token', function(done) {
		chai.request(server)
		.get('/api/user/username')
		.set('eat', 'bad token')
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(403);
			expect(res.body).to.eql({msg: 'could not authenticate - decoding error'});
			done();
		});
	});

	it('should create user and create token', function(done) {
		chai.request(server)
		.post('/api/user')
		.send({"username":"test", "firstname":"test", "lastname":"last", "email":"abc@x.com","password":"test", "location":"ny", "instruments":"example", "bio":"coding", "phone":"2222", "track1":"test", "track2":"test", "track3":"test"})
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			console.dir(res.body);
			expect(res.body).to.have.property('eat');
			token = res.body.eat;
			done();
		});
	});

	it('should sign in with the token', function(done) {
		chai.request(server)
		.get('/api/sign_in')
		.auth('test', 'test')
		.set('eat', token)
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('eat');
			token = res.body.eat;
			done();
		});
	});

	it('should not fail auth with a good token', function(done) {
		chai.request(server)
		.get('/api/user/test')
		.set('eat', token)
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			done();
		});
	});

	it('should create test user #1', function(done) {
		chai.request(server)
		.post('/api/user')
		.send({"username":"test1", "firstname":"test", "lastname":"last", "email":"abc@x.com","password":"test", "location":"ny", "instruments":"example", "bio":"coding", "phone":"2222", "track1":"test", "track2":"test", "track3":"test"})
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			console.dir(res.body);
			expect(res.body).to.have.property('eat');
			token1 = res.body.eat;
			done();
		});
	});

	it('should create test user #2', function(done) {
		chai.request(server)
		.post('/api/user')
		.send({"username":"test2", "firstname":"test", "lastname":"last", "email":"abc@x.com","password":"test", "location":"ny", "instruments":"example", "bio":"coding", "phone":"2222", "track1":"test", "track2":"test", "track3":"test"})
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			console.dir(res.body);
			expect(res.body).to.have.property('eat');
			token2 = res.body.eat;
			done();
		});
	});

	it('should create test user #3', function(done) {
		chai.request(server)
		.post('/api/user')
		.send({"username":"test3", "firstname":"test", "lastname":"last", "email":"abc@x.com","password":"test", "location":"ny", "instruments":"example", "bio":"coding", "phone":"2222", "track1":"test", "track2":"test", "track3":"test"})
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			console.dir(res.body);
			expect(res.body).to.have.property('eat');
			token3 = res.body.eat;
			done();
		});
	});

	it('should approve a user', function(done) {
		chai.request(server)
		.post('/api/approval')
		.send({'approving_user':'test1', 'approved_user':'test2'})
		.set('eat', token1)
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('approved_user').and.to.eql('test2');
			expect(res.body).to.have.property('approving_user').and.to.eql('test1');
			done();
		});
	});

	it('should reject a user', function(done) {
		chai.request(server)
		.post('/api/rejection')
		.send({'rejecting_user':'test2', 'rejected_user':'test1'})
		.set('eat', token1)
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('rejected_user').and.to.eql('test1');
			expect(res.body).to.have.property('rejecting_user').and.to.eql('test2');
			done();
		});
	});

	it('should delete a user', function(done) {
		chai.request(server)
		.del('/api/user')
		.set('eat', token)
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			done();
		});
	});

	it('should list all approvals', function(done) {
		chai.request(server)
		.get('/api/approval')
		.send({"username":"test1", "firstname":"test1", "lastname":"last", "email":"abc@x.com","password":"test", "location":"ny", "instruments":"example", "bio":"coding", "phone":"2222", "track1":"test", "track2":"test", "track3":"test"})
		.set('eat', token1)
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			expect(res.body).to.include({"username":"test2", "firstname":"test", "lastname":"last", "email":"abc@x.com", "location":"ny", "instruments":"example", "bio":"coding", "phone":"2222", "track1":"test", "track2":"test", "track3":"test"});
			done();
		});
	});

	it('should offer an unseen user', function(done) {
		chai.request(server)
		.get('/api/unseen_user')
		.set('eat', token1)
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			expect(res.body).to.include({"username":"test3", "firstname":"test", "lastname":"last", "email":"abc@x.com", "location":"ny", "instruments":"example", "bio":"coding", "phone":"2222", "track1":"test", "track2":"test", "track3":"test"});
			done();
		});
	});
});










