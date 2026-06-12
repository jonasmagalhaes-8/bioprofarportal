import React from 'react';
import { SecaoCustomModel } from '../models/SecaoCustomModel';
import { controllerCriarSecao, controllerAtualizarSecao } from '../controllers/SecaoCustomController';

type CSS = React.CSSProperties;

const overlayStyle: CSS = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1002,
  overflowY: 'auto',
  padding: '20px',
};

const modalStyle: CSS = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '8px',
  maxWidth: '800px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const titleStyle: CSS = {
  margin: '0 0 25px 0',
  color: '#4a5d3c',
  fontSize: '28px',
};

const labelStyle: CSS = {
  display: 'block',
  marginBottom: '8px',
  color: '#4a5d3c',
  fontWeight: 'bold',
  fontSize: '14px',
};

const inputStyle: CSS = {
  width: '100%',
  padding: '12px',
  marginBottom: '20px',
  border: '2px solid #e8ddc5',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const selectStyle: CSS = {
  width: '100%',
  padding: '12px',
  marginBottom: '20px',
  border: '2px solid #e8ddc5',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const textareaStyle: CSS = {
  width: '100%',
  padding: '12px',
  marginBottom: '20px',
  border: '2px solid #e8ddc5',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box',
  minHeight: '200px',
  fontFamily: 'inherit',
};

const infoStyle: CSS = {
  backgroundColor: '#e8ddc5',
  padding: '12px',
  borderRadius: '4px',
  marginBottom: '15px',
  fontSize: '13px',
  color: '#4a5d3c',
};

const buttonContainerStyle: CSS = {
  display: 'flex',
  gap: '10px',
  marginTop: '30px',
};

const buttonStyle: CSS = {
  flex: 1,
  padding: '14px',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#4a5d3c',
  color: '#ffffff',
  fontWeight: 'bold',
};

const cancelButtonStyle: CSS = {
  flex: 1,
  padding: '14px',
  border: '2px solid #4a5d3c',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
  color: '#4a5d3c',
  fontWeight: 'bold',
};

export class FormSecaoCustom extends React.Component<{
  secao: SecaoCustomModel | null;
  onClose: () => void;
  onSuccess: () => void;
}> {
  state = {
    secao: this.props.secao || new SecaoCustomModel(),
    carregando: false,
  };

  handleSalvar = async () => {
    this.setState({ carregando: true });

    if (this.state.secao.id) {
      await controllerAtualizarSecao(this.state.secao);
    } else {
      await controllerCriarSecao(this.state.secao);
    }

    this.setState({ carregando: false });
    this.props.onSuccess();
    this.props.onClose();
  };

  updateField = (field: keyof SecaoCustomModel, value: string | number) => {
    this.setState({
      secao: Object.assign(new SecaoCustomModel(), this.state.secao, {
        [field]: value,
      }),
    });
  };

  render() {
    const { onClose } = this.props;
    const { secao, carregando } = this.state;

    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h2 style={titleStyle}>
            {secao.id ? 'Editar Seção' : 'Nova Seção'}
          </h2>

          <label style={labelStyle}>Título da Seção</label>
          <input
            type="text"
            style={inputStyle}
            value={secao.titulo}
            onChange={(e) => this.updateField('titulo', e.target.value)}
            placeholder="Ex: Objetivos Principais"
          />

          <label style={labelStyle}>Tipo de Conteúdo</label>
          <select
            style={selectStyle}
            value={secao.tipo}
            onChange={(e) => this.updateField('tipo', e.target.value)}
          >
            <option value="texto">Texto Livre</option>
            <option value="lista">Lista de Itens</option>
          </select>

          {secao.tipo === 'lista' && (
            <div style={infoStyle}>
              <strong>Dica:</strong> Para lista, coloque cada item em uma linha separada.
              <br />
              Pressione Enter para criar um novo item.
            </div>
          )}

          <label style={labelStyle}>Conteúdo</label>
          <textarea
            style={textareaStyle}
            value={secao.conteudo}
            onChange={(e) => this.updateField('conteudo', e.target.value)}
            placeholder={
              secao.tipo === 'lista'
                ? 'Item 1\nItem 2\nItem 3'
                : 'Digite o texto da seção aqui...'
            }
          />

          <div style={buttonContainerStyle}>
            <button
              style={cancelButtonStyle}
              onClick={onClose}
              disabled={carregando}
            >
              Cancelar
            </button>
            <button
              style={buttonStyle}
              onClick={this.handleSalvar}
              disabled={carregando}
            >
              {carregando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
