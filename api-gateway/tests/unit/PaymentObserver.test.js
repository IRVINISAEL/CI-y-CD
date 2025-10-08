const { 
  PaymentSubject, 
  EmailNotificationObserver, 
  AnalyticsObserver 
} = require('../../controllers/patterns/behavioral/PaymentObserver');

// Mock de console.error para evitar output en tests
console.error = jest.fn();

describe('PaymentObserver Tests', () => {
  let paymentSubject;
  let emailObserver;
  let analyticsObserver;

  beforeEach(() => {
    paymentSubject = new PaymentSubject();
    emailObserver = new EmailNotificationObserver();
    analyticsObserver = new AnalyticsObserver();
    
    // Limpiar observers antes de cada test
    paymentSubject.observers = [];
    paymentSubject.addObserver(emailObserver);
    paymentSubject.addObserver(analyticsObserver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('debe notificar a todos los observadores cuando ocurre un pago', async () => {
    const paymentData = {
      _id: '123',
      concepto: 'Colegiatura Septiembre',
      monto: 8500,
      comprobante: { numero: 'COMP-001' },
      student: { 
        email: 'test@utt.edu.mx', 
        carrera: 'Enfermería',
        nombre: 'Test Student'
      }
    };

    // Espiar los métodos de los observadores
    const emailSpy = jest.spyOn(emailObserver, 'update');
    const analyticsSpy = jest.spyOn(analyticsObserver, 'update');

    await paymentSubject.notify('payment_processed', paymentData);

    expect(emailSpy).toHaveBeenCalledWith('payment_processed', paymentData);
    expect(analyticsSpy).toHaveBeenCalledWith('payment_processed', paymentData);
  });

  test('debe manejar errores en observadores sin romper el flujo', async () => {
    const brokenObserver = {
      update: jest.fn().mockRejectedValue(new Error('Observer failed'))
    };

    paymentSubject.addObserver(brokenObserver);

    // Este test debería pasar sin lanzar excepciones
    await expect(paymentSubject.notify('payment_processed', {}))
      .resolves.not.toThrow();

    // Verificar que se llamó a console.error
    expect(console.error).toHaveBeenCalledWith(
      '❌ Error en observador: Observer failed'
    );
  });

  test('debe enviar confirmación de email para payment_processed', async () => {
    const paymentData = {
      _id: 'email-test',
      concepto: 'Colegiatura Test',
      monto: 7500,
      comprobante: { numero: 'EMAIL-001' },
      student: { 
        email: 'student@test.com',
        nombre: 'Test Student'
      }
    };

    const consoleSpy = jest.spyOn(console, 'log');

    await emailObserver.update('payment_processed', paymentData);

    expect(consoleSpy).toHaveBeenCalledWith(
      '📧 ENVIANDO EMAIL: Confirmación de pago a student@test.com'
    );
  });

  test('debe enviar recordatorio para payment_due', async () => {
    const paymentData = {
      concepto: 'Colegiatura Vencida',
      monto: 8000,
      fechaVencimiento: '2025-10-01',
      student: { 
        email: 'student@test.com',
        nombre: 'Test Student'
      }
    };

    const consoleSpy = jest.spyOn(console, 'log');

    await emailObserver.update('payment_due', paymentData);

    expect(consoleSpy).toHaveBeenCalledWith(
      '⏰ ENVIANDO RECORDATORIO: Pago pendiente a student@test.com'
    );
  });

  test('debe registrar analytics para payment_processed', async () => {
    const paymentData = {
      _id: 'analytics-test',
      concepto: 'Analytics Test',
      monto: 9000,
      metodoPago: 'transferencia',
      student: { 
        carrera: 'Enfermería',
        cuatrimestre: '3ro'
      }
    };

    const consoleSpy = jest.spyOn(console, 'log');

    await analyticsObserver.update('payment_processed', paymentData);

    expect(consoleSpy).toHaveBeenCalledWith(
      '📊 REGISTRANDO ANALYTICS: Pago analytics-test'
    );
  });

  test('debe agregar y remover observadores correctamente', () => {
    const newObserver = { update: jest.fn() };
    
    expect(paymentSubject.observers).toHaveLength(2);
    
    paymentSubject.addObserver(newObserver);
    expect(paymentSubject.observers).toHaveLength(3);
    
    paymentSubject.removeObserver(newObserver);
    expect(paymentSubject.observers).toHaveLength(2);
  });
});