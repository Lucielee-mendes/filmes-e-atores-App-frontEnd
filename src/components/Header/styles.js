import styled from "styled-components";

export const HeaderStyles = styled.header`
  background-color: #9d5353;
  position: relative;
  padding: 1rem;

  

  .menu {
    align-items: center;
    display: flex;
    padding-left: 1.5rem;
    padding-right: 1.5rem;



    @media (max-width: 600px) {
      padding: 0;

      p{
        font-size: 10px;
        margin: 0!important;
        padding: 0;
      }
    }
    p {
      display: inline-block;
      margin-left: 1.5rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      color: white;
      font-weight: bold;
      text-decoration: none;


      &:hover {
      text-decoration: underline;
    }
    }


  }
`;

