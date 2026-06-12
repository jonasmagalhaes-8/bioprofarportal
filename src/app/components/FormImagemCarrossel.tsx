import React from 'react';
import { ImagemCarrosselModel } from '../models/ImagemCarrosselModel';
import { controllerCriarImagemCarrossel, controllerAtualizarImagemCarrossel } from '../controllers/ImagemCarrosselController';
import { controllerUploadImagem } from '../controllers/UploadController';

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
  maxWidth: '600px',
  width: '100%',
};

const titleStyle: CSS = {
  margin: '0 0 25px 0',
  color: '#4a5d3c',
  fontSize: '28px',
};

const formGroupStyle: CSS = {
  marginBottom: '20px',
};

const labelStyle: CSS = {
  display: 'block',
  marginBottom: '8px',
  color: '#4a5d3c',
  fontSize: '14px',
  fontWeight: 'bold',
};

const inputStyle: CSS = {
  width: '100%',
  padding: '10px',
  border: '2px solid #e8ddc5',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const textareaStyle: CSS = Object.assign({}, inputStyle, {
  minHeight: '80px',
  resize: 'vertical',
});

const buttonContainerStyle: CSS = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end',
  marginTop: '30px',
};

const saveButtonStyle: CSS = {
  padding: '12px 24px',
  backgroundColor: '#4a5d3c',
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

const cancelButtonStyle: CSS = {
  padding: '12px 24px',
  backgroundColor: '#ffffff',
  color: '#4a5d3c',
  border: '2px solid #4a5d3c',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

export class FormImagemCarrossel extends React.Component<{
  imagem: ImagemCarrosselModel | null;
  onClose: () => void;
  onSuccess: () => void;
}> {
  state = {
    url: '',
    titulo: '',
    legenda: '',
    ordem: 1,
    salvando: false,
    file: null as File | null,
    previewUrl: '',
  };

  componentDidMount() {
    const { imagem } = this.props;
    if (imagem) {
      this.setState({
        url: imagem.url,
        titulo: imagem.titulo,
        legenda: imagem.legenda,
        ordem: imagem.ordem,
      });
    }
  }

  handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      this.setState({ file, previewUrl });
    }
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({ salvando: true });

    let url = this.state.url;

    if (this.state.file) {
      try {
        url = await controllerUploadImagem(this.state.file);
      } catch (err) {
        alert('Erro no upload da imagem');
        this.setState({ salvando: false });
        return;
      }
    }

    const imagemData = new ImagemCarrosselModel();
    imagemData.url = url;
    imagemData.titulo = this.state.titulo;
    imagemData.legenda = this.state.legenda;
    imagemData.ordem = this.state.ordem;

    try {
      if (this.props.imagem) {
        imagemData.id = this.props.imagem.id;
        await controllerAtualizarImagemCarrossel(imagemData);
      } else {
        await controllerCriarImagemCarrossel(imagemData);
      }
      this.props.onSuccess();
      this.props.onClose();
    } catch (err) {
      alert('Erro ao salvar imagem');
    } finally {
      this.setState({ salvando: false });
    }
  };

  render() {
    const { onClose, imagem } = this.props;

    return (
      <div style={overlayStyle}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h2 style={titleStyle}>{imagem ? 'Editar Imagem' : 'Nova Imagem'}</h2>

          <form onSubmit={this.handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Imagem *</label>
              <input
                type="file"
                accept="image/*"
                style={inputStyle}
                onChange={this.handleFileChange}
                required={!this.state.url && !this.state.file}
              />
              {this.state.salvando && this.state.file && <span style={{fontSize: '12px', color: '#666'}}>Enviando imagem...</span>}
              {(this.state.previewUrl || this.state.url) && (
                <div style={{marginTop: 10}}>
                  <img src={this.state.previewUrl || this.state.url} style={{maxWidth: '100px'}} alt="Preview" />
                </div>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Título *</label>
              <input
                type="text"
                style={inputStyle}
                value={this.state.titulo}
                onChange={(e) => this.setState({ titulo: e.target.value })}
                required
                placeholder="Título da imagem"
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Legenda *</label>
              <textarea
                style={textareaStyle}
                value={this.state.legenda}
                onChange={(e) => this.setState({ legenda: e.target.value })}
                required
                placeholder="Descrição da imagem"
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Ordem de Exibição *</label>
              <input
                type="number"
                style={inputStyle}
                value={this.state.ordem}
                onChange={(e) => this.setState({ ordem: parseInt(e.target.value) || 1 })}
                required
                min="1"
              />
            </div>

            <div style={buttonContainerStyle}>
              <button type="button" style={cancelButtonStyle} onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" style={saveButtonStyle} disabled={this.state.salvando}>
                {this.state.salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
