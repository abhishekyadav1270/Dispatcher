
exports.up = function(knex) {
    return knex.schema
    .alterTable('sdsMessages',function(t){
      t.string('UEid');
      t.string('contactId');
      t.string('sendReceive');
    })
    .createTable('knex_seeds_lock',function(t){
      t.string('file_name');
    })
  };
  
  exports.down = function(knex) {
  //   return knex.schema
  //   .dropTa
  };
  