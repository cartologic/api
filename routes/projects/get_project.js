const Boom = require('boom');

const db = require('../../db');
const authorizationUtils = require('../../authorization_utils');

module.exports = [
  {
  /* Get a single project */
    method: 'GET',
    path: '/projects/{id}',
    config: {
      auth: {
        mode: 'optional'
      }
    },
    handler: function (req, res) {
      return db('projects')
        .select()
        .where('id', req.params.id)
        .then(ret => {
          if (ret.length === 0) {
            return res(Boom.notFound('Could not find the requested project'));
          }

          const roles = req.auth.credentials && req.auth.credentials.roles || [];
          if (authorizationUtils.isAuthorizedReader(req.auth, ret[0])) {
            const response = ret[0];
            // secondary authentication check for removing disbursement data for non-logged in users
            if (!req.auth.isAuthenticated && response.data) {
              if (response.data.disbursed) {
                response.data.disbursed.forEach((disbursement) => {
                  delete disbursement['donor_name'];
                })
              }
            }
            return res(response);
          } else {
            return res(Boom.unauthorized('Not authorized to perform this action'));
          }
        })
        .catch(function (err) {
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not find data'));
        });
    }
  }
];
