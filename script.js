const palavras = ["carta", "piano", "magia", "navio", "lapis"];
const palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];
const game = document.getElementById("game");
const teclado = document.getElementById("keyboard");

let tentativa = "";
let linhaAtual = 0;

function criarTabuleiro() {
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 5; j++) {  // ajustado para 5 tiles por linha
      const tile = document.createElement("div");
      tile.className = "tile";
      row.appendChild(tile);
    }
    game.appendChild(row);
  }
}

function criarTeclado() {
  const letras = "qwertyuiopasdfghjklzxcvbnm".split("");
  letras.push("⌫", "↵"); // Enter e Backspace
  letras.forEach(letra => {
    const key = document.createElement("button");
    key.textContent = letra;
    key.className = "key";
    key.id = "key-" + letra;
    key.onclick = () => teclaPressionada(letra);
    teclado.appendChild(key);
  });
}

function teclaPressionada(letra) {
  if (linhaAtual >= 6) return;

  const linha = game.children[linhaAtual];
  if (letra === "⌫") {
    tentativa = tentativa.slice(0, -1);
  } else if (letra === "↵") {
    if (tentativa.length === 5) verificarTentativa();
    return;
  } else if (tentativa.length < 5) {
    tentativa += letra;
  }

  [...linha.children].forEach((tile, i) => {
    tile.textContent = tentativa[i] ? tentativa[i] : "";
  });
}

function verificarTentativa() {
  const linha = game.children[linhaAtual];
  const letras = palavraSecreta.split("");

  for (let i = 0; i < 5; i++) {
    const tile = linha.children[i];
    tile.classList.add("flip");
    const letra = tentativa[i];

    setTimeout(() => {
      if (letra === palavraSecreta[i]) {
        tile.classList.add("correct");
        colorirTecla(letra, "correct");
      } else if (letras.includes(letra)) {
        tile.classList.add("present");
        colorirTecla(letra, "present");
      } else {
        tile.classList.add("absent");
        colorirTecla(letra, "absent");
      }
    }, i * 300);
  }

  if (tentativa === palavraSecreta) {
    setTimeout(() => alert("🎉 Você acertou!"), 1800);
  } else if (linhaAtual === 5) {
    setTimeout(() => alert(`Fim de jogo! A palavra era: ${palavraSecreta}`), 1800);
  }

  linhaAtual++;
  tentativa = "";
}

function colorirTecla(letra, classe) {
  const tecla = document.getElementById("key-" + letra);
  if (!tecla) return;

  const prioridade = {
    correct: 3,
    present: 2,
    absent: 1
  };

  const atual = tecla.dataset.estado;
  if (!atual || prioridade[classe] > prioridade[atual]) {
    tecla.classList.remove("correct", "present", "absent");
    tecla.classList.add(classe);
    tecla.dataset.estado = classe;
  }
}

criarTabuleiro();
criarTeclado();
