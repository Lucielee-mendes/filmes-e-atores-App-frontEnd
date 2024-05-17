

import styled from "styled-components";

export const EditarAtorContainer = styled.div`
  display: grid;
  height: 100vh;
  overflow-y: auto;
  width: 100%;
`;
export const areaEditar = styled.div`
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: #ede6db;

`;

export const area = styled.div`

  background-color: #fff;
  min-height: 100vh;
  max-width: 800px;  
  border-radius: 10px;
  margin: 1.5rem auto;  
  align-items: center;
  padding: 2rem 6rem;
  box-sizing: border-box;
   padding: 60px;

   @media (max-width: 600px) {
    padding: 0.8rem;
    margin: 0.8rem;

    }
  #cabecalho{
    text-align: center;
    color:#9d5353;
    font-weight: bold;
    font-size: 23px;
    margin-bottom: 50px;;
    @media (max-width: 600px) {
      margin: 0.8rem;
      font-size: 12px;
}
  }



`;