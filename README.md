
# ✅ Task+ - Organize suas tarefas com eficiência!

Este é um projeto desenvolvido em **Next.js + TypeScript** que permite gerenciar tarefas e comentários com autenticação via **Google (NextAuth)**. O sistema utiliza estratégias avançadas como **SSR (Server-Side Rendering)** e **SSG (Static Site Generation)**, proporcionando uma experiência rápida e otimizada para o usuário.

---

## ✨ Funcionalidades

- 🔐 Autenticação via Google com NextAuth
- 📌 Cadastro e listagem de tarefas
- 💬 Comentários por tarefa
- 🚀 SSR: carrega dados das tarefas de forma dinâmica com `getServerSideProps`
- ⚡ SSG: gera páginas estáticas com o total de tarefas e comentários
- 🧠 Uso de React Hooks
- 🔥 Integração com Firebase (Firestore)
- 🎨 Estilização com CSS Modules
- 🧼 Código organizado e componentizado com foco em escalabilidade

---

## 🛠️ Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase Firestore](https://firebase.google.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Vercel](https://vercel.com/)

---

## ⚙️ Como rodar o projeto localmente

```bash
# Clone o repositório
git clone https://github.com/DevBrigante/Task-

# Acesse a pasta do projeto
cd task-

# Instale as dependências
npm install

# Crie um arquivo .env.local e adicione suas variáveis:
```

### 📄 .env.local

```env
GOOGLE_CLIENT_ID=SUACHAVE
GOOGLE_CLIENT_SECRET=SUACHAVE
JWT_SECRET=ALGUMASEGREDO
NEXT_PUBLIC_URL=http://localhost:3000

FIREBASE_API_KEY=SUACHAVE
FIREBASE_AUTH_DOMAIN=SUACHAVE
FIREBASE_PROJECT_ID=SUACHAVE
FIREBASE_STORAGE_BUCKET=SUACHAVE
FIREBASE_MESSAGING_SENDER_ID=SUACHAVE
FIREBASE_APP_ID=SUACHAVE
```

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 🧠 Estrutura de pastas

```
📁 src
 ┣ 📁 components         # Componentes como Header e TextArea
 ┣ 📁 pages              # Páginas como index, dashboard, [id].tsx
 ┃ ┗ 📁 api/auth         # Configuração do NextAuth
 ┣ 📁 services           # Firebase Connection
 ┣ 📁 styles             # CSS Modules (globais e modulares)
 ┗ 📄 next.config.ts     # Configuração do projeto
```

---

## 🧪 Exemplo de uso do SSR

```tsx
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const docRef = doc(db, "tasks", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return {
    props: {
      task: snapshot.data(),
    },
  };
};
```

---

## 📊 Exemplo de uso do SSG

```tsx
export const getStaticProps: GetStaticProps = async () => {
  const commentsSnapshot = await getDocs(collection(db, "comments"));
  const tasksSnapshot = await getDocs(collection(db, "tasks"));

  return {
    props: {
      comments: commentsSnapshot.size,
      tasks: tasksSnapshot.size,
    },
    revalidate: 60,
  };
};
```

---

## 🔐 Autenticação com NextAuth

```tsx
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);
```

---

## 🙋 Como usar

1. Faça login com sua conta Google
2. Crie novas tarefas pelo painel
3. Veja os comentários e interaja nas páginas das tarefas
4. Gerencie suas tarefas no dashboard

---

## 💡 Aprendizados

- Utilização combinada de **SSR e SSG**
- Estrutura de autenticação com **NextAuth e Google**
- Criação de rotas dinâmicas com parâmetros (`[id].tsx`)
- Utilização de **Firestore** como backend flexível e escalável
- Boas práticas com **CSS Modules**, revalidação e tipos com TypeScript

---

## 📄 Licença

MIT © Brenno – Projeto com fins de prática e portfólio
