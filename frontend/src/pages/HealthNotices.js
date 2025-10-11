import React from 'react';

const HealthNotices = () => {
  return (
    <div className="page-container" style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
      <h1>Health Notices</h1>
      <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
        This is where the latest health notices will be displayed.
      </p>
    </div>
  );
};

export default HealthNotices;