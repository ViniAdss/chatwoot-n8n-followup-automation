# Chatwoot N8N Follow-Up Automation

Um projeto de automação integrando **n8n** ao **Chatwoot**, com mensagens de follow-up geradas por **Inteligência Artificial**.

## 📋 Sobre o Projeto

Este workflow automatiza o envio de mensagens de follow-up para leads no WhatsApp através da integração entre n8n, Chatwoot e Evolution API. O sistema utiliza IA para gerar mensagens personalizadas e contextuais baseadas no histórico de conversas.

### ✨ Funcionalidades

- ✅ **4 níveis de follow-up** com intervalos customizáveis
- 🤖 **Mensagens geradas por IA** com contexto do histórico
- 🏷️ **Sistema inteligente de tags** para controle de fluxo
- ⏰ **Ajuste automático de horário** comercial (evita mensagens fora do expediente)
- 🔄 **Controle de loops** para evitar spam
- 📊 **Filtragem avançada** por caixa de entrada e tags

## 🛠️ Pré-requisitos

Antes de começar, você precisa ter:

- **n8n** instalado e configurado
- **Chatwoot** v4.1+ (compatível com versões anteriores)
- **Evolution API** configurada
- **PostgreSQL** (para histórico de conversas)
- **OpenAI API** ou outro provedor LLM
- Acesso às credenciais de todas as integrações

## 📦 Instalação

### 1. Clone ou baixe o repositório
```bash
git clone https://github.com/ViniAdss/chatwoot-n8n-followup-automation.git
```

### 2. Importe o workflow no n8n
- Abra seu n8n
- Vá em **Settings → Import from file**
- Selecione o arquivo `Follow-Up.json`

### 3. Configure as credenciais
**⚠️ IMPORTANTE:** Você deve abrir cada nó e configurar suas próprias credenciais antes de executar o workflow.

## ⚙️ Configuração

### 🏷️ 1. Criando Tags no Chatwoot

Primeiro, crie as seguintes tags no seu Chatwoot:

![Tags do Chatwoot](https://row.viniads.com.br/media/user_files/8GF1cLZ283L19RondKWnbI1EEI30wEg5_d66b187152e357717d37187816c9fff74e940a257908871606aa13a0bc348a30.png)

**Tags obrigatórias:**
- `follow-up-1` - Primeiro follow-up enviado
- `follow-up-2` - Segundo follow-up enviado  
- `follow-up-3` - Terceiro follow-up enviado
- `follow-up-4` - Quarto follow-up enviado
- `no-follow-up` - Impede envio de follow-ups

### 📧 2. Criando Atributo Personalizado

Crie um atributo personalizado chamado **`last_message`** no Chatwoot:

![Atributo Personalizado](https://row.viniads.com.br/media/user_files/Nw4BTiT4kKenmtJDEITuEjC7vu48lcyO_b6cfc1603c80b743fb282dcc678295fc96782dd2f39de083993e27b7dbb28389.png)

**Configurações:**
- **Nome:** `last_message`
- **Tipo:** Date
- **Descrição:** Armazena data/hora da última mensagem do lead

### 📥 3. Identificando Caixa de Entrada

Execute o workflow auxiliar para identificar o ID da sua caixa de entrada do WhatsApp:

![Caixas de Entrada](https://row.viniads.com.br/media/user_files/FbhLghtct37hLq4c0tMi5JdD8NGgv4gV_a4e15a051654c6963a28475150726b1b66855b8dec8a1a7a95cb3f91eb6a9efe.png)

1. Execute o nó **manual** → **caixas_de_entrada**
2. Localize sua caixa de entrada da Evolution
3. Copie o **ID** da caixa de entrada

### 🔧 4. Configurando Credenciais nos Nós

#### Evolution API (nó `normalize`)
```javascript
baseUrl: "https://sua-evolution-api.com/"
Instance: "SuaInstancia"  
apikey: "sua-api-key-evolution"
```

#### Chatwoot
- Configure suas credenciais do Chatwoot nos nós `filtra_tag&inbox`
- Configure o **ID da caixa de entrada** encontrado no passo anterior

#### OpenAI/LLM
- Configure suas credenciais nos nós dos agentes
- Escolha o modelo de sua preferência (padrão: GPT-4o-mini)

#### PostgreSQL  
- Configure a conexão para armazenar histórico de conversas
- Nenhum requisito específico de versão

### ⏱️ 5. Configurando Intervalos de Follow-up

No nó **`switch`**, você pode personalizar os intervalos de cada follow-up:

![Configuração Switch](https://row.viniads.com.br/media/user_files/eV5ygIRb3K5jMTCj7yiZGsMFaxr0Cp1s_b58b2d6477be8802a9f800c6b87e387f915524d93f4dd9f88dc212d86b96ac2a.png)

**Padrão atual:**
- **Follow-up 1:** 5 minutos após última mensagem
- **Follow-up 2:** 10 minutos após última mensagem  
- **Follow-up 3:** 30 minutos após última mensagem
- **Follow-up 4:** 1 hora após última mensagem

**Para alterar um intervalo:**
```javascript
// Exemplo: alterar para 30 minutos
{{ $json.datetimeNow.toDateTime().minus(30, 'minutes') }}

// Unidades disponíveis: 'minutes', 'hours', 'days'
```

### 🤖 6. Configurando Agentes de IA

Personalize o prompt de cada agente nos nós **`Agente Follow Up 1-4`**:

**Exemplo de prompt:**
```
Você é um assistente comercial especializado em follow-up. 
Analise o histórico da conversa e crie uma mensagem personalizada 
e amigável para reengajar o lead. 
Seja natural, empático e focado em ajudar o cliente.
```

**Conexão com histórico:**
- Os agentes têm acesso ao histórico via ferramenta **`histórico`**
- Para desabilitar o histórico, desconecte a ferramenta

## 🧪 Testando o Workflow

### ⚠️ Modo de Teste
Durante os testes, use o nó **`isMe`** para filtrar apenas seu número:

1. Configure seu número no nó **`isMe`**
2. Execute testes sem afetar clientes reais
3. **REMOVA** este nó ao colocar em produção

### 🔄 Executando Testes
1. Configure o **Schedule Trigger** para executar a cada 1 minuto
2. Envie uma mensagem de teste no WhatsApp
3. Aguarde os intervalos configurados
4. Verifique se as tags estão sendo aplicadas corretamente

## 📁 Scripts Auxiliares

### `ajustaHorario.js`
Ajusta mensagens enviadas fora do horário comercial (21h-07h) para serem reagendadas para 07h do próximo dia útil.

### `setTags.js` 
Script base para gerenciamento de tags, usado nos nós `setTags_1-4`:

```javascript
// 🔧 Configure as tags desejadas:
const tagsParaAdicionar = ['follow-up-1'];  // ✅ Adicionar
const tagsParaRemover = [''];               // ❌ Remover
```

### `filtraSeteDias.js`
Filtra conversas dos últimos 7 dias para otimizar performance.

## 🎯 Fluxo do Workflow

```mermaid
graph TD
    A[Schedule Trigger] --> B[Filtrar Tags & Inbox]
    B --> C[Filtrar WhatsApp]
    C --> D[Normalizar Dados]
    D --> E[Loop por Leads]
    E --> F[Verificar Timing]
    F --> G{Switch por Tempo}
    G -->|5min| H[Follow-up 1]
    G -->|10min| I[Follow-up 2] 
    G -->|30min| J[Follow-up 3]
    G -->|1h| K[Follow-up 4]
    H --> L[Gerar Mensagem IA]
    I --> L
    J --> L  
    K --> L
    L --> M[Atualizar Tags]
    M --> N[Enviar WhatsApp]
```

## 📱 Integração com seu Workflow Principal

Para integrar com seu workflow de atendimento existente:

### 1. Modificar Webhook
Adicione ao seu nó de normalização:
```javascript
// Campos obrigatórios para o follow-up
conversationId: "{{ $json.body.data.chatwootConversationId }}"
date: "{{ $json.body.data.date_time.replace('Z', '-03:00') }}"
fromMe: "{{ $json.body.data.key.fromMe }}"
```

### 2. Registrar Última Mensagem
Conecte os nós da seção **"Registra última mensagem do lead"** ao seu webhook:
- `isLead` - Filtra apenas mensagens de leads
- `ajusta_horário` - Ajusta horário comercial  
- `last_message` - Salva timestamp no Chatwoot

### 3. Isolar Componentes
Mantenha o registro de mensagens separado do restante do seu workflow para não interferir no fluxo principal.

## ❗ Pontos Importantes

### ⚠️ Antes da Produção
- ✅ Teste com seu próprio número usando o nó `isMe`
- ✅ Configure todas as credenciais nos nós
- ✅ Crie todas as tags necessárias no Chatwoot
- ✅ Crie o atributo personalizado `last_message`
- ✅ **REMOVA** o nó `isMe` para funcionar com todos os leads

### 🔒 Segurança
- Não compartilhe suas API keys
- Use variáveis de ambiente quando possível
- Monitore logs de execução regularmente

### 📊 Performance
- O workflow filtra automaticamente conversas dos últimos 7 dias
- Executa a cada 1 minuto por padrão (ajustável)
- Tags impedem loops infinitos de mensagens

## 🐛 Solução de Problemas

### Mensagens não estão sendo enviadas
1. ✅ Verificar se todas as credenciais estão configuradas
2. ✅ Confirmar se as tags estão criadas no Chatwoot
3. ✅ Validar se o atributo `last_message` existe
4. ✅ Checar se o ID da caixa de entrada está correto

### Tags não estão sendo aplicadas
1. ✅ Verificar permissões das credenciais do Chatwoot
2. ✅ Confirmar nomes das tags (case-sensitive)
3. ✅ Validar conexões entre os nós

### IA não está gerando mensagens
1. ✅ Verificar credenciais do provedor LLM
2. ✅ Confirmar se o modelo escolhido está disponível
3. ✅ Validar conexão com histórico (se habilitado)

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma [Issue](https://github.com/ViniAdss/chatwoot-n8n-followup-automation/issues) no repositório
- Consulte a documentação do n8n, Chatwoot e Evolution API

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias  
- Enviar pull requests
- Compartilhar casos de uso

---

## 👨‍💻 Autor

<div align="center">
  <img src="https://avatars.githubusercontent.com/u/190038668?v=4" width="100" height="100" alt="Vinicius Sousa" style="border-radius: 50%;">
  
  **Vinicius Sousa**  
  *Desenvolvedor & Especialista em Automações*
  
  [![GitHub](https://img.shields.io/badge/GitHub-ViniAdss-black?style=flat-square&logo=github)](https://github.com/ViniAdss)
  [![Email](https://img.shields.io/badge/Email-adsvinisousa@gmail.com-red?style=flat-square&logo=gmail)](mailto:adsvinisousa@gmail.com)
  
  💼 **ViniDevs** | 🌟 Transformando ideias em automações inteligentes
</div>

---

<div align="center">
  <strong>⭐ Se este projeto te ajudou, considere dar uma estrela!</strong>
</div>