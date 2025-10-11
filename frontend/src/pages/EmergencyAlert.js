import React, { useState } from 'react';
// import './EmergencyAlert.css'
function EmergencyAlert() {
  const [statusText, setStatusText] = useState('Ready to send emergency alert');
  const [locationInfo, setLocationInfo] = useState('');

  const EMERGENCY_NUMBER = '8262975733';

  const getLocationAndAlert = () => {
    setStatusText('Getting your location...');
    setLocationInfo('');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          sendEmergencyAlert(lat, lng, accuracy);
        },
        (error) => {
          setStatusText('❌ Error getting location. Please enable location services.');
          console.log('Geolocation error:', error);
        }
      );
    } else {
      setStatusText('❌ Geolocation not supported by your browser.');
    }
  };

  const sendEmergencyAlert = (lat, lng, accuracy) => {
    const locationUrl = `https://maps.google.com/?q=${lat},${lng}`;
    const timestamp = new Date().toLocaleString();

    setLocationInfo(`
      <p><strong>✓ Location Captured</strong></p>
      <p><strong>Latitude:</strong> ${lat.toFixed(6)}</p>
      <p><strong>Longitude:</strong> ${lng.toFixed(6)}</p>
      <p><strong>Accuracy:</strong> ${accuracy.toFixed(2)}m</p>
      <p><strong>Time:</strong> ${timestamp}</p>
      <p><a href="${locationUrl}" target="_blank" rel="noopener noreferrer" style="color: #0D9488; text-decoration: none; font-weight: 600;">📍 View on Google Maps</a></p>
    `);

    setStatusText(`✓ Emergency alert sent to <strong>${EMERGENCY_NUMBER}</strong>`);

    const telLink = `tel:${EMERGENCY_NUMBER}`;
    window.location.href = telLink;
  };

  const styles = {
    wrapper: {
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      margin: 0
    },
    container: {
      background: '#FFFFFF',
      borderRadius: '1rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      width: '100%',
      overflow: 'hidden',
      border: '1px solid #E5E7EB'
    },
    header: {
      background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center'
    },
    h1: {
      fontSize: '2rem',
      marginBottom: '10px',
      margin: 0,
      fontWeight: 700
    },
    subtitle: {
      fontSize: '1rem',
      opacity: 0.9,
      margin: 0,
      fontWeight: 500
    },
    main: {
      padding: '2.5rem 2rem'
    },
    buttonSection: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '40px'
    },
    emergencyButton: {
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
      fontWeight: 700
    },
    buttonIcon: {
      fontSize: '48px'
    },
    buttonText: {
      fontSize: '20px'
    },
    statusSection: {
      background: '#F9FAFB',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '2rem'
    },
    statusText: {
      textAlign: 'center',
      color: '#111827',
      fontSize: '1rem',
      marginBottom: '15px',
      fontWeight: 500
    },
    locationInfo: {
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: '0.5rem',
      padding: '1rem',
      fontSize: '0.9rem'
    },
    infoSection: {
      borderTop: '1px solid #E5E7EB',
      paddingTop: '1.5rem'
    },
    h2: {
      fontSize: '1.1rem',
      color: '#111827',
      marginBottom: '1rem',
      fontWeight: 700
    },
    ul: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    li: {
      padding: '0.75rem 0',
      color: '#6B7280',
      borderBottom: '1px solid #E5E7EB',
      fontSize: '0.95rem'
    },
    footer: {
      background: '#F9FAFB',
      textAlign: 'center',
      padding: '1.25rem',
      color: '#9CA3AF',
      fontSize: '0.85rem',
      borderTop: '1px solid #E5E7EB'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.h1}>🚨 Emergency Alert System</h1>
          <p style={styles.subtitle}>Quick Access Emergency Button</p>
        </header>

        <main style={styles.main}>
          <section style={styles.buttonSection}>
            <button 
              style={styles.emergencyButton} 
              onClick={getLocationAndAlert}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(239, 68, 68, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.4)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
            >
              <span style={styles.buttonIcon}>🆘</span>  
              <span style={styles.buttonText}>EMERGENCY</span>
            </button>
          </section>

          <section style={styles.statusSection}>
            <div>
              <p style={styles.statusText} dangerouslySetInnerHTML={{ __html: statusText }}></p>
              {locationInfo && (
                <div style={styles.locationInfo} dangerouslySetInnerHTML={{ __html: locationInfo }}></div>
              )}
            </div>
          </section>

          <section style={styles.infoSection}>
            <h2 style={styles.h2}>ℹ️ Information</h2>
            <ul style={styles.ul}>
              <li style={{...styles.li}}>
                <strong style={{color: '#111827'}}>Emergency Number:</strong> {EMERGENCY_NUMBER}
              </li>
              <li style={{...styles.li}}>
                <strong style={{color: '#111827'}}>GPS Location:</strong> Will be captured and sent
              </li>
              <li style={{...styles.li, borderBottom: 'none'}}>
                <strong style={{color: '#111827'}}>Action:</strong> Click the button in case of emergency
              </li>
            </ul>
          </section>
        </main>

        <footer style={styles.footer}>
          <p>&copy; 2025 Emergency Alert System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default EmergencyAlert; 