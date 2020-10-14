const Boom = require('boom');

const db = require('../../db');
const authorizationUtils = require('../../authorization_utils');
const utils = require("../../utils");

module.exports = [
  {
  /* Update a single project */
    method: 'PUT',
    path: '/projects/{id}',
    config: {auth: 'jwt'},
    handler: function (req, res) {
      const data = req.payload;
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
          if (!data) {
            return res(Boom.badData('Bad data'));
          }
         

          return db('projects')
              .where('id', req.params.id)
              .returning('id')
              .update({
                name: data.name,
                private: data.private,
                published: data.published,
                updated_at: db.fn.now(),
                data: data
              }).then((ret) => {
                if (ret.length === 0) {
                  return res(Boom.notFound('Could not find the requested project'));
                }
                return res({id: ret[0]});
              }).catch(function (err) {
                console.error(err);
                return res(Boom.badImplementation('Internal Server Error - Could not update data'));
              });
        });
    }
  }
];
