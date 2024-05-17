import * as S from './styles';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const EditarFilme = () => {
    const { id } = useParams();
    const [titulo, setTitulo] = useState("");
    const [anoLancamento, setAnoLancamento] = useState("");
    const [disponivel, setDisponivel] = useState("");
    const [categoria, setCategoria] = useState("");
    const [errorEdicao, setErrorEdicao] = useState('');
    const [sucessoEdicao, setSucessoEdicao] = useState(false);
    const [atores, setAtores] = useState([]);
    const [atoresDisponiveis, setAtoresDisponiveis] = useState([]);
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
    const [previewImagem, setPreviewImagem] = useState(null);

    useEffect(() => {
        fetchAtoresDisponiveis();
        fetchFilme();
    }, [id]);

    const fetchAtoresDisponiveis = async () => {
        try {
            const response = await axios.get("http://localhost:3333/atores");
           
            setAtoresDisponiveis(response.data);
        } catch (error) {
            console.error('Erro ao buscar atores:', error);
        }
    };

    const fetchFilme = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/filmes/${id}`);
         

            const filme = response.data;
            setTitulo(filme.titulo);
            setAnoLancamento(filme.anoLancamento);
            setDisponivel(filme.disponivel ? 'true' : 'false');
            setCategoria(filme.categoria);
            setAtores(filme.atores.map(ator => ator.id));
            if (filme.imagem) {
                setPreviewImagem(`http://localhost:3333/${filme.imagem}`);
            }
        } catch (error) {
            console.error('Erro ao buscar filme:', error);
        }
    };

    const handleArquivoChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setArquivoSelecionado(file);

            const leitor = new FileReader();

            leitor.onloadend = () => {
                setPreviewImagem(leitor.result);
               
            };

            leitor.readAsDataURL(file);
        }
    };

    const handleCheckboxChange = (atorId) => {
        const updatedAtores = [...atores];
        const atorIndex = updatedAtores.indexOf(atorId);
        if (atorIndex === -1) {
            updatedAtores.push(atorId);
        } else {
            updatedAtores.splice(atorIndex, 1);
        }
        setAtores(updatedAtores);
    };

    const handleEdicao = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('anoLancamento', anoLancamento);
        formData.append('disponivel', disponivel === 'true');
        formData.append('categoria', categoria);
        if (arquivoSelecionado) {
            formData.append('imagem', arquivoSelecionado);
        }
        atores.forEach(atorId => {
            formData.append('atores', atorId);
        });

        try {
            const response = await axios.put(`http://localhost:3333/editarFilmes/${id}`, formData);

            if (response.status === 200) {
                setSucessoEdicao(true);
            } else {
                setErrorEdicao('Erro ao editar filme.');
            }
        } catch (error) {
            console.error('Erro ao editar filme:', error);
            setErrorEdicao('Erro ao editar filme.');
        }
    };

    return (
        <S.EditarFilmeContainer>
            <S.areaEditar>
                <Header />
                <S.area>
                    <p id='cabecalho'> Edição de Filme</p>
                    <Form onSubmit={handleEdicao}>
                        <Form.Group controlId="formTitulo" className="mb-3">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formAnoLancamento" className="mb-3">
                                    <Form.Label>Ano de Lançamento</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={anoLancamento}
                                        onChange={(e) => setAnoLancamento(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formDisponivel" className="mb-3">
                                    <Form.Label>Disponível</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={disponivel}
                                        onChange={(e) => setDisponivel(e.target.value)}>
                                        <option value="">Selecione uma opção</option>
                                        <option value="true">Sim</option>
                                        <option value="false">Não</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="formCategoria" className="mb-3">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control
                                as="select"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)} >
                                <option value="">Selecione uma categoria</option>
                                <option value="Ação">Ação</option>
                                <option value="Aventura">Aventura</option>
                                <option value="Comédia">Comédia</option>
                                <option value="Comédia romântica">Comédia romântica</option>
                                <option value="Dança">Dança</option>
                                <option value="Documentário">Documentário</option>
                                <option value="Drama">Drama</option>
                                <option value="Ficção científica">Ficção científica</option>
                                <option value="Filmes de guerra">Filmes de guerra</option>
                                <option value="Musical">Musical</option>
                                <option value="Romance">Romance</option>
                                <option value="Suspense">Suspense</option>
                                <option value="Terror">Terror</option>
                            </Form.Control>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formFoto" className="mb-3">
                                    <Form.Label>Foto do Filme</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={handleArquivoChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                {previewImagem && (
                                    <img
                                        src={previewImagem}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            width: 'auto',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            marginTop: '1rem',
                                            marginBottom: '30px'
                                        }}
                                    />
                                )}
                            </Col>
                        </Row>
                        <Form.Group controlId="formAtores">
                            <Form.Label>Atores que participaram do filme</Form.Label>
                            <Row>
                                {atoresDisponiveis.map((actor, index) => (
                                    <Col md={6} key={actor.id}>
                                        <Form.Check
                                            type="checkbox"
                                            label={actor.nome}
                                            value={actor.id}
                                            checked={atores.includes(actor.id)}
                                            onChange={() => handleCheckboxChange(actor.id)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>
                        <div className="text-center">
                            <Button 
                                type="submit" 
                                variant="primary" 
                                style={{ backgroundColor: '#9d5353', marginTop: '20px', fontWeight: 'bold' }} 
                                className="border-0"
                            >
                                Editar Filme
                            </Button>
                        </div>
                        {sucessoEdicao && <Alert variant="success">Filme editado com sucesso!</Alert>}
                        {errorEdicao && <Alert variant="danger">{errorEdicao}</Alert>}
                    </Form>
                </S.area>
            </S.areaEditar>
        </S.EditarFilmeContainer>
    );
};

export default EditarFilme;
