import sequelize from './models/db.js'; // Caminho para sua configuração do Sequelize


(async () => {
  try {
    await sequelize.sync({ force: true }); // Força recriar as tabelas (use com cuidado em produção)
    console.log('Tabelas sincronizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar tabelas:', error);
  } finally {
    await sequelize.close();
  }
})();
