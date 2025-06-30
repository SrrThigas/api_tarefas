const { Pool } = require("pg"); //importando Pool do pg

//Configuração da conexão com o banco PostgreSQL
const pool = new Pool({
  user: "postgres", //nome que está no PostgreSQL
  host: "localhost", //host do banco
  database: "Tarefa", //nome do banco
  password: "wcc@2023", //senha do postgreSQL
  port: 5432, //porta padrão do PostgreSQL
});

pool.connect()
  .then(() => console.log("Conectado ao PostgreSQL!"))
  .catch((err) => console.log("Erro na conexão ao banco de dados", err));

  module.exports = pool