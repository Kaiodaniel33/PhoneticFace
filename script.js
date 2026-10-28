/* ==========================================================================
   1. LIMPEZA AUTOMÁTICA DE CACHE ANTIGO (EVITA TRAVAMENTO NO GITHUB PAGES)
   ========================================================================== */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}

/* ==========================================================================
   2. ESTADO EM TEMPO REAL DO ALUNO (CONECTADO AO PAINEL DO PROFESSOR)
   ========================================================================== */
const SessaoAlunoAtivo = {
    nome: localStorage.getItem('pf_nome_aluno') || 'Estudante (Sessão Ao Vivo)',
    tarefasHoje: parseInt(localStorage.getItem('pf_tarefas_hoje') || '3', 10),
    ultimoModulo: localStorage.getItem('pf_ultimo_modulo') || '1. Sons das Letras',
    historicoAcoes: [
        'Acessou a plataforma PhoneticFace sem dificuldades.',
        'Praticou reconhecimento sonoro das vogais e consoantes.'
    ],
    dificuldadeDetectada: 'Bom ritmo de aprendizagem na sessão atual.',
    registrarAtividade: function(descricao, moduloNome) {
        this.tarefasHoje++;
        if (moduloNome) this.ultimoModulo = moduloNome;
        this.historicoAcoes.unshift(descricao);
        if (this.historicoAcoes.length > 6) this.historicoAcoes.pop();
        localStorage.setItem('pf_tarefas_hoje', String(this.tarefasHoje));
        localStorage.setItem('pf_ultimo_modulo', this.ultimoModulo);
        atualizarPlacarTopo();
    },
    registrarErro: function(detalheErro) {
        this.dificuldadeDetectada = detalheErro;
        this.historicoAcoes.unshift('⚠️ Dificuldade registrada: ' + detalheErro);
    }
};

function atualizarPlacarTopo() {
    const elPlacar = document.getElementById('placar-aluno-topo');
    if (elPlacar) {
        elPlacar.innerText = `⭐ ${SessaoAlunoAtivo.tarefasHoje} ATIVIDADES FEITAS HOJE`;
    }
    const elBoasVindas = document.getElementById('mensagem-boas-vindas');
    if (elBoasVindas && localStorage.getItem('pf_nome_aluno')) {
        elBoasVindas.innerText = `👋 OLÁ, ${localStorage.getItem('pf_nome_aluno')}!`;
    }
}

/* ==========================================================================
   3. BANCO DE DADOS COMPLETO (ALUNO + TURMA EJA DO PROFESSOR)
   ========================================================================== */
const BancoDados = {
    alfabeto: [
        { letra: 'A', palavra: 'ABELHA', icone: '🐝', youtubeId: 'XBCDUG-yEaw' },
        { letra: 'B', palavra: 'BOLA', icone: '⚽', youtubeId: 'j6ROsDM87UU' },
        { letra: 'C', palavra: 'CASA', icone: '🏠', youtubeId: 'hWZA7DElS_I' },
        { letra: 'D', palavra: 'DADO', icone: '🎲', youtubeId: 'mAIWY3S12s4' },
        { letra: 'E', palavra: 'ELEFANTE', icone: '🐘', youtubeId: '8s43APNFMtM' },
        { letra: 'F', palavra: 'FACA', icone: '🔪', youtubeId: 'nuX0O_hqoFM' },
        { letra: 'G', palavra: 'GATO', icone: '🐈', youtubeId: '4SjEf5gYXio' },
        { letra: 'H', palavra: 'HORA', icone: '⌚', youtubeId: 'NhZ6eVHmVDA' },
        { letra: 'I', palavra: 'IGREJA', icone: '⛪', youtubeId: 'ILhan-Htj0g' },
        { letra: 'J', palavra: 'JACARÉ', icone: '🐊', youtubeId: 'Z9lBor1lnI8' },
        { letra: 'K', palavra: 'KIWI', icone: '🥝', youtubeId: 'eGrZ1WM_oaE' },
        { letra: 'L', palavra: 'LÁPIS', icone: '✏️', youtubeId: 'tC3yWQPeNpE' },
        { letra: 'M', palavra: 'MALA', icone: '🧳', youtubeId: 'mH3byoH67O4' },
        { letra: 'N', palavra: 'NAVIO', icone: '🚢', youtubeId: 'AGPxKWabjSc' },
        { letra: 'O', palavra: 'ÓCULOS', icone: '👓', youtubeId: '-8RtEgO3Y5s' },
        { letra: 'P', palavra: 'PATO', icone: '🦆', youtubeId: 'bmQ_2UA7sWw' },
        { letra: 'Q', palavra: 'QUEIJO', icone: '🧀', youtubeId: '-qZ5fNtr-8g' },
        { letra: 'R', palavra: 'RATO', icone: '🐀', youtubeId: '7fKcMXcBNOA' },
        { letra: 'S', palavra: 'SAPO', icone: '🐸', youtubeId: 's6XAkz5lGxA' },
        { letra: 'T', palavra: 'TATU', icone: '🦔', youtubeId: '-FyHvZ9Hz0Y' },
        { letra: 'U', palavra: 'UVA', icone: '🍇', youtubeId: 'beFXQ-w5CKs' },
        { letra: 'V', palavra: 'VACA', icone: '🐄', youtubeId: 'cGJ2MXDMsgE' },
        { letra: 'W', palavra: 'WEB', icone: '🌐', youtubeId: 'An41gHwcEEw' },
        { letra: 'X', palavra: 'XÍCARA', icone: '☕', youtubeId: 'zqrqp-RHFHs' },
        { letra: 'Y', palavra: 'YOUTUBE', icone: '▶️', youtubeId: 'NJLEAbML25A' },
        { letra: 'Z', palavra: 'ZEBRA', icone: '🦓', youtubeId: '-QBkzFZDWNU' }
    ],
    vogais: ['A','E','I','O','U'],
    consoantes: ['B','C','D','F','G','H','J','K','L','M','N','P','Q','R','S','T','V','W','X','Y','Z'],
    sinaisDesenho: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','?','~','-'],
    iniciais: [
        { img: '✈️', nome: 'AVIÃO', certa: 'A', ops: ['A','E','O'] },
        { img: '🐘', nome: 'ELEFANTE', certa: 'E', ops: ['I','E','U'] },
        { img: '⛪', nome: 'IGREJA', certa: 'I', ops: ['A','I','O'] },
        { img: '👁️', nome: 'OLHO', certa: 'O', ops: ['U','A','O'] },
        { img: '🍇', nome: 'UVA', certa: 'U', ops: ['E','U','I'] },
        { img: '🐎', nome: 'CAVALO', certa: 'C', ops: ['B','C','D'] },
        { img: '🍌', nome: 'BANANA', certa: 'B', ops: ['P','B','D'] },
        { img: '🚗', nome: 'CARRO', certa: 'C', ops: ['C','K','S'] },
        { img: '🐕', nome: 'CACHORRO', certa: 'C', ops: ['S','X','C'] },
        { img: '🐈', nome: 'GATO', certa: 'G', ops: ['J','G','C'] },
        { img: '🦁', nome: 'LEÃO', certa: 'L', ops: ['M','L','N'] },
        { img: '🍎', nome: 'MAÇÃ', certa: 'M', ops: ['N','M','P'] },
        { img: '🗺️', nome: 'CARTAGO', certa: 'C', ops: ['K','C','S'] },
        { img: '🇧🇷', nome: 'BRASIL', certa: 'B', ops: ['P','B','D'] },
        { img: '💻', nome: 'COMPUTADOR', certa: 'C', ops: ['K','C','Q'] },
        { img: '🦖', nome: 'DINOSSAURO', certa: 'D', ops: ['T','D','B'] },
        { img: '🍉', nome: 'MELANCIA', certa: 'M', ops: ['L','M','N'] },
        { img: '🍓', nome: 'MORANGO', certa: 'M', ops: ['M','N','B'] },
        { img: '🍍', nome: 'ABACAXI', certa: 'A', ops: ['A','O','E'] },
        { img: '⚽', nome: 'BOLA', certa: 'B', ops: ['D','B','P'] },
        { img: '🏠', nome: 'CASA', certa: 'C', ops: ['S','C','K'] },
        { img: '🐒', nome: 'MACACO', certa: 'M', ops: ['N','M','L'] },
        { img: '🥘', nome: 'PANELA', certa: 'P', ops: ['B','P','D'] },
        { img: '🍅', nome: 'TOMATE', certa: 'T', ops: ['T','D','P'] },
        { img: '🦉', nome: 'CORUJA', certa: 'C', ops: ['K','C','S'] },
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
        { titulo: 'PLACA DE TRÂNSITO', icone: '🛑', textoFala: 'ATENÇÃO MOTORISTA E PEDESTRE: PARE E OLHE ANTES DE ATRAVESSAR.' },
        { titulo: 'CAIXA ELETRÔNICO', icone: '🏧', textoFala: 'BANCO: INSIRA SEU CARTÃO E DIGITE SUA SENHA COM SEGURANÇA.' }
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
            tarefas: '14 tarefas hoje',
            pct: 92,
            corBarra: 'barra-verde',
            categoria: 'otimo',
            diag: 'Concluiu módulos 1 a 6. Excelente leitura de palavras trissílabas e placas do dia a dia.',
            recomendacao: 'Liberar Leitura Prática Avançada',
            tagCor: 'tag-verde',
            detalhes: [
                'Fez 14 exercícios hoje (Módulos de Sílabas, Palavras e Leitura Prática).',
                'Acertou 100% no reconhecimento sonoro das consoantes B, C, M e P.',
                'Navega sozinho pelo celular sem precisar de auxílio.'
            ]
        },
        {
            nome: 'Maria Aparecida Oliveira (64 anos)',
            tarefas: '6 tarefas hoje',
            pct: 48,
            corBarra: 'barra-amarela',
            categoria: 'dificuldade',
            diag: 'Teve dificuldade na tarefa de Formar Palavras (trocou sílabas com F e V).',
            recomendacao: 'Reforçar Módulo 4 (Unindo Sons)',
            tagCor: 'tag-amarelo',
            detalhes: [
                'Realizou 6 tarefas hoje no Módulo 3 (Som Inicial) e Módulo 6 (Formar Palavras).',
                'Apresentou confusão auditiva entre os fonemas /f/ (Faca) e /v/ (Vaca).',
                'Conseguiu escrever o próprio nome corretamente no Módulo 9.'
            ]
        },
        {
            nome: 'Antônio Ferreira Santos (71 anos)',
            tarefas: '2 tarefas hoje',
            pct: 25,
            corBarra: 'barra-vermelha',
            categoria: 'plataforma',
            diag: 'Não conseguiu mexer direito no menu da plataforma e teve dificuldade no toque do Traçado.',
            recomendacao: 'Ensinar uso do App + Alto Contraste',
            tagCor: 'tag-roxo',
            detalhes: [
                'Completou apenas 2 tarefas no Módulo 1 (Sons das Letras).',
                'Dificuldade de usabilidade: clicou fora dos botões e não sabia trocar de aba no celular.',
                'Ação sugerida: Ativar o botão ALTO CONTRASTE e A+ AUMENTAR FONTE para facilitar a visão e guiá-lo nos primeiros 10 minutos.'
            ]
        },
        {
            nome: 'Sebastiana Rodrigues (52 anos)',
            tarefas: '11 tarefas hoje',
            pct: 85,
            corBarra: 'barra-verde',
            categoria: 'otimo',
            diag: 'Ótimo desempenho em Números (1 a 100) e leitura de Receita Médica e Lista de Mercado.',
            recomendacao: 'Avançar para ditado de frases',
            tagCor: 'tag-verde',
            detalhes: [
                'Concluiu 11 tarefas nos módulos de Vocabulário, Cores e Números.',
                'Domina a associação entre imagem, som inicial e escrita.',
                'Ótima autonomia digital no tablet da escola.'
            ]
        },
        {
            nome: 'Francisco Chagas Lima (67 anos)',
            tarefas: '5 tarefas hoje',
            pct: 42,
            corBarra: 'barra-amarela',
            categoria: 'dificuldade',
            diag: 'Dificuldade na tarefa de juntar sílabas complexas (CAR-TA-GO e COM-PU-TA-DOR).',
            recomendacao: 'Treinar palavras de 2 sílabas',
            tagCor: 'tag-amarelo',
            detalhes: [
                'Fez 5 tarefas hoje. Acertou palavras simples como BOLA e CASA.',
                'Travou quando a palavra passou de 3 sílabas no Módulo 6.',
                'Recomendação: Revisar família silábica do C, P e T antes de avançar.'
            ]
        },
        {
            nome: 'Lourdes Nascimento (69 anos)',
            tarefas: '3 tarefas hoje',
            pct: 30,
            corBarra: 'barra-vermelha',
            categoria: 'plataforma',
            diag: 'Esqueceu como fechar o vídeo da letra e teve receio de apertar errado no aplicativo.',
            recomendacao: 'Auxiliar navegação básica no celular',
            tagCor: 'tag-roxo',
            detalhes: [
                'Assistiu aos vídeos das letras A, E e I com bastante atenção.',
                'Ficou parada na tela de vídeo sem saber onde fechar; precisa de treino prático de 5 minutos com a equipe docente.',
                'No áudio fônico, repetiu corretamente todos os sons.'
            ]
        },
        {
            nome: 'Valdir Pereira Gomes (49 anos)',
            tarefas: '16 tarefas hoje',
            pct: 96,
            corBarra: 'barra-verde',
            categoria: 'otimo',
            diag: 'Traçado de caligrafia perfeito no Módulo 7 e 100% de acerto nas iniciais.',
            recomendacao: 'Aluno destaque da semana',
            tagCor: 'tag-verde',
            detalhes: [
                'Realizou 16 tarefas completas em uma única aula.',
                'Caligrafia digital validada com precisão em todas as letras testadas.',
                'Pronto para auxiliar colegas com dificuldade tecnológica.'
            ]
        }
    ]
};

/* ==========================================================================
   4. FUNÇÕES GLOBAIS DE VOZ, ACESSIBILIDADE E DISPOSITIVO
   ========================================================================== */
function falarTexto(texto) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const declaracao = new SpeechSynthesisUtterance(String(texto).toUpperCase());
    declaracao.lang = 'pt-BR';
    declaracao.rate = 0.95;
    window.speechSynthesis.speak(declaracao);
}

function pararVoz() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
}

let tamanhoFonteGlobal = 100;
function alterarTamanhoFonte(incremento) {
    const novo = tamanhoFonteGlobal + incremento;
    if (novo >= 80 && novo <= 145) {
        tamanhoFonteGlobal = novo;
        document.documentElement.style.fontSize = tamanhoFonteGlobal + '%';
        if (QuadroCaligrafia) setTimeout(() => QuadroCaligrafia.redimensionar(), 60);
    }
}

function alternarAltoContraste() {
    const ativo = document.body.classList.toggle('alto-contraste');
    const btn = document.getElementById('btn-contraste');
    if (btn) btn.setAttribute('aria-pressed', String(ativo));
}

function alterarDispositivo(modo) {
    const wrapper = document.getElementById('app-viewport-wrapper');
    document.querySelectorAll('.btn-device').forEach(b => b.classList.remove('active'));
    wrapper.className = 'viewport-' + modo;
    const btnAtivo = document.getElementById('dev-' + modo);
    if (btnAtivo) btnAtivo.classList.add('active');
    if (QuadroCaligrafia) setTimeout(() => QuadroCaligrafia.redimensionar(), 380);
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
   5. GERENCIADOR DE PERFIL (ALUNO X PROFESSOR) E PRONTUÁRIO
   ========================================================================== */
function abrirModalPerfil() {
    pararVoz();
    const modal = document.getElementById('modal-selecao-perfil');
    if (modal) modal.style.display = 'flex';
}

function selecionarPerfil(perfil) {
    const modal = document.getElementById('modal-selecao-perfil');
    if (modal) modal.style.display = 'none';

    const viewAluno = document.getElementById('view-aluno');
    const viewProfessor = document.getElementById('view-professor');
    const labelPerfil = document.getElementById('label-perfil-atual');

    if (perfil === 'professor') {
        if (viewAluno) viewAluno.style.display = 'none';
        if (viewProfessor) viewProfessor.style.display = 'block';
        if (labelPerfil) labelPerfil.innerText = '👨‍🏫 MODO: PROFESSOR (GESTÃO)';
        renderizarTabelaProfessor('todos');
        falarTexto('Painel do Professor ativado. Relatório de desempenho e tarefas da turma carregado.');
    } else {
        if (viewProfessor) viewProfessor.style.display = 'none';
        if (viewAluno) viewAluno.style.display = 'block';
        if (labelPerfil) labelPerfil.innerText = '🎓 MODO: ALUNO';
        falarTexto('Ambiente do Aluno ativado. Bons estudos!');
        if (QuadroCaligrafia) setTimeout(() => QuadroCaligrafia.redimensionar(), 100);
    }
}

function obterListaCompletaAlunos() {
    const pctAoVivo = Math.min(100, 40 + (SessaoAlunoAtivo.tarefasHoje * 8));
    const alunoAoVivo = {
        nome: `🟢 ${SessaoAlunoAtivo.nome} (Sessão Atual)`,
        tarefas: `${SessaoAlunoAtivo.tarefasHoje} tarefas hoje`,
        pct: pctAoVivo,
        corBarra: pctAoVivo >= 70 ? 'barra-verde' : 'barra-azul',
        categoria: 'otimo',
        diag: `Último módulo acessado: ${SessaoAlunoAtivo.ultimoModulo}. ${SessaoAlunoAtivo.dificuldadeDetectada}`,
        recomendacao: 'Acompanhar progresso ao vivo',
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
    renderizarTabelaProfessor(filtro);
}

function renderizarTabelaProfessor(filtro) {
    const tbody = document.getElementById('lista-alunos-professor');
    if (!tbody) return;
    tbody.innerHTML = '';

    const todos = obterListaCompletaAlunos();
    const filtrados = todos.filter(a => filtro === 'todos' ? true : a.categoria === filtro);

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
            <td><button type="button" class="btn-raio-x" onclick="abrirProntuarioAluno(${index})">🔍 VER RAIO-X</button></td>
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
    document.getElementById('prontuario-status-geral').innerText = `Volume Diário: ${aluno.tarefas} | Domínio Fônico: ${aluno.pct}%`;

    const container = document.getElementById('prontuario-conteudo');
    const itensHistorico = aluno.detalhes.map(d => `<li style="margin-bottom:6px;">${d}</li>`).join('');

    container.innerHTML = `
        <div class="bloco-info-prontuario">
            <h4>📋 Diagnóstico Pedagógico & Usabilidade</h4>
            <p>${aluno.diag}</p>
        </div>
        <div class="bloco-info-prontuario" style="border-left-color: var(--cor-sucesso);">
            <h4>✅ Histórico Detalhado de Atividades</h4>
            <ul style="padding-left: 20px; margin-top: 6px; font-weight: 600;">${itensHistorico}</ul>
        </div>
        <div class="bloco-info-prontuario" style="border-left-color: var(--cor-roxo);">
            <h4>👨‍🏫 Plano de Ação Recomendado ao Docente</h4>
            <p>${aluno.recomendacao}</p>
        </div>
    `;

    textoRelatorioAtual = `Relatório de ${aluno.nome}. Realizou ${aluno.tarefas}. Diagnóstico: ${aluno.diag}. Recomendação: ${aluno.recomendacao}.`;
    document.getElementById('modal-detalhe-aluno').style.display = 'flex';
}

function falarRelatorioAluno() {
    if (textoRelatorioAtual) falarTexto(textoRelatorioAtual);
}

function fecharModalProntuario() {
    pararVoz();
    document.getElementById('modal-detalhe-aluno').style.display = 'none';
}

/* ==========================================================================
   6. MODAL DE VÍDEO EDUCATIVO E EFEITO DE CONFETES
   ========================================================================== */
function abrirModalVideo(item) {
    document.getElementById('letra-display').innerText = item.letra;
    document.getElementById('modal-icone-palavra').innerText = item.icone;
    document.getElementById('modal-texto-palavra').innerText = item.palavra;
    document.getElementById('player-youtube').src = 'https://www.youtube.com/embed/' + item.youtubeId + '?vq=hd1080&autoplay=1';
    document.getElementById('modal-letras').style.display = 'flex';
    falarTexto(`O som da letra ${item.letra} forma a palavra ${item.palavra}.`);
    SessaoAlunoAtivo.registrarAtividade(`Estudou o som e vídeo da letra ${item.letra} (${item.palavra}).`, '1. Sons das Letras');
}

function fecharModalVideo() {
    document.getElementById('modal-letras').style.display = 'none';
    document.getElementById('player-youtube').src = '';
    pararVoz();
}

function dispararConfetes() {
    const cores = ['#FF3B30', '#00BCD4', '#28A745', '#FFB800', '#7C3AED'];
    for (let i = 0; i < 50; i++) {
        const c = document.createElement('div');
        c.className = 'confete';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = '-15px';
        c.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
        c.style.animationDuration = (Math.random() * 1.8 + 1.8) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 3800);
    }
}

/* ==========================================================================
   7. JOGOS INTERATIVOS (SOM INICIAL, FORMAR PALAVRAS E MEU NOME)
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
        btn.style.backgroundColor = 'var(--cor-secundaria)';
        btn.innerText = op;
        btn.onclick = () => {
            if (op === item.certa) {
                elDica.innerText = item.nome.split('').join(' ');
                falarTexto(`Muito bem! O som inicial de ${item.nome} é a letra ${item.certa}.`);
                dispararConfetes();
                SessaoAlunoAtivo.registrarAtividade(`Acertou a letra inicial da palavra ${item.nome}.`, '3. Som Inicial');
                indiceInicialAtual = (indiceInicialAtual + 1) % BancoDados.iniciais.length;
                setTimeout(carregarJogoInicial, 2400);
            } else {
                falarTexto('Esse não é o som inicial correto. Tente outra letra.');
                SessaoAlunoAtivo.registrarErro(`Trocou a letra inicial na palavra ${item.nome} (tentou ${op}).`);
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
                    SessaoAlunoAtivo.registrarAtividade(`Formou corretamente a palavra ${item.p}.`, '6. Formar Palavras');
                    setTimeout(() => {
                        falarTexto(`Parabéns! Você formou a palavra ${item.p}.`);
                        dispararConfetes();
                    }, 600);
                }
            } else {
                falarTexto('Essa sílaba não encaixa agora. Tente outra.');
                SessaoAlunoAtivo.registrarErro(`Dificuldade ao ordenar as sílabas da palavra ${item.p}.`);
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
        localStorage.setItem('pf_nome_aluno', nome);
        SessaoAlunoAtivo.nome = nome;
        atualizarPlacarTopo();
        falarTexto(`Muito bem, ${nome}! Parabéns por escrever e salvar o seu nome.`);
        dispararConfetes();
        SessaoAlunoAtivo.registrarAtividade(`Escreveu o próprio nome (${nome}) no módulo de identidade.`, '9. Meu Nome');
    } else {
        falarTexto('Por favor, digite o seu nome na caixa branca.');
    }
}

/* ==========================================================================
   8. QUADRO DE CALIGRAFIA (CANVAS COM VALIDAÇÃO INTELIGENTE)
   ========================================================================== */
class GerenciadorCanvas {
    constructor() {
        this.canvas = document.getElementById('canvas-caligrafia');
        this.container = document.getElementById('container-canvas');
        this.guia = document.getElementById('guia-fundo');
        if (!this.canvas || !this.container) return;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.desenhando = false;
        this.timer = null;
        this.vincularEventos();
    }
    redimensionar() {
        if (!this.canvas || !this.container) return;
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.ctx.lineWidth = 24;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = '#007AFF';
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
        this.timer = setTimeout(() => this.validarTraco(), 1400);
    }
    validarTraco() {
        if (!this.canvas.width || !this.canvas.height) return;
        const dados = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        let pintados = 0;
        for (let i = 3; i < dados.length; i += 4) {
            if (dados[i] > 50) pintados++;
        }
        const prop = pintados / (this.canvas.width * this.canvas.height);
        if (prop === 0) return;

        const letraAtual = this.guia ? this.guia.innerText : 'A';
        if (prop < 0.003) {
            falarTexto('O traço ficou muito pequeno. Tente contornar a letra inteira.');
            this.limparSilencioso();
        } else if (prop > 0.20) {
            falarTexto('Você rabiscou muito fora da letra. Tente novamente.');
            this.limparSilencioso();
        } else {
            falarTexto(`Parabéns! Excelente traçado na letra ${letraAtual}.`);
            dispararConfetes();
            SessaoAlunoAtivo.registrarAtividade(`Treinou caligrafia digital da letra ${letraAtual}.`, '7. Traçado');
            setTimeout(() => this.limparSilencioso(), 2500);
        }
    }
    limparSilencioso() {
        if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    definirGuia(caractere) {
        if (this.guia) this.guia.innerText = caractere;
        this.limparSilencioso();
        falarTexto(`Contorne o traçado de ${caractere}`);
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

/* ==========================================================================
   9. CONSTRUÇÃO DE TODAS AS 13 ABAS E EVENTOS DE NAVEGAÇÃO
   ========================================================================== */
function construirInterfaceCompleta() {
    // 1. Alfabeto
    const gridAlfabeto = document.getElementById('container-grid-alfabeto');
    if (gridAlfabeto) {
        gridAlfabeto.innerHTML = '';
        BancoDados.alfabeto.forEach(item => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-letra';
            btn.innerText = item.letra;
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
                SessaoAlunoAtivo.registrarAtividade(`Ouviu o som da vogal ${v}.`, '2. Vogais/Cons.');
            };
            boxVogais.appendChild(b);
        });
        BancoDados.consoantes.forEach(c => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-letra';
            b.style.width = '82px';
            b.style.height = '88px';
            b.style.fontSize = '2.4rem';
            b.innerText = c;
            b.onclick = () => falarTexto(c);
            boxConsoantes.appendChild(b);
        });
    }

    // 4. Unindo Sons (Famílias Silábicas)
    const boxFamilias = document.getElementById('botoes-familias');
    const resFamilia = document.getElementById('resultado-familia');
    if (boxFamilias && resFamilia) {
        boxFamilias.innerHTML = '';
        const mostrarFamilia = (consoante, falarIntro) => {
            document.getElementById('titulo-familia-atual').innerText = `UNIÃO DA LETRA ${consoante} COM AS VOGAIS:`;
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
                    SessaoAlunoAtivo.registrarAtividade(`Praticou a família silábica do ${consoante} (${silaba}).`, '4. Unindo Sons');
                };
                resFamilia.appendChild(btnS);
            });
            if (falarIntro) falarTexto(`Veja como a letra ${consoante} se junta com as vogais.`);
        };
        BancoDados.consoantes.forEach(c => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-letra';
            b.style.width = '68px';
            b.style.height = '75px';
            b.style.fontSize = '2rem';
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
                <span style="color:var(--cor-primaria);">➕</span>
                <div class="bloco">${item.vogal}</div>
                <span style="color:var(--cor-primaria);">🟰</span>
                <button type="button" class="bloco bloco-resultado" onclick="falarTexto('${silaba} de ${item.palavra}'); SessaoAlunoAtivo.registrarAtividade('Treinou a sílaba ${silaba} de ${item.palavra}.', '5. Formar Sílabas');">
                    <span>${silaba}</span>
                    <span>${item.icone}</span>
                </button>
            `;
            contSilabas.appendChild(card);
        });
    }

    // 7. Botões do Traçado
    const contDesenho = document.getElementById('botoes-desenho');
    if (contDesenho) {
        contDesenho.innerHTML = '';
        BancoDados.sinaisDesenho.forEach(sinal => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-ferramenta';
            b.innerText = sinal;
            b.onclick = () => { if (QuadroCaligrafia) QuadroCaligrafia.definirGuia(sinal); };
            contDesenho.appendChild(b);
        });
        const btnLimpar = document.createElement('button');
        btnLimpar.type = 'button';
        btnLimpar.className = 'btn-ferramenta';
        btnLimpar.style.backgroundColor = 'var(--cor-destaque)';
        btnLimpar.innerText = '🗑️ APAGAR';
        btnLimpar.onclick = () => {
            if (QuadroCaligrafia) QuadroCaligrafia.limparSilencioso();
            falarTexto('Quadro apagado.');
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
            b.style.fontSize = '1.35rem';
            b.style.border = '2px solid rgba(0,0,0,0.12)';
            b.innerText = cor.n;
            b.onclick = () => {
                falarTexto(cor.n);
                SessaoAlunoAtivo.registrarAtividade(`Estudou a cor ${cor.n}.`, '8. Cores');
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
            card.innerHTML = `<span class="icone-card">${item.icone}</span><h3>${item.titulo}</h3><p style="font-size:0.85rem; color:#64748B; margin-top:8px;">TOQUE PARA LER E OUVIR</p>`;
            card.onclick = () => {
                falarTexto(item.textoFala);
                SessaoAlunoAtivo.registrarAtividade(`Praticou leitura cidadã: ${item.titulo}.`, '10. Leitura Prática');
            };
            contDia.appendChild(card);
        });
    }

    // 11. Animais / Vocabulário
    const contAnimais = document.getElementById('container-animais');
    if (contAnimais) {
        contAnimais.innerHTML = '';
        BancoDados.animais.forEach(animal => {
            const card = document.createElement('div');
            card.className = 'card-interativo';
            card.innerHTML = `<span class="icone-card">${animal.icone}</span><h3 style="color:var(--cor-primaria); font-size:1.6rem;">${animal.nome}</h3>`;
            card.onclick = () => {
                falarTexto(animal.nome);
                SessaoAlunoAtivo.registrarAtividade(`Estudou o vocabulário: ${animal.nome}.`, '11. Vocabulário');
            };
            contAnimais.appendChild(card);
        });
    }

    // 12. Números 1 a 100
    const contNumeros = document.getElementById('container-numeros');
    if (contNumeros) {
        contNumeros.innerHTML = '';
        for (let i = 1; i <= 100; i++) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-letra';
            b.style.height = '76px';
            b.style.fontSize = '2rem';
            b.innerText = i;
            b.onclick = () => {
                falarTexto(String(i));
                SessaoAlunoAtivo.registrarAtividade(`Praticou leitura do número ${i}.`, '12. Números');
            };
            contNumeros.appendChild(b);
        }
    }

    // Navegação das Abas do Aluno
    const botoesAbas = document.querySelectorAll('.btn-tab');
    const secoesAbas = document.querySelectorAll('.aba-conteudo');
    botoesAbas.forEach(btn => {
        btn.addEventListener('click', (e) => {
            pararVoz();
            const alvo = e.currentTarget.getAttribute('data-target');
            const nomeAba = e.currentTarget.innerText;
            SessaoAlunoAtivo.ultimoModulo = nomeAba;

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

    // Jogos iniciais e Caligrafia
    carregarJogoInicial();
    carregarJogoPalavra();
    QuadroCaligrafia = new GerenciadorCanvas();
    setTimeout(() => { if (QuadroCaligrafia) QuadroCaligrafia.redimensionar(); }, 120);
    atualizarPlacarTopo();
}

window.addEventListener('resize', () => {
    if (QuadroCaligrafia) QuadroCaligrafia.redimensionar();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', construirInterfaceCompleta);
} else {
    construirInterfaceCompleta();
}
