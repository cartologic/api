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

      if (!authorizationUtils.isAuthorizedEditor(roles, data.type)) {
        return res(Boom.unauthorized('Not authorized to perform this action'));
      }
      if (!data) {
        return res(Boom.badData('Bad data'));
      }
      if (data.type === 'national') {
        if(data.reportLink) {
            data.reportLink = utils.blobToFile(data.reportLink);
        }
        if(data.project_link) {
            data.project_link = utils.blobToFile(data.project_link);
        }
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
    }
  }
];
