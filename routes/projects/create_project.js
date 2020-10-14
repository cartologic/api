const Boom = require('boom');

const db = require('../../db');
const authorizationUtils = require('../../authorization_utils');
const utils = require('../../utils');

module.exports = [
  {
    /* Create a new project */
    method: 'POST',
    path: '/projects',
    config: {auth: 'jwt'},
    handler: function (req, res) {
      const data = req.payload;
      const owner = req.auth.credentials.sub;
      const roles = req.auth.credentials.roles;
      const name = data && data.name;
      if (!authorizationUtils.isAuthorizedEditor(roles, data.type)) {
        return res(Boom.unauthorized('Not authorized to perform this action'));
      }

      if (!owner || !data || !name) {
        return res(Boom.badData('Missing Form Data'));
      }

      return db('projects')
        .returning('id')
        .insert({
          data: data,
          owner: owner,
          name: name,
          private: data.private || false,
          published: data.published || false,
          type: data.type,
          created_at: db.fn.now(),
          updated_at: db.fn.now()
        }).then(function (ret) {
          return res({id: ret[0]});
        })
        .catch(function (err) {
          // Uniqueness violation
          if (err.code === '23505') {
            return res(Boom.badData('Project name already exists'))
          }
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not add data'));
        });
    }
  }
];
