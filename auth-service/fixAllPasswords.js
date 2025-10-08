// fixAllPasswords.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://utt_user:Martinez24@cluster0.vhuyiza.mongodb.net/school_auth';

const fixAllPasswords = async () => {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Definir el schema
    const userSchema = new mongoose.Schema({
      matricula: String,
      password: String,
      nombre: String,
      carrera: String,
      cuatrimestre: String,
      email: String,
      role: String,
      isActive: Boolean
    });

    const User = mongoose.model('User', userSchema);

    // Contraseña común para todos (se hasheará)
    const commonPassword = 'password123';
    const hashedPassword = await bcrypt.hash(commonPassword, 12);

    console.log('🔄 Actualizando contraseñas de todos los usuarios...');
    
    // Actualizar TODOS los usuarios
    const result = await User.updateMany(
      {}, // Actualizar todos los documentos
      { 
        password: hashedPassword,
        updatedAt: new Date()
      }
    );

    console.log(`✅ Contraseñas actualizadas: ${result.modifiedCount} usuarios`);
    
    // Mostrar información actualizada
    const users = await User.find({});
    console.log('\n📊 USUARIOS ACTUALIZADOS:');
    console.log('=========================================');
    
    users.forEach(user => {
      console.log(`👤 ${user.matricula}: ${user.nombre}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Contraseña: ${commonPassword}`);
      console.log('-----------------------------------------');
    });

    console.log('\n🔑 CREDENCIALES PARA LOGIN:');
    console.log('=========================================');
    console.log('ADMIN:');
    console.log('   Matrícula: admin001');
    console.log('   Password: password123');
    console.log('\nESTUDIANTES:');
    console.log('   Matrícula: 2023001, 2023002, 2023003, 2023004');
    console.log('   Password: password123');
    
    console.log('\n🎉 ¡Todas las contraseñas han sido estandarizadas!');

    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixAllPasswords();