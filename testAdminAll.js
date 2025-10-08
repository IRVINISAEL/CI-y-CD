// testAdminAll.js
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAllAdminRoutes() {
  try {
    console.log('🔐 1. Login del admin...');
    
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      matricula: 'admin001',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log('✅ Login exitoso');
    console.log(`   Usuario: ${user.nombre} (${user.role})`);

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n📊 2. Obteniendo todos los pagos...');
    const paymentsResponse = await axios.get(`${API_BASE}/admin/payments`, { headers });
    console.log(`✅ Pagos obtenidos: ${paymentsResponse.data.data.length}`);
    console.log(`   Paginación: Página ${paymentsResponse.data.pagination.page} de ${paymentsResponse.data.pagination.pages}`);

    console.log('\n👥 3. Obteniendo todos los estudiantes...');
    const studentsResponse = await axios.get(`${API_BASE}/admin/students`, { headers });
    console.log(`✅ Estudiantes obtenidos: ${studentsResponse.data.data.length}`);

    console.log('\n📈 4. Obteniendo estadísticas...');
    const statsResponse = await axios.get(`${API_BASE}/admin/stats`, { headers });
    const stats = statsResponse.data.data.totals;
    console.log('✅ Estadísticas:');
    console.log(`   Total pagos: ${stats.payments}`);
    console.log(`   Pagos pendientes: ${stats.pending}`);
    console.log(`   Pagos realizados: ${stats.paid}`);
    console.log(`   Recaudación total: $${stats.revenue}`);

    console.log('\n🔍 5. Verificando token...');
    const verifyResponse = await axios.get(`${API_BASE}/auth/verify`, { headers });
    console.log('✅ Token válido');

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DEL ADMIN FUERON EXITOSAS!');
    console.log('\n📋 RESUMEN:');
    console.log(`   Usuario: ${user.nombre}`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log(`   Estudiantes en sistema: ${studentsResponse.data.data.length}`);
    console.log(`   Pagos en sistema: ${stats.payments}`);

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

testAllAdminRoutes();