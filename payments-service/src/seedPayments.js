const mongoose = require('mongoose');
const Student = require('./models/Student');
const Payment = require('./models/Payment');
const Career = require('./models/Career');
const Calendar = require('./models/Calendar');
require('dotenv').config();

const seedPayments = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB - Payments Service');

    // Limpiar datos existentes
    await Student.deleteMany({});
    await Payment.deleteMany({});
    await Career.deleteMany({});
    await Calendar.deleteMany({});
    console.log('✅ Datos existentes eliminados');

    // Crear carreras (MongoDB generará los IDs automáticamente)
    const careers = await Career.insertMany([
      {
        nombre: 'TSU Enfermería',
        nivel: 'TSU',
        duracion: '2 años',
        costoCuatrimestre: 8500,
        activa: true
      },
      {
        nombre: 'Licenciatura en Enfermería',
        nivel: 'Licenciatura',
        duracion: '4 años',
        costoCuatrimestre: 9500,
        activa: true
      },
      {
        nombre: 'Ingeniería en Sistemas',
        nivel: 'Ingeniería',
        duracion: '4 años',
        costoCuatrimestre: 10000,
        activa: true
      },
      {
        nombre: 'Maestría en Enfermería',
        nivel: 'Maestría',
        duracion: '2 años',
        costoCuatrimestre: 12000,
        activa: true
      }
    ]);

    console.log('✅ Carreras creadas:', careers.length);

    // Crear estudiantes (MongoDB generará los IDs automáticamente)
    const students = await Student.insertMany([
      {
        matricula: '2023001',
        nombre: 'Juan Pérez García',
        carrera: 'TSU Enfermería',
        cuatrimestre: '3ro',
        email: 'juan.perez@utt.edu.mx',
        telefono: '555-123-4567',
        direccion: 'Av. Universidad 123'
      },
      {
        matricula: '2023002',
        nombre: 'María López Hernández',
        carrera: 'Licenciatura en Enfermería',
        cuatrimestre: '5to',
        email: 'maria.lopez@utt.edu.mx',
        telefono: '555-987-6543',
        direccion: 'Calle Knowledge 456'
      },
      {
        matricula: '2023003',
        nombre: 'Carlos Martínez Ruiz',
        carrera: 'Ingeniería en Sistemas',
        cuatrimestre: '7mo',
        email: 'carlos.martinez@utt.edu.mx',
        telefono: '555-456-7890',
        direccion: 'Blvd. Technology 789'
      },
      {
        matricula: 'admin001',
        nombre: 'Administrador del Sistema',
        carrera: 'Administración',
        cuatrimestre: 'N/A',
        email: 'admin@utt.edu.mx',
        telefono: '555-000-0000',
        direccion: 'Dirección Administrativa'
      }
    ]);

    console.log('✅ Estudiantes creados:', students.length);

    // Crear un mapa de estudiantes por matrícula para usar en los pagos
    const studentMap = {};
    students.forEach(student => {
      studentMap[student.matricula] = student._id;
    });

    // Crear calendario de pagos
    const today = new Date();
    const calendars = await Calendar.insertMany([
      {
        cuatrimestre: 'Septiembre-Diciembre 2025',
        carrera: 'TSU Enfermería',
        nivel: 'TSU',
        pagos: [
          {
            concepto: 'Inscripción/Reinscripción Anual',
            monto: 2000,
            fechaLimite: new Date('2025-08-15'),
            tipo: 'inscripcion'
          },
          {
            concepto: 'Colegiatura Septiembre',
            monto: 8500,
            fechaLimite: new Date('2025-09-05'),
            tipo: 'colegiatura'
          },
          {
            concepto: 'Colegiatura Octubre',
            monto: 8500,
            fechaLimite: new Date('2025-10-05'),
            tipo: 'colegiatura'
          },
          {
            concepto: 'Colegiatura Noviembre',
            monto: 8500,
            fechaLimite: new Date('2025-11-05'),
            tipo: 'colegiatura'
          }
        ],
        vigente: true
      },
      {
        cuatrimestre: 'Septiembre-Diciembre 2025',
        carrera: 'Licenciatura en Enfermería',
        nivel: 'Licenciatura',
        pagos: [
          {
            concepto: 'Inscripción/Reinscripción Anual',
            monto: 2000,
            fechaLimite: new Date('2025-08-15'),
            tipo: 'inscripcion'
          },
          {
            concepto: 'Colegiatura Septiembre',
            monto: 9500,
            fechaLimite: new Date('2025-09-05'),
            tipo: 'colegiatura'
          },
          {
            concepto: 'Colegiatura Octubre',
            monto: 9500,
            fechaLimite: new Date('2025-10-05'),
            tipo: 'colegiatura'
          }
        ],
        vigente: true
      },
      {
        cuatrimestre: 'Septiembre-Diciembre 2025',
        carrera: 'Ingeniería en Sistemas',
        nivel: 'Ingeniería',
        pagos: [
          {
            concepto: 'Inscripción/Reinscripción Anual',
            monto: 2000,
            fechaLimite: new Date('2025-08-15'),
            tipo: 'inscripcion'
          },
          {
            concepto: 'Colegiatura Septiembre',
            monto: 10000,
            fechaLimite: new Date('2025-09-05'),
            tipo: 'colegiatura'
          },
          {
            concepto: 'Colegiatura Octubre',
            monto: 10000,
            fechaLimite: new Date('2025-10-05'),
            tipo: 'colegiatura'
          }
        ],
        vigente: true
      },
      {
        cuatrimestre: 'Septiembre-Diciembre 2025',
        carrera: 'Maestría en Enfermería',
        nivel: 'Maestría',
        pagos: [
          {
            concepto: 'Inscripción/Reinscripción Anual',
            monto: 2000,
            fechaLimite: new Date('2025-08-15'),
            tipo: 'inscripcion'
          },
          {
            concepto: 'Colegiatura Septiembre',
            monto: 12000,
            fechaLimite: new Date('2025-09-05'),
            tipo: 'colegiatura'
          }
        ],
        vigente: true
      }
    ]);

    console.log('✅ Calendarios de pagos creados:', calendars.length);

    // Crear pagos de prueba
    const payments = await Payment.insertMany([
      // Pagos para Juan Pérez (2023001) - TSU Enfermería
      {
        student: studentMap['2023001'],
        referencia: 'PEND-2023001-001',
        concepto: 'Colegiatura Septiembre 2025',
        monto: 8500,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-09-05'),
        estado: 'pendiente'
      },
      {
        student: studentMap['2023001'],
        referencia: 'PEND-2023001-002',
        concepto: 'Seguro Escolar Anual',
        monto: 500,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-09-10'),
        estado: 'pendiente'
      },
      {
        student: studentMap['2023001'],
        referencia: 'PEND-2023001-003',
        concepto: 'Colegiatura Octubre 2025',
        monto: 8500,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-10-05'),
        estado: 'pendiente'
      },
      {
        student: studentMap['2023001'],
        referencia: 'PAGADO-2023001-001',
        concepto: 'Inscripción Anual',
        monto: 2000,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-08-15'),
        fechaPago: new Date('2025-08-10'),
        estado: 'pagado',
        metodoPago: 'Transferencia',
        comprobante: {
          numero: 'COMP-2023001-001',
          fecha: new Date('2025-08-10')
        }
      },

      // Pagos para María López (2023002) - Licenciatura en Enfermería
      {
        student: studentMap['2023002'],
        referencia: 'PEND-2023002-001',
        concepto: 'Colegiatura Septiembre 2025',
        monto: 9500,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-09-05'),
        estado: 'pendiente'
      },
      {
        student: studentMap['2023002'],
        referencia: 'PEND-2023002-002',
        concepto: 'Material de Laboratorio',
        monto: 800,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-09-15'),
        estado: 'pendiente'
      },
      {
        student: studentMap['2023002'],
        referencia: 'PAGADO-2023002-001',
        concepto: 'Inscripción Anual',
        monto: 2000,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-08-15'),
        fechaPago: new Date('2025-08-12'),
        estado: 'pagado',
        metodoPago: 'Tarjeta de Crédito',
        comprobante: {
          numero: 'COMP-2023002-001',
          fecha: new Date('2025-08-12')
        }
      },

      // Pagos para Carlos Martínez (2023003) - Ingeniería en Sistemas
      {
        student: studentMap['2023003'],
        referencia: 'PEND-2023003-001',
        concepto: 'Colegiatura Septiembre 2025',
        monto: 10000,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-09-05'),
        estado: 'pendiente'
      },
      {
        student: studentMap['2023003'],
        referencia: 'PEND-2023003-002',
        concepto: 'Licencias de Software',
        monto: 1500,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-09-20'),
        estado: 'pendiente'
      },
      {
        student: studentMap['2023003'],
        referencia: 'PEND-2023003-003',
        concepto: 'Colegiatura Octubre 2025',
        monto: 10000,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-10-05'),
        estado: 'pendiente'
      },
      {
        student: studentMap['2023003'],
        referencia: 'PAGADO-2023003-001',
        concepto: 'Inscripción Anual',
        monto: 2000,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-08-15'),
        fechaPago: new Date('2025-08-08'),
        estado: 'pagado',
        metodoPago: 'Efectivo',
        comprobante: {
          numero: 'COMP-2023003-001',
          fecha: new Date('2025-08-08')
        }
      },

      // Pagos para Admin (admin001) - Administración
      {
        student: studentMap['admin001'],
        referencia: 'PEND-ADMIN-001',
        concepto: 'Cuota Administrativa',
        monto: 1000,
        cuatrimestre: 'Septiembre-Diciembre 2025',
        fechaVencimiento: new Date('2025-09-30'),
        estado: 'pendiente'
      }
    ]);

    console.log('✅ Pagos creados:', payments.length);

    // Mostrar resumen detallado
    console.log('\n🎯 RESUMEN COMPLETO DEL SEED');
    console.log('=' .repeat(50));

    console.log('\n📊 CARRERAS CREADAS:');
    careers.forEach(career => {
      console.log(`   - ${career.nombre} (${career.nivel}): $${career.costoCuatrimestre}`);
    });

    console.log('\n👥 ESTUDIANTES CREADOS:');
    students.forEach(student => {
      console.log(`   - ${student.matricula}: ${student.nombre} (${student.carrera})`);
    });

    console.log('\n📅 CALENDARIOS DE PAGOS:');
    calendars.forEach(calendar => {
      console.log(`   - ${calendar.carrera}: ${calendar.pagos.length} conceptos de pago`);
    });

    console.log('\n💰 PAGOS PENDIENTES:');
    const pendingPayments = await Payment.find({ estado: 'pendiente' }).populate('student');
    pendingPayments.forEach(payment => {
      console.log(`   - ${payment.student.nombre}: ${payment.concepto} - $${payment.monto} (Vence: ${payment.fechaVencimiento.toLocaleDateString()})`);
    });

    console.log('\n✅ PAGOS REALIZADOS:');
    const paidPayments = await Payment.find({ estado: 'pagado' }).populate('student');
    paidPayments.forEach(payment => {
      console.log(`   - ${payment.student.nombre}: ${payment.concepto} - $${payment.monto} (Pagado: ${payment.fechaPago.toLocaleDateString()})`);
    });

    console.log('\n🔑 INFORMACIÓN PARA LOGIN:');
    console.log('   - Admin:     matricula="admin001", password="admin123"');
    console.log('   - Estudiante 1: matricula="2023001", password="password123"');
    console.log('   - Estudiante 2: matricula="2023002", password="password123"');
    console.log('   - Estudiante 3: matricula="2023003", password="password123"');

    console.log('\n🎉 SEED COMPLETADO EXITOSAMENTE!');
    console.log('El admin ahora puede acceder al panel de administración completo.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar datos de prueba:', error);
    process.exit(1);
  }
};

seedPayments();