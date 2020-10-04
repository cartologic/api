const Boom = require('boom');

const db = require('../../db');

module.exports = [
  {
    /* Update a single indicator */
    method: 'PUT',
    path: '/indicators/{id}',
    config: {auth: 'jwt'},
    handler: function (req, res) {
      const data = req.payload;
      const roles = req.auth.credentials.roles || [];

      if (!(roles.indexOf('indicator editor') !== -1 || roles.indexOf('indicator reviewer') !== -1) ) {
        return res(Boom.unauthorized('Not authorized to perform this action'));
      }
      if (!data) {
        return res(Boom.badData('Bad data'));
      }

      return db('indicators')
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
            return res(Boom.notFound('Could not find the requested indicator'));
          }
          return res({id: ret[0]});
        }).catch(function (err) {
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not update data'));
        });
    }
  }
];
