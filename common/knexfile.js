const obj = {
  host    : process.env.REACT_APP_DB_HOST || "mysql",
  port    : process.env.REACT_APP_DB_PORT || "3306",
  user    : process.env.REACT_APP_db_user || "root",
  password: process.env.REACT_APP_db_password || "root",
  database: process.env.REACT_APP_db_database || "Dispatcher"
}
console.log("==== OBJ from knex file for sql ", obj);
module.exports = {
    production: {
      client  : 'mysql2',
      connection: obj
    },
    migrations: {
      directory: 'migrations',
    },
    seeds: {
      directory: 'seeds'
    }
}

// module.exports = {
//   production: {
//       client: 'mysql',
//     connection: {
//       host:'172.18.0.2',
//       user: 'root',
//       password: 'root',
//       database: 'Dispatcher'
//     }
//   },
//   migrations: {
//     directory: 'migrations',
//   },
// }