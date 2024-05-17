import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import Header from '../../components/Header';
import * as S from './styles'


const Home = () => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        fetchFilmes();
    }, []);

    const fetchFilmes = async () => {
        try {
            const response = await axios.get("http://localhost:3333/filmes");
            const filmes = response.data;

            // Agrupar filmes por categoria
            const categorias = {};
            filmes.forEach(filme => {
                if (!categorias[filme.categoria]) {
                    categorias[filme.categoria] = [];
                }
                categorias[filme.categoria].push(filme);
            });

            setCategorias(Object.entries(categorias));
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3333/deletarFilme/${id}`);
            // Atualizar a lista de filmes após a exclusão
            if (response.status === 200) {
                alert('Filme excluído com sucesso.');
                fetchFilmes();
            
            }
        } catch (error) {
            console.error(`Erro ao deletar filme com id: ${id}`, error);
        }
    };

    const handleEdit = (id) => {
        window.location.href = `/editarFilme/${id}`;
    };

    return (
        <S.HomeContainer>
            <Header />
            <S.area>
                {categorias.map(([categoria, filmes], index) => (
                    <div key={index} className="mb-5">
                        <h2 style={{ color: '#9d5353' }}>{categoria}</h2>
                        {filmes.length > 0 ? (
                            <Row className="gy-4">
                                {filmes.slice(0, 4).map((filme, index) => (
                                    <Col md={3} key={index}>
                                        <Card className="h-100">
                                            <Card.Img
                                                variant="top"
                                                src={`http://localhost:3333/getImagem/${filme.imagem}`}
                                                style={{ width: '100%', height: '210px', objectFit: 'contain', objectPosition: 'center' }}
                                            />
                                            <Card.Body>
                                                <Card.Title>{filme.titulo}</Card.Title>
                                                <Card.Text>
                                                    <strong>Ano de Lançamento:</strong> {filme.anoLancamento}<br />
                                                    <strong>Disponível: </strong> {filme.disponivel ? 'Sim' : 'Não'}<br />
                                                    <strong>Categoria:</strong> {filme.categoria}<br />
                                                    <strong>Atores:</strong> {filme.atores.map(ator => ator.nome).join(', ')}
                                                </Card.Text>
                                                <div className="d-flex justify-content-between mt-3">
                                                    <Button variant="danger" onClick={() => handleDelete(filme.id)}>Excluir</Button>
                                                    <Button variant="primary" onClick={() => handleEdit(filme.id)}>Editar</Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <p>Nenhum filme encontrado nesta categoria.</p>
                        )}
                    </div>
                ))}
                <Row className="justify-content-center mt-4">
                    <Col md={6} className="d-flex justify-content-center">
                        <S.VerMaisButton href="/listaFilmes">Ver Mais</S.VerMaisButton>
                    </Col>
                </Row>
            </S.area>
        </S.HomeContainer>
    );
};

export default Home;