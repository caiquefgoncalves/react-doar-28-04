// src/components/BotaoSeguir/BotaoSeguir.jsx
import { useState, useEffect } from 'react';
import css from './BotaoSeguir.module.css';

export default function BotaoSeguir({ idOng, apiUrl, onStatusChange }) {
    const [seguindo, setSeguindo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [logado, setLogado] = useState(false);
    const [isDoador, setIsDoador] = useState(false);

    useEffect(() => {
        verificarStatus();
    }, [idOng]);

    async function verificarStatus() {
        try {
            const response = await fetch(`${apiUrl}/verificar_seguindo/${idOng}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setLogado(data.logado);
                setIsDoador(data.is_doador);
                setSeguindo(data.seguindo);
            }
        } catch (error) {
            console.error('Erro ao verificar status:', error);
        }
    }

    async function toggleSeguir() {
        if (!logado) {
            alert('Faça login para seguir ONGs');
            window.location.href = '/login';
            return;
        }

        if (!isDoador) {
            alert('Apenas doadores podem seguir ONGs');
            return;
        }

        setLoading(true);

        try {
            const endpoint = seguindo ? 'desseguir' : 'seguir';
            const response = await fetch(`${apiUrl}/${endpoint}/${idOng}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setSeguindo(!seguindo);
                if (onStatusChange) {
                    onStatusChange(!seguindo);
                }
                alert(data.message);
            } else {
                alert(data.error || 'Erro ao processar solicitação');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    }

    if (!logado || !isDoador) {
        return null; // ou retorne um botão desabilitado com tooltip
    }

    return (
        <button
            className={`${css.botaoSeguir} ${seguindo ? css.seguindo : ''}`}
            onClick={toggleSeguir}
            disabled={loading}
        >
            {loading ? '...' : (seguindo ? '✓ Seguindo' : '+ Seguir')}
        </button>
    );
}