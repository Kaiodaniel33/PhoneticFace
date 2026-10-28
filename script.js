/* ==========================================================================
   1. ARMAZENAMENTO SEGURO (NUNCA TRAVA EM NAVEGADORES RESTRITOS OU GITHUB)
   ========================================================================== */
function lerDadoLocal(chave, padrao) {
    try {
        const valor = window.localStorage.getItem(chave);
        return valor !== null ? valor : padrao;
    } catch (e) {
        return padrao;
    }
}

function salvarDadoLocal(chave, valor) {
    try {
        window.localStorage.setItem(chave, String(valor));
    } catch (e) {
        /* Ignora bloqueio de cookies/storage sem quebrar a página */
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(regs) {
        for (let reg of regs) reg.unregister();
    }).catch(function() {});
}

/* ==========================================================================
   2. SESSÃO EM TEMPO REAL DO ESTUDANTE (SINCRONIZADA COM O PROFESSOR)
   ========================================================================== */
const SessaoAlunoAtivo = {
    nome: lerDadoLocal('pf_nome_aluno', 'Estudante (Sessão Atual)'),
    tarefasHoje: parseInt(lerDadoLocal('pf_tarefas_hoje', '4'), 10) || 4,
    ultimoModulo: lerDadoLocal('pf_ultimo_modulo', '1. Sons das Letras'),
    historicoAcoes: [
        'Iniciou sessão de estudo fônico na plataforma.',
        'Realizou exercícios de associação sonora e visual.'
    ],
    dificuldadeDetectada: 'Desempenho regular nas tarefas realizadas nesta sessão.',
    registrarAtividade: function(descricao, moduloNome) {
        this.tarefasHoje++;
        if (moduloNome) this.ultimoModulo = moduloNome;
        this.historicoAcoes.unshift(descricao);
        if (this.historicoAcoes.length > 6) this.historicoAcoes.pop();
        salvarDadoLocal('pf_tarefas_hoje', this.tarefasHoje);
        salvarDadoLocal('pf_ultimo_modulo', this.ultimoModulo);
        atualizarPlacarTopo();
    },
    registrarErro: function(detalheErro) {
        this.dificuldadeDetectada = detalheErro;
        this.historicoAcoes.unshift('Dificuldade registrada: ' + detalheErro);
    }
};

function atualizarPlacarTopo() {
    const elPlacar = document.getElementById('placar-aluno-topo');
    if (elPlacar) {
        elPlacar.innerText = `${SessaoAlunoAtivo.tarefasHoje} TAREFAS CONCLUÍDAS HOJE`;
    }
    const nomeSalvo = lerDadoLocal('pf_nome_aluno', '');
    const elBoasVindas = document.getElementById('mensagem-boas-vindas');
    if (elBoasVindas && nomeSalvo) {
        elBoasVindas.innerText = `ESTUDANTE: ${nomeSalvo}`;
    }
}

/* ==========================================================================
   3. BASE DE DADOS FONÉTICA E PEDAGÓGICA COMPLETA
   ========================================================================== */
const BancoDados = {
    alfabeto: [
        { letra: 'A', fonema: '/a/', palavra: 'ABELHA', icone: '🐝', youtubeId: 'XBCDUG-yEaw' },
        { letra: 'B', fonema: '/b/', palavra: 'BOLA', icone: '⚽', youtubeId: 'j6ROsDM87UU' },
        { letra: 'C', fonema: '/k/', palavra: 'CASA', icone: '🏠', youtubeId: 'hWZA7DElS_I' },
        { letra: 'D', fonema: '/d/', palavra: 'DADO', icone: '🎲', youtubeId: 'mAIWY3S12s4' },
        { letra: 'E', fonema: '/e/', palavra: 'ELEFANTE', icone: '🐘', youtubeId: '8s43APNFMtM' },
        { letra: 'F', fonema: '/f/', palavra: 'FACA', icone: '🔪', youtubeId: 'nuX0O_hqoFM' },
        { letra: 'G', fonema: '/g/', palavra: 'GATO', icone: '🐈', youtubeId: '4SjEf5gYXio' },
        { letra: 'H', fonema: 'mudo', palavra: 'HORA', icone: '⌚', youtubeId: 'NhZ6eVHmVDA' },
        { letra: 'I', fonema: '/i/', palavra: 'IGREJA', icone: '⛪', youtubeId: 'ILhan-Htj0g' },
        { letra: 'J', fonema: '/ʒ/', palavra: 'JACARÉ', icone: '🐊', youtubeId: 'Z9lBor1lnI8' },
        { letra: 'K', fonema: '/k/', palavra: 'KIWI', icone: '🥝', youtubeId: 'eGrZ1WM_oaE' },
        { letra: 'L', fonema: '/l/', palavra: 'LÁPIS', icone: '✏️', youtubeId: 'tC3yWQPeNpE' },
        { letra: 'M', fonema: '/m/', palavra: 'MALA', icone: '🧳', youtubeId: 'mH3byoH67O4' },
        { letra: 'N', fonema: '/n/', palavra: 'NAVIO', icone: '🚢', youtubeId: 'AGPxKWabjSc' },
        { letra: 'O', fonema: '/ɔ/', palavra: 'ÓCULOS', icone: '👓', youtubeId: '-8RtEgO3Y5s' },
        { letra: 'P', fonema: '/p/', palavra: 'PATO', icone: '🦆', youtubeId: 'bmQ_2UA7sWw' },
        { letra: 'Q', fonema: '/k/', palavra: 'QUEIJO', icone: '🧀', youtubeId: '-qZ5fNtr-8g' },
        { letra: 'R', fonema: '/ʀ/', palavra: 'RATO', icone: '🐀', youtubeId: '7fKcMXcBNOA' },
        { letra: 'S', fonema: '/s/', palavra: 'SAPO', icone: '🐸', youtubeId: 's6XAkz5lGxA' },
        { letra: 'T', fonema: '/t/', palavra: 'TATU', icone: '🦔', youtubeId: '-FyHvZ9Hz0Y' },
        { letra: 'U', fonema: '/u/', palavra: 'UVA', icone: '🍇', youtubeId: 'beFXQ-w5CKs' },
        { letra: 'V', fonema: '/v/', palavra: 'VACA', icone: '🐄', youtubeId: 'cGJ2MXDMsgE' },
        { letra: 'W', fonema: '/w/', palavra: 'WEB', icone: '🌐', youtubeId: 'An41gHwcEEw' },
        { letra: 'X', fonema: '/ʃ/', palavra: 'XÍCARA', icone: '☕', youtubeId: 'zqrqp-RHFHs' },
        { letra: 'Y', fonema: '/i/', palavra: 'YOUTUBE', icone: '▶️', youtubeId: 'NJLEAbML25A' },
        { letra: 'Z', fonema: '/z/', palavra: 'ZEBRA', icone: '🦓', youtubeId: '-QBkzFZDWNU' }
    ],
    vogais: ['A','E','I','O','U'],
    consoantes: ['B','C','D','F','G','H','J','K','L','M','N','P','Q','R','S','T','V','W','X','Y','Z'],
    sinaisDesenho: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
    iniciais: [
        { img: '✈️', nome: 'AVIÃO', certa: 'A', ops: ['A','E','O'] },
        { img: '🐘', nome: 'ELEFANTE', certa: 'E', ops: ['I','E','U'] },
        { img: '⛪', nome: 'IGREJA', certa: 'I', ops: ['A','I','O'] },
        { img: '👁️', nome: 'OLHO', certa: 'O', ops: ['U','A','O'] },
        { img: '🍇', nome: 'UVA', certa: 'U', ops: ['E','U','I'] },
        { img: '🐎', nome: 'CAVALO', certa: 'C', ops: ['B','C','D'] },
        { img: '🍌', nome: 'BANANA', certa: 'B', ops: ['P','B','D'] },
        { img: '🚗', nome: 'CARRO', certa: 'C', ops: ['C','F','S'] },
        { img: '🐕', nome: 'CACHORRO', certa: 'C', ops: ['S','X','C'] },
        { img: '🐈', nome: 'GATO', certa: 'G', ops: ['J','G','C'] },
        { img: '🦁', nome: 'LEÃO', certa: 'L', ops: ['M','L','N'] },
        { img: '🍎', nome: 'MAÇÃ', certa: 'M', ops: ['N','M','P'] },
        { img: '🗺️', nome: 'CARTAGO', certa: 'C', ops: ['F','C','S'] },
        { img: '🇧🇷', nome: 'BRASIL', certa: 'B', ops: ['P','B','D'] },
        { img: '💻', nome: 'COMPUTADOR', certa: 'C', ops: ['T','C','P'] },
        { img: '🦖', nome: 'DINOSSAURO', certa: 'D', ops: ['T','D','B'] },
        { img: '🍉', nome: 'MELANCIA', certa: 'M', ops: ['L','M','N'] },
        { img: '🍓', nome: 'MORANGO', certa: 'M', ops: ['M','N','B'] },
        { img: '🍍', nome: 'ABACAXI', certa: 'A', ops: ['A','O','E'] },
        { img: '⚽', nome: 'BOLA', certa: 'B', ops: ['D','B','P'] },
        { img: '🏠', nome: 'CASA', certa: 'C', ops: ['S','C','L'] },
        { img: '🐒', nome: 'MACACO', certa: 'M', ops: ['N','M','L'] },
        { img: '🥘', nome: 'PANELA', certa: 'P', ops: ['B','P','D'] },
        { img: '🍅', nome: 'TOMATE', certa: 'T', ops: ['T','D','P'] },
        { img: '🦉', nome: 'CORUJA', certa: 'C', ops: ['M','C','S'] },
        { img: '🐸', nome: 'SAPO', certa: 'S', ops: ['Z','S','C'] },
        { img: '🦋', nome: 'BORBOLETA', certa: 'B', ops: ['P','D','B'] },
        { img: '🐢', nome: 'TARTARUGA', certa: 'T', ops: ['T','D','F'] },
        { img: '🐷', nome: 'PORCO', certa: 'P', ops: ['B','P','Q'] },
        { img: '🐔', nome: 'GALINHA', certa: 'G', ops: ['J','G','C'] }
    ],
    silabas: [
        { consoante: 'B', vogal: 'A', palavra: 'BANANA', icone: '🍌' },
        { consoante: 'M', vogal: 'A', palavra: 'MALA', icone: '🧳' },
        { consoante: 'C', vogal: 'O', palavra: 'COPO', icone: '🥛' },
        { consoante: 'D', vogal: 'I', palavra: 'DINHEIRO', icone: '💵' },
        { consoante: 'F', vogal: 'O', palavra: 'FOGO', icone: '🔥' },
        { consoante: 'C', vogal: 'A', palavra: 'CASA', icone: '🏠' }
    ],
    palavrasJogo: [
        { p: 'BONECA', s: ['BO','NE','CA'] }, { p: 'BRASIL', s: ['BRA','SIL'] }, { p: 'ESCOLA', s: ['ES','CO','LA'] },
        { p: 'CARTAGO', s: ['CAR','TA','GO'] }, { p: 'BULE', s: ['BU','LE'] }, { p: 'CASA', s: ['CA','SA'] },
        { p: 'BOLA', s: ['BO','LA'] }, { p: 'MACACO', s: ['MA','CA','CO'] }, { p: 'PANELA', s: ['PA','NE','LA'] },
        { p: 'TOMATE', s: ['TO','MA','TE'] }, { p: 'CAVALO', s: ['CA','VA','LO'] }, { p: 'ABACATE', s: ['A','BA','CA','TE'] },
        { p: 'BANANA', s: ['BA','NA','NA'] }, { p: 'GATO', s: ['GA','TO'] }, { p: 'PATO', s: ['PA','TO'] },
        { p: 'COMPUTADOR', s: ['COM','PU','TA','DOR'] }, { p: 'TELEFONE', s: ['TE','LE','FO','NE'] },
        { p: 'SAPO', s: ['SA','PO'] }, { p: 'RATO', s: ['RA','TO'] }, { p: 'MATO', s: ['MA','TO'] },
        { p: 'LATA', s: ['LA','TA'] }, { p: 'FADA', s: ['FA','DA'] }, { p: 'MALA', s: ['MA','LA'] },
        { p: 'BOCA', s: ['BO','CA'] }, { p: 'DADO', s: ['DA','DO'] }, { p: 'FOCA', s: ['FO','CA'] },
        { p: 'LEÃO', s: ['LE','ÃO'] }, { p: 'PEIXE', s: ['PEI','XE'] }, { p: 'LIXO', s: ['LI','XO'] },
        { p: 'RODA', s: ['RO','DA'] }, { p: 'FOTO', s: ['FO','TO'] }, { p: 'LOBO', s: ['LO','BO'] },
        { p: 'BOLO', s: ['BO','LO'] }, { p: 'SELO', s: ['SE','LO'] }, { p: 'GELO', s: ['GE','LO'] },
        { p: 'MESA', s: ['ME','SA'] }, { p: 'PESO', s: ['PE','SO'] }, { p: 'VASO', s: ['VA','SO'] },
        { p: 'SOPA', s: ['SO','PA'] }, { p: 'MAPA', s: ['MA','PA'] }, { p: 'CAPA', s: ['CA','PA'] },
        { p: 'LUVA', s: ['LU','VA'] }, { p: 'UVA', s: ['U','VA'] }, { p: 'OVO', s: ['O','VO'] },
        { p: 'VACA', s: ['VA','CA'] }, { p: 'FACA', s: ['FA','CA'] }, { p: 'VELA', s: ['VE','LA'] },
        { p: 'BARCO', s: ['BAR','CO'] }, { p: 'PORCO', s: ['POR','CO'] }
    ],
    cores: [
        { n: 'AZUL', c: '#2196F3', txt: '#FFF' }, { n: 'VERMELHO', c: '#FF3B30', txt: '#FFF' },
        { n: 'AMARELO', c: '#FFCC00', txt: '#000' }, { n: 'VERDE', c: '#34C759', txt: '#FFF' },
        { n: 'LARANJA', c: '#FF9500', txt: '#FFF' }, { n: 'ROXO', c: '#9B59B6', txt: '#FFF' },
        { n: 'MARROM', c: '#A2845E', txt: '#FFF' }, { n: 'PRETO', c: '#1C1C1E', txt: '#FFF' },
        { n: 'BRANCO', c: '#FFFFFF', txt: '#000' }, { n: 'ROSA', c: '#FF2D55', txt: '#FFF' },
        { n: 'CINZA', c: '#8E8E93', txt: '#FFF' }, { n: 'AZUL CLARO', c: '#5AC8FA', txt: '#000' },
        { n: 'VERDE ESCURO', c: '#248A3D', txt: '#FFF' }, { n: 'BEGE', c: '#E1C699', txt: '#000' },
        { n: 'LILÁS', c: '#DAB4E5', txt: '#000' }, { n: 'OURO', c: '#FFD700', txt: '#000' },
        { n: 'PRATA', c: '#C0C0C0', txt: '#000' }, { n: 'CIANO', c: '#00BCD4', txt: '#000' }
    ],
    vidaPratica: [
        { titulo: 'RECEITA MÉDICA', icone: '💊', textoFala: 'ATENÇÃO: TOMAR UM COMPRIMIDO DE DIPIRONA A CADA 8 HORAS.' },
        { titulo: 'LETREIRO DE ÔNIBUS', icone: '🚌', textoFala: 'ÔNIBUS EXPRESSO: LINHA CENTRO VIA TERMINAL RODOVIÁRIO.' },
        { titulo: 'LISTA DO MERCADO', icone: '🛒', textoFala: 'LISTA DE COMPRAS: 5 QUILOS DE ARROZ, FEIJÃO, ÓLEO E CAFÉ.' },
        { titulo: 'TREINO DA ACADEMIA', icone: '🏋️', textoFala: 'FICHA DE TREINO: FAZER 3 SÉRIES DE 12 REPETIÇÕES COM PAUSA.' },
        { titulo: 'PLACA DE TRÂNSITO', icone: '🛑', textoFala: 'ATENÇÃO PEDESTRE E MOTORISTA: PARE E OLHE ANTES DE ATRAVESSAR.' },
        { titulo: 'CAIXA ELETRÔNICO', icone: '🏧', textoFala: 'TERMINAL BANCÁRIO: INSIRA O CARTÃO E DIGITE SUA SENHA.' }
    ],
    animais: [
        { nome: 'CACHORRO', icone: '🐕' }, { nome: 'GATO', icone: '🐈' }, { nome: 'VACA', icone: '🐄' },
        { nome: 'CAVALO', icone: '🐎' }, { nome: 'PORCO', icone: '🐷' }, { nome: 'GALINHA', icone: '🐔' },
        { nome: 'PATO', icone: '🦆' }, { nome: 'OVELHA', icone: '🐑' }, { nome: 'LEÃO', icone: '🦁' },
        { nome: 'ELEFANTE', icone: '🐘' }, { nome: 'MACACO', icone: '🐒' }, { nome: 'URSO', icone: '🐻' },
        { nome: 'SAPO', icone: '🐸' }, { nome: 'PEIXE', icone: '🐟' }, { nome: 'PAPAGAIO', icone: '🦜' },
        { nome: 'COBRA', icone: '🐍' }, { nome: 'TARTARUGA', icone: '🐢' }, { nome: 'COELHO', icone: '🐇' },
        { nome: 'ABELHA', icone: '🐝' }, { nome: 'BORBOLETA', icone: '🦋' }
    ],
    alunosFixosProfessor: [
        {
            nome: 'José Carlos da Silva (58 anos)',
            tarefas: '14 tarefas no dia',
            pct: 92,
            corBarra: 'barra-verde',
            categoria: 'otimo',
            diag: 'Concluiu módulos 1 a 6. Excelente leitura de palavras trissílabas e avisos práticos.',
            recomendacao: 'Liberar Leitura Prática',
            tagCor: 'tag-verde',
            detalhes: [
                'Concluiu 14 exercícios hoje (Módulos de Sílabas, Palavras e Leitura Prática).',
                'Acertou 100% no reconhecimento sonoro das consoantes B, C, M e P.',
                'Navega com autonomia pelo celular sem precisar de auxílio.'
            ]
        },
        {
            nome: 'Maria Aparecida Oliveira (64 anos)',
            tarefas: '6 tarefas no dia',
            pct: 48,
            corBarra: 'barra-amarela',
            categoria: 'dificuldade',
            diag: 'Apresentou dificuldade na tarefa de Formar Palavras (trocou sílabas com F e V).',
            recomendacao: 'Reforçar Módulo 4 (Unindo Sons)',
            tagCor: 'tag-amarelo',
            detalhes: [
                'Realizou 6 tarefas hoje no Módulo 3 (Som Inicial) e Módulo 6 (Formar Palavras).',
                'Apresentou dúvida auditiva entre os fonemas /f/ (Faca) e /v/ (Vaca).',
                'Conseguiu escrever o próprio nome corretamente no Módulo 9.'
            ]
        },
        {
            nome: 'Antônio Ferreira Santos (71 anos)',
            tarefas: '2 tarefas no dia',
            pct: 25,
            corBarra: 'barra-vermelha',
            categoria: 'plataforma',
            diag: 'Teve dificuldade para mexer na plataforma sozinho e trocar de módulo no celular.',
            recomendacao: 'Ensinar navegação + Alto Contraste',
            tagCor: 'tag-roxo',
            detalhes: [
                'Completou apenas 2 tarefas no Módulo 1 (Sons das Letras).',
                'Dificuldade de manuseio: tocou fora dos botões e precisou de ajuda para abrir o menu.',
                'Encaminhamento: Ativar o ALTO CONTRASTE e A+ para facilitar a leitura visual e orientar o uso básico por 10 minutos.'
            ]
        },
        {
            nome: 'Sebastiana Rodrigues (52 anos)',
            tarefas: '11 tarefas no dia',
            pct: 85,
            corBarra: 'barra-verde',
            categoria: 'otimo',
            diag: 'Ótimo desempenho em Números (1 a 100), Receita Médica e Lista de Mercado.',
            recomendacao: 'Avançar para frases completas',
            tagCor: 'tag-verde',
            detalhes: [
                'Concluiu 11 tarefas nos módulos de Vocabulário, Cores e Números.',
                'Domina a associação entre imagem, som inicial e escrita.',
                'Excelente adaptação ao uso em tablet.'
            ]
        },
        {
            nome: 'Francisco Chagas Lima (67 anos)',
            tarefas: '5 tarefas no dia',
            pct: 42,
            corBarra: 'barra-amarela',
            categoria: 'dificuldade',
            diag: 'Dificuldade na tarefa de montar palavras maiores (COMPUTADOR e TELEFONE).',
            recomendacao: 'Praticar palavras de 2 sílabas',
            tagCor: 'tag-amarelo',
            detalhes: [
                'Fez 5 tarefas hoje. Acertou palavras dissílabas como BOLA, CASA e MALA.',
                'Sentiu dificuldade quando a palavra tinha 4 sílabas no Módulo 6.',
                'Encaminhamento: Consolidar famílias silábicas simples antes de palavras longas.'
            ]
        },
        {
            nome: 'Lourdes Nascimento (69 anos)',
            tarefas: '3 tarefas no dia',
            pct: 30,
            corBarra: 'barra-vermelha',
            categoria: 'plataforma',
            diag: 'Não conseguiu mexer direito no quadro de desenho e teve receio de clicar nos botões.',
            recomendacao: 'Treinar toque na tela com monitora',
            tagCor: 'tag-roxo',
            detalhes: [
                'Assistiu aos vídeos das letras A, E e I com atenção.',
                'No Módulo 7 (Traçado), soltou o dedo antes de terminar a letra; precisa de apoio inicial de coordenação no celular.',
                'Na parte oral, pronunciou todos os fonemas corretamente.'
            ]
        }
    ]
};

/* ==========================================================================
   4. VOZ, ACESSIBILIDADE E CONTROLE MULTIPLATAFORMA
   ========================================================================== */
function falarTexto(texto) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(String(texto).toUpperCase());
    msg.lang = 'pt-BR';
    msg.rate = 0.95;
    window.speechSynthesis.speak(msg);
}

function pararVoz() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
}

let tamanhoFonteGlobal = 100;
function alterarTamanhoFonte(incremento) {
    const novo = tamanhoFonteGlobal + incremento;
    if (novo >= 80 && novo <= 150) {
        tamanhoFonteGlobal = novo;
        document.documentElement.style.fontSize = tamanhoFonteGlobal + '%';
        const visor = document.getElementById('indicador-fonte');
        if (visor) visor.innerText = tamanhoFonteGlobal + '%';
        if (QuadroCaligrafia) setTimeout(() => QuadroCaligrafia.redimensionar(), 80);
    }
}

function alternarAltoContraste() {
    const ativo = document.body.classList.toggle('alto-contraste');
    const btn = document.getElementById('btn-contraste');
    if (btn) btn.setAttribute('aria-pressed', String(ativo));
    if (QuadroCaligrafia) QuadroCaligrafia.atualizarCorPincel();
}

function alterarDispositivo(modo) {
    const wrapper = document.getElementById('app-viewport-wrapper');
    document.querySelectorAll('.btn-device').forEach(b => b.classList.remove('active'));
    if (wrapper) wrapper.className = 'viewport-' + modo;
    const btnAtivo = document.getElementById('dev-' + modo);
    if (btnAtivo) btnAtivo.classList.add('active');
    if (QuadroCaligrafia) setTimeout(() => QuadroCaligrafia.redimensionar(), 350);
}

function toggleMenuMobile() {
    const menu = document.getElementById('menu-principal');
    const btn = document.getElementById('btn-menu-mobile');
    if (menu) {
        const aberto = menu.classList.toggle('aberto');
        if (btn) btn.setAttribute('aria-expanded', String(aberto));
    }
}

/* ==========================================================================
   5. PAINEL DO PROFESSOR E FICHA INDIVIDUAL DOS ALUNOS
   ========================================================================== */
function obterListaCompletaAlunos() {
    const pctAoVivo = Math.min(100, 45 + (SessaoAlunoAtivo.tarefasHoje * 7));
    const alunoAoVivo = {
        nome: `${SessaoAlunoAtivo.nome} (Ativo Agora)`,
        tarefas: `${SessaoAlunoAtivo.tarefasHoje} tarefas no dia`,
        pct: pctAoVivo,
        corBarra: pctAoVivo >= 70 ? 'barra-verde' : 'barra-azul',
        categoria: 'otimo',
        diag: `Módulo atual: ${SessaoAlunoAtivo.ultimoModulo}. ${SessaoAlunoAtivo.dificuldadeDetectada}`,
        recomendacao: 'Sessão em andamento',
        tagCor: 'tag-verde',
        aoVivo: true,
        detalhes: SessaoAlunoAtivo.historicoAcoes
    };
    return [alunoAoVivo, ...BancoDados.alunosFixosProfessor];
}

function filtrarTabelaProfessor(filtro, btnClicado) {
    if (btnClicado) {
        document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
        btnClicado.classList.add('active');
    }
    atualizarPainelProfessor(filtro);
}

function atualizarPainelProfessor(filtro) {
    const tbody = document.getElementById('lista-alunos-professor');
    if (!tbody) return;
    tbody.innerHTML = '';

    const todos = obterListaCompletaAlunos();
    const filtrados = todos.filter(a => (!filtro || filtro === 'todos') ? true : a.categoria === filtro);

    filtrados.forEach((aluno, index) => {
        const tr = document.createElement('tr');
        if (aluno.aoVivo) tr.className = 'linha-aluno-ao-vivo';
        tr.innerHTML = `
            <td><strong>${aluno.nome}</strong></td>
            <td><strong>${aluno.tarefas}</strong></td>
            <td>
                <div class="barra-fundo">
                    <div class="barra-preenchimento ${aluno.corBarra}" style="width: ${aluno.pct}%;">${aluno.pct}%</div>
                </div>
            </td>
            <td>${aluno.diag}</td>
            <td><span class="tag-status ${aluno.tagCor}">${aluno.recomendacao}</span></td>
            <td><button type="button" class="btn-raio-x" onclick="abrirProntuarioAluno(${index})">VER FICHA</button></td>
        `;
        tbody.appendChild(tr);
    });
}

let textoRelatorioAtual = '';
function abrirProntuarioAluno(indice) {
    const lista = obterListaCompletaAlunos();
    const aluno = lista[indice];
    if (!aluno) return;

    document.getElementById('prontuario-nome').innerText = aluno.nome;
    document.getElementById('prontuario-status-geral').innerText = `Produção: ${aluno.tarefas} | Domínio Fônico: ${aluno.pct}%`;

    const container = document.getElementById('prontuario-conteudo');
    const itensHistorico = aluno.detalhes.map(d => `<li style="margin-bottom:6px;">${d}</li>`).join('');

    container.innerHTML = `
        <div class="bloco-info-prontuario">
            <h4>Diagnóstico Pedagógico e Adaptação à Plataforma</h4>
            <p>${aluno.diag}</p>
        </div>
        <div class="bloco-info-prontuario" style="border-left-color: var(--cor-sucesso);">
            <h4>Registro de Tarefas do Aluno</h4>
            <ul style="padding-left: 20px; margin-top: 6px; font-weight: 600;">${itensHistorico}</ul>
        </div>
        <div class="bloco-info-prontuario" style="border-left-color: var(--cor-roxo);">
            <h4>Orientação para a Equipe Docente</h4>
            <p>${aluno.recomendacao}</p>
        </div>
    `;

    textoRelatorioAtual = `Ficha de ${aluno.nome}. Realizou ${aluno.tarefas}. Diagnóstico: ${aluno.diag}. Orientação: ${aluno.recomendacao}.`;
    const modal = document.getElementById('modal-detalhe-aluno');
    if (modal) {
        modal.classList.remove('oculto');
        modal.style.display = 'flex';
    }
}

function falarRelatorioAluno() {
    if (textoRelatorioAtual) falarTexto(textoRelatorioAtual);
}

function fecharModalProntuario() {
    pararVoz();
    const modal = document.getElementById('modal-detalhe-aluno');
    if (modal) {
        modal.classList.add('oculto');
        modal.style.display = 'none';
    }
}

/* ==========================================================================
   6. MODAL DE VÍDEO E CONFETES
   ========================================================================== */
function abrirModalVideo(item) {
    document.getElementById('letra-display').innerText = item.letra;
    const elFonema = document.getElementById('fonema-display');
    if (elFonema) elFonema.innerText = `FONEMA ${item.fonema}`;
    document.getElementById('modal-icone-palavra').innerText = item.icone;
    document.getElementById('modal-texto-palavra').innerText = item.palavra;
    document.getElementById('player-youtube').src = 'https://www.youtube.com/embed/' + item.youtubeId + '?vq=hd1080&autoplay=1';
    const modal = document.getElementById('modal-letras');
    if (modal) {
        modal.classList.remove('oculto');
        modal.style.display = 'flex';
    }
    falarTexto(`Letra ${item.letra}, de ${item.palavra}.`);
    SessaoAlunoAtivo.registrarAtividade(`Estudou o som e vídeo da letra ${item.letra} (${item.palavra}).`, '1. Sons das Letras');
}

function fecharModalVideo() {
    const modal = document.getElementById('modal-letras');
    if (modal) {
        modal.classList.add('oculto');
        modal.style.display = 'none';
    }
    document.getElementById('player-youtube').src = '';
    pararVoz();
}

function dispararConfetes() {
    const cores = ['#0056D2', '#00A3BF', '#16A34A', '#F59E0B', '#6D28D9'];
    for (let i = 0; i < 45; i++) {
        const c = document.createElement('div');
        c.className = 'confete';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = '-15px';
        c.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
        c.style.animationDuration = (Math.random() * 1.6 + 1.6) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 3500);
    }
}

/* ==========================================================================
   7. EXERCÍCIOS INTERATIVOS (SOM INICIAL, PALAVRAS E NOME)
   ========================================================================== */
let indiceInicialAtual = 0;
let indicePalavraAtual = 0;
let silabasPreenchidasAtual = 0;

function carregarJogoInicial() {
    const item = BancoDados.iniciais[indiceInicialAtual];
    const elImg = document.getElementById('imagem-inicial');
    const elDica = document.getElementById('nome-inicial-dica');
    const elOpcoes = document.getElementById('opcoes-iniciais');
    if (!elImg || !elDica || !elOpcoes) return;

    elImg.innerText = item.img;
    elDica.innerText = '_ ' + item.nome.substring(1).split('').join(' ');
    elOpcoes.innerHTML = '';

    item.ops.forEach(op => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-grande';
        btn.style.backgroundColor = 'var(--cor-primaria)';
        btn.innerText = op;
        btn.onclick = () => {
            if (op === item.certa) {
                elDica.innerText = item.nome.split('').join(' ');
                falarTexto(`Correto! ${item.nome} começa com a letra ${item.certa}.`);
                dispararConfetes();
                SessaoAlunoAtivo.registrarAtividade(`Identificou o som inicial da palavra ${item.nome}.`, '3. Som Inicial');
                indiceInicialAtual = (indiceInicialAtual + 1) % BancoDados.iniciais.length;
                setTimeout(carregarJogoInicial, 2200);
            } else {
                falarTexto('Errou, tente novamente.');
                SessaoAlunoAtivo.registrarErro(`Dúvida na letra inicial da palavra ${item.nome}.`);
            }
        };
        elOpcoes.appendChild(btn);
    });
}

function ouvirPalavraInicialAtual() {
    const item = BancoDados.iniciais[indiceInicialAtual];
    if (item) falarTexto(item.nome);
}

function carregarJogoPalavra() {
    const item = BancoDados.palavrasJogo[indicePalavraAtual];
    silabasPreenchidasAtual = 0;

    const elContador = document.getElementById('contador-palavras-jogo');
    const elDica = document.getElementById('dica-palavra');
    const elSlots = document.getElementById('slots-palavra');
    const elSoltas = document.getElementById('silabas-soltas');
    if (!elDica || !elSlots || !elSoltas) return;

    if (elContador) elContador.innerText = `PALAVRA ${indicePalavraAtual + 1} DE ${BancoDados.palavrasJogo.length}`;
    elDica.innerText = item.p;
    elSlots.innerHTML = '';
    elSoltas.innerHTML = '';

    item.s.forEach((_, idx) => {
        const slot = document.createElement('div');
        slot.className = 'slot-silaba';
        slot.id = `slot-palavra-${idx}`;
        elSlots.appendChild(slot);
    });

    const embaralhadas = [...item.s].sort(() => Math.random() - 0.5);
    embaralhadas.forEach(silaba => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-grande';
        btn.style.backgroundColor = 'var(--cor-primaria)';
        btn.innerText = silaba;
        btn.onclick = (e) => {
            const correta = item.s[silabasPreenchidasAtual];
            if (silaba === correta) {
                falarTexto(silaba);
                const slotAlvo = document.getElementById(`slot-palavra-${silabasPreenchidasAtual}`);
                if (slotAlvo) {
                    slotAlvo.innerText = silaba;
                    slotAlvo.style.backgroundColor = 'var(--cor-sucesso)';
                    slotAlvo.style.color = '#FFF';
                    slotAlvo.style.borderColor = 'var(--cor-sucesso)';
                }
                e.currentTarget.style.visibility = 'hidden';
                silabasPreenchidasAtual++;

                if (silabasPreenchidasAtual === item.s.length) {
                    SessaoAlunoAtivo.registrarAtividade(`Montou a palavra ${item.p} com sucesso.`, '6. Formar Palavras');
                    setTimeout(() => {
                        falarTexto(`Muito bem! Você formou a palavra ${item.p}.`);
                        dispararConfetes();
                    }, 500);
                }
            } else {
                falarTexto('Errou, tente novamente.');
                SessaoAlunoAtivo.registrarErro(`Dificuldade na ordem das sílabas da palavra ${item.p}.`);
            }
        };
        elSoltas.appendChild(btn);
    });
}

function proximaPalavraJogo() {
    indicePalavraAtual = (indicePalavraAtual + 1) % BancoDados.palavrasJogo.length;
    carregarJogoPalavra();
}

function verificarESalvarNome() {
    const input = document.getElementById('input-nome');
    if (!input) return;
    const nome = input.value.trim().toUpperCase();
    if (nome.length > 0) {
        salvarDadoLocal('pf_nome_aluno', nome);
        SessaoAlunoAtivo.nome = nome;
        atualizarPlacarTopo();
        falarTexto(`Parabéns, ${nome}! Seu nome foi registrado com sucesso.`);
        dispararConfetes();
        SessaoAlunoAtivo.registrarAtividade(`Treinou e confirmou a escrita do nome (${nome}).`, '9. Meu Nome');
    } else {
        falarTexto('Digite o seu nome no campo indicado.');
    }
}

/* ==========================================================================
   8. MOTOR DE CALIGRAFIA COM RECONHECIMENTO GEOMÉTRICO DA LETRA
   ========================================================================== */
class GerenciadorCanvas {
    constructor() {
        this.canvas = document.getElementById('canvas-caligrafia');
        this.container = document.getElementById('container-canvas');
        this.guia = document.getElementById('guia-fundo');
        this.aviso = document.getElementById('status-caligrafia');
        if (!this.canvas || !this.container) return;

        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.canvasMascara = document.createElement('canvas');
        this.ctxMascara = this.canvasMascara.getContext('2d', { willReadFrequently: true });

        this.letraAtual = 'A';
        this.desenhando = false;
        this.timer = null;
        this.vincularEventos();
    }

    atualizarCorPincel() {
        if (!this.ctx) return;
        const altoContraste = document.body.classList.contains('alto-contraste');
        this.ctx.strokeStyle = altoContraste ? '#FFFF00' : '#0056D2';
    }

    redimensionar() {
        if (!this.canvas || !this.container) return;
        const largura = this.container.clientWidth || 600;
        const altura = this.container.clientHeight || 400;

        this.canvas.width = largura;
        this.canvas.height = altura;
        this.ctx.lineWidth = 24;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.atualizarCorPincel();

        this.gerarMascaraLetra();
    }

    gerarMascaraLetra() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        if (!w || !h) return;

        this.canvasMascara.width = w;
        this.canvasMascara.height = h;
        this.ctxMascara.clearRect(0, 0, w, h);

        const tamanhoFonte = w <= 480 ? 180 : 240;
        if (this.guia) this.guia.style.fontSize = tamanhoFonte + 'px';

        this.ctxMascara.font = `900 ${tamanhoFonte}px Arial, Helvetica, sans-serif`;
        this.ctxMascara.textAlign = 'center';
        this.ctxMascara.textBaseline = 'middle';
        this.ctxMascara.lineWidth = 38;
        this.ctxMascara.lineJoin = 'round';
        this.ctxMascara.strokeStyle = '#000000';
        this.ctxMascara.fillStyle = '#000000';

        this.ctxMascara.strokeText(this.letraAtual, w / 2, h / 2);
        this.ctxMascara.fillText(this.letraAtual, w / 2, h / 2);
    }

    coordenadas(e) {
        const r = this.canvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
        }
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    iniciar(e) {
        clearTimeout(this.timer);
        this.desenhando = true;
        this.atualizarCorPincel();
        e.preventDefault();
        const p = this.coordenadas(e);
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
    }

    mover(e) {
        if (!this.desenhando) return;
        e.preventDefault();
        const p = this.coordenadas(e);
        this.ctx.lineTo(p.x, p.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
    }

    finalizar() {
        if (!this.desenhando) return;
        this.desenhando = false;
        this.ctx.beginPath();
        this.timer = setTimeout(() => this.validarTracoGeometrico(), 1100);
    }

    mostrarMensagemStatus(texto, tipo) {
        if (!this.aviso) return;
        this.aviso.innerText = texto;
        this.aviso.className = 'aviso-caligrafia ' + (tipo || '');
    }

    validarTracoGeometrico() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        if (!w || !h) return;

        const imgUsuario = this.ctx.getImageData(0, 0, w, h).data;
        const imgMascara = this.ctxMascara.getImageData(0, 0, w, h).data;

        let pixelsDesenhados = 0;
        let pixelsDentroDaLetra = 0;
        let pixelsTotaisMascara = 0;

        for (let i = 3; i < imgUsuario.length; i += 16) {
            const usuarioPintou = imgUsuario[i] > 60;
            const fazParteDaLetra = imgMascara[i] > 60;

            if (fazParteDaLetra) pixelsTotaisMascara++;
            if (usuarioPintou) {
                pixelsDesenhados++;
                if (fazParteDaLetra) pixelsDentroDaLetra++;
            }
        }

        if (pixelsDesenhados === 0) return;

        const precisaoSobreALetra = pixelsDentroDaLetra / pixelsDesenhados;
        const coberturaDaLetra = pixelsTotaisMascara > 0 ? (pixelsDentroDaLetra / pixelsTotaisMascara) : 0;

        if (precisaoSobreALetra < 0.52 || coberturaDaLetra < 0.14 || pixelsDesenhados > pixelsTotaisMascara * 1.45) {
            this.mostrarMensagemStatus(`ERROU, TENTE NOVAMENTE! PASSE O TRAÇO EM CIMA DA LETRA ${this.letraAtual}.`, 'erro');
            falarTexto('Errou, tente novamente.');
            SessaoAlunoAtivo.registrarErro(`Saiu do contorno ao desenhar a letra ${this.letraAtual}.`);
            setTimeout(() => this.limparSilencioso(), 900);
        } else {
            this.mostrarMensagemStatus(`MUITO BEM! TRAÇADO DA LETRA ${this.letraAtual} CORRETO!`, 'sucesso');
            falarTexto(`Muito bem! Traçado da letra ${this.letraAtual} correto.`);
            dispararConfetes();
            SessaoAlunoAtivo.registrarAtividade(`Concluiu com precisão o traçado da letra ${this.letraAtual}.`, '7. Traçado');
            setTimeout(() => {
                this.limparSilencioso();
                this.mostrarMensagemStatus(`CONTORNE A LETRA ${this.letraAtual} OU ESCOLHA OUTRA ACIMA`, '');
            }, 2400);
        }
    }

    limparSilencioso() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    definirGuia(caractere, botaoClicado) {
        this.letraAtual = caractere;
        if (this.guia) this.guia.innerText = caractere;
        if (botaoClicado) {
            document.querySelectorAll('#botoes-desenho .btn-ferramenta').forEach(b => b.classList.remove('ativo-guia'));
            botaoClicado.classList.add('ativo-guia');
        }
        this.limparSilencioso();
        this.gerarMascaraLetra();
        this.mostrarMensagemStatus(`CONTORNE A LETRA ${caractere} NO QUADRO ABAIXO`, '');
        falarTexto(`Contorne a letra ${caractere}`);
    }

    vincularEventos() {
        this.canvas.addEventListener('mousedown', e => this.iniciar(e));
        this.canvas.addEventListener('mousemove', e => this.mover(e));
        this.canvas.addEventListener('mouseup', () => this.finalizar());
        this.canvas.addEventListener('touchstart', e => this.iniciar(e), { passive: false });
        this.canvas.addEventListener('touchmove', e => this.mover(e), { passive: false });
        this.canvas.addEventListener('touchend', () => this.finalizar());
    }
}
let QuadroCaligrafia = null;

function redimensionarQuadroGlobal() {
    if (QuadroCaligrafia) QuadroCaligrafia.redimensionar();
}

/* ==========================================================================
   9. INICIALIZAÇÃO DE TODOS OS MÓDULOS
   ========================================================================== */
function construirInterfaceCompleta() {
    // 1. Sons das Letras com indicação de Fonema
    const gridAlfabeto = document.getElementById('container-grid-alfabeto');
    if (gridAlfabeto) {
        gridAlfabeto.innerHTML = '';
        BancoDados.alfabeto.forEach(item => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-letra';
            btn.innerHTML = `<span>${item.letra}</span><span class="sub-fonema">${item.fonema}</span>`;
            btn.onclick = () => abrirModalVideo(item);
            gridAlfabeto.appendChild(btn);
        });
    }

    // 2. Vogais e Consoantes
    const boxVogais = document.getElementById('box-vogais');
    const boxConsoantes = document.getElementById('box-consoantes');
    if (boxVogais && boxConsoantes) {
        boxVogais.innerHTML = '';
        boxConsoantes.innerHTML = '';
        BancoDados.vogais.forEach(v => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-grande';
            b.style.backgroundColor = 'var(--cor-destaque)';
            b.innerText = v;
            b.onclick = () => {
                falarTexto(`Vogal ${v}`);
                SessaoAlunoAtivo.registrarAtividade(`Ouviu o som da vogal ${v}.`, '2. Vogais e Cons.');
            };
            boxVogais.appendChild(b);
        });
        BancoDados.consoantes.forEach(c => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-letra';
            b.style.width = '80px';
            b.style.height = '85px';
            b.style.fontSize = '2.2rem';
            b.innerText = c;
            b.onclick = () => falarTexto(c);
            boxConsoantes.appendChild(b);
        });
    }

    // 4. Unindo Sons
    const boxFamilias = document.getElementById('botoes-familias');
    const resFamilia = document.getElementById('resultado-familia');
    if (boxFamilias && resFamilia) {
        boxFamilias.innerHTML = '';
        const mostrarFamilia = (consoante, falarIntro) => {
            document.getElementById('titulo-familia-atual').innerText = `FAMÍLIA SILÁBICA DA LETRA ${consoante}:`;
            resFamilia.innerHTML = '';
            BancoDados.vogais.forEach(v => {
                const silaba = consoante + v;
                const btnS = document.createElement('button');
                btnS.type = 'button';
                btnS.className = 'btn-grande';
                btnS.style.backgroundColor = 'var(--cor-sucesso)';
                btnS.innerText = silaba;
                btnS.onclick = () => {
                    falarTexto(silaba);
                    SessaoAlunoAtivo.registrarAtividade(`Praticou a sílaba ${silaba}.`, '4. Unindo Sons');
                };
                resFamilia.appendChild(btnS);
            });
            if (falarIntro) falarTexto(`Família da letra ${consoante}.`);
        };
        BancoDados.consoantes.forEach(c => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-letra';
            b.style.width = '66px';
            b.style.height = '72px';
            b.style.fontSize = '1.9rem';
            b.innerText = c;
            b.onclick = () => mostrarFamilia(c, true);
            boxFamilias.appendChild(b);
        });
        mostrarFamilia('B', false);
    }

    // 5. Formar Sílabas
    const contSilabas = document.getElementById('container-silabas');
    if (contSilabas) {
        contSilabas.innerHTML = '';
        BancoDados.silabas.forEach(item => {
            const silaba = item.consoante + item.vogal;
            const card = document.createElement('div');
            card.className = 'cartao linha-silaba';
            card.innerHTML = `
                <div class="bloco">${item.consoante}</div>
                <span style="color:var(--cor-primaria);">+</span>
                <div class="bloco">${item.vogal}</div>
                <span style="color:var(--cor-primaria);">=</span>
                <button type="button" class="bloco-resultado" onclick="falarTexto('${silaba} de ${item.palavra}'); SessaoAlunoAtivo.registrarAtividade('Praticou a sílaba ${silaba} de ${item.palavra}.', '5. Formar Sílabas');">
                    <span>${silaba}</span>
                    <span>${item.icone}</span>
                </button>
            `;
            contSilabas.appendChild(card);
        });
    }

    // 7. Botões de Traçado
    const contDesenho = document.getElementById('botoes-desenho');
    if (contDesenho) {
        contDesenho.innerHTML = '';
        BancoDados.sinaisDesenho.forEach((sinal, idx) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-ferramenta' + (idx === 0 ? ' ativo-guia' : '');
            b.innerText = sinal;
            b.onclick = (e) => { if (QuadroCaligrafia) QuadroCaligrafia.definirGuia(sinal, e.currentTarget); };
            contDesenho.appendChild(b);
        });
        const btnLimpar = document.createElement('button');
        btnLimpar.type = 'button';
        btnLimpar.className = 'btn-ferramenta';
        btnLimpar.style.backgroundColor = 'var(--cor-destaque)';
        btnLimpar.innerText = 'LIMPAR QUADRO';
        btnLimpar.onclick = () => {
            if (QuadroCaligrafia) {
                QuadroCaligrafia.limparSilencioso();
                QuadroCaligrafia.mostrarMensagemStatus(`CONTORNE A LETRA ${QuadroCaligrafia.letraAtual} NO QUADRO ABAIXO`, '');
            }
            falarTexto('Quadro limpo.');
        };
        contDesenho.appendChild(btnLimpar);
    }

    // 8. Cores
    const contCores = document.getElementById('container-cores');
    if (contCores) {
        contCores.innerHTML = '';
        BancoDados.cores.forEach(cor => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-letra';
            b.style.backgroundColor = cor.c;
            b.style.color = cor.txt;
            b.style.fontSize = '1.3rem';
            b.style.border = '2px solid rgba(0,0,0,0.15)';
            b.innerText = cor.n;
            b.onclick = () => {
                falarTexto(cor.n);
                SessaoAlunoAtivo.registrarAtividade(`Identificou a cor ${cor.n}.`, '8. Cores');
            };
            contCores.appendChild(b);
        });
    }

    // 10. Leitura Prática
    const contDia = document.getElementById('container-dia-a-dia');
    if (contDia) {
        contDia.innerHTML = '';
        BancoDados.vidaPratica.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card-interativo';
            card.innerHTML = `<span class="icone-card">${item.icone}</span><h3>${item.titulo}</h3><p style="font-size:0.82rem; color:#475569; margin-top:8px;">TOQUE PARA OUVIR A LEITURA</p>`;
            card.onclick = () => {
                falarTexto(item.textoFala);
                SessaoAlunoAtivo.registrarAtividade(`Realizou leitura prática: ${item.titulo}.`, '10. Leitura Prática');
            };
            contDia.appendChild(card);
        });
    }

    // 11. Vocabulário
    const contAnimais = document.getElementById('container-animais');
    if (contAnimais) {
        contAnimais.innerHTML = '';
        BancoDados.animais.forEach(animal => {
            const card = document.createElement('div');
            card.className = 'card-interativo';
            card.innerHTML = `<span class="icone-card">${animal.icone}</span><h3 style="color:var(--cor-primaria); font-size:1.5rem;">${animal.nome}</h3>`;
            card.onclick = () => {
                falarTexto(animal.nome);
                SessaoAlunoAtivo.registrarAtividade(`Praticou vocabulário: ${animal.nome}.`, '11. Vocabulário');
            };
            contAnimais.appendChild(card);
        });
    }

    // 12. Números
    const contNumeros = document.getElementById('container-numeros');
    if (contNumeros) {
        contNumeros.innerHTML = '';
        for (let i = 1; i <= 100; i++) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-letra';
            b.style.height = '74px';
            b.style.fontSize = '1.9rem';
            b.innerText = i;
            b.onclick = () => {
                falarTexto(String(i));
                SessaoAlunoAtivo.registrarAtividade(`Praticou leitura do número ${i}.`, '12. Números');
            };
            contNumeros.appendChild(b);
        }
    }

    // Navegação entre as 13 Abas
    const botoesAbas = document.querySelectorAll('.btn-tab');
    const secoesAbas = document.querySelectorAll('.aba-conteudo');
    botoesAbas.forEach(btn => {
        btn.addEventListener('click', (e) => {
            pararVoz();
            const alvo = e.currentTarget.getAttribute('data-target');
            SessaoAlunoAtivo.ultimoModulo = e.currentTarget.innerText;

            botoesAbas.forEach(b => b.classList.remove('active'));
            secoesAbas.forEach(s => s.classList.remove('active'));

            e.currentTarget.classList.add('active');
            const secaoAlvo = document.getElementById(alvo);
            if (secaoAlvo) secaoAlvo.classList.add('active');

            if (alvo === 'aba-escrever' && QuadroCaligrafia) {
                setTimeout(() => QuadroCaligrafia.redimensionar(), 60);
            }
            const menu = document.getElementById('menu-principal');
            if (menu) menu.classList.remove('aberto');
        });
    });

    carregarJogoInicial();
    carregarJogoPalavra();
    QuadroCaligrafia = new GerenciadorCanvas();
    setTimeout(() => { if (QuadroCaligrafia) QuadroCaligrafia.redimensionar(); }, 120);
    atualizarPlacarTopo();
    atualizarPainelProfessor('todos');
}

window.addEventListener('resize', () => {
    if (QuadroCaligrafia) QuadroCaligrafia.redimensionar();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', construirInterfaceCompleta);
} else {
    construirInterfaceCompleta();
}

window.falarTexto = falarTexto;
window.atualizarPainelProfessor = atualizarPainelProfessor;
window.redimensionarQuadroGlobal = redimensionarQuadroGlobal;
