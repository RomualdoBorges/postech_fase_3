# 💳 ByteBank Mobile - Postech FIAP - Fase 3

O **ByteBank Mobile** é um aplicativo de controle financeiro desenvolvido com **React Native e Expo** para simular as funcionalidades básicas de uma conta digital.

O aplicativo permite:

- visualizar saldo
- registrar receitas e despesas
- consultar histórico de transações
- editar ou excluir movimentações
- anexar comprovantes às transações

O projeto foi desenvolvido como parte do **Tech Challenge - Pós Tech FIAP**.

---

# 🚀 Tecnologias Utilizadas

## Framework Mobile

- **Expo 54** – Plataforma para desenvolvimento de apps React Native com build simplificado
- **React Native 0.81** – Framework para construção de aplicativos móveis
- **React 19** – Biblioteca para construção de interfaces

---

# 📱 Navegação

- **Expo Router 6** – Sistema de rotas baseado em arquivos para aplicações Expo
- **React Navigation** – Navegação entre telas

Bibliotecas utilizadas:

- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/elements`

---

# 🔐 Backend e Persistência

- **Firebase 12**
  - Firebase Authentication
  - Firestore Database
  - Firebase Storage

O Firebase é utilizado para:

- autenticação de usuários
- armazenamento das transações
- upload de comprovantes

---

# 📦 Funcionalidades do App

- Login e cadastro de usuários
- Recuperação de senha
- Dashboard financeiro
- Cadastro de receitas
- Cadastro de despesas
- Edição de transações
- Upload de comprovantes
- Gráficos financeiros

---

# 📊 Visualização de Dados

- **react-native-gifted-charts** – Biblioteca para gráficos interativos

Utilizada para exibir:

- distribuição de gastos
- resumo financeiro
- comparativo de receitas e despesas

---

# ⚙️ Instalação

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI

---

# 📥 Clonar o projeto

git clone https://github.com/RomualdoBorges/postech_fase_3.git
cd postech_fase_3

---

# 📦 Instalar dependências

npm install

---

# ▶️ Executar o projeto

npm run start

Depois abra o aplicativo usando:

- **Expo Go**
- **Android Emulator**
- **iOS Simulator**

---

# 📜 Scripts Disponíveis

| Script            | Descrição                    |
| ----------------- | ---------------------------- |
| `npm run start`   | Inicia o Expo                |
| `npm run android` | Executa no Android           |
| `npm run ios`     | Executa no iOS               |
| `npm run web`     | Executa versão web           |
| `npm run lint`    | Verifica problemas de código |

---

# 🔑 Variáveis de Ambiente

O projeto utiliza um arquivo `.env` para armazenar configurações do Firebase.

Exemplo:

EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBBki37bIktZ5s4qIZvFie4EP1gtmHxOQA
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=postech-fase-3-edde1.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=postech-fase-3-edde1
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=postech-fase-3-edde1.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=670443315442
EXPO_PUBLIC_FIREBASE_APP_ID=1:670443315442:web:f2513487330687d20fb06b

⚠️ O arquivo `.env` **não deve ser enviado para o repositório**.

---

# 👥 Contribuidores

- Romualdo Borges
- Lucas Quintino

---

# 📚 Pós Tech FIAP

Projeto desenvolvido como parte do **Tech Challenge da Pós Tech FIAP**.
