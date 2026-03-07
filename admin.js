import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Mesma configuração do main.js
const firebaseConfig = {
    apiKey: "AIzaSyCeYrKyiLwgAsPKwcLkqINp_Ar2TGhaC2E",
    authDomain: "senhas-929b9.firebaseapp.com",
    projectId: "senhas-929b9",
    storageBucket: "senhas-929b9.firebasestorage.app",
    messagingSenderId: "682593159280",
    appId: "1:682593159280:web:d115d51036fdf3ae684cb5",
    measurementId: "G-9G466KSNBM"
};

let db = null;

// Lógica de Login Simples
const loginScreen = document.getElementById("loginScreen");
const painelScreen = document.getElementById("painelScreen");
const senhaAdminInput = document.getElementById("senhaAdmin");
const btnEntrar = document.getElementById("btnEntrar");
const btnSair = document.getElementById("btnSair");
const msgErro = document.getElementById("msgErro");

// A SENHA PARA ACESSAR O SISTEMA (pode alterar no futuro)
const SENHA_CORRETA = "admin123";

// Verifica se já está logado
if (localStorage.getItem("adminLogado") === "true") {
    liberarPainel();
}

btnEntrar.addEventListener("click", () => {
    const senhaDigitada = senhaAdminInput.value;
    if (senhaDigitada === SENHA_CORRETA) {
        localStorage.setItem("adminLogado", "true");
        liberarPainel();
    } else {
        msgErro.style.display = "block";
    }
});

btnSair.addEventListener("click", () => {
    localStorage.removeItem("adminLogado");
    painelScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    senhaAdminInput.value = "";
    msgErro.style.display = "none";
});

function liberarPainel() {
    loginScreen.classList.add("hidden");
    painelScreen.classList.remove("hidden");
    iniciarFirebase();
}

// Lógica para carregar os dados
function iniciarFirebase() {
    // Evita inicializar duplicado
    if (db) return;

    try {
        if (firebaseConfig.apiKey) {
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            console.log("🔥 Admin Firebase conectado");
            carregarTabela();
        } else {
            console.warn("⚠️ Firebase não configurado. Adicione suas chaves.");
            document.getElementById("tabelaSenhas").innerHTML = `<tr><td colspan="6" style="text-align: center; color:#ef4444;">O Firebase ainda não está configurado. Cadastre as chaves no arquivo.</td></tr>`;
        }
    } catch (e) {
        console.error("Erro ao conectar", e);
    }
}

// Lidar com Data Fixa
function formatarData(timestamp) {
    if (!timestamp) return "-";
    // Firestore timestamp converte assim:
    const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return data.toLocaleString('pt-BR');
}

function carregarTabela() {
    const tabelaBody = document.getElementById("tabelaSenhas");
    const labelTotal = document.getElementById("totalSenhas");

    const senhasRef = collection(db, "senhas_registradas");

    // Escuta em tempo real todas as mudanças no banco
    onSnapshot(senhasRef, (snapshot) => {
        tabelaBody.innerHTML = "";
        let count = 0;

        if (snapshot.empty) {
            tabelaBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">Nenhuma senha registrada ainda.</td></tr>`;
            labelTotal.innerText = "0";
            return;
        }

        snapshot.forEach((docSnapshot) => {
            const dados = docSnapshot.data();
            const idDoc = docSnapshot.id;
            count++;

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${formatarData(dados.dataRegistro)}</td>
                <td><strong>${dados.vaqueiro}</strong><br><small style="color:rgba(255,255,255,0.6)">Est: ${dados.esteira}</small></td>
                <td><span class="badge ${dados.categoria.toLowerCase()} badge-categoria" style="margin:0; padding:2px 6px; font-size:0.8rem">${dados.categoria}</span></td>
                <td><strong>${dados.senha}</strong></td>
                <td>${dados.dia || '-'}</td>
                <td>
                    <button class="btn-delete" data-id="${idDoc}" title="Excluir do banco (Libera a senha)">
                        <i class="fas fa-trash-alt"></i> Excluir
                    </button>
                </td>
            `;

            tabelaBody.appendChild(tr);
        });

        labelTotal.innerText = count.toString();

        // Adiciona eventos aos novos botões de deletar
        document.querySelectorAll(".btn-delete").forEach(button => {
            button.addEventListener("click", async function () {
                const docId = this.getAttribute("data-id");

                if (confirm("ATENÇÃO: Deseja realmente excluir essa inscrição? O número de senha dessa pessoa ficará disponível novamente para o público tentar selecionar.")) {
                    try {
                        await deleteDoc(doc(db, "senhas_registradas", docId));
                    } catch (error) {
                        alert("Erro ao tentar excluir " + error.message);
                    }
                }
            });
        });
    });
}
