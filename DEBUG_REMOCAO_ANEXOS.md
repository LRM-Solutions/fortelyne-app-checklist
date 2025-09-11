# 🐛 DEBUG: Problema de Remoção de Anexos

## Problema Reportado

**Descrição:** Quando remove um anexo, ele não some do array. URLs do Vercel Blob não estão sendo removidas corretamente.

## Logs de Debug Adicionados

### 1. **AnexosComponent.js - Função `removerAnexo`**

```javascript
console.log(
  `🗑️ Tentando remover anexo no índice ${index} de:`,
  JSON.stringify(anexos, null, 2)
);
console.log(`❌ Anexo removido:`, anexoRemovido);
console.log(
  `📝 Novos anexos após remoção:`,
  JSON.stringify(novosAnexos, null, 2)
);
```

### 2. **ExecucaoOrdem.js - Função `handleAnexosChange`**

```javascript
console.log(
  `🗑️ Anexos alterados para pergunta ${perguntaId}:`,
  JSON.stringify(novosAnexos, null, 2)
);
console.log(
  `📁 Estado completo dos anexos após alteração:`,
  JSON.stringify(novoState, null, 2)
);
```

### 3. **ExecucaoOrdem.js - Função `carregarDados`**

```javascript
console.log(
  `🔄 Dados recarregados - Anexos por pergunta:`,
  JSON.stringify(anexosMap, null, 2)
);
```

## Como Testar

### 1. **Teste de Remoção Simples**

1. Entre no modo de edição
2. Tente remover um anexo
3. Observe os logs no console:

**Logs Esperados:**

```
🗑️ Tentando remover anexo no índice 1 de:
[
  "https://vercel-blob.com/arquivo1.png",
  "https://vercel-blob.com/arquivo2.pdf",
  "data:image/jpeg;base64,..."
]

❌ Anexo removido: https://vercel-blob.com/arquivo2.pdf

📝 Novos anexos após remoção:
[
  "https://vercel-blob.com/arquivo1.png",
  "data:image/jpeg;base64,..."
]

🗑️ Anexos alterados para pergunta 1:
[
  "https://vercel-blob.com/arquivo1.png",
  "data:image/jpeg;base64,..."
]

📁 Estado completo dos anexos após alteração:
{
  "1": [
    "https://vercel-blob.com/arquivo1.png",
    "data:image/jpeg;base64,..."
  ]
}
```

### 2. **Teste de Persistência após Salvar**

1. Remova um anexo
2. Salve a edição
3. Observe o log de recarregamento:

**Log Esperado:**

```
🔄 Dados recarregados - Anexos por pergunta:
{
  "1": [
    "https://vercel-blob.com/arquivo1.png",
    "data:image/jpeg;base64,..."
  ]
}
```

## Possíveis Causas do Problema

### 1. **Problema no Frontend**

- Remoção não está atualizando o estado corretamente
- Estado não está sendo persistido após salvar
- Recarregamento está trazendo dados antigos

### 2. **Problema no Backend**

- Endpoint `/editar-envio-formulario` não está processando remoções
- URLs do Vercel Blob não estão sendo removidas do banco
- Resposta da API não reflete as mudanças

### 3. **Problema na Sincronização**

- Estado local vs dados do servidor estão dessincronizados
- Cache do servidor está retornando dados antigos

## Diagnóstico pelos Logs

### ✅ **Se os logs mostram remoção correta:**

- Problema está no backend
- Anexo foi removido localmente mas não persistido

### ❌ **Se os logs mostram problema na remoção:**

- Problema está no frontend
- Estado não está sendo atualizado corretamente

### 🔄 **Se recarregamento traz anexo de volta:**

- Backend não processou a remoção
- Dados antigos estão sendo retornados

## Próximos Passos

1. **Execute o teste** com os logs ativos
2. **Observe** qual dos cenários está acontecendo
3. **Analise** onde está o problema (frontend vs backend)
4. **Corrija** baseado no diagnóstico

---

**Objetivo:** Identificar se o problema é na remoção local ou na persistência no servidor
