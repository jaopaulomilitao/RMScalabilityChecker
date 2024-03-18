window.onload = function () {
    var tarefas = JSON.parse(localStorage.getItem("tarefas"));
    if (tarefas) {
        var tbody = document.getElementById("tbody");
        tarefas.forEach(function (tarefa) {
            adicionarLinhaTabela(tbody, tarefa);
        });
    }
}

function adicionarTarefa() {
    var tarefa = document.getElementById("tarefa").value.trim();
    var periodo = document.getElementById("periodo").value.trim();
    var tempo = document.getElementById("tempo").value.trim();
    var prioridade = document.getElementById("prioridade").value.trim();

    if (tarefa === '' || periodo === '' || tempo === '' || prioridade === '') {
        alert("Todos os campos devem ser preenchidos!");
        return;
    }

    var tbody = document.getElementById("tbody");
    var tarefaObj = { nome: tarefa, periodo: periodo, tempo: tempo, prioridade: prioridade };
    adicionarLinhaTabela(tbody, tarefaObj);

    // Limpar os campos de entrada após adicionar a tarefa
    document.getElementById("tarefa").value = "";
    document.getElementById("periodo").value = "";
    document.getElementById("tempo").value = "";
    document.getElementById("prioridade").value = "";

    // Salvar as tarefas no localStorage
    salvarTarefas();
}

function adicionarLinhaTabela(tbody, tarefa) {
    var newRow = tbody.insertRow();
    newRow.insertCell().innerText = tarefa.nome;
    newRow.insertCell().innerText = tarefa.periodo;
    newRow.insertCell().innerText = tarefa.tempo;
    newRow.insertCell().innerText = tarefa.prioridade;

    var cellAcoes = newRow.insertCell();

    var editarBtn = document.createElement("button");
    editarBtn.className = "btn btn-primary btn-sm";
    editarBtn.innerHTML = '<i class="bi bi-pencil"></i>';
    editarBtn.onclick = function () {
        editarTarefa(newRow, tarefa);
    };
    cellAcoes.appendChild(editarBtn);

    var excluirBtn = document.createElement("button");
    excluirBtn.className = "btn btn-danger btn-sm";
    excluirBtn.innerHTML = '<i class="bi bi-trash"></i>';
    excluirBtn.onclick = function () {
        excluirTarefa(newRow);
    };
    cellAcoes.appendChild(excluirBtn);
}

function editarTarefa(row, tarefa) {
    var cells = row.cells;
    tarefa.nome = cells[0].innerText = prompt("Digite o novo nome da tarefa:", tarefa.nome) || tarefa.nome;
    tarefa.periodo = cells[1].innerText = prompt("Digite o novo período:", tarefa.periodo) || tarefa.periodo;
    tarefa.tempo = cells[2].innerText = prompt("Digite o novo tempo de computação:", tarefa.tempo) || tarefa.tempo;
    tarefa.prioridade = cells[3].innerText = prompt("Digite a nova prioridade RM:", tarefa.prioridade) || tarefa.prioridade;
    salvarTarefas();
}

function excluirTarefa(row) {
    row.remove();
    salvarTarefas();
}

function salvarTarefas() {
    var tbody = document.getElementById("tbody");
    var rows = tbody.getElementsByTagName("tr");
    var tarefas = [];

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var tarefa = {
            nome: row.cells[0].innerText,
            periodo: row.cells[1].innerText,
            tempo: row.cells[2].innerText,
            prioridade: row.cells[3].innerText
        };
        tarefas.push(tarefa);
    }

    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function calcularEscalonamento() {
    var tbody = document.getElementById("tbody");
    var rows = tbody.getElementsByTagName("tr");

    if (rows.length === 0) {
        alert("A tabela está vazia. Adicione tarefas antes de calcular o escalonamento.");
        return;
    }

    var totalRazao = 0;

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var periodo = parseFloat(row.cells[1].innerText);
        var tempo = parseFloat(row.cells[2].innerText);

        var razao = (tempo / periodo).toFixed(4);  // Arredonda para 4 casas decimais
        totalRazao += parseFloat(razao);  // Converte de string para número e soma
    }

    var n = rows.length;
    var valorCalculado = (n * (Math.pow(2, 1 / n) - 1)).toFixed(4);

    var resultadoElement = document.getElementById("resultado");
    var resultadoMsg = "";
    var resultadoClass = "";

    if (totalRazao <= valorCalculado) {
        resultadoMsg = "O sistema é escalonável, pois " + totalRazao + " <= " + valorCalculado + ".";
        resultadoClass = "resultadoBom";
        resultadoElement.innerHTML = '<i class="bi bi-hand-thumbs-up"></i> ' + resultadoMsg;
    } else {
        resultadoMsg = "O sistema não é escalonável, pois " + totalRazao + " > " + valorCalculado + ".";
        resultadoClass = "resultadoRuim";
        resultadoElement.innerHTML = '<i class="bi bi-hand-thumbs-down"></i> ' + resultadoMsg;
    }

    resultadoElement.className = resultadoClass;
}


