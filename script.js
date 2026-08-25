/* =========================================================
   CONEXÃO COM SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://qsccgzlwtanwxunclhqd.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_XIZtmNAPdKhgpeSev_FxhA_x2xax96t";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   TESTE DA CONEXÃO
   ========================================================= */

async function testarSupabase() {

    const { data, error } =
        await supabaseClient
            .from("ranking_ezoognosia")
            .select("*")
            .limit(1);

    if (error) {

        console.error(
            "Erro Supabase:",
            error
        );

        return;
    }

    console.log(
        "Supabase conectado!",
        data
    );
}

testarSupabase();


/* =========================================================
   VARIÁVEIS DO JOGO
   ========================================================= */

let nomeJogador = "";

let pontos = 0;

let vidas = 2;

let combo = 0;

let maiorCombo = 0;

let nivel = 1;

let acertos = 0;

let erros = 0;

let modoAtual = null;

let perguntasDisponiveis = [];

let perguntaAtual = null;

let partidaFinalizada = false;


/* =========================================================
   ELEMENTOS HTML
   ========================================================= */

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


const campoNome =
    document.getElementById("nomeJogador");

const btnSalvarNome =
    document.getElementById("btnSalvarNome");

const btnRanking =
    document.getElementById("btnRanking");

const rankingModal =
    document.getElementById("rankingModal");

const fecharRanking =
    document.getElementById("fecharRanking");

const listaRanking =
    document.getElementById("listaRanking");


/* =========================================================
   NOME DO JOGADOR
   ========================================================= */

function salvarNome() {

    const nome =
        campoNome.value.trim();

    if (!nome) {

        alert(
            "Digite seu nome para começar."
        );

        campoNome.focus();

        return;
    }

    nomeJogador = nome;

    localStorage.setItem(
        "nomeJogador",
        nomeJogador
    );

    mensagemHTML.innerHTML =
        `👋 Boa sorte, <strong>${nomeJogador}</strong>!`;
}


function carregarNome() {

    const nomeSalvo =
        localStorage.getItem(
            "nomeJogador"
        );

    if (nomeSalvo) {

        nomeJogador =
            nomeSalvo;

        campoNome.value =
            nomeSalvo;
    }
}

carregarNome();


/* =========================================================
   NOME DO MODO PARA O RANKING
   ========================================================= */

function nomeModo(modo) {

    switch (modo) {

        case "macho":
            return "Macho";

        case "femea":
            return "Fêmea";

        case "aleatorio":
            return "Aleatório";

        case "definicao":
            return "Definições";

        default:
            return "Geral";
    }
}


/* =========================================================
   SALVAR PONTUAÇÃO NO SUPABASE
   ========================================================= */

async function salvarPontuacao() {

    if (partidaFinalizada) {
        return;
    }

    partidaFinalizada = true;


    if (!nomeJogador) {

        console.warn(
            "Pontuação não enviada: jogador sem nome."
        );

        return;
    }


    const registro = {

        nome:
            nomeJogador.substring(
                0,
                20
            ),

        pontos:
            Math.max(
                0,
                Math.floor(pontos)
            ),

        modo:
            nomeModo(modoAtual),

        acertos:
            acertos,

        erros:
            erros,

        combo_max:
            maiorCombo,

        nivel:
            nivel
    };


    console.log(
        "Enviando pontuação:",
        registro
    );


    const { data, error } =
        await supabaseClient
            .from("ranking_ezoognosia")
            .insert([registro])
            .select();


    if (error) {

        console.error(
            "Erro ao salvar pontuação:",
            error
        );

        mensagemHTML.innerHTML +=
            `<br><small>⚠️ Não foi possível registrar a pontuação no ranking.</small>`;

        return;
    }


    console.log(
        "Pontuação salva no ranking global:",
        data
    );
}


/* =========================================================
   BUSCAR RANKING GLOBAL
   ========================================================= */

async function mostrarRanking() {

    rankingModal.classList.add(
        "ativo"
    );


    listaRanking.innerHTML =
        "<li>⏳ Carregando ranking...</li>";


    const { data, error } =
        await supabaseClient
            .from("ranking_ezoognosia")
            .select(
                "nome,pontos,modo,acertos,erros,combo_max,nivel,criado_em"
            )
            .order(
                "pontos",
                {
                    ascending: false
                }
            )
            .order(
                "acertos",
                {
                    ascending: false
                }
            )
            .limit(10);


    if (error) {

        console.error(
            "Erro ao carregar ranking:",
            error
        );

        listaRanking.innerHTML =
            "<li>❌ Não foi possível carregar o ranking.</li>";

        return;
    }


    listaRanking.innerHTML = "";


    if (
        !data ||
        data.length === 0
    ) {

        listaRanking.innerHTML =
            "<li>Ainda não há pontuações.</li>";

        return;
    }


    data.forEach(
        (jogador, index) => {

            const item =
                document.createElement(
                    "li"
                );


            let medalha = "";


            if (index === 0) {
                medalha = "🥇";
            }

            else if (index === 1) {
                medalha = "🥈";
            }

            else if (index === 2) {
                medalha = "🥉";
            }

            else {
                medalha =
                    `${index + 1}º`;
            }


            item.innerHTML = `
                <strong>
                    ${medalha}
                </strong>
                ${jogador.nome}

                — ⭐ ${jogador.pontos}

                <small>
                    | ${jogador.modo}
                    | 🔥 ${jogador.combo_max}
                </small>
            `;


            listaRanking.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   INICIAR JOGO
   ========================================================= */

function iniciarJogo(modo) {

    if (!nomeJogador) {

        alert(
            "Digite seu nome antes de começar."
        );

        campoNome.focus();

        return;
    }


    pontos = 0;

    vidas = 2;

    combo = 0;

    maiorCombo = 0;

    nivel = 1;

    acertos = 0;

    erros = 0;

    partidaFinalizada = false;


    pontosHTML.textContent =
        pontos;

    vidasHTML.textContent =
        vidas;

    comboHTML.textContent =
        combo;

    nivelHTML.textContent =
        nivel;


    modoAtual =
        modo;


    mensagemHTML.innerHTML =
        "";


    alternativasHTML.innerHTML =
        "";


    if (
        modo === "macho"
    ) {

        perguntasDisponiveis =
            perguntas.filter(
                p =>
                    p.animal ===
                    "macho"
            );


        imagemAnimal.src =
            "imagens/boi_numerado.png";


        imagemAnimal.alt =
            "Boi com regiões zootécnicas numeradas";


        sortearPergunta();
    }


    else if (
        modo === "femea"
    ) {

        perguntasDisponiveis =
            perguntas.filter(
                p =>
                    p.animal ===
                    "femea"
            );


        imagemAnimal.src =
            "imagens/vaca_numerada.png";


        imagemAnimal.alt =
            "Vaca com regiões zootécnicas numeradas";


        sortearPergunta();
    }


    else if (
        modo === "aleatorio"
    ) {

        perguntasDisponiveis =
            [...perguntas];


        sortearPergunta();
    }


    else if (
        modo === "definicao"
    ) {

        perguntasDisponiveis =
            [...perguntas];


        sortearPerguntaDefinicao();
    }
}


/* =========================================================
   ESCOLHER IMAGEM
   ========================================================= */

function escolherImagem(
    pergunta
) {

    if (
        pergunta.animal ===
        "macho"
    ) {

        imagemAnimal.src =
            "imagens/boi_numerado.png";


        imagemAnimal.alt =
            "Boi com regiões zootécnicas numeradas";

    }

    else {

        imagemAnimal.src =
            "imagens/vaca_numerada.png";


        imagemAnimal.alt =
            "Vaca com regiões zootécnicas numeradas";
    }
}


/* =========================================================
   ATUALIZAR NÍVEL
   ========================================================= */

function atualizarNivel() {

    const novoNivel =
        Math.floor(
            pontos / 100
        ) + 1;


    if (
        novoNivel !== nivel
    ) {

        nivel =
            novoNivel;


        nivelHTML.textContent =
            nivel;


        mensagemHTML.innerHTML =
            `🎉 Você chegou ao <strong>Nível ${nivel}</strong>!`;
    }
}


/* =========================================================
   SORTEAR PERGUNTA
   ========================================================= */

function sortearPergunta() {

    if (
        vidas <= 0
    ) {

        finalizarJogo();

        return;
    }


    if (
        perguntasDisponiveis.length === 0
    ) {

        finalizarJogo();

        return;
    }


    const indice =
        Math.floor(
            Math.random() *
            perguntasDisponiveis.length
        );


    perguntaAtual =
        perguntasDisponiveis[
            indice
        ];


    perguntasDisponiveis.splice(
        indice,
        1
    );


    escolherImagem(
        perguntaAtual
    );


    mostrarPerguntaNumero();
}


/* =========================================================
   SORTEAR PERGUNTA DE DEFINIÇÃO
   ========================================================= */

function sortearPerguntaDefinicao() {

    if (
        vidas <= 0
    ) {

        finalizarJogo();

        return;
    }


    if (
        perguntasDisponiveis.length === 0
    ) {

        finalizarJogo();

        return;
    }


    const indice =
        Math.floor(
            Math.random() *
            perguntasDisponiveis.length
        );


    perguntaAtual =
        perguntasDisponiveis[
            indice
        ];


    perguntasDisponiveis.splice(
        indice,
        1
    );


    escolherImagem(
        perguntaAtual
    );


    mostrarPerguntaDefinicao();
}


/* =========================================================
   ALTERNATIVAS NUMÉRICAS
   NÚMEROS PRÓXIMOS
   ========================================================= */

function criarAlternativasNumero(
    numeroCorreto
) {

    const numeros =
        new Set();


    numeros.add(
        numeroCorreto
    );


    const candidatosProximos = [

        numeroCorreto - 1,

        numeroCorreto + 1,

        numeroCorreto - 2,

        numeroCorreto + 2,

        numeroCorreto - 3,

        numeroCorreto + 3
    ];


    const validos =
        candidatosProximos.filter(
            numero =>
                numero >= 1 &&
                numero <= 36
        );


    validos.sort(
        () =>
            Math.random() - 0.5
    );


    for (
        const numero
        of validos
    ) {

        if (
            numeros.size >= 4
        ) {
            break;
        }


        numeros.add(
            numero
        );
    }


    while (
        numeros.size < 4
    ) {

        const aleatorio =
            Math.floor(
                Math.random() * 36
            ) + 1;


        numeros.add(
            aleatorio
        );
    }


    const lista =
        [...numeros];


    lista.sort(
        () =>
            Math.random() - 0.5
    );


    return lista;
}


/* =========================================================
   ALTERNATIVAS DE TERMOS
   ========================================================= */

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
        () =>
            Math.random() - 0.5
    );


    return lista;
}


/* =========================================================
   MOSTRAR PERGUNTA NUMÉRICA
   ========================================================= */

function mostrarPerguntaNumero() {

    mensagemHTML.innerHTML =
        "";


    botaoProxima.style.display =
        "none";


    perguntaHTML.innerHTML =
        `
        Qual é o número correspondente à
        <strong>${perguntaAtual.termo}</strong>?
        `;


    alternativasHTML.innerHTML =
        "";


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


/* =========================================================
   MOSTRAR PERGUNTA DE DEFINIÇÃO
   ========================================================= */

function mostrarPerguntaDefinicao() {

    mensagemHTML.innerHTML =
        "";


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


    alternativasHTML.innerHTML =
        "";


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


/* =========================================================
   VERIFICAR NÚMERO
   ========================================================= */

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


        acertos++;

        combo++;


        if (
            combo >
            maiorCombo
        ) {

            maiorCombo =
                combo;
        }


        let ganho =
            10;


        if (
            combo >= 5
        ) {

            ganho += 20;

        }

        else if (
            combo >= 3
        ) {

            ganho += 10;
        }


        pontos +=
            ganho;


        pontosHTML.textContent =
            pontos;


        comboHTML.textContent =
            combo;


        atualizarNivel();


        mensagemHTML.innerHTML =
            `
            ✅ Correto!
            <strong>+${ganho} pontos</strong>
            `;
    }


    else {

        botao.classList.add(
            "errada"
        );


        erros++;


        combo = 0;

        vidas--;


        comboHTML.textContent =
            combo;


        vidasHTML.textContent =
            vidas;


        destacarRespostaNumero();


        mensagemHTML.innerHTML =
            `
            ❌ Incorreto!
            Você perdeu 1 vida.
            `;
        

        if (
            vidas <= 0
        ) {

            finalizarJogo();

            return;
        }
    }


    botaoProxima.style.display =
        "block";
}


/* =========================================================
   VERIFICAR DEFINIÇÃO
   ========================================================= */

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


        acertos++;


        combo++;


        if (
            combo >
            maiorCombo
        ) {

            maiorCombo =
                combo;
        }


        let ganho =
            10;


        if (
            combo >= 5
        ) {

            ganho += 20;

        }

        else if (
            combo >= 3
        ) {

            ganho += 10;
        }


        pontos +=
            ganho;


        pontosHTML.textContent =
            pontos;


        comboHTML.textContent =
            combo;


        atualizarNivel();


        mensagemHTML.innerHTML =
            `
            ✅ Correto!
            <strong>+${ganho} pontos</strong>
            `;
    }


    else {

        botao.classList.add(
            "errada"
        );


        erros++;


        combo = 0;

        vidas--;


        comboHTML.textContent =
            combo;


        vidasHTML.textContent =
            vidas;


        destacarRespostaTermo();


        mensagemHTML.innerHTML =
            `
            ❌ Incorreto!
            Você perdeu 1 vida.
            `;


        if (
            vidas <= 0
        ) {

            finalizarJogo();

            return;
        }
    }


    botaoProxima.style.display =
        "block";
}


/* =========================================================
   BLOQUEAR ALTERNATIVAS
   ========================================================= */

function bloquearAlternativas() {

    const botoes =
        document.querySelectorAll(
            ".alternativa"
        );


    botoes.forEach(
        botao => {

            botao.disabled =
                true;
        }
    );
}


/* =========================================================
   DESTACAR RESPOSTA NUMÉRICA
   ========================================================= */

function destacarRespostaNumero() {

    const botoes =
        document.querySelectorAll(
            ".alternativa"
        );


    botoes.forEach(
        botao => {

            if (
                Number(
                    botao.textContent
                ) ===
                perguntaAtual.numero
            ) {

                botao.classList.add(
                    "correta"
                );
            }
        }
    );
}


/* =========================================================
   DESTACAR RESPOSTA DE TERMO
   ========================================================= */

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


/* =========================================================
   FINALIZAR JOGO
   ========================================================= */

async function finalizarJogo() {

    if (
        partidaFinalizada
    ) {
        return;
    }


    await salvarPontuacao();


    alternativasHTML.innerHTML =
        "";


    perguntaHTML.innerHTML =
        "🏁 Fim de jogo!";


    mensagemHTML.innerHTML =
        `
        ❤️ Vidas restantes:
        <strong>${vidas}</strong>

        <br>

        ⭐ Pontuação:
        <strong>${pontos}</strong>

        <br>

        ✅ Acertos:
        <strong>${acertos}</strong>

        <br>

        ❌ Erros:
        <strong>${erros}</strong>

        <br>

        🔥 Maior combo:
        <strong>${maiorCombo}</strong>

        <br><br>

        🏆 Sua pontuação foi enviada
        para o ranking global!
        `;


    botaoProxima.style.display =
        "none";
}


/* =========================================================
   BOTÃO PRÓXIMA
   ========================================================= */

botaoProxima.addEventListener(
    "click",
    () => {

        if (
            modoAtual ===
            "definicao"
        ) {

            sortearPerguntaDefinicao();

        }

        else {

            sortearPergunta();
        }
    }
);


/* =========================================================
   BOTÕES DE MODO
   ========================================================= */

btnMacho.addEventListener(
    "click",
    () =>
        iniciarJogo("macho")
);


btnFemea.addEventListener(
    "click",
    () =>
        iniciarJogo("femea")
);


btnAleatorio.addEventListener(
    "click",
    () =>
        iniciarJogo("aleatorio")
);


btnDefinicao.addEventListener(
    "click",
    () =>
        iniciarJogo("definicao")
);


/* =========================================================
   BOTÃO JOGAR
   ========================================================= */

btnSalvarNome.addEventListener(
    "click",
    salvarNome
);


/* =========================================================
   BOTÃO RANKING
   ========================================================= */

btnRanking.addEventListener(
    "click",
    mostrarRanking
);


/* =========================================================
   FECHAR RANKING
   ========================================================= */

fecharRanking.addEventListener(
    "click",
    () => {

        rankingModal.classList.remove(
            "ativo"
        );
    }
);
