import React, { useState, useEffect } from 'react';
import { Download, Map, Loader2 } from 'lucide-react';
import headerImage from '../assets/educativa_header.jpg';

export function FichaEducativa() {
  const [regiones, setRegiones] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/exportar/ficha-pdf/regiones')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar regiones');
        return res.json();
      })
      .then(data => {
        if (data && data.regiones) {
          setRegiones(data.regiones);
          if (data.regiones.length > 0) {
            setSelectedRegion(data.regiones[0]);
          }
        }
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar las regiones.');
        // Fallback for UI if API is not yet running locally
        setRegiones(["AMAZONAS", "ANCASH", "APURIMAC", "AREQUIPA", "AYACUCHO"]);
        setSelectedRegion("AMAZONAS");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!selectedRegion) {
      alert("Por favor seleccione una región primero.");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/exportar/ficha-pdf?region=${encodeURIComponent(selectedRegion)}`);
      
      if (!response.ok) {
        throw new Error('Error al generar el PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      let filename = `Ficha_Educativa_${selectedRegion}.pdf`;
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al descargar el archivo. Por favor intente nuevamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {isDownloading && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <Loader2 className="animate-spin" size={64} style={{ marginBottom: '16px' }} />
          <h2 style={{ color: 'white', marginBottom: '8px' }}>Generando archivo PDF...</h2>
          <p style={{ color: '#ddd' }}>Por favor espere, esto puede tomar unos segundos.</p>
        </div>
      )}

      <div className="inicio-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
        {/* Header */}
        <div className="header" style={{ justifyContent: 'center', position: 'relative' }}>
          <h1 style={{ fontSize: '28px', textAlign: 'center', flex: 1, margin: 0 }}>Ficha Educativa Regional</h1>
        </div>

        <div className="inicio-content" style={{ padding: '40px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px', maxWidth: '1200px', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
            
            {/* Decorative Header Image */}
            <div style={{ flex: '1 1 400px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <img src={headerImage} alt="Ficha Educativa" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
            </div>

            {/* Controls Card */}
            <div style={{ flex: '1 1 400px', backgroundColor: 'var(--card-bg)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ color: 'var(--primary-color)', fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Map /> Descargar Ficha por Región
              </h2>
              <p style={{ color: '#555', fontSize: '16px' }}>
                Seleccione una región para descargar el reporte detallado en formato PDF con los indicadores educativos clave.
              </p>
              
              {loading ? (
                 <p>Cargando regiones...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="filter-group">
                    <label style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Región</label>
                    <select 
                      value={selectedRegion} 
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      style={{ padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', backgroundColor: '#f9f9f9' }}
                    >
                      {regiones.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button 
                    className="btn-primary"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '10px', 
                      padding: '12px 24px', 
                      fontSize: '16px',
                      borderRadius: '6px',
                      height: '48px',
                      transition: 'background-color 0.2s',
                      width: '100%',
                      cursor: 'pointer',
                      border: 'none',
                      color: 'white'
                    }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    <Download size={20} />
                    Descargar Ficha PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
