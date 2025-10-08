const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Configurar MONGODB_URI directamente si no carga del .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://utt_user:Martinez24@cluster0.vhuyiza.mongodb.net/school_auth';

const userSchema = new mongoose.Schema({
  matricula: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  carrera: {
    type: String,
    required: true
  },
  cuatrimestre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
  try {
    console.log('🔗 Conectando a MongoDB...');
    console.log('URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Verificar si ya existe el admin
    let admin = await User.findOne({ matricula: 'admin001' });
    
    if (admin) {
      // Actualizar a admin si ya existe
      admin.role = 'admin';
      admin.nombre = 'Administrador del Sistema';
      admin.carrera = 'Administración';
      admin.cuatrimestre = 'N/A';
      admin.email = 'admin@utt.edu.mx';
      admin.isActive = true;
      
      // Solo actualizar password si es diferente
      if (!admin.comparePassword || !(await bcrypt.compare('admin123', admin.password))) {
        admin.password = await bcrypt.hash('admin123', 12);
      }
      
      await admin.save();
      console.log('✅ Usuario admin001 actualizado a rol admin');
    } else {
      // Crear nuevo admin
      admin = new User({
        matricula: 'admin001',
        password: await bcrypt.hash('admin123', 12),
        nombre: 'Administrador del Sistema',
        carrera: 'Administración',
        cuatrimestre: 'N/A',
        email: 'admin@utt.edu.mx',
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('✅ Usuario admin creado exitosamente');
    }
    
    console.log('\n📋 DATOS DEL ADMIN:');
    console.log('   Matrícula: admin001');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    console.log('   Nombre: Administrador del Sistema');
    console.log('   Email: admin@utt.edu.mx');
    
    // Verificar que se guardó correctamente
    const verifiedAdmin = await User.findOne({ matricula: 'admin001' });
    console.log('\n🔍 VERIFICACIÓN:');
    console.log('   Admin en BD:', {
      matricula: verifiedAdmin.matricula,
      nombre: verifiedAdmin.nombre,
      role: verifiedAdmin.role,
      isActive: verifiedAdmin.isActive
    });
    
    await mongoose.connection.close();
    console.log('\n🎉 Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error creando admin:', error.message);
    if (error.code === 11000) {
      console.log('ℹ️  El usuario admin ya existe');
    }
    process.exit(1);
  }
};

createAdmin();