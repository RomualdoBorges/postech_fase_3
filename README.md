# ByteBank Mobile - Postech FIAP - Fase 4

O **ByteBank Mobile** é um aplicativo de controle financeiro desenvolvido com **React Native, Expo e Firebase** para simular as funcionalidades básicas de uma conta digital.

O aplicativo permite:

- autenticação de usuários
- visualizar saldo financeiro
- registrar receitas e despesas
- consultar histórico de transações
- editar ou excluir movimentações
- anexar comprovantes às transações
- visualizar dashboard financeiro com gráficos e resumos

O projeto foi desenvolvido como parte do **Tech Challenge - Pós Tech FIAP**.

---

# 🚀 Tecnologias Utilizadas

## 📱 Framework Mobile

- **Expo 54** – Plataforma para desenvolvimento de apps React Native
- **React Native 0.81** – Framework para construção de aplicativos móveis
- **React 19** – Biblioteca para construção de interfaces

---

# 🧭 Navegação

- **Expo Router 6** – Sistema de rotas baseado em arquivos
- **React Navigation** – Navegação entre telas

---

# 🔐 Backend e Persistência

## Firebase 12

- Firebase Authentication
- Firestore Database
- Firebase Storage

O Firebase é utilizado para:

- autenticação de usuários
- armazenamento das transações
- upload de comprovantes
- persistência dos dados da aplicação

---

# ⚡ Performance e Otimização

O projeto aplica estratégias modernas de otimização para melhorar a experiência do usuário e reduzir o tempo de carregamento da aplicação.

## Lazy Loading

Componentes mais pesados da aplicação, como gráficos e cards analíticos do dashboard, são carregados sob demanda utilizando:

- `React.lazy`
- `Suspense`

Essa abordagem reduz o carregamento inicial da aplicação e melhora a performance da interface.

---

## Gerenciamento de Estado

A aplicação utiliza **Context API** para gerenciamento global de estado, centralizando autenticação e transações em contextos desacoplados.

Também foram aplicadas otimizações utilizando:

- `useMemo`
- `useCallback`

Essas técnicas ajudam a evitar renderizações desnecessárias e tornam a aplicação mais responsiva e eficiente.

---

## Persistência Local

O projeto utiliza `AsyncStorage` integrado ao Firebase Authentication para persistência local da sessão do usuário.

Com isso, o usuário permanece autenticado mesmo após fechar e reabrir o aplicativo, melhorando a experiência de uso.

---

## Upload de Arquivos

Os comprovantes das transações podem ser enviados utilizando Firebase Storage.

Durante o processo de upload, os arquivos são armazenados temporariamente em cache local utilizando recursos do Expo Document Picker.

---

# 🏗️ Arquitetura do Projeto

O projeto foi estruturado utilizando arquitetura modular, com separação clara de responsabilidades para tornar o código mais organizado, reutilizável, escalável e de fácil manutenção.

As telas e rotas da aplicação ficam centralizadas na pasta `app`, utilizando o padrão do Expo Router para gerenciamento de navegação da aplicação mobile.

Já a pasta `src` concentra toda a lógica da aplicação organizada por responsabilidade.

A pasta `components` reúne componentes reutilizáveis da interface, como cards, botões, gráficos e cabeçalhos utilizados em diferentes partes da aplicação.

A pasta `context` centraliza o gerenciamento global de estado utilizando Context API, permitindo compartilhamento de informações entre as telas sem necessidade de prop drilling.

A pasta `business` contém as regras de negócio da aplicação, incluindo cálculos financeiros, resumos de transações e processamento dos dados utilizados nos dashboards.

Já a pasta `services` é responsável pela comunicação com serviços externos, incluindo autenticação, banco de dados e armazenamento de arquivos utilizando Firebase Authentication, Firestore e Firebase Storage.

Além disso, o projeto possui pastas específicas para tipagens TypeScript, constantes e funções utilitárias, promovendo maior reutilização de código, padronização e organização da aplicação.

Embora a estrutura não esteja dividida literalmente em pastas chamadas apresentação, domínio e infraestrutura, a organização segue os princípios dessas camadas, promovendo desacoplamento entre interface, regras de negócio e serviços externos.

Essa abordagem inspirada em Clean Architecture facilita manutenção, evolução do projeto, inclusão de novas funcionalidades e melhora significativamente a legibilidade e escalabilidade da aplicação.

---

# 📂 Estrutura de Pastas

```txt
app/
 ├── transactions/
 ├── dashboard.tsx
 ├── index.tsx
 ├── register.tsx

src/
 ├── business/
 ├── components/
 ├── constants/
 ├── context/
 ├── services/
 ├── types/
 ├── utils/
```

---

# ⚙️ Instalação

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI

---

# 📥 Clonar o projeto

```bash
git clone https://github.com/RomualdoBorges/postech_fase_3.git
cd postech_fase_3
```

---

# 📦 Instalar dependências

```bash
npm install
```

---

# ▶️ Executar o projeto

```bash
npm run start
```

Depois abra o aplicativo utilizando:

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

```env
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

⚠️ O arquivo `.env` **não deve ser enviado para o repositório**.

---

# 👥 Contribuidores

- Romualdo Borges
- Lucas Quintino

---

# 📚 Pós Tech FIAP

Projeto desenvolvido como parte do **Tech Challenge da Pós Tech FIAP**.
