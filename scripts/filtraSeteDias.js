// Mapeia o nó anterior
const input = $input.all();

// Obtém a lista de conversas do WhatsApp que está armazenada no campo 'payload' do primeiro item de entrada
const conversas = input[0].json.payload;

// Define o período de filtro: conversas dos últimos 7 dias
const seteDiasAtras = new Date();
seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
const timestampLimite = seteDiasAtras.getTime();

// Filtra apenas conversas do WhatsApp que tiveram atividade recente (últimos 7 dias)
const filtradas = conversas.filter(item => {
  const identifier = item.meta?.sender?.identifier || ''; // Extrai o identificador do lead
  const lastMessageDate = new Date(item.custom_attributes?.last_message); // Converte a data da última mensagem para objeto Date
  
  const isRecent = lastMessageDate.getTime() >= timestampLimite; // Verifica se a última mensagem foi enviada dentro do período limite (7 dias)
  
  return identifier.includes('@s.whatsapp.net') && isRecent; /* Retorna true apenas para conversas do WhatsApp (identificadas pelo sufixo @s.whatsapp.net)
  que tiveram mensagens nos últimos 7 dias */
});

// Formata o resultado para o padrão esperado pelo n8n: cada conversa como um objeto separado
return filtradas.map(item => ({ json: item }));