// testAdmin.js
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAdminRoutes() {
  try {
    console.log('🔐 1. Login del admin...');
    
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      matricula: 'admin001',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido');

    // Configurar headers para las siguientes peticiones
    const headers = {
      Authorization: `Bearer ${token}`
    };

    console.log('\n📊 2. Obteniendo todos los pagos...');
    const paymentsResponse = await axios.get(`${API_BASE}/admin/payments`, { headers });
    console.log(`✅ Pagos obtenidos: ${paymentsResponse.data.data.length}`);

    console.log('\n👥 3. Obteniendo todos los estudiantes...');
    const studentsResponse = await axios.get(`${API_BASE}/admin/students`, { headers });
    console.log(`✅ Estudiantes obtenidos: ${studentsResponse.data.data.length}`);

    console.log('\n📈 4. Obteniendo estadísticas...');
    const statsResponse = await axios.get(`${API_BASE}/admin/stats`, { headers });
    console.log('✅ Estadísticas:', statsResponse.data.data.totals);

    console.log('\n🎉 Todas las pruebas del admin fueron exitosas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

testAdminRoutes();