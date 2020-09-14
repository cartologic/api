exports.up = function (knex, Promise) {
    return knex('projects').select().then(ret => {
        return knex.transaction(trx => {
            const queries = ret.map(project => {
                if(project.data.number_served) {
                    project.data.number_served.beneficiary_type =
                        {
                            'en': project.data.number_served.number_served_unit,
                            'ar': project.data.number_served.number_served_unit_ar
                        };
                    project.data.number_served = [project.data.number_served];
                    delete project.data.number_served[0].number_served_unit;
                    delete project.data.number_served[0].number_served_unit_ar;
                }
                return knex('projects')
                    .where('id', project.id)
                    .update({data: project.data})
                    .transacting(trx);
            });
            return Promise.all(queries)
                .then(trx.commit)
                .catch(trx.rollback);
        });
    });

};

exports.down = function (knex, Promise) {

};
