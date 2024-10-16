const oracledb = require('oracledb');

// Configuração para conectar ao banco de dados
const config = {
  user: "RM99667",
  password: "260903",
  connectionString: "oracle.fiap.com.br:1521/ORCL"
};

// SQL statement para atualizar o registro
const sqlUpdate = `
UPDATE USER_DATA
SET NOME = :nome,
    IDADE = :idade,
    TELEFONE = :telefone,
    PROFISSAO = :profissao,
    RATING = :rating,
    FEEDBACK = :feedback
WHERE ID = :id
`;

async function atualizarRegistro(id, nome, idade, telefone, profissao, rating, feedback) {
  let connection;

  try {
    // Obter uma conexão standalone
    connection = await oracledb.getConnection(config);

    // Execução do SQL
    const result = await connection.execute(sqlUpdate, [nome, idade, telefone, profissao, rating || null, feedback || null, id], { autoCommit: true });
    if (result.rowsAffected > 0) {
      return { success: true, message: 'Registro atualizado com sucesso' };
    } else {
      return { success: false, message: 'Nenhum registro encontrado para atualizar' };
    }
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
  if (req.method === 'POST') {
    const { id, nome, idade, telefone, profissao, rating, feedback } = req.body;

    // Validar os dados recebidos
    if (!id || !nome || !idade || !telefone || !profissao) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
    }

    // Atualizar o registro
    const result = await atualizarRegistro(id, nome, idade, telefone, profissao, rating, feedback);

    // Responder com o resultado da atualização
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(500).json({ message: 'Falha ao atualizar o registro', error: result.error || result.message });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}