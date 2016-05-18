module.exports = (function() {

  'use strict';

  const Nodal = require('Nodal');

  const mockUserInfo = Nodal.require('mockData/mockUsers');
  // let mockUserInfo = require('./mockData/mockUsers.js');
  // console.log(mockUserInfo);

  const mockActivities = Nodal.require('mockData/mockActivities');
  // console.log(mockActivities);
  const mockPlansData = Nodal.require('mockData/mockPlans');
  // console.log(mockPlansData);
  const mockComments = Nodal.require('mockData/mockComments').comments;
  // console.log(mockComments);


  let activitySchema = ['plan_id', 'user_id', 'user_gen', 'private', 'desc', 'lat', 'long', 'address', 'city', 'state', 'neighborhood', 'title', 'duration'];
  let bool = [true, false];

  class User {
    constructor(username, email, password) {
      this.username = username;
      this.email = email;
      this.password = password;
    }
  }

/**
 * generate mock users
 * @param  {int} n number of users to generate
 * @param  {string}  [optional] a user generated password
 * @return {array}  of user objects
 */
  var genUsers = (n, password) => {
    password = password || '11111';
    n = n > mockUserInfo.usernames.length ? mockUserInfo.usernames.length : n;
    let usernames = mockUserInfo.usernames.slice(0, n);
    let users = usernames.map((username, i) => {
      let name = mockUserInfo.names[i];
      let email = `${name.toLowerCase()}@gmail.com`;
      return new User(username, email, password);
    });
    return JSON.stringify(users);
  };
  var mockUsers = genUsers(10);
  // console.log(mockUsers);

  // TODO: automate writing the users into the db.json for seed

  class Activity {
    constructor(plan_id, user_id, user_gen, priv, duration, isYelp, price) {
        this.plan_id = plan_id;
        this.user_id = user_id;
        this.user_gen = user_gen;
        this.private = priv;
        this.duration = duration;
        this.isYelp = isYelp || false;
        this.price = price;
    }
  }

  var transformYelpActivities = (arr) => {
    return arr.map((activity) => {
      let transformed = Object.create(null);

      transformed.title = activity.name;
      transformed.categories = activity.categories;
      transformed.desc = activity.snippet_text;
      transformed.lat = activity.location.coordinate.latitude;
      transformed.long = activity.location.coordinate.longitude;
      transformed.address = activity.location.address[0];
      transformed.city = activity.location.city;
      transformed.state = activity.location.state_code;
      transformed.neighborhood = activity.location.neighborhoods;

      return transformed;
    });
  };

  var transformedFromYelp = transformYelpActivities(mockActivities);

  var genActivities = (activities) => {
    return JSON.stringify(activities.map((activity) => {
      var userId = Math.ceil(Math.random() * 10);
      var planId = Math.ceil(Math.random() * 5);
      var price = Math.ceil(Math.random() * 50);
      let mockActivity = new Activity(planId, userId, bool[Math.round(Math.random())], bool[Math.round(Math.random())], 90, false, price);
      Object.assign(mockActivity, activity);
      return mockActivity;
    }));
  };

  // console.log(JSON.parse((genActivities(transformedFromYelp))));
  console.log((genActivities(transformedFromYelp)));


  class Plan {
    constructor(user_id, activity_id, title, desc, likes) {
      this.user_id = user_id;
      this.activity_id = activity_id;
      this.title = title;
      this.desc = desc;
      this.likes = likes;
      this.private = false;
      this.activities = [];
    }
  }

  var genPlans = (n) => {
    n = mockPlansData.titles.length < n ? mockPlansData.titles.length : n;
    var mockPlans = [];

    for (var i = 0; i < n; i++) {
      let user_id = Math.ceil(Math.random() * 10);
      let activity_id = Math.ceil(Math.random() * 20);
      let title = mockPlansData.titles[i];
      let desc = mockPlansData.descriptions[i];
      let likes = Math.floor(Math.random() * 100);
      mockPlans.push(new Plan(user_id, activity_id, title, desc, likes));
    }
    return JSON.stringify(mockPlans);
  }

  // console.log(genPlans(5));

  class Comment {
    constructor(content, user_id, activity_id, plan_id) {
      this.content = content;
      this.user_id = user_id;
      this.activity_id = activity_id;
      this.plan_id = plan_id;
    }
  }

  const genComments = (n) => {
    // store user id and content on all
    // add a comment to 1/3 of the plans
    n = mockComments.length < n ? mockComments.length : n;
    let comments = [];

    for (var i = 0; i < n; i++) {
      let content = mockComments[i];
      let user_id = Math.ceil(Math.random() * 10);
      let activity_id = i % 3 !== 0 ? Math.ceil(Math.random() * 20) : null;
      let plan_id = i % 3 === 0 ? Math.ceil(Math.random() * 5) : null;
      comments.push(new Comment(content, user_id, activity_id, plan_id));
    }
    return JSON.stringify(comments);
  }
  // console.log(genComments(120));

})();
