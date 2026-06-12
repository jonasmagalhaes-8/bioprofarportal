import React from 'react';

type CSS = React.CSSProperties;

interface CarrosselItemsProps {
  children: React.ReactNode[];
}

interface CarrosselItemsState {
  currentIndex: number;
}

const carrosselContainerStyle: CSS = {
  position: 'relative',
  width: '100%',
  marginBottom: '60px',
};

const carrosselWrapperStyle: CSS = {
  overflow: 'hidden',
  width: '100%',
};

const carrosselTrackStyle = (currentIndex: number, totalItems: number): CSS => ({
  display: 'flex',
  transition: 'transform 0.3s ease-in-out',
  transform: `translateX(-${currentIndex * 100}%)`,
});

const carrosselItemStyle: CSS = {
  minWidth: '100%',
  padding: '0 10px',
  boxSizing: 'border-box',
};

const dotsContainerStyle: CSS = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '20px',
};

const dotStyle = (isActive: boolean): CSS => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: isActive ? '#4a5d3c' : '#e8ddc5',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  transition: 'background-color 0.3s',
});

const navButtonStyle = (direction: 'left' | 'right'): CSS => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [direction]: '5px',
  backgroundColor: 'rgba(74, 93, 60, 0.8)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
  fontSize: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
});

export class CarrosselItems extends React.Component<CarrosselItemsProps, CarrosselItemsState> {
  state: CarrosselItemsState = {
    currentIndex: 0,
  };

  goToSlide = (index: number) => {
    this.setState({ currentIndex: index });
  };

  goToPrevious = () => {
    const { children } = this.props;
    const { currentIndex } = this.state;
    const newIndex = currentIndex === 0 ? children.length - 1 : currentIndex - 1;
    this.setState({ currentIndex: newIndex });
  };

  goToNext = () => {
    const { children } = this.props;
    const { currentIndex } = this.state;
    const newIndex = currentIndex === children.length - 1 ? 0 : currentIndex + 1;
    this.setState({ currentIndex: newIndex });
  };

  render() {
    const { children } = this.props;
    const { currentIndex } = this.state;

    if (!children || children.length === 0) {
      return null;
    }

    return (
      <div style={carrosselContainerStyle}>
        {children.length > 1 && (
          <button style={navButtonStyle('left')} onClick={this.goToPrevious}>
            ‹
          </button>
        )}

        <div style={carrosselWrapperStyle}>
          <div style={carrosselTrackStyle(currentIndex, children.length)}>
            {children.map((child, index) => (
              <div key={index} style={carrosselItemStyle}>
                {child}
              </div>
            ))}
          </div>
        </div>

        {children.length > 1 && (
          <>
            <button style={navButtonStyle('right')} onClick={this.goToNext}>
              ›
            </button>

            <div style={dotsContainerStyle}>
              {children.map((_, index) => (
                <button
                  key={index}
                  style={dotStyle(index === currentIndex)}
                  onClick={() => this.goToSlide(index)}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}
