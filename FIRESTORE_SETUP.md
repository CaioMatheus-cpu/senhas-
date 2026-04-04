# 🔐 Configuração de Regras de Segurança - Firestore

## ⚠️ Situação Urgente

Seu banco Firestore está em **Teste Aberto** e será bloqueado em **1 dia**. Siga os passos abaixo imediatamente.

---

## 📋 Passo a Passo para Implementar as Regras

### 1️⃣ Acesse o Console Firebase

- Vá para: https://console.firebase.google.com
- Selecione o projeto: **senhas-929b9**
- No menu lateral, clique em **Firestore Database**

### 2️⃣ Acesse as Regras de Segurança

- Clique na aba **Rules** (Regras)
- Você verá as regras atuais em "Test mode"

### 3️⃣ Copie as Novas Regras

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Permite que usuários autenticados leiam a coleção de senhas registradas
    match /senhas_registradas/{document=**} {
      // Leitura permitida para todos (necessário para verificar senhas disponíveis)
      allow read: if true;

      // Criação de novo documento apenas com validação de campos obrigatórios
      allow create: if request.auth != null && validarNovaSenh();

      // Exclusão apenas para admin (será bloqueada nesta versão)
      allow delete: if false;

      // Atualização bloqueada para manter integridade dos dados
      allow update: if false;
    }

    // Valida campos obrigatórios na criação
    function validarNovaSenh() {
      let dados = request.resource.data;

      return dados.size() > 0 &&
             dados.keys().hasAll(['nome', 'esteira', 'categoria', 'senha', 'dia']) &&
             dados.nome is string &&
             dados.nome.size() > 0 &&
             dados.esteira is string &&
             dados.esteira.size() > 0 &&
             dados.categoria is string &&
             dados.categoria.size() > 0 &&
             dados.senha is string &&
             dados.senha.size() == 4 &&
             dados.dia is string &&
             (dados.dia == "Sexta" || dados.dia == "Sábado");
    }
  }
}
```

### 4️⃣ Cole as Regras no Console

1. Apague todo o conteúdo da aba Rules
2. Cole as novas regras acima
3. Clique em **Publicar** (Publish)
4. Aguarde a confirmação

---

## 🔄 Próximas Melhorias Recomendadas

### ✅ Melhoria 1: Autenticação Firebase Real (Prioridade Alta)

Atualmente, o admin usa apenas localStorage (inseguro). Implementar:

- Google Sign-In para admin
- Verificação de email de admin no Firestore
- Role de "admin" para exclusão de senhas

### ✅ Melhoria 2: Segurança Aumentada

- Limitar leitura apenas para senhas do dia atual
- Adicionar timestamp automático nas criações
- Log de exclusões de senhas

### ✅ Melhoria 3: Exclusão de Senhas Segura

Quando estiver pronto, modificar regra para:

```javascript
allow delete: if request.auth != null &&
             get(/databases/$(database)/documents/admins/$(request.auth.uid)) != null;
```

---

## 📊 O Que As Regras Fazem

| Operação        | Antes (Teste)  | Depois (Seguro)                   |
| --------------- | -------------- | --------------------------------- |
| **Leitura**     | ✅ Qualquer um | ✅ Qualquer um (necessário)       |
| **Criação**     | ✅ Qualquer um | ✅ Apenas autenticado + validação |
| **Exclusão**    | ✅ Qualquer um | ❌ Bloqueado (use admin manual)   |
| **Atualização** | ✅ Qualquer um | ❌ Bloqueado                      |

---

## ⏰ Cronograma

| Data         | Ação                                                       |
| ------------ | ---------------------------------------------------------- |
| **Hoje**     | ✅ Implementar regras de segurança                         |
| **Em 1 dia** | Firestore bloqueará todas as requisições se não fizer isso |

---

## ❓ Dúvidas Técnicas

**P: Por que leitura ainda é permitida?**
R: Necessário para o cliente verificar quais senhas já estão reservadas em tempo real.

**P: Por que exclusão está bloqueada?**
R: Para evitar que usuários maliciosos deletem dados. Gerencie exclusões manualmente no admin console ou crie um painel admin autenticado com Firebase Auth.

**P: Meus usuários conseguem criar senhas agora?**
R: Sim, uma vez que estejam autenticados. No futuro, implemente autenticação anônima do Firebase.

---

## 🚀 Próximo Passo: Autenticação Anônima (Recomendado)

Para permitir que usuários criem senhas sem login, use autenticação anônima:

```javascript
// No seu main.js, adicione:
import {
  getAuth,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const auth = getAuth(app);
signInAnonymously(auth)
  .then(() => console.log("✅ Autenticado anonimamente"))
  .catch((error) => console.error("❌ Erro:", error));
```

E atualize a regra Firestore:

```javascript
allow create: if request.auth != null && validarNovaSenh();
```

---

**⚠️ IMPLEMENTAR AGORA! Você tem menos de 1 dia!**
