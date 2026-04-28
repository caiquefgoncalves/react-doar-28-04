import Titulo from "../Titulo/Titulo.jsx";
import css from "./EditarOng.module.css"
import Input from "../Input/Input.jsx";
import BotaoAlternar from "../BotaoAlternar/BotaoAlternar.jsx";
import Botao from "../Botao/Botao.jsx";
import Select from "../Select/Select.jsx";
import InputArquivo from "../InputArquivo/InputArquivo.jsx";

export default function EditarOng() {


    return(
        <section className={css.containerSection}>
            <div className={css.cadastroOng1}>
                <Titulo titulo={'Atualize suas informações'} cor={'laranja'}/>
            </div>
            <div className={css.formulario}>
                <div className={css.linha}>
                    <div className={css.campos}>
                        <Input
                            label={'Nome'}
                            type={'text'}
                            placeholder={'Digite seu nome'}
                            required={true}
                            // input={nome}
                            // alterarInput={alterarNome}
                        />
                        <Input
                            label={'Email'}
                            type={'text'}
                            placeholder={'Digite seu email'}
                            required={true}
                            // input={email}
                            // alterarInput={alterarEmail}
                        />
                        <Input
                            label={'Descrição breve'}
                            type={'text'}
                            placeholder={'Descrição breve sobre sua ONG'}
                            required={true}
                            maxLength={30}
                            // input={descBreve}
                            // alterarInput={alterarDescBreve}
                        />
                        <Input
                            label={'Localização'}
                            type={'text'}
                            placeholder={'Digite sua localização'}
                            required={true}
                            // input={localizacao}
                            // alterarInput={alterarLocalizacao}

                        />
                        <Input
                            label={'Senha'}
                            type={'password'}
                            placeholder={'Crie uma senha'}
                            required={true}
                            // input={senha}
                            // alterarInput={alterarSenha}
                        />
                        <Input
                            label={'Código do banco'}
                            type={'text'}
                            placeholder={'Digite o código do banco'}
                            required={true}
                            maxLength={3}
                            // input={codBanco}
                            // alterarInput={alterarCodBanco}
                        />
                        <Input
                            label={'Número da conta'}
                            type={'text'}
                            placeholder={'Digite o número da conta'}
                            required={true}
                            // input={numConta}
                            // alterarInput={alterarNumConta}
                            maxLength={12}
                        />
                        <Select
                            label={'Tipo de conta'}
                            options={['Escolha um tipo de conta', 'Conta-corrente', 'Poupança', 'Conta salário', 'Conta digital', 'Conta PJ']}
                            // input={tipoConta}
                            // alterarInput={alterarTipoConta}
                        />
                    </div>
                    <div className={css.campos}>
                        <Input
                            label={'CNPJ'}
                            type={'text'}
                            placeholder={'Digite o CNPJ'}
                            required={true}
                            maxLength={14}
                            // input={cnpj}
                            // alterarInput={alterarCNPJ}
                        />
                        <Select
                            label={'Categoria'}
                            // input={categoria}
                            // alterarInput={alterarCategoria}
                            options={['Escolha uma categoria', 'Animal', 'Escolar', 'Comida', 'Outro']}/>
                        <Input
                            tamanho={'Big'}
                            label={'Descrição longa'}
                            type={'text'}
                            placeholder={'Descrição longa sobre sua ONG'}
                            required={true}
                            minLength={50}
                            maxLength={200}
                            textarea={true}
                            // alterarInput={alterarDescLonga}
                        />
                        <Input
                            label={'Confirmar senha'}
                            type={'password'}
                            placeholder={'Confirme sua senha'}
                            required={true}
                            // input={confirmarSenha}
                            // alterarInput={alterarConfirmarSenha}
                        />
                        <Input
                            label={'Número da agência'}
                            type={'text'}
                            placeholder={'Digite o número da sua agência'}
                            required={true}
                            maxLength={5}
                            // input={numAgencia}
                            // alterarInput={alterarNumAgencia}
                        />
                        <InputArquivo
                            tamanho={'big'}
                            required={false}
                        />
                    </div>
                </div>
                <div className={css.botaoContainer}>
                    <Botao texto={'Editar'} cor={'amarelo'}/>
                </div>
            </div>
        </section>
    )
}