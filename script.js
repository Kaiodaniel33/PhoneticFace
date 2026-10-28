// BLOCO DE SEGURANÇA: REMOVE SERVICE WORKERS ANTIGOS QUE CAUSAM BUGS
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log("Cache antigo removido com sucesso.");
        }
    });
}

(function () {
    'use strict';

    function toggleMenuMobile() {
        const menu = document.getElementById('menu-principal');
        menu.classList.toggle('aberto');
    }

    // BANCO DE DADOS ALUNO E PROFESSOR
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
        iniciais: [
            { img: '✈️', nome: 'AVIÃO', certa: 'A', ops: ['A','E','O'] }, { img: '🐘', nome: 'ELEFANTE', certa: 'E', ops: ['I','E','U'] },
            { img: '⛪', nome: 'IGREJA', certa: 'I', ops: ['A','I','O'] }, { img: '👁️', nome: 'OLHO', certa: 'O', ops: ['U','A','O'] },
            { img: '🍇', nome: 'UVA', certa: 'U', ops: ['E','U','I'] }, { img: '🐎', nome: 'CAVALO', certa: 'C', ops: ['B','C','D'] }
        ],
        silabas: [
            { consoante: 'B', vogal: 'A', palavra: 'BANANA', icone: '🍌' }, { consoante: 'M', vogal: 'A', palavra: 'MALA', icone: '🧳' },
            { consoante: 'C', vogal: 'O', palavra: 'COPO', icone: '🥛' }, { consoante: 'D', vogal: 'I', palavra: 'DINHEIRO', icone: '💵' }
        ],
        palavrasJogo: [
            { p: 'BONECA', s: ['BO','NE','CA'] }, { p: 'ESCOLA', s: ['ES','CO','LA'] }, { p: 'BRASIL', s: ['BRA','SIL'] }
        ],
        cores: [
            { n: 'AZUL', c: '#2196F3', txt: '#FFF' }, { n: 'VERMELHO', c: '#FF3B30', txt: '#FFF' },
            { n: 'AMARELO', c: '#FFCC00', txt: '#000' }, { n: 'VERDE', c: '#34C759', txt: '#FFF' }
        ],
        vidaPratica: [
            { titulo: 'RECEITA MÉDICA', icone: '💊', textoFala: 'ATENÇÃO: TOMAR UM COMPRIMIDO DE DIPIRONA A CADA 8 HORAS.' },
            { titulo: 'LETREIRO DE ÔNIBUS', icone: '🚌', textoFala: 'EXPRESSO' },
            { titulo: 'LISTA DO MERCADO', icone: '🛒', textoFala: 'LISTA DE COMPRAS: 5 QUILOS DE ARROZ, FEIJÃO E MACARRÃO.' }
        ],
        animais: [
            { nome: 'CACHORRO', icone: '🐕' }, { nome: 'GATO', icone: '🐈' }, { nome: 'VACA', icone: '🐄' }, { nome: 'CAVALO', icone: '🐎' }
        ],
        // DADOS PARA A TABELA DO PROFESSOR (COM PROGRESSO)
        alunosProfessor: [
            { nome: 'Seu João da Silva', pct: 90, barra: 'barra-verde', modulo: '10. Leitura Prática', diag: 'Lê receitas e letreiros com facilidade.', acao: 'Apto para o próximo nível', tag: 'tag-verde' },
            { nome: 'Dona Maria Oliveira', pct: 45, barra: 'barra-amarela', modulo: '4. Unindo Sons', diag: 'Confunde o som do P com o B.', acao: 'Reforço de Consoantes', tag: 'tag-amarelo' },
            { nome: 'Carlos Eduardo', pct: 98, barra: 'barra-verde', modulo: '12. Números', diag: 'Excelente coordenação motora no traçado.', acao: 'Apto para formatura', tag: 'tag-verde' },
            { nome: 'Ana Paula Souza', pct: 20, barra: 'barra-vermelha', modulo: '1. Sons das Letras', diag: 'Dificuldade visual. Precisa de Alto Contraste.', acao: 'Acompanhamento lado a lado', tag: 'tag-vermelho' },
            { nome: 'Marcos Roberto', pct: 70, barra: 'barra-verde', modulo: '6. Formar Palavras', diag: 'Bom desenvolvimento na formação de sílabas.', acao: 'Continuar no módulo atual', tag: 'tag-verde' }
        ]
    };

    const Voz = {
        falar: function(texto) {
            if (!window.speechSynthesis) return;
            window.speechSynthesis.cancel();
            const fala = new SpeechSynthesisUtterance(texto);
            fala.lang = 'pt-BR';
            window.speechSynthesis.speak(fala);
        },
        parar: function() {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        }
    };

    // CONTROLE DE PERFIL EXTREMAMENTE ROBUSTO (SEM BUGS DE CLIQUE)
    const GerenciadorPerfil = {
        abrirModalSelecao: function() {
            const modal = document.getElementById('modal-selecao-perfil');
            modal.style.display = 'flex';
        },
        selecionarPerfil: function(perfil) {
            try {
                // 1. Esconde o modal na marra
                const modal = document.getElementById('modal-selecao-perfil');
                modal.style.display = 'none';
                
                // 2. Controla qual View aparece
                const viewAluno = document.getElementById('view-aluno');
                const viewProfessor = document.getElementById('view-professor');
                const label = document.getElementById('label-perfil-atual');

                if (perfil === 'professor') {
                    viewAluno.style.display = 'none';
                    viewProfessor.style.display = 'block';
                    label.innerText = '👨‍🏫 PERFIL: PROFESSOR';
                    this.renderizarTabelaProfessor();
                    Voz.falar('Painel do professor aberto com sucesso.');
                } else {
                    viewProfessor.style.display = 'none';
                    viewAluno.style.display = 'block';
                    label.innerText = '🎓 PERFIL: ALUNO';
                    // Força a aba alfabeto a ficar ativa no aluno
                    document.querySelectorAll('.aba-conteudo').forEach(el => el.classList.remove('active'));
                    document.querySelectorAll('.btn-tab').forEach(el => el.classList.remove('active'));
                    document.getElementById('aba-alfabeto').classList.add('active');
                    document.querySelector('.btn-tab[data-target="aba-alfabeto"]').classList.add('active');
                    Voz.falar('Painel do aluno aberto. Escolha uma lição.');
                }
            } catch (erro) {
                console.error("Erro no clique do perfil: ", erro);
            }
        },
        renderizarTabelaProfessor: function() {
            const tbody = document.getElementById('lista-alunos-professor');
            tbody.innerHTML = '';
            BancoDados.alunosProfessor.forEach(aluno => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${aluno.nome}</td>
                    <td>
                        <div class="barra-fundo">
                            <div class="barra-preenchimento ${aluno.barra}" style="width: ${aluno.pct}%;">${aluno.pct}%</div>
                        </div>
                    </td>
                    <td>${aluno.modulo}</td>
                    <td><i style="color: #666;">"${aluno.diag}"</i></td>
                    <td><span class="tag-status ${aluno.tag}">${aluno.acao}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
    };

    const InterfaceModal = {
        mostrarVideo: function(item) {
            document.getElementById('letra-display').innerText = item.letra;
            document.getElementById('modal-icone-palavra').innerText = item.icone;
            document.getElementById('modal-texto-palavra').innerText = item.palavra;
            document.getElementById('player-youtube').src = "https://www.youtube.com/embed/" + item.youtubeId + "?autoplay=1";
            document.getElementById('modal-letras').style.display = 'flex';
            Voz.falar(`A letra ${item.letra} forma a palavra ${item.palavra}.`);
        },
        fechar: function() {
            document.getElementById('modal-letras').style.display = 'none';
            document.getElementById('player-youtube').src = "";
            Voz.parar();
        }
    };

    class CanvasCaligrafia {
        constructor() {
            this.canvas = document.getElementById('canvas-caligrafia');
            this.ctx = this.canvas.getContext('2d');
            this.container = document.getElementById('container-canvas');
            this.desenhando = false;
            this.canvas.addEventListener('mousedown', (e) => this.iniciar(e));
            this.canvas.addEventListener('mousemove', (e) => this.desenhar(e));
            this.canvas.addEventListener('mouseup', () => this.parar());
            this.canvas.addEventListener('touchstart', (e) => this.iniciar(e), {passive:false});
            this.canvas.addEventListener('touchmove', (e) => this.desenhar(e), {passive:false});
            this.canvas.addEventListener('touchend', () => this.parar());
        }
        redimensionar() {
            if(!this.container || !this.canvas) return;
            this.canvas.width = this.container.clientWidth;
            this.canvas.height = this.container.clientHeight;
            this.ctx.lineWidth = 25; 
            this.ctx.lineCap = 'round';
            this.ctx.strokeStyle = '#007AFF';
        }
        obterPos(e) {
            const rect = this.canvas.getBoundingClientRect();
            if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }
        iniciar(e) { e.preventDefault(); this.desenhando = true; const p = this.obterPos(e); this.ctx.beginPath(); this.ctx.moveTo(p.x, p.y); }
        desenhar(e) { if(!this.desenhando) return; e.preventDefault(); const p = this.obterPos(e); this.ctx.lineTo(p.x, p.y); this.ctx.stroke(); this.ctx.beginPath(); this.ctx.moveTo(p.x, p.y); }
        parar() { this.desenhando = false; this.ctx.beginPath(); setTimeout(() => this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height), 2500); }
        limpar() { this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height); }
    }
    let QuadroInterativo;

    const InteracaoApp = {
        idInicial: 0, idPalavra: 0, silabasOk: 0,
        verificarNome: function() {
            const nome = document.getElementById('input-nome').value.trim();
            if(nome) {
                document.getElementById('mensagem-boas-vindas').innerText = `OLÁ, ${nome}!`;
                Voz.falar(`Parabéns, ${nome}! Nome salvo.`);
            }
        },
        carregarInicial: function() {
            const ct = document.getElementById('opcoes-iniciais'); ct.innerHTML = '';
            const item = BancoDados.iniciais[this.idInicial];
            document.getElementById('imagem-inicial').innerText = item.img;
            document.getElementById('nome-inicial-dica').innerText = "_ " + item.nome.substring(1).split('').join(' ');
            item.ops.forEach(op => {
                let btn = document.createElement('button'); btn.className='btn-grande'; btn.style.background='var(--cor-secundaria)'; btn.innerText=op;
                btn.onclick = () => {
                    if(op === item.certa) {
                        document.getElementById('nome-inicial-dica').innerText = item.nome.split('').join(' ');
                        Voz.falar('Certo!');
                        this.idInicial = (this.idInicial + 1) % BancoDados.iniciais.length;
                        setTimeout(() => this.carregarInicial(), 2000);
                    } else Voz.falar('Tente outra vez.');
                };
                ct.appendChild(btn);
            });
        },
        carregarPalavra: function() {
            const item = BancoDados.palavrasJogo[this.idPalavra]; this.silabasOk = 0;
            document.getElementById('dica-palavra').innerText = item.p;
            const slots = document.getElementById('slots-palavra'); slots.innerHTML = '';
            item.s.forEach((sil, i) => { slots.innerHTML += `<div class="btn-grande" style="background:#eee; color:#333;" id="slot-${i}">_</div>`; });
            
            const soltas = document.getElementById('silabas-soltas'); soltas.innerHTML = '';
            let misturadas = [...item.s].sort(() => Math.random() - 0.5);
            misturadas.forEach(sil => {
                let btn = document.createElement('button'); btn.className='btn-grande'; btn.style.background='var(--cor-secundaria)'; btn.innerText=sil;
                btn.onclick = (e) => {
                    if(sil === item.s[this.silabasOk]) {
                        document.getElementById(`slot-${this.silabasOk}`).innerText = sil;
                        document.getElementById(`slot-${this.silabasOk}`).style.background = 'var(--cor-sucesso)';
                        document.getElementById(`slot-${this.silabasOk}`).style.color = 'white';
                        e.target.style.display = 'none';
                        this.silabasOk++;
                        if(this.silabasOk === item.s.length) Voz.falar(`Você formou ${item.p}`);
                    } else Voz.falar('Sílaba errada.');
                };
                soltas.appendChild(btn);
            });
        },
        proximaPalavra: function() { this.idPalavra = (this.idPalavra + 1) % BancoDados.palavrasJogo.length; this.carregarPalavra(); }
    };

    const AppConfig = {
        tam: 100,
        alterarTamanhoFonte: function(inc) {
            this.tam += inc; if(this.tam>=80 && this.tam<=150) document.documentElement.style.fontSize = this.tam + '%';
        },
        alternarAltoContraste: function() { document.body.classList.toggle('alto-contraste'); }
    };

    function renderizarTudo() {
        // Alfabeto
        const ca = document.getElementById('container-grid-alfabeto');
        BancoDados.alfabeto.forEach(i => { let b=document.createElement('button'); b.className='btn-letra'; b.innerText=i.letra; b.onclick=()=>InterfaceModal.mostrarVideo(i); ca.appendChild(b); });
        
        // Vogais e Cons
        const v = document.getElementById('box-vogais'); const c = document.getElementById('box-consoantes');
        BancoDados.vogais.forEach(l => { let b=document.createElement('button'); b.className='btn-grande'; b.style.background='var(--cor-destaque)'; b.innerText=l; b.onclick=()=>Voz.falar(l); v.appendChild(b); });
        BancoDados.consoantes.forEach(l => { let b=document.createElement('button'); b.className='btn-letra'; b.style.width='80px'; b.innerText=l; b.onclick=()=>Voz.falar(l); c.appendChild(b); });
        
        // Familias
        const bf = document.getElementById('botoes-familias');
        BancoDados.consoantes.forEach(l => {
            let b=document.createElement('button'); b.className='btn-letra'; b.style.width='60px'; b.innerText=l;
            b.onclick = () => {
                document.getElementById('resultado-familia').innerHTML = '';
                BancoDados.vogais.forEach(vg => {
                    let r=document.createElement('button'); r.className='btn-grande'; r.style.background='var(--cor-sucesso)'; r.innerText=l+vg;
                    r.onclick=()=>Voz.falar(l+vg); document.getElementById('resultado-familia').appendChild(r);
                });
            };
            bf.appendChild(b);
        });

        // Abas Navegação
        document.querySelectorAll('.btn-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-tab').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.aba-conteudo').forEach(c => c.classList.remove('active'));
                e.currentTarget.classList.add('active');
                document.getElementById(e.currentTarget.getAttribute('data-target')).classList.add('active');
                if(e.currentTarget.getAttribute('data-target') === 'aba-escrever' && QuadroInterativo) QuadroInterativo.redimensionar();
                document.getElementById('menu-principal').classList.remove('aberto');
            });
        });

        // Cores, Numeros, Dia-a-dia etc...
        BancoDados.cores.forEach(cor => { let b=document.createElement('button'); b.className='btn-letra'; b.innerText=cor.n; b.style.background=cor.c; b.style.color=cor.txt; b.style.fontSize='1.5rem'; b.onclick=()=>Voz.falar(cor.n); document.getElementById('container-cores').appendChild(b); });
        for(let i=1; i<=100; i++){ let b=document.createElement('button'); b.className='btn-letra'; b.style.height='80px'; b.style.fontSize='2.5rem'; b.innerText=i; b.onclick=()=>Voz.falar(i.toString()); document.getElementById('container-numeros').appendChild(b); }
        
        BancoDados.vidaPratica.forEach(i => {
            let d = document.createElement('div'); d.className='cartao centralizado'; d.style.cursor='pointer'; d.innerHTML=`<div style="font-size:5rem;">${i.icone}</div><h2>${i.titulo}</h2>`;
            d.onclick=()=>Voz.falar(i.textoFala); document.getElementById('container-dia-a-dia').appendChild(d);
        });
        
        BancoDados.animais.forEach(i => {
            let d = document.createElement('div'); d.className='cartao centralizado'; d.style.cursor='pointer'; d.innerHTML=`<div style="font-size:5rem;">${i.icone}</div><h2>${i.nome}</h2>`;
            d.onclick=()=>Voz.falar(i.nome); document.getElementById('container-animais').appendChild(d);
        });

        // Botoes Desenho
        let cd = document.getElementById('botoes-desenho');
        ['A','B','C','D','E','F','?','~'].forEach(s => { let b=document.createElement('button'); b.className='btn-ferramenta'; b.innerText=s; b.onclick=()=>{document.getElementById('guia-fundo').innerText=s; QuadroInterativo.limpar();}; cd.appendChild(b); });
        
        InteracaoApp.carregarInicial();
        InteracaoApp.carregarPalavra();
        QuadroInterativo = new CanvasCaligrafia();
    }

    // Inicialização da Página
    document.addEventListener('DOMContentLoaded', () => {
        renderizarTudo();
        GerenciadorPerfil.abrirModalSelecao(); // Garante que o modal abre na largada
    });

    // Torna as funções globais para o HTML acessá-las sem problemas
    window.toggleMenuMobile = toggleMenuMobile;
    window.GerenciadorPerfil = GerenciadorPerfil;
    window.AppConfig = AppConfig;
    window.Voz = Voz;
    window.InterfaceModal = InterfaceModal;
    window.InteracaoApp = InteracaoApp;
})();
