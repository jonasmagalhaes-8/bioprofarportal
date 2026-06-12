import React from 'react';
import { NoticiaModel } from '../models/NoticiaModel';
import { controllerCriarNoticia, controllerAtualizarNoticia } from '../controllers/NoticiaController';
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
  minHeight: '150px',
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

export class FormNoticia extends React.Component<{
  noticia: NoticiaModel | null;
  onClose: () => void;
  onSuccess: () => void;
}> {
  state = {
    noticia: this.props.noticia || new NoticiaModel(),
    carregando: false,
    file: null as File | null,
    previewUrl: '',
  };

  componentDidMount() {
    if (!this.state.noticia.imagemUrl) {
      const novaNoticia = Object.assign(new NoticiaModel(), this.state.noticia, {
        imagemUrl: 'figma:asset/ec0999868796dce3fdbedb6a94e5eab9bbc5051e.png',
      });
      this.setState({ noticia: novaNoticia });
    }
  }

  handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      this.setState({ file, previewUrl });
    }
  };

  handleSalvar = async () => {
    this.setState({ carregando: true });

    let imagemUrl = this.state.noticia.imagemUrl;

    if (this.state.file) {
      try {
        imagemUrl = await controllerUploadImagem(this.state.file);
      } catch (err) {
        alert('Erro no upload da imagem');
        this.setState({ carregando: false });
        return;
      }
    }

    const noticiaParaSalvar = Object.assign(new NoticiaModel(), this.state.noticia, { imagemUrl });

    if (noticiaParaSalvar.id) {
      await controllerAtualizarNoticia(noticiaParaSalvar);
    } else {
      await controllerCriarNoticia(noticiaParaSalvar);
    }

    this.setState({ carregando: false });
    this.props.onSuccess();
    this.props.onClose();
  };

  updateField = (field: keyof NoticiaModel, value: string) => {
    this.setState({
      noticia: Object.assign(new NoticiaModel(), this.state.noticia, {
        [field]: value,
      }),
    });
  };

  render() {
    const { onClose } = this.props;
    const { noticia, carregando } = this.state;

    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h2 style={titleStyle}>
            {noticia.id ? 'Editar Notícia' : 'Nova Notícia'}
          </h2>

          <label style={labelStyle}>Título</label>
          <input
            type="text"
            style={inputStyle}
            value={noticia.titulo}
            onChange={(e) => this.updateField('titulo', e.target.value)}
          />

          <label style={labelStyle}>Conteúdo</label>
          <textarea
            style={textareaStyle}
            value={noticia.conteudo}
            onChange={(e) => this.updateField('conteudo', e.target.value)}
          />

          <label style={labelStyle}>Data</label>
          <input
            type="date"
            style={inputStyle}
            value={noticia.data}
            onChange={(e) => this.updateField('data', e.target.value)}
          />

          <label style={labelStyle}>Autor</label>
          <input
            type="text"
            style={inputStyle}
            value={noticia.autor}
            onChange={(e) => this.updateField('autor', e.target.value)}
          />

          <label style={labelStyle}>Imagem *</label>
          <input
            type="file"
            accept="image/*"
            style={inputStyle}
            onChange={this.handleFileChange}
          />
          {this.state.carregando && this.state.file && <span style={{fontSize: '12px', color: '#666'}}>Enviando imagem...</span>}
          {(this.state.previewUrl || (noticia.imagemUrl && !noticia.imagemUrl.startsWith('figma'))) && (
            <div style={{marginBottom: 20}}>
              <img src={this.state.previewUrl || noticia.imagemUrl} style={{maxWidth: '100px'}} alt="Preview" />
            </div>
          )}

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
