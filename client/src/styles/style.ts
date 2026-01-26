export const containerStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 16px',
  fontFamily: 'Roboto, sans-serif',
};

export const buttonStyles = (variant: 'primary' | 'secondary' | 'danger') => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  backgroundColor: {
    primary: '#1E88E5',
    secondary: '#4CAF50',
    danger: '#F44336',
  }[variant],
  color: 'white',
});

export const titleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  color: '#212121',
  marginBottom: '16px',
};
