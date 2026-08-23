let pontos = 0;
let vidas = 3;
let combo = 0;
let nivel = 1;

let modoAtual = null;

let perguntasDisponiveis = [];

let perguntaAtual = null;

const perguntaHTML =
    document.getElementById("pergunta");

const alternativasHTML =
    document.getElementById("alternativas");

const pontosHTML =
    document.getElementById("pontos");

const vidasHTML =
    document.getElementById("vidas");

const comboHTML =
    document.getElementById("combo");

const nivelHTML =
    document.getElementById("nivel");

const mensagemHTML =
    document.getElementById("mensagem");

const botaoProxima =
    document.getElementById("proxima");

const imagemAnimal =
    document.getElementById("animal");

const btnMacho =
    document.getElementById("btnMacho");

const btnFemea =
    document.getElementById("btnFemea");

const btnAleatorio =
    document.getElementById("btnAleatorio");

const btnDefinicao =
    document.getElementById("btnDefinicao");


/* =====================================================
   INICIAR JOGO
   ===================================================== */

function iniciarJogo(modo) {

    pontos = 0;
    vidas = 3;
    combo = 0;
    nivel = 1;

    pontosHTML.textContent = pontos;
    vidasHTML.textContent = vidas;
    comboHTML.textContent = combo;
    nivelHTML.textContent = nivel;

    modoAtual = modo;

    mensagemHTML.innerHTML = "";

    alternativasHTML.innerHTML = "";

    if (modo === "macho") {

        perguntasDisponiveis =
            perguntas.filter(
                p => p.animal === "macho"
            );

        imagemAnimal.src =
            "imagens/boi_numerado.png";

        imagemAnimal.alt =
            "Boi com regiões zootécnicas numeradas";

        sortearPergunta();

    }

    else if (modo === "femea") {

        perguntasDisponiveis =
            perguntas.filter(
                p => p.animal === "femea"
            );

        imagemAnimal.src =
            "imagens/vaca_numerada.png";

        imagemAnimal.alt =
            "Vaca com regiões zootécnicas numeradas";

        sortearPergunta();

    }

    else if (modo === "aleatorio") {

        perguntasDisponiveis =
            [...perguntas];

        sortearPergunta();

    }

    else if (modo === "definicao") {

        perguntasDisponiveis =
            [...perguntas];

        sortearPerguntaDefinicao();

    }
}


/* =====================================================
   IMAGEM DO ANIMAL
   ===================================================== */

function escolherImagem(pergunta) {

    if (pergunta.animal === "macho") {

        imagemAnimal.src =
            "imagens/boi_numerado.png";

        imagemAnimal.alt =
            "Boi com regiões zootécnicas numeradas";

    } else {

        imagemAnimal.src =
            "imagens/vaca_numerada.png";

        imagemAnimal.alt =
            "Vaca com regiões zootécnicas numeradas";
    }
}


/* =====================================================
   NÍVEL
   ===================================================== */

function atualizarNivel() {

    const novoNivel =
        Math.floor(pontos / 100) + 1;

    if (novoNivel !== nivel) {

        nivel = novoNivel;

        nivelHTML.textContent = nivel;

        mensagemHTML.innerHTML =
            `🎉 Você chegou ao <strong>Nível ${nivel}</strong>!`;
    }
}


/* =====================================================
   SORTEAR PERGUNTA
   ===================================================== */

function sortearPergunta() {

    if (vidas <= 0) {

        finalizarJogo();

        return;
    }

    if (perguntasDisponiveis.length === 0) {

        finalizarJogo();

        return;
    }

    const indice =
        Math.floor(
            Math.random() *
            perguntasDisponiveis.length
        );

    perguntaAtual =
        perguntasDisponiveis[indice];

    perguntasDisponiveis.splice(
        indice,
        1
    );

    escolherImagem(perguntaAtual);

    mostrarPerguntaNumero();
}


function sortearPerguntaDefinicao() {

    if (vidas <= 0) {

        finalizarJogo();

        return;
    }

    if (perguntasDisponiveis.length === 0) {

        finalizarJogo();

        return;
    }

    const indice =
        Math.floor(
            Math.random() *
            perguntasDisponiveis.length
        );

    perguntaAtual =
        perguntasDisponiveis[indice];

    perguntasDisponiveis.splice(
        indice,
        1
    );

    escolherImagem(perguntaAtual);

    mostrarPerguntaDefinicao();
}


/* =====================================================
   ALTERNATIVAS — NÚMEROS
   ===================================================== */

function criarAlternativasNumero(
    numeroCorreto
) {

    const numeros =
        new Set();

    numeros.add(
        numeroCorreto
    );

    while (
        numeros.size < 4
    ) {

        const numero =
            Math.floor(
                Math.random() * 36
            ) + 1;

        numeros.add(numero);
    }

    const lista =
        [...numeros];

    lista.sort(
        () => Math.random() - 0.5
    );

    return lista;
}


/* =====================================================
   ALTERNATIVAS — TERMOS
   ===================================================== */

function criarAlternativasTermo(
    termoCorreto
) {

    const termos =
        new Set();

    termos.add(
        termoCorreto
    );

    while (
        termos.size < 4
    ) {

        const indice =
            Math.floor(
                Math.random() *
                perguntas.length
            );

        termos.add(
            perguntas[indice].termo
        );
    }

    const lista =
        [...termos];

    lista.sort(
        () => Math.random() - 0.5
    );

    return lista;
}


/* =====================================================
   MOSTRAR PERGUNTA — NÚMERO
   ===================================================== */

function mostrarPerguntaNumero() {

    mensagemHTML.innerHTML = "";

    botaoProxima.style.display =
        "none";

    perguntaHTML.innerHTML =
        `Qual é o número correspondente à <strong>${perguntaAtual.termo}</strong>?`;

    alternativasHTML.innerHTML = "";

    const alternativas =
        criarAlternativasNumero(
            perguntaAtual.numero
        );

    alternativas.forEach(
        numero => {

            const botao =
                document.createElement(
                    "button"
                );

            botao.className =
                "alternativa";

            botao.textContent =
                numero;

            botao.addEventListener(
                "click",
                () =>
                    verificarNumero(
                        numero,
                        botao
                    )
            );

            alternativasHTML.appendChild(
                botao
            );
        }
    );
}


/* =====================================================
   MOSTRAR PERGUNTA — DEFINIÇÃO
   ===================================================== */

function mostrarPerguntaDefinicao() {

    mensagemHTML.innerHTML = "";

    botaoProxima.style.display =
        "none";

    perguntaHTML.innerHTML =
        `
        <span class="titulo-definicao">
            Qual estrutura corresponde à definição?
        </span>

        <br>

        <span class="texto-definicao">
            ${perguntaAtual.definicao}
        </span>
        `;

    alternativasHTML.innerHTML = "";

    const alternativas =
        criarAlternativasTermo(
            perguntaAtual.termo
        );

    alternativas.forEach(
        termo => {

            const botao =
                document.createElement(
                    "button"
                );

            botao.className =
                "alternativa";

            botao.textContent =
                termo;

            botao.addEventListener(
                "click",
                () =>
                    verificarDefinicao(
                        termo,
                        botao
                    )
            );

            alternativasHTML.appendChild(
                botao
            );
        }
    );
}


/* =====================================================
   VERIFICAR NÚMERO
   ===================================================== */

function verificarNumero(
    numeroEscolhido,
    botao
) {

    bloquearAlternativas();

    if (
        numeroEscolhido ===
        perguntaAtual.numero
    ) {

        botao.classList.add(
            "correta"
        );

        combo++;

        let ganho = 10;

        if (combo >= 5) {

            ganho += 20;

        } else if (combo >= 3) {

            ganho += 10;

        }

        pontos += ganho;

        pontosHTML.textContent =
            pontos;

        comboHTML.textContent =
            combo;

        atualizarNivel();

        mensagemHTML.innerHTML =
            `✅ Correto! +${ganho} pontos`;

    } else {

        botao.classList.add(
            "errada"
        );

        combo = 0;

        vidas--;

        comboHTML.textContent =
            combo;

        vidasHTML.textContent =
            vidas;

        destacarRespostaNumero();

        mensagemHTML.innerHTML =
            `❌ Incorreto! Você perdeu 1 vida.`;

        if (vidas <= 0) {

            finalizarJogo();

            return;
        }
    }

    botaoProxima.style.display =
        "block";
}


/* =====================================================
   VERIFICAR DEFINIÇÃO
   ===================================================== */

function verificarDefinicao(
    termoEscolhido,
    botao
) {

    bloquearAlternativas();

    if (
        termoEscolhido ===
        perguntaAtual.termo
    ) {

        botao.classList.add(
            "correta"
        );

        combo++;

        let ganho = 10;

        if (combo >= 5) {

            ganho += 20;

        } else if (combo >= 3) {

            ganho += 10;

        }

        pontos += ganho;

        pontosHTML.textContent =
            pontos;

        comboHTML.textContent =
            combo;

        atualizarNivel();

        mensagemHTML.innerHTML =
            `✅ Correto! +${ganho} pontos`;

    } else {

        botao.classList.add(
            "errada"
        );

        combo = 0;

        vidas--;

        comboHTML.textContent =
            combo;

        vidasHTML.textContent =
            vidas;

        destacarRespostaTermo();

        mensagemHTML.innerHTML =
            `❌ Incorreto! Você perdeu 1 vida.`;

        if (vidas <= 0) {

            finalizarJogo();

            return;
        }
    }

    botaoProxima.style.display =
        "block";
}


/* =====================================================
   BLOQUEAR ALTERNATIVAS
   ===================================================== */

function bloquearAlternativas() {

    const botoes =
        document.querySelectorAll(
            ".alternativa"
        );

    botoes.forEach(
        botao => {
            botao.disabled = true;
        }
    );
}


/* =====================================================
   DESTACAR RESPOSTA
   ===================================================== */

function destacarRespostaNumero() {

    const botoes =
        document.querySelectorAll(
            ".alternativa"
        );

    botoes.forEach(
        botao => {

            if (
                Number(botao.textContent) ===
                perguntaAtual.numero
            ) {

                botao.classList.add(
                    "correta"
                );
            }
        }
    );
}


function destacarRespostaTermo() {

    const botoes =
        document.querySelectorAll(
            ".alternativa"
        );

    botoes.forEach(
        botao => {

            if (
                botao.textContent ===
                perguntaAtual.termo
            ) {

                botao.classList.add(
                    "correta"
                );
            }
        }
    );
}


/* =====================================================
   FINALIZAR
   ===================================================== */

function finalizarJogo() {

    alternativasHTML.innerHTML = "";

    perguntaHTML.innerHTML =
        "🏁 Fim de jogo!";

    if (vidas <= 0) {

        mensagemHTML.innerHTML =
            `
            ❤️ Você ficou sem vidas.

            <br><br>

            ⭐ Pontuação:
            <strong>${pontos}</strong>

            <br>

            🔥 Maior sequência:
            <strong>${combo}</strong>
            `;

    } else {

        mensagemHTML.innerHTML =
            `
            🎉 Você terminou todas as perguntas!

            <br><br>

            ⭐ Pontuação final:
            <strong>${pontos}</strong>
            `;
    }

    botaoProxima.style.display =
        "none";
}


/* =====================================================
   BOTÃO PRÓXIMA
   ===================================================== */

botaoProxima.addEventListener(
    "click",
    () => {

        if (
            modoAtual ===
            "definicao"
        ) {

            sortearPerguntaDefinicao();

        } else {

            sortearPergunta();
        }
    }
);


/* =====================================================
   BOTÕES DE MODO
   ===================================================== */

btnMacho.addEventListener(
    "click",
    () => iniciarJogo("macho")
);

btnFemea.addEventListener(
    "click",
    () => iniciarJogo("femea")
);

btnAleatorio.addEventListener(
    "click",
    () => iniciarJogo("aleatorio")
);

btnDefinicao.addEventListener(
    "click",
    () => iniciarJogo("definicao")
);