const input = $input.all();

// Processa cada item do array de entrada
const resultado = input.map(item => {
  // Cria uma cópia do item original para não modificar o objeto original
  const itemProcessado = { ...item.json };
  
  // Extrai a hora diretamente da string ISO para evitar problemas de fuso horário
  const horaString = itemProcessado.date.split('T')[1]; // Exemplo: "21:00:48.697-03:00"
  const horaAtual = parseInt(horaString.split(':')[0]); // "21" Divide a string no ":" e retorna somente a hora.
  
  // Verifica se está no período fora do horário comercial (21h às 06h59)
  const estaForaHorarioComercial = horaAtual >= 21 || horaAtual < 7;
  
  if (estaForaHorarioComercial) {
    // Extrai a data da string original
    const parteData = itemProcessado.date.split('T')[0]; // "2025-08-06". Pega a string de data e retorna só a data
    const [ano, mes, dia] = parteData.split('-').map(Number); // [2025, 8, 6]
    
    // Cria nova data no mesmo fuso horário
    const novaData = new Date(ano, mes - 1, dia, 7, 0, 0, 0); // mes-1 porque Date usa 0-11 para meses
    
    // Se a hora atual é entre 21h e 23h59, adiciona um dia
    if (horaAtual >= 21) {
      novaData.setDate(novaData.getDate() + 1);
    }
    
    // Converte para ISO mantendo o fuso horário original
    const fusoOriginal = itemProcessado.date.split('T')[1].slice(-6); // "-03:00"
    const isoString = novaData.toISOString();
    const semFuso = isoString.slice(0, -1); // Remove o 'Z'
    
    // Atualiza a data no item processado mantendo o fuso original
    itemProcessado.date = semFuso + fusoOriginal; // Exemplo "2025-08-07T07:00:00.000-03:00"
  }
  
  // Se não está fora do horário comercial, mantém a data original sem alterações
  
  return { json: itemProcessado };
});

return resultado;