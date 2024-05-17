import * as S from './styles';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { useParams } from 'react-router-dom';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

const EditarAtor = () => {
    const { id } = useParams();
    const [nome, setNome] = useState("");
    const [nacionalidade, setNacionalidade] = useState("");
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
    const [filmes, setFilmes] = useState([]);
    const [filmesDisponiveis, setFilmesDisponiveis] = useState([]);
    const [previewImagem, setPreviewImagem] = useState(null);
    const [errorEdicao, setErrorEdicao] = useState('');
    const [sucessoEdicao, setSucessoEdicao] = useState(false);

    useEffect(() => {
        fetchFilmesDisponiveis();
        fetchAtor();
    }, [id]);

    const fetchFilmesDisponiveis = async () => {
        try {
            const response = await axios.get("http://localhost:3333/filmes");
           
            setFilmesDisponiveis(response.data);
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
        }
    };

    const handleFilmeCheckboxChange = (filmeId) => {
        const updatedFilmes = [...filmes];
        const filmeIndex = updatedFilmes.indexOf(filmeId);
        if (filmeIndex === -1) {
            updatedFilmes.push(filmeId);
        } else {
            updatedFilmes.splice(filmeIndex, 1);
        }
        setFilmes(updatedFilmes);
    };

    const handleArquivoChange = (e) => {
        const file = e.target.files[0];
        setArquivoSelecionado(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImagem(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const fetchAtor = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/atores/${id}`);
          
            const ator = response.data;
            setNome(ator.nome || '');
            setNacionalidade(ator.nacionalidade || '');
            setFilmes(ator.filmes.map(filme => filme.id));
            if (ator.imagem) {
                setPreviewImagem(`http://localhost:3333/${ator.imagem}`);
            }
        } catch (error) {
            console.error('Erro ao buscar ator:', error);
        }
    };

    const handleEdicao = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('nacionalidade', nacionalidade);
        if (arquivoSelecionado) {
            formData.append('imagem', arquivoSelecionado);
        }
        filmes.forEach(filmeId => {
            formData.append('filmes', filmeId);
        });

        try {
            const response = await axios.put(`http://localhost:3333/editarAtores/${id}`, formData);
    
            if (response.status === 200) {
                setSucessoEdicao(true);
            } else {
                setErrorEdicao('Erro ao editar ator.');
            }
        } catch (error) {
            console.error('Erro ao editar ator:', error);
            setErrorEdicao('Erro ao editar ator.');
        }
    };

    return (
        <S.EditarAtorContainer>
            <S.areaEditar>
                <Header />
                <S.area>
                    <p id='cabecalho'> Edição de Ator</p>
                    <Form onSubmit={handleEdicao}>
                        <Form.Group controlId="formNome" className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formNacionalidade" className="mb-3">
                            <Form.Label>Nacionalidade</Form.Label>
                            <Form.Control type="text" value={nacionalidade} onChange={(e) => setNacionalidade(e.target.value)} />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formFoto" className="mb-3">
                                    <Form.Label>Foto do Ator</Form.Label>
                                    <Form.Control type="file" onChange={handleArquivoChange} />
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

                        <Form.Group controlId="formFilmes">
                            <Form.Label>Selecione os filmes em que o ator participou</Form.Label>
                            <Row>
                                {filmesDisponiveis.map(filme => (
                                    <Col md={6} key={filme.id}>
                                        <Form.Check
                                            type="checkbox"
                                            label={filme.titulo}
                                            value={filme.id}
                                            checked={filmes.includes(filme.id)}
                                            onChange={() => handleFilmeCheckboxChange(filme.id)}
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
                                Editar Ator
                            </Button>
                        </div>
                    </Form>
                    {sucessoEdicao && <Alert variant="success">Ator editado com sucesso!</Alert>}
                    {errorEdicao && <Alert variant="danger">{errorEdicao}</Alert>}
                </S.area>
            </S.areaEditar>
        </S.EditarAtorContainer>
    );
};

export default EditarAtor;
