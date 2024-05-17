import { Link } from 'react-router-dom';
import * as S from './styles'
import { Navbar, Nav } from 'react-bootstrap';


const Header = () => {

    return (
        <S.HeaderStyles>
            <nav >
                <div className="menu">
                    <Link to="/"> <p>Home</p> </Link>
                    <Link to="/cadastroFilme"> <p>Cadastrar filme</p> </Link>
                    <Link to="/cadastroAtor"> <p>Cadastrar ator</p></Link>
                    <Link to="/listaFilmes"> <p>Lista de filmes</p></Link>
                    <Link to="/listaAtores"> <p>Lista de atores</p></Link>
                </div>

            </nav>
        </S.HeaderStyles>

    );
};

export default Header;