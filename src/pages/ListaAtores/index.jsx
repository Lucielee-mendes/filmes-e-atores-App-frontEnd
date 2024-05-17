import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card, Button } from 'react-bootstrap';
import * as S from './styles';

const ListaAtores = () => {
    const [atores, setAtores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const atoresPerPage = 16;

    const fetchAtores = async () => {
        try {
            const response = await axios.get("http://localhost:3333/atores", {
                params: {
                    page: currentPage,
                    limit: atoresPerPage,
                }
            });
            setAtores(response.data || []);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Erro ao buscar atores:', error);
            setAtores([]);
        }
    };

    useEffect(() => {
        fetchAtores();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3333/deletarAtor/${id}`);
            if (response.status === 200) {
                alert('Ator excluído com sucesso.');
                fetchAtores();
            }
        } catch (error) {
            console.error(`Erro ao deletar ator com id: ${id}`, error);
        }
    };

    const handleEdit = (id) => {
        window.location.href = `/editarAtor/${id}`;
    };

    return (
        <>
            <S.ListaContainer>
                <Header />
                <S.area >
                    {atores.length > 0 ? (
                        <Row className="gy-4">
                            {atores.map((ator, index) => (
                                <Col md={3} key={index}>
                                    <Card className="h-100">
                                        <Card.Img
                                            variant="top"
                                            src={`http://localhost:3333/getImagem/${ator.imagem}`}
                                            alt={ator.nome}
                                            style={{ width: '100%', height: '210px', objectFit: 'contain', objectPosition: 'center' }}
                                        />
                                        <Card.Body>
                                            <Card.Title>{ator.nome}</Card.Title>
                                            <Card.Text>
                                                <strong>Data de Nascimento:</strong> {new Date(ator.dataNascimento).toLocaleDateString()}<br />
                                                <strong>Nacionalidade:</strong> {ator.nacionalidade}<br />
                                                <strong>Filmes:</strong> {ator.filmes?.map(filme => filme.titulo).join(', ')} {/* Mostrar os títulos dos filmes */}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between mt-3">
                                                <Button variant="danger" onClick={() => handleDelete(ator.id)}>Excluir</Button>
                                                <Button variant="primary" onClick={() => handleEdit(ator.id)}>Editar</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p className="text-center">Nenhum ator encontrado.</p>
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

export default ListaAtores;
