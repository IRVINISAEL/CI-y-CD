import React, { useState } from 'react';
import '../styles/PaymentDetail.css';

const PaymentDetail = ({ payment, user, onBack, onPaymentSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('transferencia');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Aquí iría la llamada real a la API
      // const response = await paymentsAPI.processPayment(payment._id, {
      //   metodoPago: selectedMethod,
      //   fechaPago: new Date().toISOString()
      // });

      // Simular éxito
      alert('¡Pago procesado exitosamente!');
      onPaymentSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Podrías agregar un toast de confirmación aquí
  };

  const paymentMethods = [
    {
      id: 'transferencia',
      name: 'Transferencia Bancaria',
      description: 'Transferencia SPEI o interbancaria',
      icon: '🏦'
    },
    {
      id: 'tarjeta',
      name: 'Tarjeta de Crédito/Débito',
      description: 'Pago con tarjeta Visa, Mastercard',
      icon: '💳'
    },
    {
      id: 'efectivo',
      name: 'Pago en Efectivo',
      description: 'Pago en ventanilla bancaria',
      icon: '💰'
    }
  ];

  if (processing) {
    return (
      <div className="payment-detail-processing">
        <div className="payment-detail-processing-content">
          <div className="payment-detail-processing-spinner"></div>
          <h3>Procesando Pago</h3>
          <p>Estamos procesando tu pago. Por favor no cierres esta ventana.</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
            Esto puede tomar unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-detail-page">
      <div className="payment-detail-content">
        {/* Header */}
        <div className="payment-detail-header">
          <button onClick={onBack} className="payment-detail-back-button">
            ← Volver a pagos pendientes
          </button>
          <h1 className="payment-detail-title">Confirmar Pago</h1>
          <p className="payment-detail-subtitle">
            Revisa y confirma los detalles de tu pago
          </p>
        </div>

        {/* Proceso de pago */}
        <div className="payment-detail-process">
          <div className="payment-detail-steps">
            <div className="payment-detail-step active">
              <div className="payment-detail-step-icon">1</div>
              <span className="payment-detail-step-label">Confirmar Datos</span>
            </div>
            <div className="payment-detail-step">
              <div className="payment-detail-step-icon">2</div>
              <span className="payment-detail-step-label">Seleccionar Método</span>
            </div>
            <div className="payment-detail-step">
              <div className="payment-detail-step-icon">3</div>
              <span className="payment-detail-step-label">Procesar Pago</span>
            </div>
            <div className="payment-detail-step">
              <div className="payment-detail-step-icon">4</div>
              <span className="payment-detail-step-label">Comprobante</span>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{ 
              background: '#fee2e2', 
              color: '#dc2626', 
              padding: '1rem', 
              borderRadius: '12px', 
              marginBottom: '2rem',
              border: '2px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          {/* Información del estudiante */}
          <div className="payment-detail-sections">
            <div className="payment-detail-section">
              <h3>👤 Información del Estudiante</h3>
              <div className="payment-detail-grid">
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Nombre Completo</span>
                  <span className="payment-detail-value">{user.nombre}</span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Matrícula</span>
                  <span className="payment-detail-value">{user.matricula}</span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Carrera</span>
                  <span className="payment-detail-value">{user.carrera}</span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Cuatrimestre</span>
                  <span className="payment-detail-value">{user.cuatrimestre}</span>
                </div>
              </div>
            </div>

            {/* Detalles del pago */}
            <div className="payment-detail-section">
              <h3>💰 Detalles del Pago</h3>
              <div className="payment-detail-grid">
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Concepto de Pago</span>
                  <span className="payment-detail-value">{payment.concepto}</span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Referencia</span>
                  <code 
                    className="payment-detail-value payment-detail-reference"
                    onClick={() => copyToClipboard(payment.referencia)}
                    title="Click para copiar"
                  >
                    {payment.referencia}
                  </code>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Monto Total</span>
                  <span className="payment-detail-value payment-detail-amount">
                    {formatCurrency(payment.monto)}
                  </span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Fecha de Vencimiento</span>
                  <span className="payment-detail-value">{formatDate(payment.fechaVencimiento)}</span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Cuatrimestre</span>
                  <span className="payment-detail-value">{payment.cuatrimestre}</span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Estado</span>
                  <span className="payment-detail-value" style={{ 
                    background: '#fef3c7', 
                    color: '#92400e', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '20px',
                    fontWeight: '700',
                    fontSize: '0.9rem'
                  }}>
                    Pendiente
                  </span>
                </div>
              </div>
            </div>

            {/* Métodos de pago */}
            <div className="payment-detail-section">
              <h3>💳 Método de Pago</h3>
              <div className="payment-detail-methods">
                <div className="payment-detail-methods-grid">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`payment-detail-method ${selectedMethod === method.id ? 'selected' : ''}`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="payment-detail-method-icon">{method.icon}</div>
                      <div className="payment-detail-method-name">{method.name}</div>
                      <div className="payment-detail-method-description">{method.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="payment-detail-actions">
            <button 
              onClick={handlePayment}
              disabled={processing}
              className="payment-detail-confirm-button"
            >
              💳 Confirmar y Proceder al Pago
            </button>
            
            <button 
              onClick={onBack}
              disabled={processing}
              className="payment-detail-cancel-button"
            >
              ↩️ Cancelar
            </button>
          </div>

          {/* Nota importante */}
          <div className="payment-detail-notice">
            <p>
              <strong>Importante:</strong> Al confirmar el pago, se generará un comprobante oficial. 
              Este proceso es irreversible. Verifique que toda la información sea correcta antes de continuar.
              <br /><br />
              <strong>Tiempo de procesamiento:</strong> Los pagos pueden tomar de 1 a 24 horas en reflejarse en el sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;