

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

export default { formatDate, formatCurrency };
