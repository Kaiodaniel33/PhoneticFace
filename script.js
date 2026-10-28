(function () {
    'use strict';

    /* Remove caches antigos de Service Worker que possam travar atualizações */
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (regs) {
            for (let reg of regs) reg.unregister();
        }).catch(function () {});
    }

    function lerStorage(chave, padrao) {
        try {
            const v = localStorage.getItem(chave);
            return v !== null ? v : padrao;
        } catch (e) {
            return padrao;
        }
    }

    function salvarStorage(chave, valor) {
        try {
            localStorage.setItem(chave, String(valor));
        } catch (e) {}
    }

    /* CORRIGIDO (PROBLEMA 2): Sincronizado com #menu-principal e .menu-toggle */
    function toggleMenuMobile() {
        const menu = document.getElementById('menu-principal');
        const btn = document.querySelector('.menu-toggle');

        if (menu) {
            const aberto = menu.classList.toggle('aberto');
            if (btn) {
                btn.setAttribute('aria-expanded', String(aberto));
            }
        }
    }

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
        sinaisDesenho: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','?','~','-'],
        iniciais: [
            { img: '✈️', nome: 'AVIÃO', certa: 'A', ops: ['A','E','O'] }, { img: '🐘', nome: 'ELEFANTE', certa: 'E', ops: ['I','E','U'] },
            { img: '⛪', nome: 'IGREJA', certa: 'I', ops: ['A','I','O'] }, { img: '👁️', nome: 'OLHO', certa: 'O', ops: ['U','A','O'] },
            { img: '🍇', nome: 'UVA', certa: 'U', ops: ['E','U','I'] }, { img: '🐎', nome: 'CAVALO', certa: 'C', ops: ['B','C','D'] },
            { img: '🍌', nome: 'BANANA', certa: 'B', ops: ['P','B','D'] }, { img: '🚗', nome: 'CARRO', certa: 'C', ops: ['C','K','S'] },
            { img: '🐕', nome: 'CACHORRO', certa: 'C', ops: ['S','X','C'] }, { img: '🐈', nome: 'GATO', certa: 'G', ops: ['J','G','C'] },
            { img: '🦁', nome: 'LEÃO', certa: 'L', ops: ['M','L','N'] }, { img: '🍎', nome: 'MAÇÃ', certa: 'M', ops: ['N','M','P'] },
            { img: '🗺️', nome: 'CARTAGO', certa: 'C', ops: ['K','C','S'] }, { img: '🇧🇷', nome: 'BRASIL', certa: 'B', ops: ['P','B','D'] },
            { img: '💻', nome: 'COMPUTADOR', certa: 'C', ops: ['K','C','Q'] }, { img: '🦖', nome: 'DINOSSAURO', certa: 'D', ops: ['T','D','B'] },
            { img: '🍉', nome: 'MELANCIA', certa: 'M', ops: ['L','M','N'] }, { img: '🍓', nome: 'MORANGO', certa: 'M', ops: ['M','N','B'] },
            { img: '🍍', nome: 'ABACAXI', certa: 'A', ops: ['A','O','E'] }, { img: '⚽', nome: 'BOLA', certa: 'B', ops: ['D','B','P'] },
            { img: '🏠', nome: 'CASA', certa: 'C', ops: ['S','C','K'] }, { img: '🐒', nome: 'MACACO', certa: 'M', ops: ['N','M','L'] },
            { img: '🥘', nome: 'PANELA', certa: 'P', ops: ['B','P','D'] }, { img: '🍅', nome: 'TOMATE', certa: 'T', ops: ['T','D','P'] },
            { img: '🦉', nome: 'CORUJA', certa: 'C', ops: ['K','C','S'] }, { img: '🐸', nome: 'SAPO', certa: 'S', ops: ['Z','S','C'] },
            { img: '🦋', nome: 'BORBOLETA', certa: 'B', ops: ['P','D','B'] }, { img: '🐢', nome: 'TARTARUGA', certa: 'T', ops: ['T','D','F'] },
            { img: '🐷', nome: 'PORCO', certa: 'P', ops: ['B','P','Q'] }, { img: '🐔', nome: 'GALINHA', certa: 'G', ops: ['J','G','C'] }
        ],
        silabas: [
            { consoante: 'B', vogal: 'A', palavra: 'BANANA', icone: '🍌' }, { consoante: 'M', vogal: 'A', palavra: 'MALA', icone: '🧳' },
            { consoante: 'C', vogal: 'O', palavra: 'COPO', icone: '🥛' }, { consoante: 'D', vogal: 'I', palavra: 'DINHEIRO', icone: '💵' },
            { consoante: 'F', vogal: 'O', palavra: 'FOGO', icone: '🔥' }, { consoante: 'C', vogal: 'A', palavra: 'CARTAGO', icone: '🗺️' }
        ],
        palavrasJogo: [
            { p: 'CARTAGO', s: ['CAR','TA','GO'] }, { p: 'BRASIL', s: ['BRA','SIL'] }, { p: 'ESCOLA', s: ['ES','CO','LA'] },
            { p: 'BONECA', s: ['BO','NE','CA'] }, { p: 'BULE', s: ['BU','LE'] }, { p: 'CASA', s: ['CA','SA'] },
            { p: 'BOLA', s: ['BO','LA'] }, { p: 'MACACO', s: ['MA','CA','CO'] }, { p: 'PANELA', s: ['PA','NE','LA'] },
            { p: 'TOMATE', s: ['TO','MA','TE'] }, { p: 'CAVALO', s: ['CA','VA','LO'] }, { p: 'ABACATE', s: ['A','BA','CA','TE'] },
            { p: 'BANANA', s: ['BA','NA','NA'] }, { p: 'GATO', s: ['GA','TO'] }, { p: 'PATO', s: ['PA','TO'] },
            { p: 'COMPUTADOR', s: ['COM','PU','TA','DOR'] }, { p: 'TELEFONE', s: ['TE','LE','FO','NE'] },
            { p: 'SAPO', s: ['SA','PO'] }, { p: 'RATO', s: ['RA','TO'] }, { p: 'MATO', s: ['MA','TO'] },
            { p: 'LATA', s: ['LA','TA'] }, { p: 'FADA', s: ['FA','DA'] }, { p: 'MALA', s: ['MA','LA'] },
            { p: 'BOCA', s: ['BO','CA'] }, { p: 'DADO', s: ['DA','DO'] }, { p: 'FOCA', s: ['FO','CA'] },
            { p: 'LEÃO', s: ['LE','ÃO'] }, { p: 'MÃO', s: ['MÃO'] }, { p: 'PÃO', s: ['PÃO'] },
            { p: 'CÃO', s: ['CÃO'] }, { p: 'PEIXE', s: ['PEI','XE'] }, { p: 'LIXO', s: ['LI','XO'] },
            { p: 'RODA', s: ['RO','DA'] }, { p: 'FOTO', s: ['FO','TO'] }, { p: 'LOBO', s: ['LO','BO'] },
            { p: 'BOLO', s: ['BO','LO'] }, { p: 'SELO', s: ['SE','LO'] }, { p: 'GELO', s: ['GE','LO'] },
            { p: 'MESA', s: ['ME','SA'] }, { p: 'PESO', s: ['PE','SO'] }, { p: 'VASO', s: ['VA','SO'] },
            { p: 'SOPA', s: ['SO','PA'] }, { p: 'MAPA', s: ['MA','PA'] }, { p: 'CAPA', s: ['CA','PA'] },
            { p: 'LUVA', s: ['LU','VA'] }, { p: 'UVA', s: ['U','VA'] }, { p: 'OVO', s: ['O','VO'] },
            { p: 'AVE', s: ['A','VE'] }, { p: 'NAVE', s: ['NA','VE'] }, { p: 'NEVE', s: ['NE','VE'] },
            { p: 'VACA', s: ['VA','CA'] }, { p: 'FACA', s: ['FA','CA'] }, { p: 'MACA', s: ['MA','CA'] },
            { p: 'TELA', s: ['TE','LA'] }, { p: 'VELA', s: ['VE','LA'] }, { p: 'BELO', s: ['BE','LO'] },
            { p: 'BARCO', s: ['BAR','CO'] }, { p: 'MARCO', s: ['MAR','CO'] }, { p: 'PORCO', s: ['POR','CO'] }
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
            { titulo: 'LETREIRO DE ÔNIBUS', icone: '🚌', textoFala: 'EXPRESSO' },
            { titulo: 'LISTA DO MERCADO', icone: '🛒', textoFala: 'LISTA DE COMPRAS: 5 QUILOS DE ARROZ, FEIJÃO E MACARRÃO.' },
            { titulo: 'TREINO DA ACADEMIA', icone: '🏋️', textoFala: 'FICHA DE TREINO: FAZER 3 SÉRIES DE 10 REPETIÇÕES.' }
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
        alunosProfessor: [
            {
                nome: 'José Carlos da Silva (58 anos)',
                tarefas: '14 tarefas no dia',
                pct: 92,
                corBarra: 'fill-verde',
                categoria: 'otimo',
                relatorio: 'Concluiu tarefas de Sons das Letras, Sílabas e Leitura Prática com 100% de acerto.',
                orientacao: 'Avançar para frases',
                corBadge: 'var(--cor-sucesso)',
                historico: [
                    'Fez 14 exercícios hoje nos módulos 1, 5, 6 e 10.',
                    'Acertou todas as consoantes e leu os cartões de Receita Médica e Ônibus.',
                    'Navega na plataforma pelo celular sem precisar de ajuda.'
                ]
            },
            {
                nome: 'Maria Aparecida Oliveira (64 anos)',
                tarefas: '6 tarefas no dia',
                pct: 48,
                corBarra: 'fill-amarelo',
                categoria: 'dificuldade',
                relatorio: 'Teve dificuldade na tarefa de Formar Palavras (trocou sílabas das letras F e V).',
                orientacao: 'Reforçar Módulo 4 (Unindo Sons)',
                corBadge: '#D97706',
                historico: [
                    'Fez 6 tarefas hoje nos módulos 3 e 6.',
                    'Sentiu dificuldade ao ordenar sílabas de palavras maiores como BONECA e PANELA.',
                    'Acertou a escrita do próprio nome no Módulo 9.'
                ]
            },
            {
                nome: 'Antônio Ferreira Santos (71 anos)',
                tarefas: '2 tarefas no dia',
                pct: 25,
                corBarra: 'fill-vermelho',
                categoria: 'plataforma',
                relatorio: 'Não conseguiu mexer direito na plataforma sozinho; ensinar novamente a trocar de módulo.',
                orientacao: 'Ensinar uso do App + Alto Contraste',
                corBadge: 'var(--cor-roxo)',
                historico: [
                    'Realizou apenas 2 tarefas no Módulo 1 (Sons das Letras).',
                    'Teve dificuldade para abrir o menu e rolar a página no celular.',
                    'Recomendação: Ativar ALTO CONTRASTE e A+ AUMENTAR e ensinar novamente o passo a passo por 10 minutos.'
                ]
            },
            {
                nome: 'Sebastiana Rodrigues (52 anos)',
                tarefas: '12 tarefas no dia',
                pct: 88,
                corBarra: 'fill-verde',
                categoria: 'otimo',
                relatorio: 'Ótimo desempenho em Números de 1 a 100, Cores e Vocabulário.',
                orientacao: 'Aluna destaque do dia',
                corBadge: 'var(--cor-sucesso)',
                historico: [
                    'Realizou 12 tarefas hoje.',
                    'Completou o contorno das letras A, B, C, D e E com precisão.',
                    'Ótima facilidade tanto no tablet quanto no celular.'
                ]
            },
            {
                nome: 'Francisco Chagas Lima (67 anos)',
                tarefas: '5 tarefas no dia',
                pct: 42,
                corBarra: 'fill-amarelo',
                categoria: 'dificuldade',
                relatorio: 'Dificuldade na tarefa de Som Inicial e no contorno das letras R e S.',
                orientacao: 'Treinar Módulo 3 e Módulo 7',
                corBadge: '#D97706',
                historico: [
                    'Fez 5 tarefas no dia.',
                    'Saiu fora da linha no traçado da letra S três vezes seguidas.',
                    'Recomendado assistir novamente aos vídeos das letras C, R e S.'
                ]
            },
            {
                nome: 'Lourdes Nascimento (69 anos)',
                tarefas: '3 tarefas no dia',
                pct: 30,
                corBarra: 'fill-vermelho',
                categoria: 'plataforma',
                relatorio: 'Ficou com receio de clicar nos botões e esqueceu como fechar o vídeo; orientar uso básico.',
                orientacao: 'Auxiliar navegação básica',
                corBadge: 'var(--cor-roxo)',
                historico: [
                    'Assistiu aos vídeos das vogais A, E e I.',
                    'Precisa de ajuda inicial para ganhar confiança ao tocar na tela do aparelho.',
                    'Oralmente, repetiu todos os sons sem errar.'
                ]
            }
        ]
    };

    class GerenciadorVoz {
        constructor() { this.synth = window.speechSynthesis || null; }
        falar(texto) {
            if (!this.synth) return;
            try {
                this.synth.cancel(); 
                const declaracao = new SpeechSynthesisUtterance(String(texto).toUpperCase());
                declaracao.lang = 'pt-BR';
                this.synth.speak(declaracao);
            } catch (e) {}
        }
        parar() {
            if (this.synth) {
                try { this.synth.cancel(); } catch (e) {}
            }
        }
    }
    const Voz = new GerenciadorVoz();

    class ConfiguracaoAcessibilidade {
        constructor() { this.tamanhoAtual = 100; this.html = document.documentElement; }
        alterarTamanhoFonte(inc) {
            let novo = this.tamanhoAtual + inc;
            if (novo >= 80 && novo <= 150) {
                this.tamanhoAtual = novo;
                this.html.style.fontSize = `${this.tamanhoAtual}%`;
                const abaEscrever = document.getElementById('aba-escrever');
                if (QuadroInterativo && abaEscrever && abaEscrever.classList.contains('active')) {
                    setTimeout(() => QuadroInterativo.redimensionar(), 50);
                }
            }
        }
        alternarAltoContraste() {
            const ativo = document.body.classList.toggle('alto-contraste');
            const botao = document.getElementById('btn-alto-contraste');
            if (botao) botao.setAttribute('aria-pressed', String(ativo));
            if (QuadroInterativo) QuadroInterativo.atualizarCorTraco();
        }
    }
    const AppConfig = new ConfiguracaoAcessibilidade();

    /* CORRIGIDO (PROBLEMA 5): URL limpa + link reserva caso o navegador bloqueie autoplay */
    class GerenciadorModal {
        constructor() {
            this.modal = document.getElementById('modal-letras');
            this.titulo = document.getElementById('letra-display'); 
            this.icone = document.getElementById('modal-icone-palavra');
            this.texto = document.getElementById('modal-texto-palavra');
            this.iframe = document.getElementById('player-youtube');
            this.linkDireto = document.getElementById('link-youtube-direto');
        }
        mostrarVideo(item) {
            if (!this.modal) return;
            if (this.titulo) this.titulo.innerText = item.letra.toUpperCase();
            if (this.icone) this.icone.innerText = item.icone;
            if (this.texto) this.texto.innerText = item.palavra;
            if (this.iframe) {
                this.iframe.src = "https://www.youtube.com/embed/" + item.youtubeId + "?rel=0&autoplay=1";
            }
            if (this.linkDireto) {
                this.linkDireto.href = "https://www.youtube.com/watch?v=" + item.youtubeId;
            }
            this.modal.classList.add('visivel');
            Voz.falar(`O som da letra ${item.letra} forma a palavra ${item.palavra}.`);
            GerenciadorPerfil.registrarAcaoAluno(`Assistiu ao vídeo fônico da letra ${item.letra} (${item.palavra}).`);
        }
        fechar() {
            if (!this.modal) return;
            this.modal.classList.remove('visivel');
            Voz.parar();
            if (this.iframe) this.iframe.src = ""; 
        }
    }
    const InterfaceModal = new GerenciadorModal();

    /* CORRIGIDO (PROBLEMA 4): Preserva o desenho ao redimensionar e valida contra o molde */
    class CanvasCaligrafia {
        constructor(idCanvas, idContainer, idGuia) {
            this.canvas = document.getElementById(idCanvas);
            this.container = document.getElementById(idContainer);
            this.guiaFundo = document.getElementById(idGuia);
            this.barraStatus = document.getElementById('aviso-tracado');
            if (!this.canvas || !this.container) return;

            this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
            this.canvasMolde = document.createElement('canvas');
            this.ctxMolde = this.canvasMolde.getContext('2d', { willReadFrequently: true });

            this.letraAtual = 'A';
            this.desenhando = false;
            this.timerValidacao = null;
            this.vincularEventos();
        }

        atualizarCorTraco() {
            if (!this.ctx) return;
            this.ctx.strokeStyle = document.body.classList.contains('alto-contraste') ? '#FFFF00' : '#007AFF';
        }

        redimensionar() {
            if (!this.container || !this.canvas || !this.ctx) return;

            const largura = this.container.clientWidth || 600;
            const altura = this.container.clientHeight || 420;

            /* Guarda o desenho anterior antes de alterar as dimensões do canvas */
            const anterior = document.createElement('canvas');
            anterior.width = this.canvas.width;
            anterior.height = this.canvas.height;

            if (anterior.width > 0 && anterior.height > 0) {
                anterior.getContext('2d').drawImage(this.canvas, 0, 0);
            }

            this.canvas.width = largura;
            this.canvas.height = altura;

            this.ctx.lineWidth = 26;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';

            this.atualizarCorTraco();
            this.desenharMoldeLetra();

            if (anterior.width > 0 && anterior.height > 0) {
                this.ctx.drawImage(
                    anterior,
                    0, 0, anterior.width, anterior.height,
                    0, 0, largura, altura
                );
            }
        }

        desenharMoldeLetra() {
            if (!this.canvas) return;
            const w = this.canvas.width;
            const h = this.canvas.height;
            if (!w || !h) return;

            this.canvasMolde.width = w;
            this.canvasMolde.height = h;
            this.ctxMolde.clearRect(0, 0, w, h);

            const tamFonte = w < 500 ? 180 : 240;
            if (this.guiaFundo) this.guiaFundo.style.fontSize = tamFonte + 'px';

            this.ctxMolde.font = `900 ${tamFonte}px Arial, Helvetica, sans-serif`;
            this.ctxMolde.textAlign = 'center';
            this.ctxMolde.textBaseline = 'middle';
            this.ctxMolde.lineWidth = 42;
            this.ctxMolde.lineJoin = 'round';
            this.ctxMolde.strokeStyle = '#000';
            this.ctxMolde.fillStyle = '#000';
            this.ctxMolde.strokeText(this.letraAtual, w / 2, h / 2);
            this.ctxMolde.fillText(this.letraAtual, w / 2, h / 2);
        }

        obterCoordenadas(e) {
            const rect = this.canvas.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
            }
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }

        iniciarTraco(e) {
            clearTimeout(this.timerValidacao); 
            this.desenhando = true;
            this.atualizarCorTraco();
            e.preventDefault();
            const pos = this.obterCoordenadas(e);
            this.ctx.beginPath();
            this.ctx.moveTo(pos.x, pos.y);
        }

        desenhar(e) {
            if (!this.desenhando) return;
            e.preventDefault();
            const pos = this.obterCoordenadas(e);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(pos.x, pos.y);
        }

        finalizarTraco() {
            if (!this.desenhando) return;
            this.desenhando = false;
            this.ctx.beginPath();
            this.timerValidacao = setTimeout(() => { this.validarDesenho(); }, 1100); 
        }

        atualizarAviso(texto, classe) {
            if (!this.barraStatus) return;
            this.barraStatus.innerText = texto;
            this.barraStatus.className = 'barra-status-tracado ' + (classe || '');
        }

        validarDesenho() {
            if (!this.canvas) return;
            const w = this.canvas.width;
            const h = this.canvas.height;
            if (!w || !h) return;

            this.desenharMoldeLetra();
            const dadosAluno = this.ctx.getImageData(0, 0, w, h).data;
            const dadosMolde = this.ctxMolde.getImageData(0, 0, w, h).data;

            let pintadosPeloAluno = 0;
            let pintadosDentroDaLetra = 0;
            let tamanhoMolde = 0;

            for (let i = 3; i < dadosAluno.length; i += 16) {
                const alunoRiscou = dadosAluno[i] > 50;
                const dentroDaLetra = dadosMolde[i] > 50;

                if (dentroDaLetra) tamanhoMolde++;
                if (alunoRiscou) {
                    pintadosPeloAluno++;
                    if (dentroDaLetra) pintadosDentroDaLetra++;
                }
            }

            if (pintadosPeloAluno === 0) return;

            const precisao = pintadosDentroDaLetra / pintadosPeloAluno;
            const preenchimento = tamanhoMolde > 0 ? (pintadosDentroDaLetra / tamanhoMolde) : 0;

            if (precisao < 0.50 || preenchimento < 0.14 || pintadosPeloAluno > tamanhoMolde * 1.5) {
                this.atualizarAviso(`❌ ERROU, TENTE NOVAMENTE! CONTORNE EM CIMA DA LETRA ${this.letraAtual}.`, 'erro');
                Voz.falar("ERROU, TENTE NOVAMENTE.");
                GerenciadorPerfil.registrarDificuldadeAluno(`Errou o traçado da letra ${this.letraAtual}.`);
                setTimeout(() => this.limparSilencioso(), 950);
            } else {
                this.atualizarAviso(`✅ MUITO BEM! TRAÇADO DA LETRA ${this.letraAtual} CORRETO!`, 'sucesso');
                Voz.falar("TÁ CERTO! PARABÉNS PELO DESENHO.");
                InteracaoApp.gerarConfetes();
                GerenciadorPerfil.registrarAcaoAluno(`Concluiu corretamente o traçado da letra ${this.letraAtual}.`);
                setTimeout(() => {
                    this.limparSilencioso();
                    this.atualizarAviso(`PASSE O DEDO OU O MOUSE EXATAMENTE EM CIMA DA LETRA ${this.letraAtual}`, '');
                }, 2400);
            }
        }

        limparSilencioso() {
            if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        limpar() {
            this.limparSilencioso();
            this.atualizarAviso(`QUADRO APAGADO. CONTORNE A LETRA ${this.letraAtual}`, '');
            Voz.falar("QUADRO APAGADO.");
        }

        definirGuia(letra) {
            this.letraAtual = letra;
            if (this.guiaFundo) this.guiaFundo.innerText = letra;
            this.limparSilencioso();
            this.desenharMoldeLetra();
            this.atualizarAviso(`PASSE O DEDO OU O MOUSE EXATAMENTE EM CIMA DA LETRA ${letra}`, '');
            let textoFalar = (letra === '?' || letra === '~' || letra === '-') ? `DESENHE O SINAL ${letra}` : `CONTORNE O TRAÇADO DA LETRA ${letra}`;
            Voz.falar(textoFalar);
        }

        vincularEventos() {
            this.canvas.addEventListener('mousedown', (e) => this.iniciarTraco(e));
            this.canvas.addEventListener('mousemove', (e) => this.desenhar(e));
            this.canvas.addEventListener('mouseup', () => this.finalizarTraco());
            this.canvas.addEventListener('touchstart', (e) => this.iniciarTraco(e), {passive: false});
            this.canvas.addEventListener('touchmove', (e) => this.desenhar(e), {passive: false});
            this.canvas.addEventListener('touchend', () => this.finalizarTraco());
        }
    }
    let QuadroInterativo = null;

    class InteracoesDiversas {
        static idInicial = 0;
        static idPalavra = 0;
        static palavraAtual = null;
        static silabasPreenchidas = 0;

        static verificarNome() {
            const input = document.getElementById('input-nome');
            if (!input) return;
            const nome = input.value.trim().toUpperCase();
            if (nome.length > 0) {
                salvarStorage('phoneticface_aluno', nome);
                const boasVindas = document.getElementById('mensagem-boas-vindas');
                if (boasVindas) {
                    boasVindas.innerText = `👋 OLÁ, ${nome}!`;
                    boasVindas.style.display = 'block';
                }
                Voz.falar(`MUITO BEM, ${nome}! PARABÉNS POR ESCREVER SEU NOME.`);
                this.gerarConfetes();
                GerenciadorPerfil.registrarAcaoAluno(`Cadastrou e treinou a escrita do nome (${nome}).`);
            } else {
                Voz.falar("POR FAVOR, DIGITE O SEU NOME NA CAIXA BRANCA.");
            }
        }

        static carregarNomeSalvo() {
            const nomeSalvo = lerStorage('phoneticface_aluno', '');
            if (nomeSalvo) {
                const boasVindas = document.getElementById('mensagem-boas-vindas');
                const input = document.getElementById('input-nome');
                if (boasVindas) {
                    boasVindas.innerText = `👋 BEM-VINDO DE VOLTA, ${nomeSalvo}!`;
                    boasVindas.style.display = 'block';
                }
                if (input) input.value = nomeSalvo;
            }
        }

        static gerarConfetes() {
            const cores = ['#FF3B30', '#00BCD4', '#34C759', '#FFCC00', '#9B59B6'];
            for (let i = 0; i < 55; i++) {
                const confete = document.createElement('div');
                confete.className = 'confete';
                confete.style.left = Math.random() * 100 + 'vw';
                confete.style.top = '-10px';
                confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
                confete.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confete);
                setTimeout(() => confete.remove(), 4000);
            }
        }

        static ouvirPalavraInicial() {
            const item = BancoDados.iniciais[this.idInicial];
            if (item) Voz.falar(item.nome);
        }

        static carregarInicial() {
            const elImg = document.getElementById('imagem-inicial');
            const elDica = document.getElementById('nome-inicial-dica');
            const ct = document.getElementById('opcoes-iniciais');
            if (!elImg || !elDica || !ct) return;

            let item = BancoDados.iniciais[this.idInicial];
            elImg.innerText = item.img;
            elDica.innerText = "_ " + item.nome.substring(1).split('').join(' ');
            ct.innerHTML = '';

            item.ops.forEach(op => {
                let b = document.createElement('button'); 
                b.type = 'button';
                b.className = 'btn-grande'; 
                b.style.backgroundColor = 'var(--cor-secundaria)'; 
                b.innerText = op;
                b.onclick = () => {
                    if (op === item.certa) {
                        elDica.innerText = item.nome.split('').join(' ');
                        Voz.falar(`MUITO BEM! O SOM INICIAL DE ${item.nome} É REPRESENTADO PELA LETRA ${item.certa}.`);
                        this.gerarConfetes();
                        GerenciadorPerfil.registrarAcaoAluno(`Identificou a letra inicial da palavra ${item.nome}.`);
                        this.idInicial = (this.idInicial + 1) % BancoDados.iniciais.length;
                        setTimeout(() => this.carregarInicial(), 2500);
                    } else {
                        Voz.falar("ERROU, TENTE NOVAMENTE.");
                        GerenciadorPerfil.registrarDificuldadeAluno(`Dificuldade na letra inicial de ${item.nome}.`);
                    }
                };
                ct.appendChild(b);
            });
        }

        static carregarPalavra() {
            const elDica = document.getElementById('dica-palavra');
            const slots = document.getElementById('slots-palavra');
            const soltas = document.getElementById('silabas-soltas');
            if (!elDica || !slots || !soltas) return;

            this.palavraAtual = BancoDados.palavrasJogo[this.idPalavra];
            this.silabasPreenchidas = 0;
            elDica.innerText = this.palavraAtual.p;
            slots.innerHTML = '';
            soltas.innerHTML = '';

            this.palavraAtual.s.forEach((_, i) => {
                let slot = document.createElement('div'); 
                slot.className = 'slot-silaba'; 
                slot.id = `slot-${i}`;
                slots.appendChild(slot);
            });

            let embaralhadas = [...this.palavraAtual.s].sort(() => Math.random() - 0.5);
            embaralhadas.forEach(silaba => {
                let b = document.createElement('button'); 
                b.type = 'button';
                b.className = 'btn-grande'; 
                b.style.backgroundColor = 'var(--cor-secundaria)'; 
                b.innerText = silaba;
                b.onclick = (e) => {
                    let silabaCorreta = this.palavraAtual.s[this.silabasPreenchidas];
                    if (silaba === silabaCorreta) {
                        Voz.falar(silaba);
                        let sl = document.getElementById(`slot-${this.silabasPreenchidas}`);
                        if (sl) {
                            sl.innerText = silaba;
                            sl.style.backgroundColor = 'var(--cor-sucesso)';
                            sl.style.color = 'white';
                            sl.style.borderColor = 'var(--cor-sucesso)';
                        }
                        e.currentTarget.style.visibility = 'hidden';
                        this.silabasPreenchidas++;
                        if (this.silabasPreenchidas === this.palavraAtual.s.length) {
                            GerenciadorPerfil.registrarAcaoAluno(`Formou a palavra ${this.palavraAtual.p}.`);
                            setTimeout(() => {
                                Voz.falar(`PARABÉNS! VOCÊ FORMOU A PALAVRA ${this.palavraAtual.p}.`);
                                this.gerarConfetes();
                            }, 700);
                        }
                    } else {
                        Voz.falar("ERROU, TENTE NOVAMENTE.");
                        GerenciadorPerfil.registrarDificuldadeAluno(`Dúvida ao juntar as sílabas de ${this.palavraAtual.p}.`);
                    }
                };
                soltas.appendChild(b);
            });
        }

        static proximaPalavra() {
            this.idPalavra = (this.idPalavra + 1) % BancoDados.palavrasJogo.length;
            this.carregarPalavra();
        }
    }
    const InteracaoApp = InteracoesDiversas;

    const GerenciadorPerfil = {
        tarefasSessao: 4,
        historicoSessao: [
            'Acessou a plataforma PhoneticFace.',
            'Realizou atividades de consciência fonológica.'
        ],
        ultimoDiagnostico: 'Participando das lições na sessão atual.',
        fichaTextoAtual: '',

        registrarAcaoAluno: function (acao) {
            this.tarefasSessao++;
            this.historicoSessao.unshift(acao);
            if (this.historicoSessao.length > 6) this.historicoSessao.pop();
        },

        registrarDificuldadeAluno: function (erro) {
            this.ultimoDiagnostico = erro;
            this.historicoSessao.unshift('⚠️ ' + erro);
        },

        abrirModal: function () {
            Voz.parar();
            const m = document.getElementById('modal-selecao-perfil');
            if (m) m.classList.add('visivel');
        },

        selecionar: function (perfil) {
            const m = document.getElementById('modal-selecao-perfil');
            if (m) m.classList.remove('visivel');

            const viewAluno = document.getElementById('view-aluno');
            const viewProf = document.getElementById('view-professor');
            const navAluno = document.getElementById('container-navegacao-aluno');
            const badge = document.getElementById('label-perfil-atual');

            if (perfil === 'professor') {
                if (viewAluno) viewAluno.style.display = 'none';
                if (navAluno) navAluno.style.display = 'none';
                if (viewProf) viewProf.style.display = 'block';
                if (badge) badge.innerText = '👨‍🏫 MODO: PROFESSOR';
                this.renderizarTabela('todos');
                Voz.falar('Painel do professor aberto.');
            } else {
                if (viewProf) viewProf.style.display = 'none';
                if (viewAluno) viewAluno.style.display = 'block';
                if (navAluno) navAluno.style.display = 'block';
                if (badge) badge.innerText = '🎓 MODO: ALUNO';
                const abaEscrever = document.getElementById('aba-escrever');
                if (QuadroInterativo && abaEscrever && abaEscrever.classList.contains('active')) {
                    setTimeout(() => QuadroInterativo.redimensionar(), 60);
                }
                Voz.falar('Modo aluno aberto. Bons estudos.');
            }
        },

        obterAlunosCombinados: function () {
            const nomeAtual = lerStorage('phoneticface_aluno', 'Aluno em Aula Agora');
            const pct = Math.min(100, 45 + (this.tarefasSessao * 8));
            const alunoAoVivo = {
                nome: `🟢 ${nomeAtual} (Sessão Atual)`,
                tarefas: `${this.tarefasSessao} tarefas no dia`,
                pct: pct,
                corBarra: pct >= 70 ? 'fill-verde' : 'fill-amarelo',
                categoria: 'otimo',
                relatorio: this.ultimoDiagnostico,
                orientacao: 'Sessão em andamento',
                corBadge: 'var(--cor-primaria)',
                historico: this.historicoSessao
            };
            return [alunoAoVivo, ...BancoDados.alunosProfessor];
        },

        filtrarAlunos: function (categoria, btn) {
            if (btn) {
                document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
            this.renderizarTabela(categoria);
        },

        renderizarTabela: function (categoria) {
            const tbody = document.getElementById('tabela-alunos-body');
            if (!tbody) return;
            tbody.innerHTML = '';

            const todos = this.obterAlunosCombinados();
            const lista = todos.filter(a => (!categoria || categoria === 'todos') ? true : a.categoria === categoria);

            lista.forEach((aluno, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${aluno.nome}</strong></td>
                    <td><strong>${aluno.tarefas}</strong></td>
                    <td>
                        <div class="barra-progresso-bg">
                            <div class="barra-progresso-fill ${aluno.corBarra}" style="width: ${aluno.pct}%;">${aluno.pct}%</div>
                        </div>
                    </td>
                    <td>${aluno.relatorio}</td>
                    <td><span class="badge-status-prof" style="background: ${aluno.corBadge};">${aluno.orientacao}</span></td>
                    <td><button type="button" class="btn-ver-ficha" onclick="GerenciadorPerfil.abrirFicha(${idx})">🔍 VER FICHA</button></td>
                `;
                tbody.appendChild(tr);
            });
        },

        abrirFicha: function (indice) {
            const aluno = this.obterAlunosCombinados()[indice];
            if (!aluno) return;

            const elNome = document.getElementById('ficha-nome-aluno');
            const elResumo = document.getElementById('ficha-resumo-aluno');
            const elCorpo = document.getElementById('ficha-corpo-detalhes');
            const modalFicha = document.getElementById('modal-ficha-aluno');

            if (elNome) elNome.innerText = aluno.nome;
            if (elResumo) elResumo.innerText = `Produção Hoje: ${aluno.tarefas} | Evolução Fônica: ${aluno.pct}%`;

            const listaHtml = aluno.historico.map(h => `<li style="margin-bottom: 6px;">${h}</li>`).join('');
            if (elCorpo) {
                elCorpo.innerHTML = `
                    <div class="ficha-item">
                        <h4>Diagnóstico Pedagógico e Uso da Plataforma</h4>
                        <p>${aluno.relatorio}</p>
                    </div>
                    <div class="ficha-item" style="border-left-color: var(--cor-sucesso);">
                        <h4>Atividades Registradas</h4>
                        <ul style="padding-left: 20px; margin-top: 6px;">${listaHtml}</ul>
                    </div>
                    <div class="ficha-item" style="border-left-color: var(--cor-roxo);">
                        <h4>Orientação ao Professor</h4>
                        <p>${aluno.orientacao}</p>
                    </div>
                `;
            }

            this.fichaTextoAtual = `Ficha de ${aluno.nome}. Fez ${aluno.tarefas}. Diagnóstico: ${aluno.relatorio}. Orientação: ${aluno.orientacao}.`;
            if (modalFicha) modalFicha.classList.add('visivel');
        },

        ouvirFichaAtual: function () {
            if (this.fichaTextoAtual) Voz.falar(this.fichaTextoAtual);
        },

        fecharFicha: function () {
            Voz.parar();
            const modalFicha = document.getElementById('modal-ficha-aluno');
            if (modalFicha) modalFicha.classList.remove('visivel');
        }
    };

    class ConstrutorInterface {
        static renderizarAlfabeto() {
            const container = document.getElementById('container-grid-alfabeto');
            if (!container) return;
            container.innerHTML = '';
            BancoDados.alfabeto.forEach(item => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-letra';
                btn.innerHTML = `<span>${item.letra}</span><span class="sub-fonema">${item.fonema}</span>`;
                btn.onclick = () => InterfaceModal.mostrarVideo(item);
                container.appendChild(btn);
            });
        }

        static renderizarVogaisConsoantes() {
            const v = document.getElementById('box-vogais');
            const c = document.getElementById('box-consoantes');
            if (!v || !c) return;
            v.innerHTML = '';
            c.innerHTML = '';
            BancoDados.vogais.forEach(l => {
                let b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn-grande';
                b.style.backgroundColor = 'var(--cor-destaque)';
                b.innerText = l;
                b.onclick = () => Voz.falar(`O som desta vogal é ${l}`);
                v.appendChild(b);
            });
            BancoDados.consoantes.forEach(l => {
                let b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn-letra';
                b.style.width = '80px';
                b.innerText = l;
                b.onclick = () => Voz.falar(l);
                c.appendChild(b);
            });
        }

        static renderizarFamilias() {
            const bts = document.getElementById('botoes-familias');
            const res = document.getElementById('resultado-familia');
            const titulo = document.getElementById('titulo-familia-atual');
            if (!bts || !res || !titulo) return;

            bts.innerHTML = '';
            const mostrarUniao = (c, falar) => {
                titulo.innerText = `UNIÕES COM A LETRA ${c}:`;
                res.innerHTML = '';
                BancoDados.vogais.forEach(v => {
                    let f = c + v;
                    let btnF = document.createElement('button');
                    btnF.type = 'button';
                    btnF.className = 'btn-grande';
                    btnF.style.backgroundColor = 'var(--cor-sucesso)';
                    btnF.innerText = f;
                    btnF.onclick = () => Voz.falar(f);
                    res.appendChild(btnF);
                });
                if (falar) Voz.falar(`Veja como o som da letra ${c} se junta com as vogais.`);
            };
            BancoDados.consoantes.forEach(c => {
                let b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn-letra';
                b.style.width = '65px';
                b.innerText = c;
                b.onclick = () => mostrarUniao(c, true);
                bts.appendChild(b);
            });
            mostrarUniao('B', false);
        }

        static renderizarSilabas() {
            const container = document.getElementById('container-silabas');
            if (!container) return;
            container.innerHTML = '';
            BancoDados.silabas.forEach(item => {
                const silaba = item.consoante + item.vogal;
                const cartao = document.createElement('div');
                cartao.className = 'cartao linha-silaba';
                cartao.innerHTML = `
                    <div class="bloco">${item.consoante}</div>
                    <div style="color: var(--cor-primaria); font-size: 2rem;">➕</div>
                    <div class="bloco">${item.vogal}</div>
                    <div style="color: var(--cor-primaria); font-size: 2rem;">🟰</div>
                    <button type="button" class="bloco bloco-resultado" onclick="Voz.falar('A união dos sons forma a sílaba ${silaba}. ${silaba} de ${item.palavra}.')">
                        <span>${silaba}</span>
                        <span style="font-size: 2.5rem;">${item.icone}</span>
                    </button>
                `;
                container.appendChild(cartao);
            });
        }

        static renderizarBotoesDesenho() {
            const container = document.getElementById('botoes-desenho');
            if (!container) return;
            container.innerHTML = '';
            BancoDados.sinaisDesenho.forEach(sinal => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-ferramenta';
                btn.innerText = sinal;
                btn.onclick = () => { if (QuadroInterativo) QuadroInterativo.definirGuia(sinal); };
                container.appendChild(btn);
            });
            const btnApagar = document.createElement('button');
            btnApagar.type = 'button';
            btnApagar.className = 'btn-ferramenta';
            btnApagar.style.backgroundColor = 'var(--cor-destaque)';
            btnApagar.innerText = '🗑️ APAGAR';
            btnApagar.onclick = () => { if (QuadroInterativo) QuadroInterativo.limpar(); };
            container.appendChild(btnApagar);
        }

        static renderizarCores() {
            const ct = document.getElementById('container-cores');
            if (!ct) return;
            ct.innerHTML = '';
            BancoDados.cores.forEach(c => {
                let btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-letra';
                btn.innerText = c.n;
                btn.style.backgroundColor = c.c;
                btn.style.color = c.txt;
                btn.style.fontSize = '1.4rem';
                btn.style.border = '2px solid rgba(0,0,0,0.12)';
                btn.onclick = () => Voz.falar(c.n);
                ct.appendChild(btn);
            });
        }

        static renderizarVidaPratica() {
            const container = document.getElementById('container-dia-a-dia');
            if (!container) return;
            container.innerHTML = '';
            BancoDados.vidaPratica.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card-interativo';
                card.onclick = () => Voz.falar(item.textoFala);
                card.innerHTML = `<span class="icone-card">${item.icone}</span><h2 style="font-size: 1.7rem;">${item.titulo}</h2>`;
                container.appendChild(card);
            });
        }

        static renderizarAnimais() {
            const container = document.getElementById('container-animais');
            if (!container) return;
            container.innerHTML = '';
            BancoDados.animais.forEach(animal => {
                const card = document.createElement('div');
                card.className = 'card-interativo';
                card.onclick = () => Voz.falar(animal.nome); 
                card.innerHTML = `<span class="icone-card">${animal.icone}</span><h2 style="font-size: 1.9rem; color: var(--cor-primaria);">${animal.nome}</h2>`;
                container.appendChild(card);
            });
        }

        static renderizarNumeros() {
            const container = document.getElementById('container-numeros');
            if (!container) return;
            container.innerHTML = '';
            for (let i = 1; i <= 100; i++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-letra';
                btn.style.height = '80px'; 
                btn.style.fontSize = '2.2rem';
                btn.innerText = i;
                btn.onclick = () => Voz.falar(i.toString());
                container.appendChild(btn);
            }
        }

        static configurarNavegacaoAbas() {
            const botoes = document.querySelectorAll('.btn-tab');
            const conteudos = document.querySelectorAll('.aba-conteudo');
            const menu = document.getElementById('menu-principal');

            botoes.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    Voz.parar(); 
                    botoes.forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-selected', 'false');
                    });
                    e.currentTarget.classList.add('active');
                    e.currentTarget.setAttribute('aria-selected', 'true');

                    const alvo = e.currentTarget.getAttribute('data-target');
                    conteudos.forEach(c => {
                        c.classList.remove('active');
                        if (c.id === alvo) {
                            c.classList.add('active');
                            if (alvo === 'aba-escrever' && QuadroInterativo) {
                                setTimeout(() => QuadroInterativo.redimensionar(), 50);
                            }
                        }
                    });
                    if (window.innerWidth <= 768 && menu) {
                        menu.classList.remove('aberto');
                    }
                });
            });
        }
    }

    function configurarFechamentoModal() {
        const overlayVideo = document.getElementById('modal-letras');
        if (!overlayVideo) return;
        overlayVideo.addEventListener('click', (e) => {
            if (e.target === overlayVideo) InterfaceModal.fechar();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlayVideo.classList.contains('visivel')) InterfaceModal.fechar();
        });
    }

    /* CORRIGIDO (ITEM 3): Inicialização com tratamento de erro isolado por etapa */
    function inicializarAplicacao() {
        const etapas = [
            () => ConstrutorInterface.renderizarAlfabeto(),
            () => ConstrutorInterface.renderizarVogaisConsoantes(),
            () => ConstrutorInterface.renderizarFamilias(),
            () => ConstrutorInterface.renderizarSilabas(),
            () => ConstrutorInterface.renderizarCores(),
            () => ConstrutorInterface.renderizarVidaPratica(),
            () => ConstrutorInterface.renderizarAnimais(),
            () => ConstrutorInterface.renderizarNumeros(),
            () => ConstrutorInterface.configurarNavegacaoAbas(),
            () => {
                BancoDados.iniciais.sort(() => Math.random() - 0.5);
                BancoDados.palavrasJogo.sort(() => Math.random() - 0.5);
                InteracaoApp.carregarInicial();
                InteracaoApp.carregarPalavra();
                InteracaoApp.carregarNomeSalvo();
            },
            () => {
                QuadroInterativo = new CanvasCaligrafia('canvas-caligrafia', 'container-canvas', 'guia-fundo');
                ConstrutorInterface.renderizarBotoesDesenho();
                QuadroInterativo.redimensionar();
            },
            () => configurarFechamentoModal(),
            () => GerenciadorPerfil.renderizarTabela('todos')
        ];

        etapas.forEach((executarEtapa, indice) => {
            try {
                executarEtapa();
            } catch (erro) {
                console.error(`Aviso na etapa ${indice + 1} da inicialização:`, erro);
            }
        });

        let larguraJanelaAnterior = window.innerWidth;
        window.addEventListener('resize', () => {
            if (Math.abs(window.innerWidth - larguraJanelaAnterior) > 15) {
                larguraJanelaAnterior = window.innerWidth;
                const abaEscrever = document.getElementById('aba-escrever');
                if (abaEscrever && abaEscrever.classList.contains('active') && QuadroInterativo) {
                    QuadroInterativo.redimensionar();
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarAplicacao);
    } else {
        inicializarAplicacao();
    }

    window.toggleMenuMobile = toggleMenuMobile;
    window.Voz = Voz;
    window.AppConfig = AppConfig;
    window.InterfaceModal = InterfaceModal;
    window.InteracaoApp = InteracaoApp;
    window.GerenciadorPerfil = GerenciadorPerfil;
})();
