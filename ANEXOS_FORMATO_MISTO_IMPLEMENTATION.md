# Implementação de Formato Misto para Anexos

## Funcionalidade Implementada

Implementação da lógica de formato misto para anexos no `ordemApi.js`, permitindo que:

- **Anexos existentes**: Mantêm as URLs do Vercel Blob
- **Anexos novos**: São enviados como base64

## Estrutura do Payload

```javascript
{
  "formulario_pergunta_id": 1,
  "tipo_pergunta": "TEXTO",
  "resposta_escolha_id": null,
  "resposta_texto": "Sua resposta aqui",
  "assinatura_base64": null,
  "anexos": ["https://vercel-blob.com/exemplo.png", "data:image/jpeg;base64,/9j/4AAQ...", "data:image/png;base64,iVBOR..."]
}
```

## Função `processarAnexosFormatoMisto`

### Lógica de Processamento:

1. **URLs (anexos existentes)**:

   - Detecta strings que começam com `http` ou `https`
   - Mantém as URLs do Vercel Blob sem modificação

2. **Base64 (anexos novos)**:

   - Detecta strings que começam com `data:`
   - Mantém o formato base64 completo

3. **Fallback**:
   - Qualquer outro formato é mantido como está

### Implementação:

```javascript
const processarAnexosFormatoMisto = (anexos) => {
  return anexos.map((anexo) => {
    // Se é uma URL do Vercel Blob, mantém como está
    if (
      typeof anexo === "string" &&
      (anexo.startsWith("http") || anexo.startsWith("https"))
    ) {
      return anexo;
    }
    // Se é base64, mantém como está
    if (typeof anexo === "string" && anexo.startsWith("data:")) {
      return anexo;
    }
    // Fallback: retorna como está
    return anexo;
  });
};
```

## Funções Atualizadas

### 1. `enviarFormularioOrdem`

- Processa anexos com `processarAnexosFormatoMisto()`
- Envia para endpoint `/envio-formulario`

### 2. `editarFormularioOrdem`

- Processa anexos com `processarAnexosFormatoMisto()`
- Envia para endpoint `/editar-envio-formulario`

## Logs de Debug

Mantidos apenas os logs do payload conforme solicitado:

- `"Payload formatado:"` (envio)
- `"Payload para edição:"` (edição)

## Fluxo de Funcionamento

1. **Carregamento de anexos existentes** (ExecucaoOrdem.js):

   - URLs do Vercel Blob vêm de `resposta.respostaFinalImagens`
   - Base64 antigos vêm de `resposta.anexos`

2. **Adição de novos anexos** (AnexosComponent.js):

   - Novos arquivos são convertidos para base64
   - Formato: `data:image/jpeg;base64,{base64String}`

3. **Processamento no envio** (ordemApi.js):
   - `processarAnexosFormatoMisto()` identifica e preserva cada tipo
   - Array final contém mix de URLs e base64

## Vantagens

- ✅ **Preserva anexos existentes**: URLs do Vercel Blob não são re-enviadas
- ✅ **Suporte a novos anexos**: Base64 para arquivos adicionados
- ✅ **Compatibilidade**: Funciona com ambos os endpoints
- ✅ **Performance**: Evita re-upload desnecessário de arquivos existentes
