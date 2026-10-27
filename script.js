// REGISTRO SERVICE WORKER (PWA OFFLINE RELATIVO)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('PWA Offline ativo:', reg.scope))
        .catch(err => console.error('Erro no PWA:', err));
    });
}

(function () {
    'use strict';

    function toggleMenuMobile() {
        const menu = document.getElementById('menu-principal');
        const aberto = menu.classList.toggle('aberto');
        document.querySelector('.menu-toggle').setAttribute('aria-expanded', String(aberto));
    }

    // BANCO DE DADOS COMPLETO E SEM CORTES DE ITENS
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
            { p: 'SATO', s: ['SA','TO'] }, { p: 'RATO', s: ['RA','TO'] }, { p: 'MATO', s: ['MA','TO'] },
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
        // ESTATÍSTICAS DETALHADAS DO PAINEL DO PROFESSOR
        alunosProfessor: [
            { nome: 'João Silva', tarefas: '12 Módulos', desempenho: '92%', diag: 'Excelente retenção do som da consoante B e R', acao: 'Avançar para Formar Palavras', classe: 'otimo', status: 'Avançado' },
            { nome: 'Maria Oliveira', tarefas: '5 Módulos', desempenho: '58%', diag: 'Dificuldade na associação da vogal E com sílabas complexas', acao: 'Reforço no Módulo 2 e 4', classe: 'atencao', status: 'Dificuldade' },
            { nome: 'Carlos Eduardo', tarefas: '14 Módulos', desempenho: '98%', diag: 'Traçado de caligrafia 100% preciso no canvas', acao: 'Liberado para Leitura Prática', classe: 'otimo', status: 'Excelente' },
            { nome: 'Ana Souza', tarefas: '3 Módulos', desempenho: '40%', diag: 'Apresenta dúvida ao clicar no menu para trocar de lição', acao: 'Orientar navegação básica', classe: 'suporte', status: 'Ajuda na Navegação' },
            { nome: 'Marcos Roberto', tarefas: '8 Módulos', desempenho: '75%', diag: 'Bom domínio do vocabulário prático e números', acao: 'Continuar treino diário', classe: 'otimo', status: 'Normal' }
        ]
    };

    class GerenciadorVoz {
        constructor() { this.synth = window.speechSynthesis; }
        falar(texto) {
            if (!this.synth) return;
            this.synth.cancel(); 
            const declaracao = new SpeechSynthesisUtterance(texto.toUpperCase());
            declaracao.lang = 'pt-BR';
            this.synth.speak(declaracao);
        }
        parar() { if (this.synth) this.synth.cancel(); }
    }
    const Voz = new GerenciadorVoz();

    class GerenciadorPerfil {
        static selecionarPerfil(perfil) {
            const modal = document.getElementById('modal-selecao-perfil');
            modal.classList.remove('visivel');
            modal.style.display = 'none';

            const label = document.getElementById('label-perfil-atual');
            const viewAluno = document.getElementById('view-aluno');
            const viewProfessor = document.getElementById('view-professor');

            if (perfil === 'professor') {
                label.innerText = '👨‍🏫 MODALIDADE: PROFESSOR';
                viewAluno.style.display = 'none';
                viewProfessor.style.display = 'block';
                this.renderizarTabelaProfessor();
                Voz.falar("Painel do Professor ativado. Relatório pedagógico carregado.");
            } else {
                label.innerText = '🎓 MODALIDADE: ALUNO';
                viewProfessor.style.display = 'none';
                viewAluno.style.display = 'block';
                Voz.falar("Bem-vindo Aluno! Escolha um módulo e bom aprendizado.");
            }
        }

        static abrirModalSelecao() {
            const modal = document.getElementById('modal-selecao-perfil');
            modal.style.display = 'flex';
            modal.classList.add('visivel');
        }

        static renderizarTabelaProfessor() {
            const tbody = document.getElementById('lista-alunos-professor');
            tbody.innerHTML = '';
            BancoDados.alunosProfessor.forEach(aluno => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${aluno.nome}</strong></td>
                    <td>${aluno.tarefas}</td>
                    <td><strong>${aluno.desempenho}</strong></td>
                    <td>${aluno.diag}</td>
                    <td><span class="tag-status ${aluno.classe}">${aluno.acao}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
    }

    class ConfiguracaoAcessibilidade {
        constructor() { this.tamanhoAtual = 100; this.html = document.documentElement; }
        alterarTamanhoFonte(inc) {
            let novo = this.tamanhoAtual + inc;
            if (novo >= 80 && novo <= 150) {
                this.tamanhoAtual = novo;
                this.html.style.fontSize = `${this.tamanhoAtual}%`;
                if(document.getElementById('aba-escrever').classList.contains('active')) QuadroInterativo.redimensionar();
            }
        }
        alternarAltoContraste() {
            const ativo = document.body.classList.toggle('alto-contraste');
            const botao = document.querySelector('[onclick="AppConfig.alternarAltoContraste()"]');
            if (botao) botao.setAttribute('aria-pressed', String(ativo));
        }
    }
    const AppConfig = new ConfiguracaoAcessibilidade();

    class GerenciadorModal {
        constructor() {
            this.modal = document.getElementById('modal-letras');
            this.titulo = document.getElementById('letra-display'); 
            this.icone = document.getElementById('modal-icone-palavra');
            this.texto = document.getElementById('modal-texto-palavra');
            this.iframe = document.getElementById('player-youtube'); 
        }
        mostrarVideo(item) {
            this.titulo.innerText = item.letra.toUpperCase();
            this.icone.innerText = item.icone;
            this.texto.innerText = item.palavra;
            this.iframe.src = "https://www.youtube.com/embed/" + item.youtubeId + "?vq=hd1080&autoplay=1";
            this.modal.classList.add('visivel');
            Voz.falar(`O som da letra ${item.letra} forma a palavra ${item.palavra}.`);
        }
        fechar() {
            this.modal.classList.remove('visivel');
            Voz.parar();
            this.iframe.src = ""; 
        }
    }
    const InterfaceModal = new GerenciadorModal();

    class CanvasCaligrafia {
        constructor(idCanvas, idContainer, idGuia) {
            this.canvas = document.getElementById(idCanvas);
            this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
            this.container = document.getElementById(idContainer);
            this.guiaFundo = document.getElementById(idGuia);
            this.desenhando = false;
            this.timerValidacao = null;
            this.vincularEventos();
        }
        redimensionar() {
            if(!this.container || !this.canvas) return;
            this.canvas.width = this.container.clientWidth;
            this.canvas.height = this.container.clientHeight;
            this.ctx.lineWidth = 25; 
            this.ctx.lineCap = 'round';
            this.ctx.strokeStyle = '#007AFF';
        }
        obterCoordenadas(e) {
            const rect = this.canvas.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }
        iniciarTraco(e) {
            clearTimeout(this.timerValidacao); 
            this.desenhando = true;
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
            this.desenhando = false;
            this.ctx.beginPath();
            this.timerValidacao = setTimeout(() => { this.validarDesenho(); }, 1500); 
        }
        validarDesenho() {
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
            let marcados = 0;
            for (let i = 3; i < imageData.length; i += 4) { if (imageData[i] > 50) { marcados++; } }
            const totalPixels = this.canvas.width * this.canvas.height;
            const proporcao = marcados / totalPixels;

            if (proporcao === 0) return; 

            if (proporcao < 0.003) {
                Voz.falar("ISSO PARECE APENAS UM RISCO. ERRADO, TENTE NOVAMENTE O TRAÇADO.");
                this.limparSilencioso();
            } else if (proporcao > 0.18) {
                Voz.falar("VOCÊ RABISCOU MUITO. ERRADO, TENTE NOVAMENTE O TRAÇADO.");
                this.limparSilencioso();
            } else {
                Voz.falar("TÁ CERTO! PARABÉNS PELO DESENHO.");
                InteracaoApp.gerarConfetes();
                setTimeout(() => this.limparSilencioso(), 3000);
            }
        }
        limparSilencioso() { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
        limpar() { this.limparSilencioso(); Voz.falar("QUADRO APAGADO."); }
        definirGuia(letra) {
            this.guiaFundo.innerText = letra;
            this.limparSilencioso();
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
    let QuadroInterativo;

    class InteracoesDiversas {
        static idInicial = 0; static idPalavra = 0; static palavraAtual = null; static silabasPreenchidas = 0;

        static verificarNome() {
            const input = document.getElementById('input-nome');
            const nome = input.value.trim().toUpperCase();
            if (nome.length > 0) {
                localStorage.setItem('phoneticface_aluno', nome);
                document.getElementById('mensagem-boas-vindas').innerText = `👋 OLÁ, ${nome}!`;
                document.getElementById('mensagem-boas-vindas').style.display = 'block';
                Voz.falar(`MUITO BEM, ${nome}! PARABÉNS POR ESCREVER SEU NOME.`);
                this.gerarConfetes();
            } else {
                Voz.falar("POR FAVOR, DIGITE O SEU NOME NA CAIXA BRANCA.");
            }
        }
        
        static carregarNomeSalvo() {
            const nomeSalvo = localStorage.getItem('phoneticface_aluno');
            if (nomeSalvo) {
                document.getElementById('mensagem-boas-vindas').innerText = `👋 BEM-VINDO DE VOLTA, ${nomeSalvo}!`;
                document.getElementById('mensagem-boas-vindas').style.display = 'block';
                document.getElementById('input-nome').value = nomeSalvo;
            }
        }

        static gerarConfetes() {
            const cores = ['#FF3B30', '#00BCD4', '#34C759', '#FFCC00', '#9B59B6'];
            for (let i = 0; i < 60; i++) {
                const confete = document.createElement('div');
                confete.className = 'confete';
                confete.style.left = Math.random() * 100 + 'vw';
                confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
                confete.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confete);
                setTimeout(() => confete.remove(), 4000);
            }
        }

        static carregarInicial() {
            let item = BancoDados.iniciais[this.idInicial];
            document.getElementById('imagem-inicial').innerText = item.img;
            let nomeDica = "_ " + item.nome.substring(1).split('').join(' ');
            document.getElementById('nome-inicial-dica').innerText = nomeDica;

            const ct = document.getElementById('opcoes-iniciais');
            ct.innerHTML = '';
            item.ops.forEach(op => {
                let b = document.createElement('button'); b.className='btn-grande'; b.style.backgroundColor='var(--cor-secundaria)'; b.innerText = op;
                b.onclick = () => {
                    if(op === item.certa) {
                        document.getElementById('nome-inicial-dica').innerText = item.nome.split('').join(' ');
                        Voz.falar(`MUITO BEM! O SOM INICIAL DE ${item.nome} É REPRESENTADO PELA LETRA ${item.certa}.`);
                        this.gerarConfetes();
                        this.idInicial = (this.idInicial + 1) % BancoDados.iniciais.length;
                        setTimeout(() => this.carregarInicial(), 3000);
                    } else {
                        Voz.falar("ESSE NÃO É O SOM INICIAL CORRETO. TENTE OUTRA LETRA.");
                    }
                };
                ct.appendChild(b);
            });
        }

        static carregarPalavra() {
            this.palavraAtual = BancoDados.palavrasJogo[this.idPalavra];
            this.silabasPreenchidas = 0;
            document.getElementById('dica-palavra').innerText = this.palavraAtual.p;
            
            const slots = document.getElementById('slots-palavra'); slots.innerHTML = '';
            this.palavraAtual.s.forEach((silaba, i) => {
                let slot = document.createElement('div'); slot.className = 'slot-silaba'; slot.id = `slot-${i}`;
                slots.appendChild(slot);
            });

            const soltas = document.getElementById('silabas-soltas'); soltas.innerHTML = '';
            let embaralhadas = [...this.palavraAtual.s].sort(() => Math.random() - 0.5);
            embaralhadas.forEach(silaba => {
                let b = document.createElement('button'); b.className='btn-grande'; b.style.backgroundColor='var(--cor-secundaria)'; b.innerText = silaba;
                b.onclick = (e) => {
                    let silabaCorreta = this.palavraAtual.s[this.silabasPreenchidas];
                    if(silaba === silabaCorreta) {
                        Voz.falar(silaba);
                        let sl = document.getElementById(`slot-${this.silabasPreenchidas}`);
                        sl.innerText = silaba; sl.style.backgroundColor = 'var(--cor-sucesso)'; sl.style.color = 'white'; sl.style.borderColor = 'var(--cor-sucesso)';
                        e.target.style.visibility = 'hidden';
                        this.silabasPreenchidas++;
                        if(this.silabasPreenchidas === this.palavraAtual.s.length) {
                            setTimeout(() => { Voz.falar(`PARABÉNS! VOCÊ FORMOU A PALAVRA ${this.palavraAtual.p}.`); this.gerarConfetes(); }, 1000);
                        }
                    } else {
                        Voz.falar("ESSA SÍLABA NÃO ENCAIXA AGORA. TENTE OUTRA.");
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

    class ConstrutorInterface {
        static renderizarAlfabeto() {
            const container = document.getElementById('container-grid-alfabeto');
            container.innerHTML = '';
            BancoDados.alfabeto.forEach(item => {
                const btn = document.createElement('button'); btn.className = 'btn-letra'; btn.innerText = item.letra;
                btn.onclick = () => InterfaceModal.mostrarVideo(item); container.appendChild(btn);
            });
        }
        static renderizarVogaisConsoantes() {
            const v = document.getElementById('box-vogais'); const c = document.getElementById('box-consoantes');
            v.innerHTML = ''; c.innerHTML = '';
            BancoDados.vogais.forEach(l => {
                let b = document.createElement('button'); b.className='btn-grande'; b.style.backgroundColor='var(--cor-destaque)'; b.innerText=l;
                b.style.boxShadow = '0 6px 0 #C0392B'; b.onclick = () => Voz.falar(`O som desta vogal é ${l}`); v.appendChild(b);
            });
            BancoDados.consoantes.forEach(l => {
                let b = document.createElement('button'); b.className='btn-letra'; b.style.width='80px'; b.innerText=l;
                b.onclick = () => Voz.falar(l); c.appendChild(b);
            });
        }
        static renderizarFamilias() {
            const bts = document.getElementById('botoes-familias');
            bts.innerHTML = '';
            BancoDados.consoantes.forEach(c => {
                let b = document.createElement('button'); b.className='btn-letra'; b.style.width='60px'; b.innerText=c;
                b.onclick = () => {
                    document.getElementById('titulo-familia-atual').innerText = `UNIÕES COM A LETRA ${c}:`;
                    const res = document.getElementById('resultado-familia'); res.innerHTML = '';
                    BancoDados.vogais.forEach(v => {
                        let f = c+v;
                        let btnF = document.createElement('button'); btnF.className='btn-grande'; btnF.style.backgroundColor='var(--cor-sucesso)'; btnF.innerText=f;
                        btnF.style.boxShadow = '0 6px 0 var(--cor-sucesso-escuro)'; btnF.onclick = () => Voz.falar(f); res.appendChild(btnF);
                    });
                    Voz.falar(`Veja como o som da letra ${c} se junta com as vogais.`);
                };
                bts.appendChild(b);
            });
        }
        static renderizarSilabas() {
            const container = document.getElementById('container-silabas');
            container.innerHTML = '';
            BancoDados.silabas.forEach(item => {
                const silaba = item.consoante + item.vogal;
                const cartao = document.createElement('div'); cartao.className = 'cartao linha-silaba';
                cartao.innerHTML = `<div class="bloco">${item.consoante}</div><div class="sinal-matematico" style="color: var(--cor-primaria);">➕</div><div class="bloco">${item.vogal}</div><div class="sinal-matematico" style="color: var(--cor-primaria);">🟰</div><button class="bloco bloco-resultado" onclick="Voz.falar('A união dos sons forma a sílaba ${silaba}. ${silaba} de ${item.palavra}.')"><span>${silaba}</span><span style="font-size: 2.5rem;">${item.icone}</span></button>`;
                container.appendChild(cartao);
            });
        }
        static renderizarBotoesDesenho() {
            const container = document.getElementById('botoes-desenho');
            container.innerHTML = '';
            BancoDados.sinaisDesenho.forEach(sinal => {
                const btn = document.createElement('button'); btn.className = 'btn-ferramenta'; btn.innerText = sinal;
                btn.onclick = () => QuadroInterativo.definirGuia(sinal); container.appendChild(btn);
            });
            const btnApagar = document.createElement('button'); btnApagar.className = 'btn-ferramenta'; btnApagar.style.backgroundColor = 'var(--cor-destaque)';
            btnApagar.style.boxShadow = '0 6px 0 #C0392B'; btnApagar.innerText = '🗑️ APAGAR'; btnApagar.onclick = () => QuadroInterativo.limpar();
            container.appendChild(btnApagar);
        }
        static renderizarCores() {
            const ct = document.getElementById('container-cores');
            ct.innerHTML = '';
            BancoDados.cores.forEach(c => {
                let btn = document.createElement('button'); btn.className = 'btn-letra'; btn.innerText = c.n;
                btn.style.backgroundColor = c.c; btn.style.color = c.txt; btn.style.fontSize = '1.5rem'; btn.style.border = '2px solid rgba(0,0,0,0.1)';
                btn.style.boxShadow = '0 6px 0 rgba(0,0,0,0.2)'; btn.onclick = () => Voz.falar(c.n); ct.appendChild(btn);
            });
        }
        static renderizarVidaPratica() {
            const container = document.getElementById('container-dia-a-dia');
            container.innerHTML = '';
            BancoDados.vidaPratica.forEach(item => {
                const card = document.createElement('div'); card.className = 'card-interativo'; card.onclick = () => Voz.falar(item.textoFala);
                card.innerHTML = `<span class="icone-card">${item.icone}</span><h2 style="font-size: 1.8rem;">${item.titulo}</h2>`; container.appendChild(card);
            });
        }
        static renderizarAnimais() {
            const container = document.getElementById('container-animais');
            container.innerHTML = '';
            BancoDados.animais.forEach(animal => {
                const card = document.createElement('div'); card.className = 'card-interativo'; card.onclick = () => Voz.falar(animal.nome); 
                card.innerHTML = `<span class="icone-card">${animal.icone}</span><h2 style="font-size: 2rem; color: var(--cor-primaria);">${animal.nome}</h2>`;
                container.appendChild(card);
            });
        }
        static renderizarNumeros() {
            const container = document.getElementById('container-numeros');
            container.innerHTML = '';
            for (let i = 1; i <= 100; i++) {
                const btn = document.createElement('button'); btn.className = 'btn-letra'; btn.style.height = '80px'; btn.style.fontSize = '2.5rem';
                btn.innerText = i; btn.onclick = () => Voz.falar(i.toString()); container.appendChild(btn);
            }
        }
        static configurarNavegacaoAbas() {
            const botoes = document.querySelectorAll('.btn-tab');
            const conteudos = document.querySelectorAll('.aba-conteudo');

            botoes.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    Voz.parar(); 
                    botoes.forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    const alvo = e.currentTarget.getAttribute('data-target');

                    conteudos.forEach(c => {
                        c.classList.remove('active');
                        if (c.id === alvo) {
                            c.classList.add('active');
                            if(alvo === 'aba-escrever' && QuadroInterativo) setTimeout(() => QuadroInterativo.redimensionar(), 50);
                        }
                    });
                    if (window.innerWidth <= 768) {
                        document.getElementById('menu-principal').classList.remove('aberto');
                    }
                });
            });
        }
    }

    function configurarFechamentoModal() {
        const overlay = document.getElementById('modal-letras');
        overlay.addEventListener('click', (e) => { if (e.target === overlay) InterfaceModal.fechar(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('visivel')) InterfaceModal.fechar(); });
    }

    function inicializarAplicacao() {
        try {
            ConstrutorInterface.renderizarAlfabeto();
            ConstrutorInterface.renderizarVogaisConsoantes();
            ConstrutorInterface.renderizarFamilias();
            ConstrutorInterface.renderizarSilabas();
            ConstrutorInterface.renderizarCores();
            ConstrutorInterface.renderizarVidaPratica();
            ConstrutorInterface.renderizarAnimais();
            ConstrutorInterface.renderizarNumeros();
            ConstrutorInterface.configurarNavegacaoAbas();

            InteracaoApp.carregarInicial();
            InteracaoApp.carregarPalavra();
            InteracaoApp.carregarNomeSalvo();

            QuadroInterativo = new CanvasCaligrafia('canvas-caligrafia', 'container-canvas', 'guia-fundo');
            ConstrutorInterface.renderizarBotoesDesenho();
            QuadroInterativo.redimensionar();

            configurarFechamentoModal();

            window.addEventListener('resize', () => {
                if (document.getElementById('aba-escrever').classList.contains('active') && QuadroInterativo) { 
                    QuadroInterativo.redimensionar(); 
                }
            });
        } catch (erro) {
            console.error('Falha ao inicializar:', erro);
        }
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', inicializarAplicacao); } 
    else { inicializarAplicacao(); }

    window.toggleMenuMobile = toggleMenuMobile;
    window.Voz = Voz;
    window.AppConfig = AppConfig;
    window.InterfaceModal = InterfaceModal;
    window.InteracaoApp = InteracaoApp;
    window.GerenciadorPerfil = GerenciadorPerfil;
})();
