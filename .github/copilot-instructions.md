<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Fortelyne App - React Native

Este é um projeto React Native com JavaScript usando StyleSheet para estilização.

## Arquitetura do Projeto

- `src/components/` - Componentes reutilizáveis
- `src/screens/` - Telas da aplicação
- `src/api/` - Configuração e funções da API
- `src/utils/` - Funções utilitárias
- `src/assets/` - Imagens e estilos

## Padrões de Desenvolvimento

- Use StyleSheet do React Native para estilização
- Use AsyncStorage para persistência local
- Use Axios para requisições HTTP
- Implemente autenticação baseada em token JWT
- Use Context API para gerenciamento de estado de autenticação

## API

- Base URL: https://api-fortelyne.lrmsolutions.com.br/
- Endpoint de login: POST /login
- Payload: { user_email, user_password }
- Resposta: { token }
