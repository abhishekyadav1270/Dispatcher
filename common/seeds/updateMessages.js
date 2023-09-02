const path = require('path');
exports.seed = async function(knex) {
  const file_name = path.basename(__filename)
  const seedIsExist = await knex('knex_seeds_lock').where({ file_name }).first()
  if (seedIsExist) {
    return
  } else {
    let message = [];
    await knex('knex_seeds_lock').insert({ file_name })
    return knex('sdsMessages').then(function(data){
        message = data.map((sds) => ({ ...sds, 'UEid':'0000','sendReceive':(sds.creatorId == sds.toId ? "Receive":"Send"),'contactId':((sds.sdsType == 'GROUP_TEXT_MESSAGE' || sds.sdsType == 'GROUP_STATUS_MESSAGE')? sds.groupId:(sds.creatorId == sds.toId ? sds.fromId:sds.toId)) }))
        // Deletes ALL existing entries
        return knex('sdsMessages').del()
          .then(function () {
            // Inserts updated message
            return knex('sdsMessages').insert(message);
        });
      });
    }
  };
