import css from './Titulo.module.css';

export default function Titulo({titulo, cor = "azul-claro", texto = ""}) {
    if (texto.length === 0) {
        return (
            <div>
                <h2 className={css[cor]}>{titulo}</h2>
            </div>
        )
    }
    else {
        return (
            <div>
                <h2 className={css[cor]}>{titulo}</h2>
                <p className={css.texto}>{texto}</p>
            </div>
        )
    }
}