class PaymentSubject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  async notify(event, data) {
    console.log(`🔔 Notificando evento: ${event} a ${this.observers.length} observadores`);
    
    const notifications = this.observers.map(observer => 
      observer.update(event, data).catch(error => {
        console.error(`❌ Error en observador: ${error.message}`);
        return null;
      })
    );
    
    await Promise.allSettled(notifications);
  }
}

class EmailNotificationObserver {
  async update(event, data) {
    if (event === 'payment_processed') {
      await this.sendPaymentConfirmation(data);
    } else if (event === 'payment_due') {
      await this.sendPaymentReminder(data);
    }
  }

  async sendPaymentConfirmation(paymentData) {
    console.log(`📧 ENVIANDO EMAIL: Confirmación de pago a ${paymentData.student?.email}`);
    console.log(`   Concepto: ${paymentData.concepto}`);
    console.log(`   Monto: $${paymentData.monto}`);
    console.log(`   Referencia: ${paymentData.comprobante?.numero}`);
    // Aquí iría la integración real con servicio de email
  }

  async sendPaymentReminder(paymentData) {
    console.log(`⏰ ENVIANDO RECORDATORIO: Pago pendiente a ${paymentData.student?.email}`);
    console.log(`   Concepto: ${paymentData.concepto}`);
    console.log(`   Monto: $${paymentData.monto}`);
    console.log(`   Vence: ${paymentData.fechaVencimiento}`);
  }
}

class AnalyticsObserver {
  async update(event, data) {
    if (event === 'payment_processed') {
      await this.recordPaymentAnalytics(data);
    }
  }

  async recordPaymentAnalytics(paymentData) {
    console.log(`📊 REGISTRANDO ANALYTICS: Pago ${paymentData._id}`);
    console.log(`   Método: ${paymentData.metodoPago}`);
    console.log(`   Carrera: ${paymentData.student?.carrera}`);
    console.log(`   Cuatrimestre: ${paymentData.student?.cuatrimestre}`);
    // Aquí iría la integración con Google Analytics o similar
  }
}

class LoggingObserver {
  async update(event, data) {
    console.log(`📝 LOG: Evento ${event}`, {
      paymentId: data._id,
      student: data.student?.matricula,
      amount: data.monto,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = { 
  PaymentSubject, 
  EmailNotificationObserver, 
  AnalyticsObserver, 
  LoggingObserver 
};