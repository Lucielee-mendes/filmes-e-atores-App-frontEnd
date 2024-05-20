import * as S from './styles'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

import { format } from 'date-fns';



const CadastroAtor = () => {
    const [nome, setNome] = useState("");
    const [dataNascimento, setDataNascimento] = useState('');
    const [nacionalidade, setNacionalidade] = useState("");
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
    const [filmes, setFilmes] = useState([]);
    const [filmesDisponiveis, setFilmesDisponiveis] = useState([]);
    const [errorCadastro, setErrorCadastro] = useState('');
    const [sucessoCadastro, setSucessoCadastro] = useState(false);
    const [previewImagem, setPreviewImagem] = useState(null);


    useEffect(() => {
        // Carregar lista de filmes disponíveis ao montar o componente
        fetchFilmesDisponiveis();
    }, []);

    const fetchFilmesDisponiveis = async () => {
        try {
            const response = await axios.get("http://localhost:3333/filmes");
            

            setFilmesDisponiveis(response.data);
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
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
    const limparFormulario = () => {
        setNome('');
        setDataNascimento('');
        setNacionalidade('');
        setArquivoSelecionado(null);
        setFilmes([]);
        setErrorCadastro('');
        setPreviewImagem(null);
    };


    const handleCadastro = async () => {
        // Validação dos campos do formulário
       

        if (nome.length === 0 || nacionalidade.length === 0) {
            setErrorCadastro("Preencha todos os campos")
            return;
        } else {
            const formData = new FormData();
            formData.append('imagem', arquivoSelecionado);

            const [dia, mes, ano] = dataNascimento.split('/');
            const dataFormatada = `${ano}-${mes}-${dia}`;
            const dataNascimentoFormatada = new Date(dataFormatada);

            const atorData = {
                nome,
                dataNascimento: dataNascimentoFormatada,
                nacionalidade,
                filmes: filmes ? filmes.map(filme => filme.id) : [],
            };

        

            formData.append('json', JSON.stringify(atorData))

            try {
                // Requisição POST para cadastrar o ator
                const response = await axios.post("http://localhost:3333/atores", formData);

                if (response.status === 201) {
                    limparFormulario();
                    setSucessoCadastro(true);
                    setTimeout(() => {
                        setSucessoCadastro(false);
                    }, 2000)

                } else {
                    console.error('Error response data:', response.data || 'No response data available');
                    setErrorCadastro(response.data.error || 'Erro ao cadastrar ator');
                }
            } catch (error) {
                console.error('Error response data:', error.response.data);
                setErrorCadastro(`Erro ao cadastrar ator ${error.response.data.error}`);
            }
        }
    };

    const handleFilmeCheckboxChange = (filmeId) => {
        const filme = filmesDisponiveis.find(filme => filme.id === filmeId);
        const updatedFilmes = [...filmes];
        const filmeIndex = updatedFilmes.findIndex(f => f.id === filmeId);
        if (filmeIndex === -1) {
            updatedFilmes.push(filme);
        } else {
            updatedFilmes.splice(filmeIndex, 1);
        }
        setFilmes(updatedFilmes);
    };


    return (
        <S.CadastroAtorContainer>
            <S.areaCadastro>
                <Header />
                <S.area>
                    <p id='cabecalho'> Cadastro de Ator</p>
                    <Form>
                        <Form.Group controlId="formNome" className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formDataNascimento"className="mb-3">
                                    <Form.Label>Data de Nascimento</Form.Label>
                                    <Form.Control type="date" value={dataNascimento}onChange={(e) => setDataNascimento(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formNacionalidade"className="mb-3">
                                    <Form.Label>Nacionalidade</Form.Label>
                                    <Form.Control type="text" value={nacionalidade}onChange={(e) => setNacionalidade(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formFoto"className="mb-3">
                                    <Form.Label>Foto do Ator</Form.Label>
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
                        <Form.Group controlId="formFilmes">
                            <Form.Label>Selecione os filmes em que o ator participou</Form.Label>
                            <Row>
                                {filmesDisponiveis.map((filme, index) => (
                                    <Col md={6} key={filme.id}>
                                        <Form.Check
                                            type="checkbox"
                                            label={filme.titulo}
                                            value={filme.id}
                                            checked={filmes.some(f => f.id === filme.id)}
                                            onChange={() => handleFilmeCheckboxChange(filme.id)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="primary" onClick={handleCadastro} style={{ backgroundColor: '#9d5353', marginTop: '20px', fontWeight: 'bold' }}className="border-0 ">
                                Cadastrar Ator
                            </Button>
                        </div>
                    </Form>

                    {sucessoCadastro && <Alert variant="success">Ator cadastrado com sucesso!</Alert>}
                    {errorCadastro && <Alert variant="danger">{errorCadastro}</Alert>}
                </S.area>
            </S.areaCadastro>
        </S.CadastroAtorContainer>
    );
};

export default CadastroAtor;
