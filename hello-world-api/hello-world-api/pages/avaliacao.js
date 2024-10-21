import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Rating from "react-rating-stars-component"; // Importação do componente Rating
import Styled from "styled-components";

const ContainerDeAvaliacao = Styled.div`
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.70);
  padding: 24px;
`;

export default function Home() {
  const [formData, setFormData] = useState({
    telefone: "",
    feedback: "",
    rating: 0,
  });

  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInviteMessage, setShowInviteMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRatingChange = (newRating) => {
    setFormData({
      ...formData,
      rating: newRating,
    });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowInviteMessage(false);

    try {
      const response = await fetch(`/api/buscarPorTelefone?telefone=${formData.telefone}`);
      const data = await response.json();
      if (data.message === "Registro mais recente encontrado") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchResult) {
      alert("Por favor, busque um registro primeiro.");
      return;
    }

    const { nome, idade, telefone, profissao } = searchResult;

    try {
      const response = await fetch("/api/atualizarRegistro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, id: searchResult.id, nome, idade, telefone, profissao }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Dados atualizados:", result);
        alert("Feedback enviado com sucesso!");
      } else {
        const errorData = await response.json();
        console.error("Erro ao enviar o feedback:", errorData.message);
        alert(`Erro ao enviar o feedback: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao enviar o feedback:", error);
      alert("Erro ao enviar o feedback. Por favor, tente novamente.");
    }
  };

  return (
    <div className="container pt-3" style={{ background: "#F3F4F8" }}>
      <h1 className="text-center">Enviar Feedback</h1>


      {!searchResult && (
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
            Telefone não encontrado. <br /> Venha participar de nossa experiencia para deixar uma avaliação.
          </div>
        )}
          <button type="submit" className="btn btn-primary w-100">
            Buscar
          </button>
        </form>
      )}

        {loading && (
          <div className="text-center">
            <h2>Carregando dados...</h2>
          </div>
        )}
      



      {searchResult && (
        <ContainerDeAvaliacao>
          <h2 className="text-center">Seus dados</h2>
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-sm mt-3 d-none d-md-table">
              <thead className="thead-dark">
                <tr>
                  <th>Nome</th>
                  <th>Pontuação</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{searchResult.nome}</td>
                  <td>{searchResult.pontuacao}</td>
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
              </ul>
            </div>
          </div>

          <h2 className="text-center mt-5">Deixe a sua opinião</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="feedback" className="form-label">
                Conte-nos o que achou:
              </label>
              <textarea
                className="form-control"
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Achei a experiência incrível porque..."
              />
            </div>
            <div className="mb-3">
              <label className="form-label">O quanto você gostou da experiencia ?</label>
              <Rating
                count={5}
                size={24}
                activeColor="#ffd700"
                value={formData.rating}
                onChange={handleRatingChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Enviar Feedback
            </button>
          </form>
        </ContainerDeAvaliacao>
      )}
    </div>
  );
}