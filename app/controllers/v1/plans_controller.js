module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');
  const Plan = Nodal.require('app/models/plan.js');
  const AuthController = Nodal.require('app/controllers/auth_controller.js');
  const Activity = Nodal.require('app/models/activity.js')

  class V1PlansController extends AuthController {

    index() {

      Plan.query()
        .where(this.params.query)
        .end((err, models) => {
          let modelsWithActivities = models.map((model, i) => {
            Activity.query()
              .where({plan_id: model.get('id')})
              .end((err, activities) => {
                activities = activities.toObject();
                model.set('activities', activities);
                console.log('model update with activities', activities);
                console.log('model>>>>>', model.get('activities'));
                if (i === models.length - 1) {
                  this.respond(err || models);
                }
              });
            });
        });

    }

    show() {

      Plan.find(this.params.route.id, (err, model) => {

        Activity.query()
          .where({plan_id: model.get('id')})
          .end((err, activities) => {
            activities = activities.toObject();
            model.set('activities', activities);
            this.respond(err || model);
          });
      });

    }

    put() {

      this.authorize((accessToken, user) => {

        let activities = this.params.body.activities;

        delete this.params.body.activities;

        Plan.update(this.params.route.id, this.params.body, (err, model) => {

          let updatedActivities = activities.map((activity, i) => {

            let updates = Object.assign({}, activity, {plan_id: model.get('id')});

            delete updates.activity_id;

            return Activity
              .update(activity.activity_id, updates, (err, activity) => {
                if (err) console.log(err);
            });
          });

          this.respond(err || model);

        });

      })

    }

    destroy() {

      Plan.destroy(this.params.route.id, (err, model) => {

        this.respond(err || model);

      });

    }

    post() {

      this.authorize((accessToken, user) => {

        this.params.body.user_id = user.get('id');

        // let activities = this.params.body.activities;
        // console.log(activities);

        // delete this.params.body.activities;

        Plan.create(this.params.body, (err, model) => {

          // let updatedActivities = activities.map((activity, i) => {

          //   let updates = Object.assign({}, activity, {plan_id: model.get('id')});

          //   return Activity
          //     .update(activity.id, updates, (err, activity) => {
          //       if (err) {console.log('error updating activity:', err)}
          //     });
          // });

          // model.set('activities', updatedActivities)
          this.respond(err || model);

        });
      });
    }
  }

  return V1PlansController;

})();
