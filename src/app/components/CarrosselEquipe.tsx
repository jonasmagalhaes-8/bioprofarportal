import React from 'react';
import { MembroEquipeModel } from '../models/MembroEquipeModel';

type CSS = React.CSSProperties;

interface CarrosselEquipeProps {
  membros: MembroEquipeModel[];
  tema: number;
  isDestaque?: boolean;
}

export class CarrosselEquipe extends React.Component<CarrosselEquipeProps> {
  state = {
    indiceAtual: 0,
    isMobile: window.innerWidth <= 768,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 });
  };

  proximoSlide = () => {
    const { membros } = this.props;
    const { isMobile } = this.state;
    const itemsPorPagina = isMobile ? 1 : 3;
    const totalPaginas = Math.ceil(membros.length / itemsPorPagina);
    this.setState((prevState) => ({
      indiceAtual: (prevState.indiceAtual + 1) % totalPaginas,
    }));
  };

  slideAnterior = () => {
    const { membros } = this.props;
    const { isMobile } = this.state;
    const itemsPorPagina = isMobile ? 1 : 3;
    const totalPaginas = Math.ceil(membros.length / itemsPorPagina);
    this.setState((prevState) => ({
      indiceAtual: prevState.indiceAtual === 0 ? totalPaginas - 1 : prevState.indiceAtual - 1,
    }));
  };

  irParaPagina = (indice: number) => {
    this.setState({ indiceAtual: indice });
  };

  render() {
    const { membros, tema, isDestaque } = this.props;
    const { isMobile } = this.state;

    if (!membros || membros.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#7a8a6a' }}>
          Nenhum membro cadastrado
        </div>
      );
    }

    const itemsPorPagina = isMobile ? 1 : 3;
    const inicio = this.state.indiceAtual * itemsPorPagina;
    const membrosParaExibir = membros.slice(inicio, inicio + itemsPorPagina);
    const totalPaginas = Math.ceil(membros.length / itemsPorPagina);

    return (
      <div style={{ position: 'relative', marginBottom: '60px', overflow: 'hidden' }}>
        {totalPaginas > 1 && (
          <button
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              backgroundColor: '#7a8a6a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '18px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={this.slideAnterior}
          >
            ‹
          </button>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px',
          padding: '0 20px',
          alignItems: 'start'
        }}>
          {membrosParaExibir.map((membro) => {
            const cardStyle: CSS = {
              padding: '25px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
            };

            if (tema === 1) {
              Object.assign(cardStyle, {
                backgroundColor: '#ffffff',
                border: '2px solid #e8ddc5',
              });
            } else if (tema === 2) {
              Object.assign(cardStyle, {
                backgroundColor: '#fef9f0',
                border: '2px solid #e8ddc5',
              });
            } else if (tema === 3) {
              Object.assign(cardStyle, {
                backgroundColor: '#ffffff',
                borderLeft: '4px solid #7a8a6a',
              });
            } else if (tema === 4) {
              Object.assign(cardStyle, {
                backgroundColor: '#ffffff',
                border: '2px solid #bdc3c7',
              });
            } else {
              Object.assign(cardStyle, {
                backgroundColor: '#2a3526',
                color: '#e8ddc5',
              });
            }

            const nomeColor = tema === 5 ? '#b8c7a8' : '#4a5d3c';
            const cargoColor = tema === 5 ? '#9aaa8a' : '#7a8a6a';

            return (
              <div key={membro.id} style={cardStyle}>
                <img
                  src={membro.fotoUrl}
                  alt={membro.nome}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 15px',
                    border: '4px solid #7a8a6a',
                  }}
                />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: nomeColor }}>
                  {membro.nome}
                </h3>
                <p style={{ fontSize: '14.5px', color: cargoColor, marginBottom: '8px', fontWeight: '400' }}>
                  {membro.cargo}
                </p>
                <p style={{ fontSize: '13px', color: cargoColor, marginBottom: '10px' }}>
                  {membro.instituicao}
                </p>
                <p style={{ fontSize: '14.5px', lineHeight: '1.6', marginBottom: '10px' }}>
                  {membro.descricao}
                </p>
                {membro.lattes && (
                  <a
                    href={membro.lattes}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '12px',
                      color: '#7a8a6a',
                      textDecoration: 'underline',
                    }}
                  >
                    Currículo Lattes
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {totalPaginas > 1 && (
          <button
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              backgroundColor: '#7a8a6a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '18px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={this.proximoSlide}
          >
            ›
          </button>
        )}

        {totalPaginas > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '20px',
          }}>
            {Array.from({ length: totalPaginas }).map((_, index) => (
              <button
                key={index}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: index === this.state.indiceAtual ? '#4a5d3c' : '#e8ddc5',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background-color 0.3s',
                }}
                onClick={() => this.irParaPagina(index)}
                aria-label={`Ir para página ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}
