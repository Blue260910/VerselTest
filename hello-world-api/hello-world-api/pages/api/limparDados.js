const oracledb = require('oracledb');

// Configuração para conectar ao banco de dados
const config = {
  user: "RM99667",
  password: "260903",
  connectionString: "oracle.fiap.com.br:1521/ORCL"
};

// SQL statement para limpar os nomes nulos
const sqlLimparNomesNulos = `
Delete from USER_DATA
where NOME is NULL
`;

// SQL statement para deletar todos os dados da tabela
const sqlDeletarTodosDados = `
DELETE FROM USER_DATA
`;

async function limparNomesNulos() {
  let connection;

  try {
    // Obter uma conexão standalone
    connection = await oracledb.getConnection(config);

    // Execução do SQL
    const result = await connection.execute(sqlLimparNomesNulos, [], { autoCommit: true });
    return { success: true, rowsAffected: result.rowsAffected };
  } catch (err) {
    console.error('Error executing query:', err);
    return { success: false, error: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

async function deletarTodosDados() {
  let connection;

  try {
    // Obter uma conexão standalone
    connection = await oracledb.getConnection(config);

    // Execução do SQL
    const result = await connection.execute(sqlDeletarTodosDados, [], { autoCommit: true });
    return { success: true, rowsAffected: result.rowsAffected };
  } catch (err) {
    console.error('Error executing query:', err);
    return { success: false, error: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

export default async function handler(req, res) {
  const { limpar } = req.query;

  if (limpar) {
    // Deletar todos os dados da tabela
    const result = await deletarTodosDados();

    if (result.success) {
      res.status(200).json({ message: 'Todos os dados foram deletados', rowsAffected: result.rowsAffected });
    } else {
      res.status(500).json({ message: 'Falha ao deletar os dados', error: result.error });
    }
  } else {
    // Limpar os nomes nulos
    const result = await limparNomesNulos();

    if (result.success) {
      res.status(200).json({ message: 'Nomes nulos foram limpos', rowsAffected: result.rowsAffected });
    } else {
      res.status(500).json({ message: 'Falha ao limpar os nomes nulos', error: result.error });
    }
  }
}