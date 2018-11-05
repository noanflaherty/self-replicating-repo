import React from 'react';

export const LoadingPage = () => {
  const containerStyle = {
    maxWidth: '550px',
    marginTop: '150px',
    marginBottom: '50px',
  };

  return (
    <div className="container" style={containerStyle}>
      <div className="row">
        <div className="col-md-12 center-block text-center">
          <h2>Authenticating...</h2>
          <p>This should only take a second.</p>
        </div>
      </div>
    </div>
  );
};
