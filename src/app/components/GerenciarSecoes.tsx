import React from 'react';
import { SecaoCustomModel } from '../models/SecaoCustomModel';
import { controllerListarSecoes, controllerDeletarSecao, controllerAtualizarOrdemSecoes } from '../controllers/SecaoCustomController';

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
  zIndex: 1001,
  overflowY: 'auto',
  padding: '20px',
};

const modalStyle: CSS = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '8px',
  maxWidth: '1000px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const titleStyle: CSS = {
  margin: '0 0 25px 0',
  color: '#4a5d3c',
  fontSize: '28px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '15px',
};

const addButtonStyle: CSS = {
  padding: '10px 20px',
  backgroundColor: '#4a5d3c',
  color: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

const secaoItemStyle: CSS = {
  padding: '20px',
  marginBottom: '15px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  border: '2px solid #e8ddc5',
  cursor: 'grab',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '15px',
};

const secaoItemDraggingStyle: CSS = {
  padding: '20px',
  marginBottom: '15px',
  backgroundColor: '#e8ddc5',
  borderRadius: '8px',
  border: '2px dashed #4a5d3c',
  cursor: 'grabbing',
  opacity: 0.5,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '15px',
};

const secaoInfoStyle: CSS = {
  flex: 1,
  minWidth: '200px',
};

const actionButtonStyle: CSS = {
  padding: '8px 16px',
  margin: '0 5px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 'bold',
};

const editButtonStyle: CSS = Object.assign({}, actionButtonStyle, {
  backgroundColor: '#7a8a6a',
  color: '#ffffff',
});

const deleteButtonStyle: CSS = Object.assign({}, actionButtonStyle, {
  backgroundColor: '#c44',
  color: '#ffffff',
});

const buttonContainerStyle: CSS = {
  display: 'flex',
  gap: '10px',
  marginTop: '30px',
  justifyContent: 'center',
};

const saveButtonStyle: CSS = {
  padding: '12px 30px',
  backgroundColor: '#4a5d3c',
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

const closeButtonStyle: CSS = {
  padding: '12px 30px',
  border: '2px solid #4a5d3c',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
  color: '#4a5d3c',
  fontSize: '14px',
  fontWeight: 'bold',
};

const dragHandleStyle: CSS = {
  fontSize: '20px',
  marginRight: '15px',
  color: '#7a8a6a',
  cursor: 'grab',
};

export class GerenciarSecoes extends React.Component<{
  onClose: () => void;
  onEdit: (secao: SecaoCustomModel) => void;
  onAdd: () => void;
  onUpdate: () => void;
}> {
  state = {
    secoes: [] as SecaoCustomModel[],
    carregando: true,
    draggedIndex: null as number | null,
  };

  componentDidMount() {
    this.carregarSecoes();
  }

  carregarSecoes = async () => {
    const response = await controllerListarSecoes();
    this.setState({
      secoes: response.response || [],
      carregando: false,
    });
  };

  handleDeletar = async (id: number, titulo: string) => {
    if (confirm(`Tem certeza que deseja deletar a seção "${titulo}"?`)) {
      await controllerDeletarSecao(id);
      await this.carregarSecoes();
      this.props.onUpdate();
    }
  };

  handleDragStart = (e: React.DragEvent, index: number) => {
    this.setState({ draggedIndex: index });
    e.dataTransfer.effectAllowed = 'move';
  };

  handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const { draggedIndex, secoes } = this.state;

    if (draggedIndex === null || draggedIndex === dropIndex) {
      this.setState({ draggedIndex: null });
      return;
    }

    const newSecoes = Array.from(secoes);
    const draggedItem = newSecoes[draggedIndex];
    newSecoes.splice(draggedIndex, 1);
    newSecoes.splice(dropIndex, 0, draggedItem);

    const reordered = newSecoes.map((secao, index) =>
      Object.assign(new SecaoCustomModel(), secao, { ordem: index })
    );

    this.setState({ secoes: reordered, draggedIndex: null });
  };

  handleDragEnd = () => {
    this.setState({ draggedIndex: null });
  };

  handleSalvar = async () => {
    await controllerAtualizarOrdemSecoes(this.state.secoes);
    this.props.onUpdate();
    this.props.onClose();
  };

  render() {
    const { onClose, onEdit, onAdd } = this.props;
    const { draggedIndex } = this.state;

    return (
      <div style={overlayStyle}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h2 style={titleStyle}>
            <span>Gerenciar Seções - Sobre o Projeto</span>
            <button style={addButtonStyle} onClick={onAdd}>
              + Nova Seção
            </button>
          </h2>

          <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
            Arraste as seções para reordenar. Cada seção pode ser de texto livre ou lista de itens.
          </p>

          {this.state.carregando ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
          ) : (
            <div>
              {this.state.secoes.map((secao, index) => (
                <div
                  key={secao.id}
                  draggable
                  onDragStart={(e) => this.handleDragStart(e, index)}
                  onDragOver={this.handleDragOver}
                  onDrop={(e) => this.handleDrop(e, index)}
                  onDragEnd={this.handleDragEnd}
                  style={draggedIndex === index ? secaoItemDraggingStyle : secaoItemStyle}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <span style={dragHandleStyle}>☰</span>
                    <div style={secaoInfoStyle}>
                      <strong style={{ fontSize: '16px', color: '#4a5d3c' }}>
                        {secao.titulo}
                      </strong>
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                        Tipo: {secao.tipo === 'lista' ? 'Lista' : 'Texto'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      style={editButtonStyle}
                      onClick={() => onEdit(secao)}
                    >
                      Editar
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => this.handleDeletar(secao.id, secao.titulo)}
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={buttonContainerStyle}>
            <button style={closeButtonStyle} onClick={onClose}>
              Cancelar
            </button>
            <button style={saveButtonStyle} onClick={this.handleSalvar}>
              Salvar Ordem
            </button>
          </div>
        </div>
      </div>
    );
  }
}
