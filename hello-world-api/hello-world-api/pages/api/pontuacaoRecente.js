const oracledb = require('oracledb');

// Configuração para conectar ao banco de dados
const config = {
  user: "RM99667",
  password: "260903",
  connectionString: "oracle.fiap.com.br:1521/ORCL"
};

// SQL statement para buscar o registro mais recente
const sql = `
SELECT id, nome, idade, telefone, profissao, data_insercao, pontuacao, pontuacao_ranking
FROM USER_DATA
ORDER BY DATA_INSERCAO DESC
FETCH FIRST 1 ROWS ONLY
`;

async function buscarTempoMaisRecente() {
  let connection;

  try {
    // Obter uma conexão standalone
    connection = await oracledb.getConnection(config);

    // Execução do SQL
    const result = await connection.execute(sql);
    console.log('Result:', result);
    if (result.rows.length > 0) {
      const [id, nome, idade, telefone, profissao, dataInsercao, pontuacao, pontuacao_ranking] = result.rows[0];
      console.log('Registro mais recente:', id, nome, idade, telefone, profissao, dataInsercao, pontuacao, pontuacao_ranking);
      return { success: true, id, nome, idade, telefone, profissao, dataInsercao, pontuacao, pontuacao_ranking };
    } else {
      return { success: false, message: 'Nenhum registro encontrado' };
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
  // Buscar o registro mais recente
  const result = await buscarTempoMaisRecente();

  // Responder com o registro mais recente ou mensagem de erro
  if (result.success) {
    res.status(200).json({
      message: 'Registro mais recente encontrado',
      id: result.id,
      nome: result.nome,
      idade: result.idade,
      telefone: result.telefone,
      profissao: result.profissao,
      dataInsercao: result.dataInsercao,
      pontuacao: result.pontuacao,
      pontuacao_ranking: result.pontuacao_ranking
    });
  } else {
    res.status(500).json({ message: 'Falha ao buscar o registro mais recente', error: result.error || result.message });
  }
}