

exports.up = function(knex, Promise) {
    return knex('indicators').select().then(ret => {
        return knex.transaction(trx => {
            const queries = ret.map(indicator => {
                if (indicator.data.sources && indicator.data.sources.length > 0) {
                    indicator.data.sources = indicator.data.sources.map(item => {
                        item = {
                            'source': item,
                            'source_ar': null
                        };
                        delete item.source;
                        delete item.source_ar;
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
