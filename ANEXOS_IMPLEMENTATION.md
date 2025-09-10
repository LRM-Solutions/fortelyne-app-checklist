# 📎 Implementação de Anexos - Fortelyne App

## ✅ Funcionalidades Implementadas

### 🔧 Novo Componente: AnexosComponent

**Localização:** `src/components/AnexosComponent.js`

**Funcionalidades:**

- ✅ Adicionar anexos via câmera
- ✅ Adicionar anexos via galeria
- ✅ Visualização de anexos como miniaturas
- ✅ Remoção de anexos individuais
- ✅ Estado desabilitado durante edição
- ✅ Contador de anexos
- ✅ Interface visual intuitiva

### 📱 Telas Atualizadas

#### 1. **FormularioOrdem.js**

- ✅ Anexos disponíveis para TODOS os tipos de pergunta
- ✅ Estado `anexosPorPergunta` para gerenciar anexos por pergunta
- ✅ Função `handleAnexosChange` para atualizar anexos
- ✅ Componente AnexosComponent integrado em cada pergunta

#### 2. **ExecucaoOrdem.js**

- ✅ Anexos disponíveis para TODOS os tipos de pergunta (incluindo assinaturas)
- ✅ Carregamento de anexos existentes da API
- ✅ Edição de anexos em modo de edição
- ✅ Preservação de anexos durante recarregamento

### 🔌 API Atualizada

#### **ordemApi.js**

- ✅ `enviarFormularioOrdem()` - Inclui anexos no payload
- ✅ `editarFormularioOrdem()` - Inclui anexos no payload de edição
- ✅ Payload conforme exemplo fornecido com campo `anexos: []`

### 📋 Payload da API

Conforme solicitado, cada resposta agora inclui o campo `anexos`:

```json
{
  "ordem_id": 1,
  "respostas": [
    {
      "formulario_pergunta_id": 1,
      "resposta_texto": "Resposta de texto",
      "resposta_escolha_id": null,
      "assinatura_base64": null,
      "tipo_pergunta": "TEXTO",
      "anexos": [
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..."
      ]
    }
  ]
}
```

## 📦 Dependências Necessárias

⚠️ **IMPORTANTE:** Instale estas dependências antes de usar:

```bash
npx expo install expo-image-picker expo-document-picker
```

### Dependências Adicionadas:

- `expo-image-picker` - Para câmera e galeria
- `expo-document-picker` - Para seleção de documentos

## 🎯 Como Usar

### Para o Usuário:

1. **Preencher qualquer pergunta** (texto, múltipla escolha, única escolha, assinatura)
2. **Clicar em "Adicionar"** na seção de anexos
3. **Escolher uma opção:**
   - 📷 **Câmera** - Tirar foto na hora
   - 🖼️ **Galeria** - Selecionar imagem existente
   - 📄 **Documento** - Selecionar arquivo (em desenvolvimento)
4. **Visualizar anexos** como miniaturas
5. **Remover anexos** clicando no X

### Para Desenvolvedores:

- Anexos são armazenados como arrays de base64 strings
- Cada pergunta tem seu próprio array de anexos
- Anexos são incluídos automaticamente no payload da API
- Estado é sincronizado entre formulário novo e edição

## 🔧 Configurações de Permissões

### Android (app.json):

```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

### iOS (app.json):

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Este app precisa acessar a câmera para tirar fotos.",
        "NSPhotoLibraryUsageDescription": "Este app precisa acessar a galeria para selecionar fotos."
      }
    }
  }
}
```

## 🚨 Limitações Atuais

1. **Documentos PDF:** Implementação em desenvolvimento
2. **Tamanho de Arquivo:** Sem limite definido (considerar compressão)
3. **Tipos de Arquivo:** Apenas imagens atualmente

## 🔄 Compatibilidade

- ✅ Funciona em formulários novos
- ✅ Funciona em edição de formulários
- ✅ Preserva anexos existentes
- ✅ Sincroniza com estado de edição
- ✅ Desabilita durante envio/salvamento

## 📱 Interface

- **Visual limpo** com contador de anexos
- **Miniaturas** dos anexos em scroll horizontal
- **Botão de remoção** individual para cada anexo
- **Estado vazio** com instruções claras
- **Feedback visual** durante carregamento
