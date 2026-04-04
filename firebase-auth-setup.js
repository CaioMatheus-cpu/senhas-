// 🔐 firebase-auth-setup.js
// Adicionar este arquivo ao seu HTML antes de main.js e admin.js
// Garante autenticação anônima para criar senhas com segurança

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCeYrKyiLwgAsPKwcLkqINp_Ar2TGhaC2E",
  authDomain: "senhas-929b9.firebaseapp.com",
  projectId: "senhas-929b9",
  storageBucket: "senhas-929b9.firebasestorage.app",
  messagingSenderId: "682593159280",
  appId: "1:682593159280:web:d115d51036fdf3ae684cb5",
  measurementId: "G-9G466KSNBM",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Monitora estado de autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Autenticado anonimamente - ID:", user.uid);
  } else {
    console.log("🔄 Tentando autenticar...");
    // Se não está autenticado, faz login anônimo
    signInAnonymously(auth)
      .then(() => {
        console.log("✅ Login anônimo realizado com sucesso!");
      })
      .catch((error) => {
        console.error("❌ Erro ao autenticar anonimamente:", error);
      });
  }
});

// Exporta para uso nos outros scripts
window.firebaseAuth = auth;
