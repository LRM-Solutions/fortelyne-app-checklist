# Implementação de Tipos de Pergunta UNICA e ASSINATURA

## Resumo das Alterações

### 1. Nova Biblioteca Instalada

- **react-native-signature-canvas**: Para captura de assinaturas digitais

### 2. Novo Componente Criado

- **AssinaturaComponent.js**: Componente para captura e exibição de assinaturas
  - Interface modal para área de desenho
  - Conversão automática para base64
  - Opções de limpar, confirmar e remover assinatura
  - Design responsivo com tema consistente

### 3. Atualizações no FormularioOrdem.js

#### Novos Handlers:

- `handleUnicaEscolha()`: Para perguntas de escolha única (radio button)
- `handleAssinatura()`: Para captura de assinaturas em base64

#### Nova Renderização de Perguntas:

- **UNICA**: Radio buttons para seleção única
- **ASSINATURA**: Área de assinatura com modal interativo

#### Validação Atualizada:

- Verifica se perguntas UNICA foram respondidas
- Verifica se assinaturas foram capturadas

### 4. Atualizações na API (ordemApi.js)

#### Novo Formato de Payload:

```javascript
{
  "ordem_id": 2,
  "respostas": [
    {
      "formulario_pergunta_id": 24,
      "tipo_pergunta": "ASSINATURA",
      "resposta_escolha_id": null,
      "resposta_texto": null,
      "assinatura_base64": "data:image/png;base64,iVBORw0KG..."
    },
    {
      "formulario_pergunta_id": 23,
      "tipo_pergunta": "UNICA",
      "resposta_escolha_id": 1,
      "resposta_texto": null,
      "assinatura_base64": null
    }
  ]
}
```

## Tipos de Pergunta Suportados

### 1. MULTIPLA

- Checkboxes para múltiplas seleções
- Array de IDs de escolhas

### 2. UNICA

- Radio buttons para seleção única
- ID único da escolha selecionada

### 3. TEXTO

- Campo de texto multilinha
- Resposta em texto livre

### 4. ASSINATURA

- Modal com área de desenho
- Conversão automática para base64
- Opções de editar/remover

## Funcionalidades da Assinatura

### Interface do Usuário:

- **Área de captura**: Botão "Toque para assinar" quando vazia
- **Área preenchida**: Mostra "✓ Assinatura capturada" com botões Alterar/Remover
- **Modal de assinatura**: Tela completa com área de desenho

### Controles do Modal:

- **Limpar**: Remove desenho atual
- **Cancelar**: Fecha sem salvar
- **Confirmar**: Salva assinatura em base64

### Validação:

- Impede confirmação sem assinatura
- Valida presença de assinatura no envio do formulário

## Fluxo de Uso

1. **Usuário acessa formulário** → Pergunta ASSINATURA aparece com botão "Toque para assinar"
2. **Toca no botão** → Modal de assinatura abre em tela cheia
3. **Desenha assinatura** → Área de canvas captura os traços
4. **Confirma assinatura** → Modal fecha e mostra "✓ Assinatura capturada"
5. **Envia formulário** → Assinatura é enviada em base64 no payload

## Configurações Técnicas

### Signature Canvas:

- **Formato**: PNG em base64
- **Cor da caneta**: Preto
- **Fundo**: Branco
- **Tamanho mínimo da linha**: 1px
- **Tamanho do ponto**: 2px

### Responsividade:

- Canvas adapta ao tamanho da tela
- Margem de 40px nas laterais
- Altura fixa de 300px

### Acessibilidade:

- Botões com feedback visual
- Textos descritivos claros
- Confirmação antes de remover assinatura

## Validações e Tratamento de Erros

### Validações no Frontend:

- Todos os campos obrigatórios preenchidos
- Assinatura presente quando necessária
- Escolha única selecionada quando aplicável

### Tratamento de Erros:

- Alerts informativos para usuário
- Logs detalhados para debugging
- Fallbacks para falhas de rede

## Compatibilidade

### Plataformas:

- ✅ iOS (via WebView)
- ✅ Android (via WebView)
- ✅ Web (Canvas nativo)

### Dependências:

- React Native 0.79+
- Expo 53+
- react-native-signature-canvas 4.7+
