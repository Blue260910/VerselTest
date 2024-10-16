const oracledb = require('oracledb');

// Configuração para conectar ao banco de dados
const config = {
  user: "RM99667",
  password: "260903",
  connectionString: "oracle.fiap.com.br:1521/ORCL"
};

// SQL statement a ser executado
const sql = `
INSERT INTO USER_DATA (
  NOME, 
  DATA_INSERCAO, 
  PONTUACAO
) 
VALUES (
  :nome, 
  DEFAULT, 
  :tempopontuacao
)
`;

async function inserir(nome, minutos, segundos, milissegundos) {
  let connection;

  // Formatar a string tempopontuacao no formato 00:00:00
  const pad = (num) => String(num).padStart(2, '0');
  const tempopontuacao = `${pad(minutos)}:${pad(segundos)}:${pad(milissegundos)}`;

  try {
    // Obter uma conexão standalone
    connection = await oracledb.getConnection(config);

    // Execução do SQL
    const result = await connection.execute(sql, { nome, tempopontuacao }, { autoCommit: true });
    console.log('Rows inserted:', result.rowsAffected);
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
  // Receber parâmetros da query string como uma única string
  const { params } = req.query;

  // Validar parâmetros
  if (!params) {
    res.status(400).send('Parâmetros inválidos');
    return;
  }

  // Dividir a string para obter os valores individuais
  const [nome, minutos, segundos, milissegundos] = params.split(',');

  // Inserir dados no banco de dados
  const result = await inserir(nome, minutos, segundos, milissegundos);

  // Responder com mensagem apropriada
  if (result.success) {
    res.status(200).json({ message: 'Hello World - Inserção bem-sucedida', rowsAffected: result.rowsAffected });
  } else {
    res.status(500).json({ message: 'Hello World - Falha na inserção', error: result.error });
  }
}