# Bot WhatsApp de Gestão Financeira
💸 Um bot para WhatsApp que ajuda a registrar gastos, receitas e orçamentos direto no chat.

Desenvolvido em Node.js e SQLite, com comandos simples para organizar suas finanças.

# ✅ Funcionalidades Implementadas

- **Registro Instantâneo**  
  `/gasto 25,50 comida lanche` ou `/receita 3000 salário`  
  Registre transações em segundos com categorização automática

- **Relatórios Detalhados**  
  `/relatorio` ou `/relatorio categoria`  
  Visualize seus gastos por período ou categoria com gráficos simples

- **Análise Inteligente**  
  📌 Top categorias de gastos  
  📌 Comparativo mês anterior  
  📌 Projeção de economia

- **Multi-usuários**  
  Cadastro individual com histórico pessoal  
  Compatível com famílias ou pequenas equipes

## 🚧 Em Desenvolvimento

- **Metas e Alertas**  
  Em breve: Defina limites por categoria e receba notificações quando estiver perto de ultrapassar

- **Integrações**  
  Próximas versões incluirão:  
  🔗 Export para Google Sheets  
  🔗 Conexão com bancos (Open Banking)  
  🔗 Lembretes automáticos

**Comandos de Exemplo:**
- `/gasto <valor> <categoria> <descrição>`: Para inserir uma nova despesa
- `/receita <valor> <descrição>`: Para inserir uma nova receita
- `/relatorio`: Para gerar relatório mensal
- `/orcamento <categoria> <valor>`: Para definir um orçamento por categoria

**Tecnologias:**
- Node.js
- SQLite
- whatsapp-web.js
