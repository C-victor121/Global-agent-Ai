'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface IWhatsAppUserConfig {
  phoneNumberId: string;
  trialStartDate?: string;
  trialEndDate?: string;
  // Añade otros campos que esperas de tu config
}

const ConnectWhatsAppButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userConfig, setUserConfig] = useState<IWhatsAppUserConfig | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [trialExpired, setTrialExpired] = useState<boolean>(false);

  const fetchUserConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<IWhatsAppUserConfig>('/api/whatsapp/config');
      setUserConfig(response.data);
      if (response.data.trialEndDate) {
        const endDate = new Date(response.data.trialEndDate);
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 0) {
          setDaysRemaining(0);
          setTrialExpired(true);
        } else {
          setDaysRemaining(diffDays);
          setTrialExpired(false);
        }
      } else {
        // Si no hay trialEndDate, podría ser que aún no ha conectado WhatsApp
        setDaysRemaining(null);
        setTrialExpired(false);
      }
    } catch (err: any) {
      if (err.response?.status !== 404) { // No mostrar error si es solo que no hay config
        console.warn('No se pudo cargar la configuración de WhatsApp:', err.response?.data?.message || err.message);
        // setError('No se pudo cargar la configuración de WhatsApp.');
      }
      setUserConfig(null); // Asegurarse de limpiar config si hay error
      setDaysRemaining(null);
      setTrialExpired(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUserConfig();
  }, [fetchUserConfig]);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/whatsapp/connect');
      const { facebookLoginUrl } = response.data;

      if (facebookLoginUrl) {
        window.location.href = facebookLoginUrl;
      } else {
        setError('No se pudo obtener la URL de conexión de WhatsApp.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Error al conectar con WhatsApp:', err);
      setError(err.response?.data?.message || 'Ocurrió un error al intentar conectar con WhatsApp.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const whatsappStatus = urlParams.get('whatsapp_status');
    const whatsappMessage = urlParams.get('whatsapp_message');

    if (whatsappStatus === 'success') {
      console.log('Conexión con WhatsApp exitosa:', whatsappMessage);
      // Forzar la recarga de la configuración del usuario para obtener las fechas de prueba
      fetchUserConfig(); 
    } else if (whatsappStatus === 'error') {
      setError(whatsappMessage || 'Hubo un error durante la conexión con WhatsApp.');
    }
    if (whatsappStatus) {
      const newUrl = window.location.pathname + window.location.search.replace(/[?&]whatsapp_status=[^&]+/, '').replace(/[?&]whatsapp_message=[^&]+/, '');
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [fetchUserConfig]);

  if (isLoading && !userConfig) {
    return <p>Cargando configuración...</p>;
  }

  if (userConfig && userConfig.phoneNumberId) {
    return (
      <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <p style={{ color: 'green', fontWeight: 'bold' }}>✅ WhatsApp Business Conectado.</p>
        {/* <p>Número de teléfono: {userConfig.phoneNumberId}</p> */}
        {daysRemaining !== null && !trialExpired && (
          <p>Te quedan <span style={{ fontWeight: 'bold' }}>{daysRemaining}</span> día(s) de prueba gratuita.</p>
        )}
        {trialExpired && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            Tu período de prueba gratuita ha finalizado. Por favor, realiza el pago para continuar.
          </p>
          // Aquí podrías añadir un botón o enlace para el pago
        )}
        {/* Podrías añadir un botón para desconectar o reconfigurar */}
      </div>
    );
  }

  return (
    <div>
      <button 
        onClick={handleConnect} 
        disabled={isLoading}
        style={{
          padding: '10px 15px',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          backgroundColor: isLoading ? '#ccc' : '#25D366',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {isLoading ? 'Conectando...' : 'Conectar WhatsApp Business'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
      {!userConfig && !isLoading && (
         <p style={{ fontSize: '12px', marginTop: '10px' }}>
           Conecta tu cuenta de WhatsApp Business para activar tu prueba gratuita de 15 días.
         </p>
      )}
    </div>
  );
};

export default ConnectWhatsAppButton;