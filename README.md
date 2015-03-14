# bandFinderApp
An IOS app that helps musicians meet one another.  Musicians create a profile and
approve or reject other musicians in a tinder-style matching system.  Musicians who approve
of one another will be given contact information to connect with each other.

This repo is for the server and REST api for the app.  IOS client currently under development.

Authors:
Gaye Bulut,
Jake Barnett,
Stephen Sherwood

## Routes:

### Users:
POST
/api/user
Creates a new user.

Get
/api/sign_in
Returns a new token for a user.

Delete
/api/user
Deletes user.

Get
/api/user/:username
Returns the data for a specified user


### Approvals:
Post:
/api/approval
Creates an approval between two users(approving and approved user.)

Get:
/api/approval/:username
Returns an array of all users approved by the specified username.


### Rejections:
Post:
/api/rejection
Creates a rejection between two users(rejecting and rejected user.)

Unseen User:

### Get:
api/unseen_user/:username
Returns an array of all users that have not yet been rejected or approved by the specifued user.
