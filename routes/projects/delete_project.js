const Boom = require('boom');

const db = require('../../db');
const authorizationUtils = require('../../authorization_utils');

module.exports = [
  {
    /* Delete a single project */
    method: 'DELETE',
    path: '/projects/{id}',
    config: {auth: 'jwt'},
    handler: function (req, res) {
      const roles = req.auth.credentials.roles || [];


      return db('projects')
        .select('type') // get project type to check if user authorized to delete this project type.
        .where('id', req.params.id)
        .then(ret => {
          if (ret.length === 0) {
            return res(Boom.notFound('Could not find the requested project'));
          }
          if (!authorizationUtils.isAuthorizedEditor(roles, ret[0].type)) {
            return res(Boom.unauthorized('Not authorized to perform this action'));
          }
          return db('projects')
            .where('id', req.params.id)
            .del()
            .then((ret) => {
              if (ret === 0) {
                return res(Boom.notFound('Could not find the requested project'));
              }
              return res({id: req.params.id});
            }).catch(function (err) {
              console.error(err);
              return res(Boom.badImplementation('Internal Server Error - Could not delete data'));
            });

        })
        .catch(function (err) {
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not find data'));
        });


    }
  }
];
