# 📱 Instruções para Gerar APK - Fortelyne App

## 🎯 Configuração Simplificada

As configurações foram simplificadas para reduzir erros:

### ✅ Arquivo `eas.json` (Simplificado)

- Apenas 2 perfis: `preview` (APK interno) e `production` (AAB Play Store)
- Sem configurações avançadas que podem causar conflitos

### ✅ Arquivo `app.json` (Limpo)

- Removidas configurações do Android que causavam erro no expo doctor
- Removidas permissões explícitas (serão adicionadas automaticamente)
- Removido `newArchEnabled` para evitar problemas de compatibilidade

## 🚀 Comando para Gerar APK

```bash
eas build --platform android --profile preview
```

## 🔧 Se der problema, tente:

1. **Limpar cache:**

```bash
eas build --platform android --profile preview --clear-cache
```

2. **Verificar configuração:**

```bash
expo doctor
```

3. **Se houver erro de dependências:**

```bash
npx expo install --check
npx expo install --fix
```

## 📋 Checklist antes do Build

- [ ] Arquivo `eas.json` existe e está simples
- [ ] Arquivo `app.json` sem configurações Android avançadas
- [ ] `projectId` está configurado no `app.json`
- [ ] ErrorBoundary está ativo no `App.js`

## 🎯 Para Distribuição Interna

Use sempre o perfil `preview`:

- Gera APK (não AAB)
- Distribuição interna
- Mais rápido que produção
- Ideal para testes

## 🆘 Em caso de crash do app

O ErrorBoundary foi adicionado para capturar erros e mostrar uma tela amigável ao invés de fechar o app.
