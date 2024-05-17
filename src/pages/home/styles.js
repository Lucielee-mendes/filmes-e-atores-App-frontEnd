import styled from "styled-components";

export const HomeContainer = styled.div`
  display: grid;
  height: 100vh;
  overflow-y: auto;
  width: 100%;
`;
export const area = styled.div`
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: #ede6db;
  padding: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;


    h2 {
        margin-top: 30px; /* Espaçamento maior entre categorias */
    }

   
`;

export const VerMaisButton = styled.a`
  /* Estilo personalizado para o botão Ver Mais */
  display: inline-block;
  padding: 10px 20px;
  background-color: #9d5353; /* Cor de fundo desejada */
  color: #fff; /* Cor do texto */
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
  font-weight: bold;

  &:hover {
    background-color: #764242; /* Cor de fundo ao passar o mouse */
  }
`;