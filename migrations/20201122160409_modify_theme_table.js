

exports.up = function(knex, Promise) {
    return knex('indicators').select().then(ret => {
        return knex.transaction(trx => {
            const queries = ret.map(indicator => {
                if (indicator.data.themes && indicator.data.themes.length > 0) {
                    indicator.data.themes = indicator.data.themes.map(item => {
                        if (item.en === 'Economy') {
                            item = {
                                'en': item.en, 
                                'ar': 'الإقتصاد',
                                type: item.type
                            };
                          
                        }
                        return item; 
                    });
                }
            
                return knex('indicators')
                    .where('id', indicator.id)
                    .update({data: indicator.data})
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

