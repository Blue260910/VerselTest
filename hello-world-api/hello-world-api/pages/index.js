import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";

function OffcanvasExample() {
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container fluid>
            <Navbar.Brand href="#">
              {" "}
              <svg
                width="50"
                height="65"
                viewBox="0 0 42 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.22002 14.3022L17.8774 19.9035C17.9203 19.9281 17.9421 19.9656 17.9414 20.0147L17.9448 55.5841C17.9455 55.6339 17.9237 55.6708 17.8808 55.6953L10.1738 64.1075C10.1309 64.1328 10.0887 64.1328 10.0458 64.1075C10.0029 64.083 9.98184 64.0461 9.98184 63.9963V28.6296C9.98184 28.5804 9.96074 28.5429 9.91786 28.5184L0.49594 23.0651C0.453061 23.0405 0.431962 23.0037 0.431962 22.9539L0.428558 9.34835C0.428558 9.29923 0.449658 9.26171 0.492537 9.23715L8.08526 0.892483C8.12746 0.86724 8.17034 0.86724 8.21322 0.892483L41.5074 20.1832C41.5503 20.2085 41.5714 20.2453 41.5714 20.2951V34.1333C41.5714 34.1824 41.5503 34.22 41.5074 34.2445L27.1047 47.6994C27.0618 47.7239 27.0189 47.7239 26.9767 47.6994C26.9339 47.6741 26.9128 47.6373 26.9128 47.5875L26.9094 25.3595C26.9094 25.3104 26.9305 25.2736 26.9733 25.2483C27.0155 25.2238 27.0584 25.2238 27.1013 25.2483L38.5236 31.8723C38.5664 31.8969 38.6093 31.8969 38.6522 31.8723C38.6944 31.8478 38.7162 31.8102 38.7155 31.7611L38.7121 21.8507C38.7128 21.8009 38.691 21.764 38.6481 21.7388L8.36432 4.19255C8.32212 4.16731 8.27924 4.16799 8.23636 4.19255C8.19348 4.21711 8.17238 4.25395 8.17238 4.30376L8.15605 14.1903C8.15536 14.2401 8.17714 14.277 8.22002 14.3022Z"
                  fill="#140A04"
                />
              </svg>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  TITANIUM
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="#">Home</Nav.Link>
                  <Nav.Link href="/atualizarDados">Atualizar dados</Nav.Link>
                  <Nav.Link href="/avaliacao">Avaliacao de usuarios</Nav.Link>
                  <Nav.Link href="/feedbackDash">Feadbacks</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default function Home() {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    telefone: "",
    profissao: "",
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/atualizarRegistro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, id: recentData.id }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Dados atualizados:", result);

        // Atualizar a tabela com os dados submetidos
        setSubmittedData([
          ...submittedData,
          { ...formData, id: recentData.id },
        ]);

        // Limpar o formulário
        setFormData({
          nome: "",
          idade: "",
          telefone: "",
          profissao: "",
        });

        // Atualizar os dados recentes
        setRecentData(result);
        window.location.reload();
      } else {
        console.error("Erro ao atualizar os dados:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  };

  useEffect(() => {
    async function fetchRecentData() {
      try {
        const response = await fetch("/api/pontuacaoRecente");
        const data = await response.json();
        console.log("Dados recebidos da API:", data); // Log dos dados recebidos
        if (data.message === "Registro mais recente encontrado") {
          setRecentData(data);
          setFormData((prevFormData) => ({
            ...prevFormData,
            id: data.id,
          }));
        }
      } catch (error) {
        console.error("Error fetching recent data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentData();
  }, []);

  {
    loading && (
      <div className="container mt-5 text-center">
      </div>
    );
  }

  return (
    <div>
      <OffcanvasExample />
      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">
              Nome
            </label>
            <input
              type="text"
              className="form-control"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="idade" className="form-label">
              Idade
            </label>
            <input
              type="number"
              className="form-control"
              id="idade"
              name="idade"
              value={formData.idade}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="telefone" className="form-label">
              Telefone
            </label>
            <input
              type="number"
              className="form-control"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="profissao" className="form-label">
              Profissão
            </label>
            <input
              type="text"
              className="form-control"
              id="profissao"
              name="profissao"
              value={formData.profissao}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Enviar
          </button>
        </form>

        {recentData ? (
          <div className="mt-5">
            <h2 className="text-center">Registro Mais Recente</h2>
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-sm mt-3 d-none d-md-table">
                <thead className="thead-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th>Telefone</th>
                    <th>Profissão</th>
                    <th>Data de Inserção</th>
                    <th>Pontuação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{recentData.id}</td>
                    <td>{recentData.nome}</td>
                    <td>{recentData.idade}</td>
                    <td>{recentData.telefone}</td>
                    <td>{recentData.profissao}</td>
                    <td>
                      {new Date(recentData.dataInsercao).toLocaleString()}
                    </td>
                    <td>{recentData.pontuacao}</td>
                  </tr>
                </tbody>
              </table>
              <div className="d-block d-md-none">
                <ul className="list-group">
                  <li className="list-group-item">
                    <strong>ID:</strong> {recentData.id}
                  </li>
                  <li className="list-group-item">
                    <strong>Nome:</strong> {recentData.nome}
                  </li>
                  <li className="list-group-item">
                    <strong>Idade:</strong> {recentData.idade}
                  </li>
                  <li className="list-group-item">
                    <strong>Telefone:</strong> {recentData.telefone}
                  </li>
                  <li className="list-group-item">
                    <strong>Profissão:</strong> {recentData.profissao}
                  </li>
                  <li className="list-group-item">
                    <strong>Data de Inserção:</strong>{" "}
                    {new Date(recentData.dataInsercao).toLocaleString()}
                  </li>
                  <li className="list-group-item">
                    <strong>Pontuação:</strong> {recentData.pontuacao}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <h2 className="text-center">Nenhum dado recente encontrado.</h2>
          </div>
        )}
      </div>
    </div>
  );
}
