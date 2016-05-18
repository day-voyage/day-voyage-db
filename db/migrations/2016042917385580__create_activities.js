module.exports = (function() {

  "use strict";

  const Nodal = require('nodal');

  class CreateActivities extends Nodal.Migration {

    constructor(db) {
      super(db);
      this.id = 2016042917385580;
    }

    up() {

      return [
        this.createTable("activities",
          [{"name":"plan_id","type":"int"},
          {"name":"user_id","type":"int"},
          {"name":"user_gen","type":"boolean"},
          {"name":"private","type":"boolean"},
          {"name":"desc","type":"string"},
          {"name":"lat","type":"string"},
          {"name":"long","type":"string"},
          {"name":"address","type":"string"},
          {"name":"city","type":"string"},
          {"name":"state","type":"string"},
          {"name":"neighborhood","type":"json"},
          {"name":"title","type":"string"},
          {"name":"duration","type":"int"},
          {"name":"price", "type":"int"},
          {"name": "isYelp", "type":"boolean"},
          {"name": "categories", "type": "json"}])
      ];

    }

    down() {

      return [
        this.dropTable("activities")
      ];

    }

  }

  return CreateActivities;

})();
