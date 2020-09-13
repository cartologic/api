exports.up = function (knex, Promise) {
    return knex('projects').select().then(ret => {
        return knex.transaction(trx => {
            const queries = ret.map(project => {
                if (project.data.budget && project.data.budget.length > 0) {
                    console.error('budget --------------------- ', project.data.name);
                    project.data.budget = project.data.budget.map(item => {
                        item.donor = {
                            'en': item.donor_name,
                            'ar': item.donor_name_ar
                        };
                        delete item.donor_name;
                        delete item.donor_name_ar;
                        return item;
                    });
                }
                if (project.data.disbursed && project.data.disbursed.length > 0) {
                    console.error('disbursed --------------- ', project.data.name);
                    project.data.disbursed = project.data.disbursed.map(item => {
                        item.donor = {
                            'en': item.donor_name,
                            'ar': item.donor_name_ar
                        };
                        delete item.donor_name;
                        delete item.donor_name_ar;
                        return item;
                    });
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
