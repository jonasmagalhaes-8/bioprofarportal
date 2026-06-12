import React from 'react';
import { MembroEquipeModel } from '../models/MembroEquipeModel';
import { controllerCriarMembro, controllerAtualizarMembro } from '../controllers/MembroEquipeController';
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

export class FormEquipe extends React.Component<{
  membro: MembroEquipeModel | null;
  onClose: () => void;
  onSuccess: () => void;
}> {
  state = {
    membro: this.props.membro || new MembroEquipeModel(),
    carregando: false,
    file: null as File | null,
    previewUrl: '',
  };

  componentDidMount() {
    if (!this.state.membro.fotoUrl) {
      const novoMembro = Object.assign(new MembroEquipeModel(), this.state.membro, {
        fotoUrl: 'figma:asset/ec0999868796dce3fdbedb6a94e5eab9bbc5051e.png',
      });
      this.setState({ membro: novoMembro });
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

    let fotoUrl = this.state.membro.fotoUrl;

    if (this.state.file) {
      try {
        fotoUrl = await controllerUploadImagem(this.state.file);
      } catch (err) {
        alert('Erro no upload da imagem');
        this.setState({ carregando: false });
        return;
      }
    }

    const membroParaSalvar = Object.assign(new MembroEquipeModel(), this.state.membro, { fotoUrl });

    if (membroParaSalvar.id) {
      await controllerAtualizarMembro(membroParaSalvar.id, membroParaSalvar);
    } else {
      await controllerCriarMembro(membroParaSalvar);
    }

    this.setState({ carregando: false });
    this.props.onSuccess();
    this.props.onClose();
  };

  updateField = (field: keyof MembroEquipeModel, value: any) => {
    this.setState({
      membro: Object.assign(new MembroEquipeModel(), this.state.membro, {
        [field]: value,
      }),
    });
  };

  render() {
    const { onClose } = this.props;
    const { membro, carregando } = this.state;

    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h2 style={titleStyle}>
            {membro.id ? 'Editar Membro' : 'Novo Membro'}
          </h2>

          <label style={labelStyle}>Nome</label>
          <input
            type="text"
            style={inputStyle}
            value={membro.nome}
            onChange={(e) => this.updateField('nome', e.target.value)}
          />

          <label style={labelStyle}>Cargo</label>
          <input
            type="text"
            style={inputStyle}
            value={membro.cargo}
            onChange={(e) => this.updateField('cargo', e.target.value)}
          />

          <label style={labelStyle}>Instituição</label>
          <input
            type="text"
            style={inputStyle}
            value={membro.instituicao}
            onChange={(e) => this.updateField('instituicao', e.target.value)}
          />

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            style={inputStyle}
            value={membro.email}
            onChange={(e) => this.updateField('email', e.target.value)}
          />

          <label style={labelStyle}>Currículo Lattes</label>
          <input
            type="text"
            style={inputStyle}
            value={membro.lattes}
            onChange={(e) => this.updateField('lattes', e.target.value)}
            placeholder="http://lattes.cnpq.br/..."
          />

          <label style={labelStyle}>Foto *</label>
          <input
            type="file"
            accept="image/*"
            style={inputStyle}
            onChange={this.handleFileChange}
          />
          {this.state.carregando && this.state.file && <span style={{fontSize: '12px', color: '#666'}}>Enviando imagem...</span>}
          {(this.state.previewUrl || (membro.fotoUrl && !membro.fotoUrl.startsWith('figma'))) && (
            <div style={{marginBottom: 20}}>
              <img src={this.state.previewUrl || membro.fotoUrl} style={{maxWidth: '100px'}} alt="Preview" />
            </div>
          )}

          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}>
            <input
              type="checkbox"
              checked={membro.comite || false}
              onChange={(e) => this.updateField('comite', e.target.checked)}
            />
            Faz parte do Comitê Gestor?
          </label>

          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}>
            <input
              type="checkbox"
              checked={membro.pesquisador || false}
              onChange={(e) => this.updateField('pesquisador', e.target.checked)}
            />
            Também é um pesquisador?
          </label>

          {membro.comite && (
            <>
              <label style={labelStyle}>Ordem no Comitê</label>
              <input
                type="number"
                style={inputStyle}
                value={membro.ordemComite || ''}
                onChange={(e) => this.updateField('ordemComite', parseInt(e.target.value) || 0)}
              />
            </>
          )}

          <label style={labelStyle}>Descrição</label>
          <textarea
            style={textareaStyle}
            value={membro.descricao}
            onChange={(e) => this.updateField('descricao', e.target.value)}
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
