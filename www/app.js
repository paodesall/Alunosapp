let alunos = [];
let proximoId = 1;
const CHAVE = "alunos_app_database";

function carregar() {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) {
        try {
            alunos = JSON.parse(salvo);
            proximoId = alunos.length ? Math.max(...alunos.map(a => a.id)) + 1 : 1;
        } catch (e) {
            alunos = [];
            proximoId = 1;
        }
    }
    listar();
}

function persistir() {
    localStorage.setItem(CHAVE, JSON.stringify(alunos));
}

function listar() {
    const tbody = document.getElementById("listaAlunos");
    tbody.innerHTML = "";

    if (alunos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#64748b;">Nenhum aluno cadastrado.</td></tr>';
        return;
    }

    for (let i = 0; i < alunos.length; i++) {
        const a = alunos[i];
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = "#" + a.id;

        const tdNome = document.createElement("td");
        const strong = document.createElement("strong");
        strong.textContent = a.nome;
        tdNome.appendChild(strong);

        const tdIdade = document.createElement("td");
        tdIdade.textContent = a.idade ? a.idade + " anos" : "-";

        const tdAcoes = document.createElement("td");
        const btn = document.createElement("button");
        btn.className = "btn-del";
        btn.textContent = "Excluir";
        btn.addEventListener("click", function () { excluir(a.id); });
        tdAcoes.appendChild(btn);

        tr.appendChild(tdId);
        tr.appendChild(tdNome);
        tr.appendChild(tdIdade);
        tr.appendChild(tdAcoes);
        tbody.appendChild(tr);
    }
}

function salvar() {
    const n = document.getElementById("nome");
    const e = document.getElementById("email");
    const i = document.getElementById("idade");

    if (!n.value.trim()) {
        alert("Preencha o nome!");
        return;
    }

    alunos.push({
        id: proximoId++,
        nome: n.value.trim(),
        email: e.value.trim(),
        idade: i.value.trim()
    });

    n.value = "";
    e.value = "";
    i.value = "";

    persistir();
    listar();
}

function excluir(id) {
    alunos = alunos.filter(a => a.id !== id);
    persistir();
    listar();
}

carregar();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js")
            .then(function () { console.log("Service Worker registrado"); })
            .catch(function (err) { console.warn("Falha no SW:", err); });
    });
}
