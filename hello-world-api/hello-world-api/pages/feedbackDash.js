import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from 'react-bootstrap/Card';
import Rating from 'react-rating-stars-component';

const FeedbackDash = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Fetch feedbacks from the API
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("/api/feedbacks");
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const feedbackDashStyle = {
    padding: "20px",
    textAlign: "left",
  };

  const cardStyle = {
    width: "100%", // Ajusta a largura do card para 100% em dispositivos móveis
    maxWidth: "18rem",
    borderLeft: "4px solid #007bff", // Linha vertical à esquerda
  };

  // Dividir os feedbacks em três grupos
  const groupSize = Math.ceil(feedbacks.length / 3);
  const feedbackGroups = [
    feedbacks.slice(0, groupSize),
    feedbacks.slice(groupSize, groupSize * 2),
    feedbacks.slice(groupSize * 2, feedbacks.length),
  ];

  // Configurações individuais para cada carrossel
  const getSliderSettings = (index) => ({
    infinite: true,
    speed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000 + index * 500, // Diferente velocidade de autoplay para cada carrossel
    responsive: [
      {
        breakpoint: 768, // Para telas menores que 768px (dispositivos móveis)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  return (
    <div style={feedbackDashStyle}>
      <h2 className="text-center mb-4">Feedbacks dos Usuários</h2>
      <div className="container mt-5">
        {feedbackGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4"> {/* Adiciona espaçamento vertical entre os carrosséis */}
            <Slider {...getSliderSettings(groupIndex)}>
              {group.map((feedback, index) => (
                <div key={index} className="mx-2">
                  <Card style={cardStyle}>
                    <Card.Header>
                      <Rating
                        count={5}
                        size={24}
                        activeColor="#ffd700"
                        value={feedback.rating}
                        edit={false}
                      />
                    </Card.Header>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p>{feedback.feedback}</p>
                        <footer className="blockquote-footer">
                          {feedback.nome}
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackDash;