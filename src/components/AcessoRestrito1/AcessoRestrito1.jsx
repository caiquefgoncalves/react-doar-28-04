import Titulo from "../Titulo/Titulo.jsx";
import css from "./AcessoRestrito1.module.css"
import Botao from "../Botao/Botao.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Mensagem from "../Mensagem/Mensagem.jsx";

export default function AcessoRestrito1({api}) {
    const api_url = api
    const navigate = useNavigate();
    const nome = localStorage.getItem('nome');
    const [error, setError] = useState('');
    const sucesso = localStorage.getItem('sucesso');
    if (sucesso) {
        localStorage.removeItem('sucesso');
    }

    async function Logout() {
        const token = localStorage.getItem('token');
        await fetch(`${api_url}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        });

        localStorage.removeItem("token");
        localStorage.removeItem("nome");

        navigate("/login");
    }

    useEffect(function () {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate("/login");
        }
    }, [])

    return (
        <div className={css.inicio}>
            <div>
                <Mensagem tipo={"sucesso"} texto={sucesso} onClose={() => setError('')}/>
                <Mensagem tipo={"erro"} texto={error} onClose={() => setError('')}/>
            </div>
            <Titulo titulo={'Olá, ' + nome} cor={'azul-claro'} texto={'Essa página é restrita, sendo somente acessada com validação'}/>
            <div>
                <Botao texto={'Logout'} cor={'vermelho'} acao={Logout}/>
            </div>
        </div>
    )
}