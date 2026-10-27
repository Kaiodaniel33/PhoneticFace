/* PhoneticFace — app.js
   Tudo roda no navegador (sem banco de dados). Nome do aluno fica no localStorage. */
'use strict';

/* ========== 1. UTILIDADES ========== */
const $ = (id) => document.getElementById(id);
const embaralhar = (lista) => [...lista].sort(() => Math.random() - 0.5);
const esvaziar = (no) => { no.replaceChildren(); return no; };

function el(tag, classe = '', texto = '', aoClicar = null, cor = '') {
    const e = document.createElement(tag);
    if (tag === 'button') e.type = 'button';
    if (classe) e.className = classe;
    if (texto) e.textContent = texto;
    if (aoClicar) e.onclick = aoClicar;
    if (cor) e.style.background = cor;
    return e;
}

const Armazem = {
    ler(chave) { try { return localStorage.getItem('phoneticface:' + chave); } catch { return null; } },
    gravar(chave, valor) { try { localStorage.setItem('phoneticface:' + chave, valor); } catch { /* modo privado */ } }
};

function confete() {
    const cores = ['#007AFF', '#34C759', '#FFCC00', '#FF3B30', '#AF52DE'];
    for (let i = 0; i < 40; i++) {
        const c = el('div', 'confete');
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = '-20px';
        c.style.background = cores[i % cores.length];
        c.style.animationDelay = Math.random() * 0.6 + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 3800);
    }
}

/* ========== 2. DADOS ========== */
const MODO_DEMONSTRACAO = true; // painel do professor usa dados fictícios

const LETRAS = [
    ['A', 'ABELHA', '🐝'], ['B', 'BOLA', '⚽'], ['C', 'CASA', '🏠'], ['D', 'DADO', '🎲'],
    ['E', 'ELEFANTE', '🐘'], ['F', 'FOGUETE', '🚀'], ['G', 'GATO', '🐱'], ['H', 'HIPOPÓTAMO', '🦛'],
    ['I', 'IGREJA', '⛪'], ['J', 'JACARÉ', '🐊'], ['K', 'KIWI', '🥝'], ['L', 'LEÃO', '🦁'],
    ['M', 'MACACO', '🐒'], ['N', 'NAVIO', '🚢'], ['O', 'OVO', '🥚'], ['P', 'PATO', '🦆'],
    ['Q', 'QUEIJO', '🧀'], ['R', 'RATO', '🐭'], ['S', 'SAPO', '🐸'], ['T', 'TARTARUGA', '🐢'],
    ['U', 'UVA', '🍇'], ['V', 'VACA', '🐄'], ['W', 'WAFFLE', '🧇'], ['X', 'XÍCARA', '☕'],
    ['Y', 'YOGA', '🧘'], ['Z', 'ZEBRA', '🦓']
];

// Cole aqui os IDs dos vídeos do YouTube de cada letra, ex.: A: 'dQw4w9WgXcQ'
const VIDEOS = {};

const VOGAIS = [...'AEIOU'];
const CONSOANTES = [...'BCDFGHJKLMNPQRSTVWXYZ'];

const PALAVRAS_INICIAIS = [
    ['AVIÃO', '✈️'], ['BOLA', '⚽'], ['CASA', '🏠'], ['DADO', '🎲'], ['GATO', '🐱'],
    ['LUA', '🌙'], ['MACACO', '🐒'], ['SAPO', '🐸'], ['UVA', '🍇'], ['VACA', '🐄']
];

const SILABAS_EXEMPLO = [['B', 'A'], ['C', 'O'], ['D', 'E'], ['F', 'I'], ['G', 'U'], ['L', 'A'], ['M', 'E'], ['N', 'O'], ['P', 'I'], ['T', 'U']];

const PALAVRAS = [
    ['BONECA', ['BO', 'NE', 'CA'], '🪆'], ['SAPATO', ['SA', 'PA', 'TO'], '👞'], ['CAMISA', ['CA', 'MI', 'SA'], '👕'],
    ['JANELA', ['JA', 'NE', 'LA'], '🪟'], ['TOMATE', ['TO', 'MA', 'TE'], '🍅'], ['BANANA', ['BA', 'NA', 'NA'], '🍌'],
    ['MACACO', ['MA', 'CA', 'CO'], '🐒'], ['PANELA', ['PA', 'NE', 'LA'], '🍲']
];

const CORES = [
    ['VERMELHO', '#FF3B30'], ['AZUL', '#007AFF'], ['VERDE', '#34C759'], ['AMARELO', '#FFCC00'],
    ['LARANJA', '#FF9500'], ['ROXO', '#AF52DE'], ['ROSA', '#FF2D92'], ['MARROM', '#8B5A2B'],
    ['PRETO', '#1C1C1E'], ['BRANCO', '#FFFFFF'], ['CINZA', '#8E8E93']
];

const DIA_A_DIA = [
    ['🚌', 'ÔNIBUS', 'O ÔNIBUS SAI ÀS SETE HORAS.'], ['🛒', 'MERCADO', 'EU COMPRO ARROZ E FEIJÃO NO MERCADO.'],
    ['💊', 'FARMÁCIA', 'A FARMÁCIA ABRE CEDO.'], ['🏫', 'ESCOLA', 'EU ESTUDO NA ESCOLA À NOITE.'],
    ['💵', 'DINHEIRO', 'O PÃO CUSTA CINCO REAIS.'], ['🪪', 'DOCUMENTO', 'MEU NOME ESTÁ NO DOCUMENTO.']
];

const VOCABULARIO = [
    ['🐶', 'CACHORRO'], ['🐱', 'GATO'], ['🐴', 'CAVALO'], ['🐄', 'VACA'], ['🐔', 'GALINHA'], ['🐟', 'PEIXE'],
    ['🐦', 'PASSARINHO'], ['🐷', 'PORCO'], ['🍎', 'MAÇÃ'], ['🍌', 'BANANA'], ['🍊', 'LARANJA'], ['🍉', 'MELANCIA']
];

// [nome, tarefas, classe da etiqueta, rótulo, diagnóstico, ação recomendada]
const ALUNOS_DEMO = [
    ['Maria A.', '12/13', 'otimo', 'ÓTIMO', 'Domina sílabas e já forma palavras sozinha.', 'Propor leitura prática.'],
    ['José C.', '11/13', 'otimo', 'ÓTIMO', 'Boa leitura; escreve o próprio nome com segurança.', 'Avançar em vocabulário.'],
    ['Ana L.', '9/13', 'suporte', 'EM EVOLUÇÃO', 'Reconhece as vogais; ainda confunde B e D.', 'Reforçar módulo 3.'],
    ['Carlos M.', '8/13', 'suporte', 'EM EVOLUÇÃO', 'Boa participação; precisa de ritmo mais lento.', 'Repetir módulo 4.'],
    ['Rita P.', '6/13', 'atencao', 'ATENÇÃO', 'Dificuldade ao unir consoante e vogal.', 'Atendimento individual no módulo 5.'],
    ['Paulo S.', '10/13', 'otimo', 'ÓTIMO', 'Traçado firme; lê palavras curtas.', 'Treinar leitura de números.'],
    ['Lúcia F.', '7/13', 'suporte', 'EM EVOLUÇÃO', 'Frequência irregular, mas evolui quando presente.', 'Contato para reforçar assiduidade.'],
    ['Antônio R.', '5/13', 'atencao', 'ATENÇÃO', 'Ainda no reconhecimento das letras.', 'Retomar módulos 1 e 2.']
];

/* ========== 3. VOZ, ACESSIBILIDADE E MODAL ========== */
const Voz = {
    falar(texto) {
        if (!('speechSynthesis' in window)) return;
        speechSynthesis.cancel();
        const fala = new SpeechSynthesisUtterance(texto);
        fala.lang = 'pt-BR';
        fala.rate = 0.85;
        speechSynthesis.speak(fala);
    },
    parar() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
};

const AppConfig = {
    alterarTamanhoFonte(delta) {
        const raiz = document.documentElement;
        const atual = parseFloat(getComputedStyle(raiz).fontSize) / 16 * 100;
        raiz.style.fontSize = Math.min(200, Math.max(70, atual + delta)) + '%';
    },
    alternarAltoContraste() {
        const ativo = document.body.classList.toggle('alto-contraste');
        const botao = document.querySelector('.btn-acesso[aria-pressed]');
        if (botao) botao.setAttribute('aria-pressed', String(ativo));
        Armazem.gravar('contraste', ativo ? '1' : '0');
    }
};

const InterfaceModal = {
    abrir(letra) {
        const [, palavra, icone] = LETRAS.find((l) => l[0] === letra);
        const idVideo = VIDEOS[letra];
        $('letra-display').textContent = letra;
        $('modal-icone-palavra').textContent = icone;
        $('modal-texto-palavra').textContent = palavra;
        document.querySelector('.video-wrapper').style.display = idVideo ? '' : 'none';
        $('player-youtube').src = idVideo ? `https://www.youtube.com/embed/${idVideo}?rel=0` : '';
        $('modal-letras').classList.add('visivel');
        Voz.falar(`${letra}. ${palavra}`);
    },
    fechar() {
        $('modal-letras').classList.remove('visivel');
        $('player-youtube').src = '';
        Voz.parar();
    }
};

/* ========== 4. PERFIL (ALUNO / PROFESSOR) ========== */
const GerenciadorPerfil = {
    atual: null,
    selecionarPerfil(perfil) {
        this.atual = perfil;
        $('modal-selecao-perfil').classList.remove('visivel');
        $('view-aluno').style.display = perfil === 'aluno' ? 'block' : 'none';
        $('view-professor').style.display = perfil === 'professor' ? 'block' : 'none';
        $('label-perfil-atual').textContent = '👤 MODALIDADE: ' + perfil.toUpperCase();
        if (perfil === 'professor') PainelProfessor.renderizar();
        if (perfil === 'aluno') Navegacao.ir(document.querySelector('.aba-conteudo.active')?.id || 'aba-alfabeto');
        window.scrollTo(0, 0);
    },
    abrirModalSelecao() {
        Voz.parar();
        $('modal-selecao-perfil').classList.add('visivel');
    }
};

const PainelProfessor = {
    renderizar() {
        const corpo = esvaziar($('lista-alunos-professor'));
        ALUNOS_DEMO.forEach(([nome, tarefas, classe, rotulo, diagnostico, acao]) => {
            const linha = el('tr');
            const etiqueta = el('span', 'tag-status ' + classe, rotulo);
            const celulaDesempenho = el('td');
            celulaDesempenho.appendChild(etiqueta);
            linha.append(el('td', '', nome), el('td', '', tarefas), celulaDesempenho, el('td', '', diagnostico), el('td', '', acao));
            corpo.appendChild(linha);
        });
        const subtitulo = document.querySelector('.cabecalho-painel p');
        if (MODO_DEMONSTRACAO && subtitulo && !subtitulo.dataset.demo) {
            subtitulo.dataset.demo = '1';
            subtitulo.appendChild(el('strong', '', ' (DADOS DE DEMONSTRAÇÃO)'));
        }
    }
};

/* ========== 5. NAVEGAÇÃO ENTRE MÓDULOS ========== */
const Navegacao = {
    ir(idAba) {
        document.querySelectorAll('.aba-conteudo').forEach((s) => s.classList.toggle('active', s.id === idAba));
        document.querySelectorAll('.btn-tab').forEach((b) => {
            const ativa = b.dataset.target === idAba;
            b.classList.toggle('active', ativa);
            b.setAttribute('aria-selected', String(ativa));
        });
        $('menu-principal').classList.remove('aberto');
        Voz.parar();
        if (idAba === 'aba-escrever') Tracado.ajustar(true);
    }
};

function toggleMenuMobile() {
    const aberto = $('menu-principal').classList.toggle('aberto');
    document.querySelector('.menu-toggle').setAttribute('aria-expanded', String(aberto));
}

/* ========== 6. ATIVIDADES INTERATIVAS ========== */
const InteracaoApp = {
    indicePalavra: -1,

    proximaInicial() {
        const [palavra, icone] = PALAVRAS_INICIAIS[Math.floor(Math.random() * PALAVRAS_INICIAIS.length)];
        const certa = palavra[0];
        const dica = $('nome-inicial-dica');
        dica.textContent = ['_', ...palavra.slice(1)].join(' ');
        $('imagem-inicial').textContent = icone;
        const caixa = esvaziar($('opcoes-iniciais'));
        const erradas = embaralhar([...VOGAIS, ...CONSOANTES].filter((l) => l !== certa)).slice(0, 2);
        embaralhar([certa, ...erradas]).forEach((letra) => {
            caixa.appendChild(el('button', 'btn-grande', letra, () => {
                if (letra !== certa) return Voz.falar('TENTE DE NOVO');
                caixa.querySelectorAll('button').forEach((b) => { b.disabled = true; });
                dica.textContent = [...palavra].join(' ');
                confete();
                Voz.falar(`MUITO BEM! ${palavra}`);
                setTimeout(() => this.proximaInicial(), 2500);
            }, 'var(--cor-primaria)'));
        });
    },

    escolherFamilia(consoante) {
        $('titulo-familia-atual').textContent = `UNIÃO DE SONS: ${consoante}`;
        const caixa = esvaziar($('resultado-familia'));
        VOGAIS.forEach((v) => caixa.appendChild(el('button', 'btn-grande', consoante + v, () => Voz.falar(consoante + v), 'var(--cor-sucesso)')));
    },

    proximaPalavra() {
        this.indicePalavra = (this.indicePalavra + 1) % PALAVRAS.length;
        const [palavra, silabas, icone] = PALAVRAS[this.indicePalavra];
        $('dica-palavra').textContent = `${icone} ${palavra}`;
        const slots = esvaziar($('slots-palavra'));
        const soltas = esvaziar($('silabas-soltas'));
        const casas = silabas.map(() => slots.appendChild(el('div', 'slot-silaba')));
        let proxima = 0;
        embaralhar(silabas).forEach((silaba) => {
            const botao = el('button', 'bloco', silaba, () => {
                if (silaba !== silabas[proxima]) return Voz.falar('TENTE DE NOVO');
                casas[proxima].textContent = silaba;
                casas[proxima].classList.add('preenchido');
                botao.remove();
                Voz.falar(silaba);
                proxima++;
                if (proxima === silabas.length) {
                    confete();
                    setTimeout(() => Voz.falar(`MUITO BEM! ${palavra}`), 800);
                }
            });
            soltas.appendChild(botao);
        });
    },

    verificarNome() {
        const nome = $('input-nome').value.trim().toUpperCase();
        if (!nome) return Voz.falar('DIGITE O SEU NOME NA CAIXA BRANCA');
        Armazem.gravar('nome', nome);
        mostrarBoasVindas(nome);
        confete();
        Voz.falar(`MUITO BEM, ${nome}! SEU NOME TEM AS LETRAS: ${[...nome].join(', ')}`);
    }
};

function mostrarBoasVindas(nome) {
    const tag = $('mensagem-boas-vindas');
    tag.textContent = `👋 OLÁ, ${nome}!`;
    tag.style.display = 'block';
}

/* ========== 7. TRAÇADO (CANVAS) ========== */
const Tracado = {
    tela: null, ctx: null, desenhando: false,

    iniciar() {
        this.tela = $('canvas-caligrafia');
        this.ctx = this.tela.getContext('2d');
        const posicao = (e) => { const r = this.tela.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
        this.tela.addEventListener('pointerdown', (e) => {
            this.desenhando = true;
            this.tela.setPointerCapture(e.pointerId);
            const [x, y] = posicao(e);
            this.ctx.beginPath(); this.ctx.moveTo(x, y); this.ctx.lineTo(x + 0.01, y); this.ctx.stroke();
        });
        this.tela.addEventListener('pointermove', (e) => {
            if (!this.desenhando) return;
            const [x, y] = posicao(e);
            this.ctx.lineTo(x, y); this.ctx.stroke();
        });
        ['pointerup', 'pointercancel'].forEach((ev) => this.tela.addEventListener(ev, () => { this.desenhando = false; }));
        window.addEventListener('resize', () => this.ajustar(false));

        const botoes = $('botoes-desenho');
        botoes.appendChild(el('button', 'btn-ferramenta', '🧽 LIMPAR', () => this.limpar(), 'var(--cor-destaque)'));
        [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'].forEach((c) => botoes.appendChild(el('button', 'btn-ferramenta', c, () => {
            $('guia-fundo').textContent = c;
            this.limpar();
            Voz.falar(c);
        })));
    },

    ajustar(forcar) {
        const caixa = $('container-canvas');
        if (!caixa.clientWidth || (!forcar && caixa.clientWidth === this.tela.width)) return;
        this.tela.width = caixa.clientWidth;
        this.tela.height = caixa.clientHeight;
        Object.assign(this.ctx, { lineWidth: 14, lineCap: 'round', lineJoin: 'round', strokeStyle: '#007AFF' });
    },

    limpar() { this.ctx.clearRect(0, 0, this.tela.width, this.tela.height); }
};

/* ========== 8. MONTAGEM DAS TELAS ========== */
const Montagem = {
    alfabeto() {
        const grade = $('container-grid-alfabeto');
        LETRAS.forEach(([letra]) => grade.appendChild(el('button', 'btn-letra', letra, () => InterfaceModal.abrir(letra))));
    },
    vogaisEConsoantes() {
        VOGAIS.forEach((l) => $('box-vogais').appendChild(el('button', 'btn-grande', l, () => Voz.falar(l), 'var(--cor-destaque)')));
        CONSOANTES.forEach((l) => $('box-consoantes').appendChild(el('button', 'btn-grande', l, () => Voz.falar(l), 'var(--cor-primaria)')));
    },
    familias() {
        CONSOANTES.forEach((c) => $('botoes-familias').appendChild(el('button', 'btn-grande', c, () => InteracaoApp.escolherFamilia(c), 'var(--cor-primaria)')));
        InteracaoApp.escolherFamilia('B');
    },
    silabas() {
        const area = $('container-silabas');
        SILABAS_EXEMPLO.forEach(([c, v]) => {
            const linha = el('div', 'linha-silaba');
            linha.append(
                el('span', 'bloco', c), el('span', 'sinal-matematico', '+'), el('span', 'bloco', v), el('span', 'sinal-matematico', '='),
                el('button', 'bloco bloco-resultado', `🔊 ${c}${v}`, () => Voz.falar(c + v))
            );
            area.appendChild(linha);
        });
    },
    cores() {
        CORES.forEach(([nome, hex]) => {
            const botao = el('button', 'btn-letra', nome, () => Voz.falar(nome), hex);
            botao.style.fontSize = '1.1rem';
            botao.style.color = ['AMARELO', 'BRANCO'].includes(nome) ? '#000' : '#FFF';
            if (nome === 'BRANCO') botao.style.border = '3px solid #CCC';
            $('container-cores').appendChild(botao);
        });
    },
    cartoes(idContainer, lista) {
        const caixa = $(idContainer);
        lista.forEach(([icone, titulo, frase]) => {
            const cartao = el('div', 'card-interativo');
            cartao.tabIndex = 0;
            cartao.setAttribute('role', 'button');
            const falar = () => Voz.falar(frase || titulo);
            cartao.onclick = falar;
            cartao.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); falar(); } };
            cartao.append(el('div', 'icone-card', icone), el('h3', '', titulo));
            if (frase) cartao.appendChild(el('p', '', frase));
            caixa.appendChild(cartao);
        });
    },
    numeros() {
        for (let n = 1; n <= 100; n++) {
            const botao = el('button', 'btn-grande', String(n), () => Voz.falar(String(n)), 'var(--cor-primaria)');
            botao.style.fontSize = '1.6rem';
            botao.style.padding = '10px';
            $('container-numeros').appendChild(botao);
        }
    }
};

/* ========== 9. INICIALIZAÇÃO ========== */
function iniciar() {
    // Primeiro o que garante a navegação, para nada travar a tela de perfil
    document.querySelectorAll('.btn-tab').forEach((b) => { b.onclick = () => Navegacao.ir(b.dataset.target); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') InterfaceModal.fechar(); });
    $('modal-letras').addEventListener('click', (e) => { if (e.target === $('modal-letras')) InterfaceModal.fechar(); });

    const nomeSalvo = Armazem.ler('nome');
    if (nomeSalvo) { $('input-nome').value = nomeSalvo; mostrarBoasVindas(nomeSalvo); }
    if (Armazem.ler('contraste') === '1') AppConfig.alternarAltoContraste();

    // Cada módulo é montado isoladamente: um erro não derruba os demais
    [
        () => Montagem.alfabeto(), () => Montagem.vogaisEConsoantes(), () => InteracaoApp.proximaInicial(),
        () => Montagem.familias(), () => Montagem.silabas(), () => InteracaoApp.proximaPalavra(),
        () => { Tracado.iniciar(); }, () => Montagem.cores(), () => Montagem.cartoes('container-dia-a-dia', DIA_A_DIA),
        () => Montagem.cartoes('container-animais', VOCABULARIO), () => Montagem.numeros()
    ].forEach((montar) => { try { montar(); } catch (erro) { console.error('Falha ao montar módulo:', erro); } });

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        navigator.serviceWorker.register('./sw.js').catch((erro) => console.warn('Service worker não registrado:', erro));
    }
}

Object.assign(window, { AppConfig, Voz, GerenciadorPerfil, InteracaoApp, InterfaceModal, toggleMenuMobile });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
