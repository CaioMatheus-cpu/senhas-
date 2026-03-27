import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
let senhasOcupadasGlobais = [];

try {
    if (firebaseConfig.apiKey) {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        console.log("🔥 Firebase inicializado com sucesso!");

        // Listener em tempo real para sincronizar as senhas
        const senhasRef = collection(db, "senhas_registradas");
        onSnapshot(senhasRef, (snapshot) => {
            senhasOcupadasGlobais = [];
            snapshot.forEach((doc) => {
                senhasOcupadasGlobais.push(doc.data().senha);
            });
            atualizarSenhasDisponiveis();
        });
    } else {
        console.warn("⚠️ Firebase não configurado. As senhas não serão salvas no banco de dados.");
    }
} catch (e) {
    console.error("Erro ao inicializar Firebase", e);
}

window.senhasOcupadasGlobais = senhasOcupadasGlobais;
window.db = db;

// Obtém os elementos dos selects
const selectProfissional = document.getElementById("senhaProfissional");
const selectAspirante = document.getElementById("senhaAspirante");
const selectMaster = document.getElementById("senhaMaster");
const selectFeminina = document.getElementById("senhaFeminina");

// Obtém as boxes das categorias
const boxProfissional = document.getElementById("boxProfissional");
const boxAspirante = document.getElementById("boxAspirante");
const boxMaster = document.getElementById("boxMaster");
const boxFeminina = document.getElementById("boxFeminina");

// Campo dia da corrida
const campoDiaCorrida = document.getElementById("campoDiaCorrida");
const selectDia = document.getElementById("diaCorrida");

// Elementos de aviso
const avisoProfissional = document.getElementById("textoAvisoProfissional");
const avisoAspirante = document.getElementById("textoAvisoAspirante");

// Função para gerar números nos selects com 4 dígitos
function gerarNumeros(select, inicio, fim) {
    for (let i = inicio; i <= fim; i++) {
        const numeroFormatado = i.toString().padStart(4, '0');

        // Se a senha estiver ocupada no banco de dados, não adiciona ao select
        if (senhasOcupadasGlobais.includes(numeroFormatado)) continue;

        const option = document.createElement("option");
        option.value = numeroFormatado;
        option.textContent = numeroFormatado;
        select.appendChild(option);
    }
}

// Função para atualizar senhas disponíveis em tempo real
function atualizarSenhasDisponiveis() {
    const profValor = selectProfissional.value;
    const aspValor = selectAspirante.value;
    const masterValor = selectMaster.value;
    const femValor = selectFeminina.value;

    atualizarSelectPorDia();

    selectMaster.innerHTML = '';
    gerarNumeros(selectMaster, 2000, 2300);
    selectMaster.insertBefore(new Option('Selecione', ''), selectMaster.firstChild);

    selectFeminina.innerHTML = '';
    gerarNumeros(selectFeminina, 3000, 3300);
    selectFeminina.insertBefore(new Option('Selecione', ''), selectFeminina.firstChild);

    if (profValor && Array.from(selectProfissional.options).find(o => o.value === profValor)) selectProfissional.value = profValor;
    else if (profValor && !window.isSubmitting) alert("A senha Profissional que você escolheu acabou de ser reservada por outra pessoa!");

    if (aspValor && Array.from(selectAspirante.options).find(o => o.value === aspValor)) selectAspirante.value = aspValor;
    else if (aspValor && !window.isSubmitting) alert("A senha Aspirante que você escolheu acabou de ser reservada por outra pessoa!");

    if (masterValor && Array.from(selectMaster.options).find(o => o.value === masterValor)) selectMaster.value = masterValor;
    else if (masterValor && !window.isSubmitting) alert("A senha Master que você escolheu acabou de ser reservada por outra pessoa!");

    if (femValor && Array.from(selectFeminina.options).find(o => o.value === femValor)) selectFeminina.value = femValor;
    else if (femValor && !window.isSubmitting) alert("A senha Feminina que você escolheu acabou de ser reservada por outra pessoa!");
}

// Inicializa options Master e Feminina a 1a vez
selectMaster.innerHTML = '';
gerarNumeros(selectMaster, 2000, 2300);

selectFeminina.innerHTML = '';
gerarNumeros(selectFeminina, 3000, 3300);

// Função para atualizar os selects baseado no dia escolhido
function atualizarSelectPorDia() {
    const dia = selectDia.value;

    // Limpa e desabilita os selects
    selectProfissional.innerHTML = '';
    selectAspirante.innerHTML = '';
    selectProfissional.disabled = true;
    selectAspirante.disabled = true;

    if (!dia) {
        selectProfissional.innerHTML = '<option value="">Primeiro selecione o dia</option>';
        selectAspirante.innerHTML = '<option value="">Primeiro selecione o dia</option>';
        avisoProfissional.innerText = 'Selecione o dia primeiro';
        avisoAspirante.innerText = 'Selecione o dia primeiro';
        return;
    }

    if (dia === "Sexta") {
        selectProfissional.disabled = false;
        gerarNumeros(selectProfissional, 1, 100);
        avisoProfissional.innerHTML = '✅ Sexta-feira: Senhas 001 a 100';

        selectAspirante.disabled = false;
        gerarNumeros(selectAspirante, 1001, 1150);
        avisoAspirante.innerHTML = '✅ Sexta-feira: Senhas 1.001 a 1.150';
    }
    else if (dia === "Sabado") {
        selectProfissional.disabled = false;
        gerarNumeros(selectProfissional, 101, 300);
        avisoProfissional.innerHTML = '➡️ Sábado: Senhas 101 a 300';

        selectAspirante.disabled = false;
        gerarNumeros(selectAspirante, 1151, 1300);
        avisoAspirante.innerHTML = '➡️ Sábado: Senhas 1.151 a 1.300';
    }

    selectProfissional.insertBefore(new Option('Selecione o número', ''), selectProfissional.firstChild);
    selectAspirante.insertBefore(new Option('Selecione o número', ''), selectAspirante.firstChild);
    selectProfissional.value = '';
    selectAspirante.value = '';
}

// Função para resetar o campo dia
function resetarCampoDia() {
    selectDia.value = '';
    campoDiaCorrida.classList.add("hidden");
    selectDia.required = false;
}

// Mostra o bloco conforme a categoria selecionada
document.getElementById("categoria").addEventListener("change", function () {
    const categoria = this.value;

    // Esconde todas as boxes
    boxProfissional.classList.add("hidden");
    boxAspirante.classList.add("hidden");
    boxMaster.classList.add("hidden");
    boxFeminina.classList.add("hidden");

    // Esconde e reseta o campo dia
    resetarCampoDia();

    if (categoria === "Profissional") {
        boxProfissional.classList.remove("hidden");
        campoDiaCorrida.classList.remove("hidden");
        selectDia.required = true;
    }
    if (categoria === "Aspirante") {
        boxAspirante.classList.remove("hidden");
        campoDiaCorrida.classList.remove("hidden");
        selectDia.required = true;
    }
    if (categoria === "Master") {
        boxMaster.classList.remove("hidden");
    }
    if (categoria === "Feminina") {
        boxFeminina.classList.remove("hidden");
    }
});

// Atualiza quando o dia muda
selectDia.addEventListener("change", function () {
    const categoria = document.getElementById("categoria").value;
    if (categoria === "Profissional" || categoria === "Aspirante") {
        atualizarSelectPorDia();
    }
});

// Função para remover número selecionado
function removerNumeroEscolhido(select) {
    const valor = select.value;
    if (!valor) return;

    const option = Array.from(select.options).find(o => o.value === valor);
    if (option) option.remove();

    select.value = "";
}

// Array para contar senhas por vaqueiro
let senhasUtilizadas = {};

document.getElementById("enviar").addEventListener("click", async function () {
    const nome = document.getElementById("nomeVaqueiro").value.trim();
    const esteira = document.getElementById("nomeEsteira").value.trim();
    const representacao = document.getElementById("representacao").value.trim();
    const categoria = document.getElementById("categoria").value;
    const boitv = document.getElementById("boitv").value;

    const diaCorrida = (categoria === "Profissional" || categoria === "Aspirante") ? selectDia.value : '';

    const senhaProf = selectProfissional.value;
    const senhaAsp = selectAspirante.value;
    const senhaMaster = selectMaster.value;
    const senhaFem = selectFeminina.value;

    if (!nome || !esteira || !categoria || !boitv) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    if ((categoria === "Profissional" || categoria === "Aspirante") && !diaCorrida) {
        alert("Selecione o dia da corrida!");
        return;
    }

    if (categoria === "Profissional" && !senhaProf) {
        alert("Selecione o número da senha!");
        return;
    }
    if (categoria === "Aspirante" && !senhaAsp) {
        alert("Selecione o número da senha!");
        return;
    }
    if (categoria === "Master" && !senhaMaster) {
        alert("Selecione o número da senha!");
        return;
    }
    if (categoria === "Feminina" && !senhaFem) {
        alert("Selecione o número da senha!");
        return;
    }

    const chaveVaqueiro = nome.toLowerCase();
    if (!senhasUtilizadas[chaveVaqueiro]) {
        senhasUtilizadas[chaveVaqueiro] = 0;
    }

    if (senhasUtilizadas[chaveVaqueiro] >= 4) {
        alert("⚠️ Limite de 4 senhas por vaqueiro atingido!");
        return;
    }

    senhasUtilizadas[chaveVaqueiro]++;

    let mensagem = `🏇 PARQUE PAI E FILHO 🏇\n`;
    mensagem += `📍 Sítio Saco do Romão/Flores-PE\n`;
    mensagem += `🏆 15MIL EM PRÊMIOS\n\n`;
    mensagem += `👤 Vaqueiro: ${nome}\n`;
    mensagem += `🐎 Esteira: ${esteira}\n`;

    if (representacao) mensagem += `🏷 Representação: ${representacao}\n`;

    if (categoria === "Profissional" || categoria === "Aspirante") {
        mensagem += `📅 Dia: ${diaCorrida}\n`;
    }

    let valorTotal = 0;

    if (categoria === "Profissional") {
        valorTotal += 250;
        mensagem += `🏆 Categoria: PROFISSIONAL\n`;
        mensagem += `💰 10MIL - R$250 (3 bois)\n`;
        mensagem += `🔢 Senha: ${senhaProf}\n`;
    }

    if (categoria === "Aspirante") {
        valorTotal += 150;
        mensagem += `⭐ Categoria: ASPIRANTE\n`;
        mensagem += `💰 5MIL - R$150 (2 bois)\n`;
        mensagem += `🔢 Senha: ${senhaAsp}\n`;
    }

    if (categoria === "Master") {
        valorTotal += 150;
        mensagem += `👑 Categoria: MASTER\n`;
        mensagem += `💰 40% - R$150 (2 bois)\n`;
        mensagem += `🔢 Senha: ${senhaMaster}\n`;
    }

    if (categoria === "Feminina") {
        valorTotal += 100;
        mensagem += `👧 Categoria: FEMININA\n`;
        mensagem += `💰 30% - R$100 (2 bois)\n`;
        mensagem += `🔢 Senha: ${senhaFem}\n`;
    }

    if (boitv === 'Sim') {
        valorTotal += 100;
    }

    mensagem += `📺 Boi TV: ${boitv}${boitv === 'Sim' ? ' ( R$100)' : ''}\n\n`;
    mensagem += `🔹 Rabo da gata:  1 boi\n`;
    mensagem += `🔹 Restam: ${4 - senhasUtilizadas[chaveVaqueiro]} de 4 senhas\n`;
    mensagem += `Inscrição online`;
    const telefone = "5583999587010";
    const waUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    // Tenta abrir o WhatsApp PRIMEIRO para garantir o redirecionamento (evita bloqueador de popup)
    const waWindow = window.open(waUrl, "_blank");

    // Verifica se conseguiu abrir
    if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
        alert("⚠️ O redirecionamento para o WhatsApp foi bloqueado!\n\nPor favor, permita os pop-ups do seu navegador para esta página e tente novamente.");
        senhasUtilizadas[chaveVaqueiro]--; // Remove da contagem já que falhou
        return;
    }

    window.isSubmitting = true;

    const btnEnvia = document.getElementById("enviar");
    const btnTextoOriginal = btnEnvia.innerHTML;

    if (db) {
        try {
            btnEnvia.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando online...';
            btnEnvia.disabled = true;

            const senhasParaRegistrar = [];
            if (categoria === "Profissional" && senhaProf) senhasParaRegistrar.push({ categoria: "Profissional", senha: senhaProf, dia: diaCorrida });
            if (categoria === "Aspirante" && senhaAsp) senhasParaRegistrar.push({ categoria: "Aspirante", senha: senhaAsp, dia: diaCorrida });
            if (categoria === "Master" && senhaMaster) senhasParaRegistrar.push({ categoria: "Master", senha: senhaMaster });
            if (categoria === "Feminina" && senhaFem) senhasParaRegistrar.push({ categoria: "Feminina", senha: senhaFem });

            for (const s of senhasParaRegistrar) {
                await addDoc(collection(db, "senhas_registradas"), {
                    vaqueiro: nome,
                    esteira: esteira,
                    categoria: s.categoria,
                    senha: s.senha,
                    dia: s.dia || null,
                    dataRegistro: new Date()
                });
            }
        } catch (e) {
            console.error("Erro ao salvar no Firestore", e);
            alert("Erro ao registrar no banco de dados. Verifique a conexão.");
            btnEnvia.innerHTML = btnTextoOriginal;
            btnEnvia.disabled = false;
            window.isSubmitting = false;
            return;
        }
    }

    btnEnvia.innerHTML = '<i class="fas fa-check"></i> Enviado!';
    setTimeout(() => {
        btnEnvia.innerHTML = btnTextoOriginal;
        btnEnvia.disabled = false;
    }, 3000);

    if (categoria === "Profissional") removerNumeroEscolhido(selectProfissional);
    if (categoria === "Aspirante") removerNumeroEscolhido(selectAspirante);
    if (categoria === "Master") removerNumeroEscolhido(selectMaster);
    if (categoria === "Feminina") removerNumeroEscolhido(selectFeminina);

    window.isSubmitting = false;

    // Não precisa de alert com window.open pois já foi redirecionado
    console.log(`✅ Inscrição enviada! Você usou ${senhasUtilizadas[chaveVaqueiro]} de 4 senhas.`);
});
