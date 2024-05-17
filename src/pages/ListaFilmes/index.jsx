import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card, Button } from 'react-bootstrap';
import * as S from './styles';

const ListaFilmes = () => {
    const [filmes, setFilmes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const filmesPerPage = 16;

 
    const fetchFilmes = async () => {
        try {
            const response = await axios.get("http://localhost:3333/filmes", {
                params: {
                    page: currentPage,
                    limit: filmesPerPage,
                
                }
            });
            setFilmes(response.data || []);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            setFilmes([]);
        }
    };

    useEffect(() => {
        fetchFilmes();
    }, [currentPage]);


    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3333/}/deletarFilme/${id}`);
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
        <>

            <S.ListaContainer>
            <Header />

                <S.area >
                    {filmes.length > 0 ? (
                        <Row className="gy-4">
                            {filmes.map((filme, index) => (
                                <Col md={3} key={index}>
                                    <Card className="h-100">
                                        <Card.Img
                                            variant="top"
                                            src={`http://localhost:3333/getImagem/${filme.imagem}`}
                                            alt={filme.titulo}
                                            style={{ width: '100%', height: '210px', objectFit: 'contain', objectPosition: 'center' }}
                                        />
                                        <Card.Body>
                                            <Card.Title>{filme.titulo}</Card.Title>
                                            <Card.Text>
                                                <strong>Ano de Lançamento:</strong> {filme.anoLancamento}<br />
                                                <strong>Disponível: </strong> {filme.disponivel ? 'Sim' : 'Não'}<br />
                                                <strong>Categoria:</strong> {filme.categoria}<br />
                                                <strong>Atores:</strong> {filme.atores?.map(ator => ator.nome).join(', ')}
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
                        <p className="text-center">Nenhum filme encontrado.</p>
                    )}

                    <div className="d-flex justify-content-center mt-4">
                        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} variant="secondary" className="me-2">Anterior</Button>
                        {[...Array(totalPages).keys()].map(number => (
                            <Button
                                key={number + 1}
                                onClick={() => handlePageChange(number + 1)}
                                variant={currentPage === number + 1 ? 'primary' : 'secondary'}
                                className="me-2"
                            >
                                {number + 1}
                            </Button>
                        ))}
                        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="secondary">Próximo</Button>
                    </div>
                </S.area>
            </S.ListaContainer>
        </>
    );
};

export default ListaFilmes;
