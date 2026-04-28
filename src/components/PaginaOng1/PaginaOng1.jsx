// src/components/PaginaOng1/PaginaOng1.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Titulo from "../Titulo/Titulo.jsx";
import MenuLateral from "../MenuLateral/MenuLateral.jsx";
import css from "./PaginaOng1.module.css";

export default function PaginaOng1({api}) {
    const api_url = api
    const { id } = useParams();
    const [ong, setOng] = useState(null);
    const [projetos, setProjetos] = useState([]);
    const [atualizacoes, setAtualizacoes] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        buscarDados();
    }, [id]);

    async function buscarDados() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/ver_ong_publica/${id}?token=${token || ''}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Dados ONG:', data);
                if (data.ong) setOng(data.ong);
                if (data.projetos) setProjetos(data.projetos);
                if (data.atualizacoes) setAtualizacoes(data.atualizacoes || []);
            }
        } catch (error) { console.error('Erro:', error); }
        finally { setLoading(false); }
    }

    if (loading) return (
        <section className={css.secao}><MenuLateral/><div className={css.conteudo}><p>Carregando...</p></div></section>
    );

    if (!ong) return (
        <section className={css.secao}><MenuLateral/><div className={css.conteudo}><p>ONG não encontrada</p></div></section>
    );

    return (
        <section className={css.secao}>
            <MenuLateral/>
            <div className={css.conteudo}>

                {/* Nome e descrição breve */}
                <h1 className={css.nome}>{ong.nome}</h1>
                <p className={css.descBreve}>{ong.descricao_breve}</p>

                <div className={css.layoutDuasColunas}>

                    {/* Coluna Esquerda */}
                    <div className={css.colunaEsquerda}>

                        {/* Sobre Nós */}
                        <div className={css.secaoBox}>
                            <Titulo titulo={'Sobre Nós'} cor={'preto'}/>
                            <p className={css.descLonga}>{ong.descricao_longa || 'Sem descrição detalhada.'}</p>
                        </div>

                        {/* Informações */}
                        <div className={css.secaoBox}>
                            <div className={css.infoGrid}>
                                <div>
                                    <span className={css.infoLabel}>Categoria</span>
                                    <p className={css.infoValor}>{ong.categoria || 'Não informada'}</p>
                                </div>
                                <div>
                                    <span className={css.infoLabel}>Localização</span>
                                    <p className={css.infoValor}>{ong.localizacao || 'Não informada'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Projetos da ONG */}
                        {projetos.length > 0 && (
                            <div className={css.secaoBox}>
                                <Titulo titulo={'Projetos Ativos'} cor={'preto'}/>
                                <div className={css.projetosLista}>
                                    {projetos.map(proj => (
                                        <Link to={`/projeto/${proj.id}`} key={proj.id} className={css.cardProjeto}>
                                            <h3>{proj.titulo}</h3>
                                            <p>{proj.descricao?.substring(0, 100)}...</p>
                                            <span className={css.tipoAjuda}>{proj.tipo_ajuda}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Últimas atualizações da ONG */}
                        {atualizacoes.length > 0 && (
                            <div className={css.secaoBox}>
                                <Titulo titulo={'Últimas atualizações'} cor={'preto'}/>
                                <div className={css.atualizacoesLista}>
                                    {atualizacoes.map(att => (
                                        <div key={att.id} className={css.atualizacao}>
                                            <h3 className={css.attTitulo}>{att.titulo}</h3>
                                            {att.texto && <p className={css.attTexto}>{att.texto}</p>}
                                            {att.foto && (
                                                <img
                                                    src={`${API_URL}/uploads/Atualizacoes/${att.foto}`}
                                                    alt={att.titulo}
                                                    className={css.attImagem}
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Coluna Direita - Apoie a ONG */}
                    <div className={css.colunaDireita}>
                        <div className={css.cardApoie}>
                            <Titulo titulo={`Apoie o ${ong.nome} diretamente!`} cor={'preto'}/>


                            <div className={css.dadosBancarios}>
                                <p><strong>Instituição:</strong><br/>{ong.cod_banco || 'Não informado'}</p>
                                <p><strong>Agência:</strong><br/>{ong.num_agencia || 'Não informada'}</p>
                                <p><strong>Titular:</strong><br/>{ong.nome}</p>
                                <p><strong>CNPJ:</strong><br/>{ong.cpf_cnpj}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}