import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Styled from "styled-components";

const ContainerDeAvaliacao = Styled.div`
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.70);
  padding: 24px;
`;



export default function TopJogadores() {
  const [topPlayers, setTopPlayers] = useState([]);
  const [formData, setFormData] = useState({
    telefone: "",
  });
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInviteMessage, setShowInviteMessage] = useState(false);

  useEffect(() => {
    // Fetch top 3 players from the API
    const fetchTopPlayers = async () => {
      try {
        const response = await fetch("/api/buscarJogadores");
        const data = await response.json();
        setTopPlayers(data);
      } catch (error) {
        console.error("Error fetching top players:", error);
      }
    };

    fetchTopPlayers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowInviteMessage(false);

    try {
      const response = await fetch(`/api/buscarJogadores?telefone=${formData.telefone}`);
      const data = await response.json();
      if (data.message === "Posição encontrada") {
        setSearchResult(data);
      } else {
        setSearchResult(null);
        setShowInviteMessage(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container pt-3" style={{ background: "#F3F4F8" }}>
      <h1 className="text-center">Top 3 Melhores Jogadores</h1>

      <div className="table-responsive mt-4">
        <table className="table table-striped table-bordered table-sm">
          <thead className="thead-dark">
            <tr>
              <th>Posição</th>
              <th>Nome</th>
              <th>Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(topPlayers) && topPlayers.map((player, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{player[0]}</td>
                <td>{player[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-center mt-5">Consultar Posição</h2>

      <form onSubmit={handleSearchSubmit} className="mb-5 mt-3">
        <div className="mb-3">
          <label htmlFor="telefone" className="form-label">
            Telefone utilizado no cadastro:
          </label>
          <input
            type="text"
            className="form-control"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>
        {showInviteMessage && (
          <div className="alert alert-info text-center" role="alert">
            Telefone não encontrado. <br /> Venha participar de nossa experiência para deixar uma avaliação.
          </div>
        )}
        <button type="submit" className="btn btn-primary w-100">
          Buscar
        </button>
      </form>

      {loading && (
        <div className="text-center">
          <h2>Carregando dados...</h2>
        </div>
      )}

      {searchResult && (
        <ContainerDeAvaliacao>
          <h2 className="text-center">Sua Posição</h2>
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-sm mt-3 d-none d-md-table">
              <thead className="thead-dark">
                <tr>
                  <th>Nome</th>
                  <th>Pontuação</th>
                  <th>Posição</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{searchResult.nome}</td>
                  <td>{searchResult.pontuacao}</td>
                  <td>{searchResult.posicao}</td>
                </tr>
              </tbody>
            </table>
            <div className="d-block d-md-none">
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Nome:</strong> {searchResult.nome}
                </li>
                <li className="list-group-item">
                  <strong>Pontuação:</strong> {searchResult.pontuacao}
                </li>
                <li className="list-group-item">
                  <strong>Posição:</strong> {searchResult.posicao}
                </li>
              </ul>
            </div>
          </div>
        </ContainerDeAvaliacao>
      )}
    </div>
  );
}