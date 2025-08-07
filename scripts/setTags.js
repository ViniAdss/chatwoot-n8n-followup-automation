// Aqui coletamos as informações to nó "switch". Dentro desse nó temos o campo 'payload' que  contém as tags atuais daquela conversa

const input = $('switch').all(); // Mapeia o nó 'switch'.
const tagsAtuais = input[0].json.payload; // Coleta as tags atuais da conversa

// 🔧 Configure aqui as tags que você quer adicionar ou remover:
const tagsParaAdicionar = ['tag-para-adicionar-1', 'tag-para-adicionar-2'];  // ✅ Customize aqui
const tagsParaRemover = ['tag-para-remover-1', 'tag-para-remover-2']; // ❌ Customize aqui

// Junta as tags existentes com as novas (sem duplicar)
let tagsAtualizadas = [...new Set([...tagsAtuais, ...tagsParaAdicionar])];

// Remove as tags indesejadas
tagsAtualizadas = tagsAtualizadas.filter(tag => !tagsParaRemover.includes(tag));

// Retorna como payload atualizado
return [
  {
    json: {
      payload: tagsAtualizadas
    }
  }
];