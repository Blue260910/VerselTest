const oracledb = require('oracledb');

// Configuração para conectar ao banco de dados
const config = {
  user: "RM99667",
  password: "260903",
  connectionString: "oracle.fiap.com.br:1521/ORCL"
};

// SQL statement para buscar os top 3 jogadores
const sqlTop3 = `
SELECT Nome, Pontuacao, Pontuacao_Ranking
FROM (
  SELECT Nome, Pontuacao, Pontuacao_Ranking,
         ROW_NUMBER() OVER (PARTITION BY TELEFONE ORDER BY Pontuacao DESC) AS rn
  FROM USER_DATA
)
WHERE rn = 1
ORDER BY Pontuacao_Ranking DESC
FETCH FIRST 3 ROWS ONLY
`;

// SQL statement para buscar a posição de um jogador específico
const sqlPosicao = `
SELECT NOME, PONTUACAO, PONTUACAO_RANKING, POSICAO
FROM (
  SELECT NOME, PONTUACAO, PONTUACAO_RANKING, TELEFONE, RANK() OVER (ORDER BY PONTUACAO_RANKING DESC) AS POSICAO
  FROM USER_DATA
)
WHERE TELEFONE = :telefone
`;

async function buscarTop3Jogadores() {
  let connection;

  try {
    // Obter uma conexão standalone
    connection = await oracledb.getConnection(config);

    // Execução do SQL
    const result = await connection.execute(sqlTop3);
    return { success: true, rows: result.rows };
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

async function buscarPosicaoPorTelefone(telefone) {
  let connection;

  try {
    // Obter uma conexão standalone
    connection = await oracledb.getConnection(config);

    // Execução do SQL
    const result = await connection.execute(sqlPosicao, { telefone });
    if (result.rows.length > 0) {
      const [nome, pontuacao, pontuacao_ranking, posicao] = result.rows[0];
      return { success: true, nome, pontuacao, pontuacao_ranking, posicao };
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
  const { telefone } = req.query;

  if (telefone) {
    // Buscar posição por telefone
    const result = await buscarPosicaoPorTelefone(telefone);

    if (result.success) {
      res.status(200).json({
        message: 'Posição encontrada',
        nome: result.nome,
        pontuacao: result.pontuacao,
        pontuacao_ranking: result.pontuacao_ranking,
        posicao: result.posicao
      });
    } else {
      res.status(500).json({ message: 'Falha ao buscar a posição', error: result.error || result.message });
    }
  } else {
    // Buscar top 3 jogadores
    const result = await buscarTop3Jogadores();

    if (result.success) {
      res.status(200).json(result.rows);
    } else {
      res.status(500).json({ message: 'Falha ao buscar os top 3 jogadores', error: result.error });
    }
  }
}