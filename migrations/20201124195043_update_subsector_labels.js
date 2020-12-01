

exports.up = function(knex, Promise) {
    return knex('projects').select().then(ret => {
        return knex.transaction(trx => {
            const queries = ret.map(project => {
                if (project.data.category && project.data.category.length > 0) {
                    project.data.category = project.data.category.map(item => {
                        if (item.en === 'Agriculture Extension & Research') {
                            item = {
                                'en': item.en, 
                                'ar': 'الإرشاد الزراعي والبحث',
                            };
                        }else if (item.en === 'Fishing, Aquaculture & Forestry') {
                            item = {
                                'en': item.en, 
                                'ar': 'صيد الأسماك و الزراعة المائية و التحريج',
                            };
                        }
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

exports.down = function(knex, Promise) {
};
