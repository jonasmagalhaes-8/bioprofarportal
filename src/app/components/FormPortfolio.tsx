import React from 'react';
import { PortfolioModel } from '../models/PortfolioModel';
import { controllerAdicionarPortfolio, controllerAtualizarPortfolio } from '../controllers/PortfolioController';
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
  minHeight: '100px',
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

export class FormPortfolio extends React.Component<{
  item: PortfolioModel | null;
  onClose: () => void;
  onSuccess: () => void;
}> {
  state = {
    titulo: '',
    tipo: '',
    ano: '',
    descricao: '',
    imagemUrl: '',
    salvando: false,
    file: null as File | null,
    previewUrl: '',
  };

  componentDidMount() {
    const { item } = this.props;
    if (item) {
      this.setState({
        titulo: item.titulo,
        tipo: item.tipo,
        ano: item.ano,
        descricao: item.descricao,
        imagemUrl: item.imagemUrl,
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

    let imagemUrl = this.state.imagemUrl;

    if (this.state.file) {
      try {
        imagemUrl = await controllerUploadImagem(this.state.file);
      } catch (err) {
        alert('Erro no upload da imagem');
        this.setState({ salvando: false });
        return;
      }
    }

    const portfolioData = new PortfolioModel();
    portfolioData.titulo = this.state.titulo;
    portfolioData.tipo = this.state.tipo;
    portfolioData.ano = this.state.ano;
    portfolioData.descricao = this.state.descricao;
    portfolioData.imagemUrl = imagemUrl;

    try {
      if (this.props.item) {
        portfolioData.id = this.props.item.id;
        await controllerAtualizarPortfolio(portfolioData);
      } else {
        await controllerAdicionarPortfolio(portfolioData);
      }
      this.props.onSuccess();
      this.props.onClose();
    } catch (err) {
      alert('Erro ao salvar portfolio');
    } finally {
      this.setState({ salvando: false });
    }
  };

  render() {
    const { onClose, item } = this.props;

    return (
      <div style={overlayStyle}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h2 style={titleStyle}>{item ? 'Editar Item' : 'Novo Item'}</h2>

          <form onSubmit={this.handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Título *</label>
              <input
                type="text"
                style={inputStyle}
                value={this.state.titulo}
                onChange={(e) => this.setState({ titulo: e.target.value })}
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Tipo *</label>
              <input
                type="text"
                style={inputStyle}
                value={this.state.tipo}
                onChange={(e) => this.setState({ tipo: e.target.value })}
                required
                placeholder="Ex: Software, Hardware, Premiação..."
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Ano *</label>
              <input
                type="text"
                style={inputStyle}
                value={this.state.ano}
                onChange={(e) => this.setState({ ano: e.target.value })}
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Descrição *</label>
              <textarea
                style={textareaStyle}
                value={this.state.descricao}
                onChange={(e) => this.setState({ descricao: e.target.value })}
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Imagem *</label>
              <input
                type="file"
                accept="image/*"
                style={inputStyle}
                onChange={this.handleFileChange}
                required={!this.state.imagemUrl && !this.state.file}
              />
              {this.state.salvando && this.state.file && <span style={{fontSize: '12px', color: '#666'}}>Enviando imagem...</span>}
              {(this.state.previewUrl || this.state.imagemUrl) && (
                <div style={{marginTop: 10}}>
                  <img src={this.state.previewUrl || this.state.imagemUrl} style={{maxWidth: '100px'}} alt="Preview" />
                </div>
              )}
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
