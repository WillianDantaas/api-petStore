

// Fomatação de Datas pt-BR
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

// Nome com Iniciais Maiúsculas
const capitalizeName = (value) => {

// Divide o nome em partes (nome e sobrenome) usando espaço como separador
const nameParts = value.split(' ');

// Formata cada parte (nome ou sobrenome) e junta novamente
const formattedParts = nameParts.map(part => {
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
});

// Retorna o nome completo formatado
return formattedParts.join(' ');
}

export default { formatDate, formatCurrency, capitalizeName };
