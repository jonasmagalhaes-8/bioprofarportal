import React from 'react';
import { ConfiguracaoSiteModel } from '../models/ConfiguracaoSiteModel';
import { FinanciadorModel } from '../models/FinanciadorModel';
import { ApoioModel } from '../models/ApoioModel';
import { controllerAtualizarConfiguracao } from '../controllers/ConfiguracaoController';
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

const sectionTitleStyle: CSS = {
  fontSize: '20px',
  color: '#4a5d3c',
  marginTop: '30px',
  marginBottom: '15px',
  borderBottom: '2px solid #e8ddc5',
  paddingBottom: '8px',
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
  position: 'sticky',
  bottom: 0,
  backgroundColor: '#ffffff',
  padding: '20px 0',
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

export class FormConfiguracao extends React.Component<{
  config: ConfiguracaoSiteModel;
  tipo: 'hero' | 'sobre' | 'rodape';
  onClose: () => void;
  onSuccess: (novaConfig?: ConfiguracaoSiteModel) => void;
}> {
  state = {
    config: (() => {
      const c = Object.assign(new ConfiguracaoSiteModel(), this.props.config);
      for (const k in c) {
        if ((c as any)[k] === null || (c as any)[k] === undefined) {
          if (k !== 'financiadores' && k !== 'apoios' && k !== 'id') {
            (c as any)[k] = '';
          }
        }
      }
      return c;
    })(),
    carregando: false,
    files: {} as { [id: number]: File },
    previewUrls: {} as { [id: number]: string },
  };

  handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      this.setState((prevState: any) => ({
        files: { ...prevState.files, [id]: file },
        previewUrls: { ...prevState.previewUrls, [id]: previewUrl }
      }));
    }
  };

  handleSalvar = async () => {
    this.setState({ carregando: true });

    let configToSave = Object.assign(new ConfiguracaoSiteModel(), this.state.config);

    const uploadForArray = async (items: any[]) => {
      const newItems = [...items];
      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];
        if ((this.state.files as any)[item.id]) {
          try {
            const url = await controllerUploadImagem((this.state.files as any)[item.id]);
            newItems[i] = { ...item, logoUrl: url };
          } catch (err) {
            alert(`Erro no upload da imagem para ${item.nome || 'item'}`);
            throw err;
          }
        }
      }
      return newItems;
    };

    try {
      configToSave.financiadores = await uploadForArray(configToSave.financiadores || []);
      configToSave.apoios = await uploadForArray(configToSave.apoios || []);
    } catch (err) {
      this.setState({ carregando: false });
      return;
    }

    const result = await controllerAtualizarConfiguracao(configToSave);
    this.setState({ carregando: false });
    this.props.onSuccess(result?.response || configToSave);
    this.props.onClose();
  };

  updateField = (field: keyof ConfiguracaoSiteModel, value: string) => {
    this.setState({
      config: Object.assign(new ConfiguracaoSiteModel(), this.state.config, {
        [field]: value,
      }),
    });
  };

  renderHeroForm = () => {
    const { config } = this.state;

    return (
      <div>
        <label style={labelStyle}>Título Principal</label>
        <input
          type="text"
          style={inputStyle}
          value={config.heroTitulo}
          onChange={(e) => this.updateField('heroTitulo', e.target.value)}
        />

        <label style={labelStyle}>Subtítulo / Descrição</label>
        <textarea
          style={textareaStyle}
          value={config.heroSubtitulo}
          onChange={(e) => this.updateField('heroSubtitulo', e.target.value)}
        />
      </div>
    );
  };

  renderSobreForm = () => {
    const { config } = this.state;

    return (
      <div>
        <label style={labelStyle}>Título da Seção</label>
        <input
          type="text"
          style={inputStyle}
          value={config.sobreTitulo}
          onChange={(e) => this.updateField('sobreTitulo', e.target.value)}
        />

        <label style={labelStyle}>Conteúdo Principal</label>
        <textarea
          style={Object.assign({}, textareaStyle, { minHeight: '150px' })}
          value={config.sobreConteudo}
          onChange={(e) => this.updateField('sobreConteudo', e.target.value)}
        />

        <label style={labelStyle}>Missão</label>
        <textarea
          style={textareaStyle}
          value={config.sobreMissao}
          onChange={(e) => this.updateField('sobreMissao', e.target.value)}
        />

        <label style={labelStyle}>Visão</label>
        <textarea
          style={textareaStyle}
          value={config.sobreVisao}
          onChange={(e) => this.updateField('sobreVisao', e.target.value)}
        />
      </div>
    );
  };

  renderRodapeForm = () => {
    const { config } = this.state;

    const addFinanciador = () => {
      const novo = new FinanciadorModel();
      novo.id = Date.now();
      novo.ordem = (config.financiadores || []).length + 1;
      novo.nome = '';
      novo.temDestaque = true; 
      novo.mostrarLogo = true;
      
      this.setState({
        config: Object.assign(new ConfiguracaoSiteModel(), config, {
          financiadores: [...(config.financiadores || []), novo],
        }),
      });
    };

    const removeFinanciador = (id: number) => {
      this.setState({
        config: Object.assign(new ConfiguracaoSiteModel(), config, {
          financiadores: config.financiadores.filter(f => f.id !== id),
        }),
      });
    };

    const updateFinanciador = (id: number, field: string, value: any) => {
      this.setState({
        config: Object.assign(new ConfiguracaoSiteModel(), config, {
          financiadores: config.financiadores.map(f => f.id === id ? { ...f, [field]: value } : f),
        }),
      });
    };

    const addApoio = () => {
      const novo = new ApoioModel();
      novo.id = Date.now();
      novo.ordem = (config.apoios || []).length + 1;
      novo.nome = '';
      novo.temDestaque = false;
      novo.mostrarLogo = true;
      
      this.setState({
        config: Object.assign(new ConfiguracaoSiteModel(), config, {
          apoios: [...(config.apoios || []), novo],
        }),
      });
    };

    const removeApoio = (id: number) => {
      this.setState({
        config: Object.assign(new ConfiguracaoSiteModel(), config, {
          apoios: config.apoios.filter(f => f.id !== id),
        }),
      });
    };

    const updateApoio = (id: number, field: string, value: any) => {
      this.setState({
        config: Object.assign(new ConfiguracaoSiteModel(), config, {
          apoios: config.apoios.map(f => f.id === id ? { ...f, [field]: value } : f),
        }),
      });
    };

    const renderCard = (f: any, label: string, onUpdate: (id: number, field: string, value: any) => void, onRemove: (id: number) => void) => (
      <div key={f.id} style={{ 
        border: '1px solid #e8ddc5', 
        padding: '15px', 
        borderRadius: '6px', 
        marginBottom: '15px',
        backgroundColor: '#fef9f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>{label}</span>
          <button 
            onClick={() => onRemove(f.id)}
            style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            Remover
          </button>
        </div>
        
        <label style={labelStyle}>Nome</label>
        <input
          type="text"
          style={inputStyle}
          value={f.nome}
          onChange={(e) => onUpdate(f.id, 'nome', e.target.value)}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={labelStyle}>Ordem</label>
            <input
              type="number"
              style={inputStyle}
              value={f.ordem}
              onChange={(e) => onUpdate(f.id, 'ordem', parseInt(e.target.value))}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <label style={{ ...labelStyle, marginBottom: '0', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={f.temDestaque}
                onChange={(e) => onUpdate(f.id, 'temDestaque', e.target.checked)}
              />
              Em Destaque?
            </label>
          </div>
        </div>

        <label style={labelStyle}>Logo (ou deixe vazio para texto) *</label>
        <input
          type="file"
          accept="image/*"
          style={inputStyle}
          onChange={(e) => this.handleLogoFileChange(e, f.id)}
        />
        {this.state.carregando && (this.state.files as any)[f.id] && <span style={{fontSize: '12px', color: '#666'}}>Enviando imagem...</span>}
        {((this.state.previewUrls as any)[f.id] || f.logoUrl) && (
          <div style={{marginBottom: 10}}>
            <img src={(this.state.previewUrls as any)[f.id] || f.logoUrl} style={{maxWidth: '100px'}} alt="Preview" />
          </div>
        )}
        
        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={f.mostrarLogo}
            onChange={(e) => onUpdate(f.id, 'mostrarLogo', e.target.checked)}
          />
          Exibir Imagem?
        </label>
      </div>
    );

    return (
      <div>
        <div style={sectionTitleStyle}>Contato</div>
        
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          style={inputStyle}
          value={config.contatoEmail}
          onChange={(e) => this.updateField('contatoEmail', e.target.value)}
        />

        <label style={labelStyle}>Telefone</label>
        <input
          type="text"
          style={inputStyle}
          value={config.contatoTelefone}
          onChange={(e) => this.updateField('contatoTelefone', e.target.value)}
        />

        <label style={labelStyle}>WhatsApp</label>
        <input
          type="text"
          style={inputStyle}
          value={config.contatoWhatsapp}
          onChange={(e) => this.updateField('contatoWhatsapp', e.target.value)}
        />

        <div style={sectionTitleStyle}>Endereço</div>
        
        <label style={labelStyle}>Linha 1</label>
        <input
          type="text"
          style={inputStyle}
          value={config.enderecoLinha1}
          onChange={(e) => this.updateField('enderecoLinha1', e.target.value)}
        />

        <label style={labelStyle}>Linha 2</label>
        <input
          type="text"
          style={inputStyle}
          value={config.enderecoLinha2}
          onChange={(e) => this.updateField('enderecoLinha2', e.target.value)}
        />

        <label style={labelStyle}>Linha 3</label>
        <input
          type="text"
          style={inputStyle}
          value={config.enderecoLinha3}
          onChange={(e) => this.updateField('enderecoLinha3', e.target.value)}
        />

        <label style={labelStyle}>Linha 4</label>
        <input
          type="text"
          style={inputStyle}
          value={config.enderecoLinha4}
          onChange={(e) => this.updateField('enderecoLinha4', e.target.value)}
        />

        <label style={labelStyle}>Linha 5</label>
        <input
          type="text"
          style={inputStyle}
          value={config.enderecoLinha5}
          onChange={(e) => this.updateField('enderecoLinha5', e.target.value)}
        />

        <div style={sectionTitleStyle}>Redes Sociais</div>
        
        <label style={labelStyle}>Twitter/X</label>
        <input
          type="url"
          style={inputStyle}
          value={config.redesTwitter}
          onChange={(e) => this.updateField('redesTwitter', e.target.value)}
        />

        <label style={labelStyle}>Instagram</label>
        <input
          type="url"
          style={inputStyle}
          value={config.redesInstagram}
          onChange={(e) => this.updateField('redesInstagram', e.target.value)}
        />

        <label style={labelStyle}>LinkedIn</label>
        <input
          type="url"
          style={inputStyle}
          value={config.redesLinkedin}
          onChange={(e) => this.updateField('redesLinkedin', e.target.value)}
        />

        <div style={sectionTitleStyle}>Parceiros</div>

        <label style={labelStyle}>Lista de Parceiros (separados por vírgula)</label>
        <textarea
          style={textareaStyle}
          value={config.parceiros}
          onChange={(e) => this.updateField('parceiros', e.target.value)}
        />

        <div style={sectionTitleStyle}>Financiamento</div>
        {(config.financiadores || []).map((f, i) => renderCard(f, `Financiador #${i + 1}`, updateFinanciador, removeFinanciador))}
        <button 
          style={{ ...buttonStyle, backgroundColor: '#7a8a6a', marginBottom: '20px', display: 'block', width: 'auto', padding: '10px 20px' }}
          onClick={addFinanciador}
        >
          + Adicionar Financiador
        </button>

        <div style={sectionTitleStyle}>Apoio</div>
        {(config.apoios || []).map((f, i) => renderCard(f, `Apoio #${i + 1}`, updateApoio, removeApoio))}
        <button 
          style={{ ...buttonStyle, backgroundColor: '#7a8a6a', marginBottom: '20px', display: 'block', width: 'auto', padding: '10px 20px' }}
          onClick={addApoio}
        >
          + Adicionar Apoio
        </button>
      </div>
    );
  };

  render() {
    const { onClose, tipo } = this.props;
    const { carregando } = this.state;

    const titulos = {
      hero: 'Editar Texto Principal',
      sobre: 'Editar Sobre o Projeto',
      rodape: 'Editar Informações de Rodapé',
    };

    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h2 style={titleStyle}>{titulos[tipo]}</h2>

          {tipo === 'hero' && this.renderHeroForm()}
          {tipo === 'sobre' && this.renderSobreForm()}
          {tipo === 'rodape' && this.renderRodapeForm()}

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
