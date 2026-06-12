import React from 'react';
import { ArtigoModel } from '../models/ArtigoModel';
import { controllerCriarArtigo, controllerAtualizarArtigo } from '../controllers/ArtigoController';

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
  maxWidth: '700px',
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

const textareaStyle: CSS = {
  width: '100%',
  padding: '12px',
  marginBottom: '20px',
  border: '2px solid #e8ddc5',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box',
  minHeight: '100px',
  fontFamily: 'inherit',
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

export class FormArtigo extends React.Component<{
  artigo: ArtigoModel | null;
  onClose: () => void;
  onSuccess: () => void;
}> {
  state = {
    artigo: this.props.artigo || new ArtigoModel(),
    carregando: false,
  };

  handleSalvar = async () => {
    this.setState({ carregando: true });

    if (this.state.artigo.id) {
      await controllerAtualizarArtigo(this.state.artigo);
    } else {
      await controllerCriarArtigo(this.state.artigo);
    }

    this.setState({ carregando: false });
    this.props.onSuccess();
    this.props.onClose();
  };

  updateField = (field: keyof ArtigoModel, value: string) => {
    this.setState({
      artigo: Object.assign(new ArtigoModel(), this.state.artigo, {
        [field]: value,
      }),
    });
  };

  render() {
    const { onClose } = this.props;
    const { artigo, carregando } = this.state;

    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h2 style={titleStyle}>
            {artigo.id ? 'Editar Artigo' : 'Novo Artigo'}
          </h2>

          <label style={labelStyle}>Título</label>
          <input
            type="text"
            style={inputStyle}
            value={artigo.titulo}
            onChange={(e) => this.updateField('titulo', e.target.value)}
          />

          <label style={labelStyle}>Autores</label>
          <input
            type="text"
            style={inputStyle}
            value={artigo.autores}
            onChange={(e) => this.updateField('autores', e.target.value)}
            placeholder="Sobrenome AB, Silva CD, Costa EF"
          />

          <label style={labelStyle}>Resumo</label>
          <textarea
            style={textareaStyle}
            value={artigo.resumo}
            onChange={(e) => this.updateField('resumo', e.target.value)}
          />

          <label style={labelStyle}>Conteúdo Completo</label>
          <textarea
            style={Object.assign({}, textareaStyle, { minHeight: '200px' })}
            value={artigo.conteudo}
            onChange={(e) => this.updateField('conteudo', e.target.value)}
          />

          <label style={labelStyle}>Data de Publicação</label>
          <input
            type="date"
            style={inputStyle}
            value={artigo.dataPublicacao}
            onChange={(e) => this.updateField('dataPublicacao', e.target.value)}
          />

          <label style={labelStyle}>Revista</label>
          <input
            type="text"
            style={inputStyle}
            value={artigo.revista}
            onChange={(e) => this.updateField('revista', e.target.value)}
          />

          <label style={labelStyle}>DOI</label>
          <input
            type="text"
            style={inputStyle}
            value={artigo.doi}
            onChange={(e) => this.updateField('doi', e.target.value)}
            placeholder="10.1016/j.exemplo.2024.01.001"
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
