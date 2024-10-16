const oracledb = require('oracledb');

// Configuração para conectar ao banco de dados
const config = {
  user: "RM99667",
  password: "260903",
  connectionString: "oracle.fiap.com.br:1521/ORCL"
};

// SQL statement para buscar os feedbacks
const sqlSelect = `
SELECT NOME, RATING, FEEDBACK
FROM USER_DATA
WHERE RATING IS NOT NULL AND FEEDBACK IS NOT NULL
`;

async function buscarFeedbacks() {
  let connection;

  try {
    // Obter uma conexão standalone
    connection = await oracledb.getConnection(config);

    // Execução do SQL
    const result = await connection.execute(sqlSelect);
    return result.rows.map(row => ({
      nome: row[0],
      rating: row[1],
      feedback: row[2]
    }));
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
  if (req.method === 'GET') {
    const feedbacks = await buscarFeedbacks();

    if (feedbacks.success === false) {
      res.status(500).json({ message: 'Falha ao buscar os feedbacks', error: feedbacks.error });
    } else {
      res.status(200).json(feedbacks);
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}