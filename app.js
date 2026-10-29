(function () {
    'use strict';

    if (window.__PHONETICFACE_READY__) return;
    window.__PHONETICFACE_READY__ = true;

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (regs) {
            for (var i = 0; i < regs.length; i++) regs[i].unregister();
        }).catch(function () {});
    }

    function lerStorage(chave, padrao) {
        try {
            var v = localStorage.getItem(chave);
            return v !== null ? v : padrao;
        } catch (e) { return padrao; }
    }

    function salvarStorage(chave, valor) {
        try { localStorage.setItem(chave, String(valor)); } catch (e) {}
    }

    function embaralharArray(arr) {
        var copia = arr.slice();
        for (var i = copia.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = copia[i];
            copia[i] = copia[j];
            copia[j] = temp;
        }
        return copia;
    }

    function toggleMenuMobile() {
        var menu = document.getElementById('menu-principal');
        var btn = document.querySelector('.menu-toggle');
        if (menu) {
            var aberto = menu.classList.toggle('aberto');
            if (btn) btn.setAttribute('aria-expanded', String(aberto));
        }
    }

    /* ==========================================================================
       1. DICIONÁRIO FONÉTICO PARA PRONÚNCIA EXATA DE VOGAIS, CONSOANTES E SÍLABAS
       ========================================================================== */
    var MapaFoneticoVogais = {
        'A': 'á',
        'E': 'é',
        'I': 'í',
        'O': 'ó',
        'U': 'ú'
    };

    var MapaFoneticoConsoantes = {
        'B': 'bê', 'C': 'cê', 'D': 'dê', 'F': 'éfe', 'G': 'gê', 'H': 'agá',
        'J': 'jóta', 'K': 'cá', 'L': 'éle', 'M': 'ême', 'N': 'êne', 'P': 'pê',
        'Q': 'quê', 'R': 'érre', 'S': 'ésse', 'T': 'tê', 'V': 'vê', 'W': 'dáblio',
        'X': 'xís', 'Y': 'ípsilon', 'Z': 'zê'
    };

    /* Evita que o navegador soletre "B-A" como sigla e força o som "bá, bê, bí, bó, bú" */
    var MapaFoneticoSilabas = {
        'BA': 'bá', 'BE': 'bê', 'BI': 'bí', 'BO': 'bó', 'BU': 'bú',
        'CA': 'cá', 'CE': 'cê', 'CI': 'cí', 'CO': 'có', 'CU': 'cú',
        'DA': 'dá', 'DE': 'dê', 'DI': 'dí', 'DO': 'dó', 'DU': 'dú',
        'FA': 'fá', 'FE': 'fê', 'FI': 'fí', 'FO': 'fó', 'FU': 'fú',
        'GA': 'gá', 'GE': 'gê', 'GI': 'gí', 'GO': 'gó', 'GU': 'gú',
        'HA': 'á',  'HE': 'ê',  'HI': 'í',  'HO': 'ó',  'HU': 'ú',
        'JA': 'já', 'JE': 'jê', 'JI': 'jí', 'JO': 'jó', 'JU': 'jú',
        'KA': 'cá', 'KE': 'quê','KI': 'quí','KO': 'có', 'KU': 'cú',
        'LA': 'lá', 'LE': 'lê', 'LI': 'lí', 'LO': 'ló', 'LU': 'lú',
        'MA': 'má', 'ME': 'mê', 'MI': 'mí', 'MO': 'mó', 'MU': 'mú',
        'NA': 'ná', 'NE': 'nê', 'NI': 'ní', 'NO': 'nó', 'NU': 'nú',
        'PA': 'pá', 'PE': 'pê', 'PI': 'pí', 'PO': 'pó', 'PU': 'pú',
        'QA': 'quá','QE': 'quê','QI': 'quí','QO': 'quó','QU': 'qú',
        'RA': 'rrá','RE': 'rrê','RI': 'rrí','RO': 'rró','RU': 'rrú',
        'SA': 'sá', 'SE': 'sê', 'SI': 'sí', 'SO': 'só', 'SU': 'sú',
        'TA': 'tá', 'TE': 'tê', 'TI': 'tí', 'TO': 'tó', 'TU': 'tú',
        'VA': 'vá', 'VE': 'vê', 'VI': 'ví', 'VO': 'vó', 'VU': 'vú',
        'WA': 'uá', 'WE': 'uê', 'WI': 'uí', 'WO': 'uó', 'WU': 'uú',
        'XA': 'xá', 'XE': 'xê', 'XI': 'xí', 'XO': 'xó', 'XU': 'xú',
        'YA': 'iá', 'YE': 'iê', 'YI': 'ií', 'YO': 'ió', 'YU': 'iú',
        'ZA': 'zá', 'ZE': 'zê', 'ZI': 'zí', 'ZO': 'zó', 'ZU': 'zú'
    };

    var ExemplosSilabas = {
        'BA': 'BANANA', 'BE': 'BEBÊ', 'BI': 'BICO', 'BO': 'BOLA', 'BU': 'BULE',
        'CA': 'CASA', 'CE': 'CEBOLA', 'CI': 'CIDADE', 'CO': 'COPO', 'CU': 'CUBO',
        'DA': 'DADO', 'DE': 'DEDO', 'DI': 'DINHEIRO', 'DO': 'DOCE', 'DU': 'DUELO',
        'FA': 'FACA', 'FE': 'FEIJÃO', 'FI': 'FITA', 'FO': 'FOGO', 'FU': 'FUBÁ',
        'GA': 'GATO', 'GE': 'GELO', 'GI': 'GIRAFA', 'GO': 'GOLA', 'GU': 'GUGA',
        'HA': 'HARPA', 'HE': 'HÉLICE', 'HI': 'HINO', 'HO': 'HORA', 'HU': 'HUMANO',
        'JA': 'JANELA', 'JE': 'JEGUE', 'JI': 'JIPE', 'JO': 'JOGO', 'JU': 'CAJU',
        'KA': 'KARATÊ', 'KE': 'KETCHUP', 'KI': 'KIWI', 'KO': 'KOMBI', 'KU': 'KUNG FU',
        'LA': 'LATA', 'LE': 'LEITE', 'LI': 'LIVRO', 'LO': 'LOBO', 'LU': 'LUA',
        'MA': 'MALA', 'ME': 'MESA', 'MI': 'MILHO', 'MO': 'MOTO', 'MU': 'MURO',
        'NA': 'NAVIO', 'NE': 'NEVE', 'NI': 'NINHO', 'NO': 'NOITE', 'NU': 'NUVEM',
        'PA': 'PATO', 'PE': 'PEIXE', 'PI': 'PIPOCA', 'PO': 'PORTA', 'PU': 'PUDIM',
        'QA': 'QUADRO', 'QE': 'QUEIJO', 'QI': 'QUIABO', 'QO': 'QUOCIENTE', 'QU': 'QUILO',
        'RA': 'RATO', 'RE': 'REDE', 'RI': 'RIO', 'RO': 'RODA', 'RU': 'RUA',
        'SA': 'SAPO', 'SE': 'SELO', 'SI': 'SINO', 'SO': 'SOPA', 'SU': 'SUCO',
        'TA': 'TATU', 'TE': 'TELA', 'TI': 'TIJOLO', 'TO': 'TOMATE', 'TU': 'TUBARÃO',
        'VA': 'VACA', 'VE': 'VELA', 'VI': 'VIOLÃO', 'VO': 'VOVÓ', 'VU': 'VULCÃO',
        'WA': 'WAFFLE', 'WE': 'WEB', 'WI': 'WIFI', 'WO': 'WOK', 'WU': 'WUSHU',
        'XA': 'XALE', 'XE': 'XERIFE', 'XI': 'XÍCARA', 'XO': 'XODÓ', 'XU': 'XUXA',
        'YA': 'YAKISSOBA', 'YE': 'YEN', 'YI': 'YIN', 'YO': 'YOGA', 'YU': 'YURI',
        'ZA': 'ZABUMBA', 'ZE': 'ZEBRA', 'ZI': 'ZÍPER', 'ZO': 'ZOOLÓGICO', 'ZU': 'ZUMBIDO'
    };

    /* ==========================================================================
       2. BANCO DE DADOS COMPLETO
       ========================================================================== */
    var BancoDados = {
        alfabeto: [
            { letra: 'A', palavra: 'ABELHA', youtubeId: 'XBCDUG-yEaw' },
            { letra: 'B', palavra: 'BOLA', youtubeId: 'j6ROsDM87UU' },
            { letra: 'C', palavra: 'CASA', youtubeId: 'hWZA7DElS_I' },
            { letra: 'D', palavra: 'DADO', youtubeId: 'mAIWY3S12s4' },
            { letra: 'E', palavra: 'ELEFANTE', youtubeId: '8s43APNFMtM' },
            { letra: 'F', palavra: 'FACA', youtubeId: 'nuX0O_hqoFM' },
            { letra: 'G', palavra: 'GATO', youtubeId: '4SjEf5gYXio' },
            { letra: 'H', palavra: 'HORA', youtubeId: 'NhZ6eVHmVDA' },
            { letra: 'I', palavra: 'IGREJA', youtubeId: 'ILhan-Htj0g' },
            { letra: 'J', palavra: 'JACARÉ', youtubeId: 'Z9lBor1lnI8' },
            { letra: 'K', palavra: 'KIWI', youtubeId: 'eGrZ1WM_oaE' },
            { letra: 'L', palavra: 'LÁPIS', youtubeId: 'tC3yWQPeNpE' },
            { letra: 'M', palavra: 'MALA', youtubeId: 'mH3byoH67O4' },
            { letra: 'N', palavra: 'NAVIO', youtubeId: 'AGPxKWabjSc' },
            { letra: 'O', palavra: 'ÓCULOS', youtubeId: '-8RtEgO3Y5s' },
            { letra: 'P', palavra: 'PATO', youtubeId: 'bmQ_2UA7sWw' },
            { letra: 'Q', palavra: 'QUEIJO', youtubeId: '-qZ5fNtr-8g' },
            { letra: 'R', palavra: 'RATO', youtubeId: '7fKcMXcBNOA' },
            { letra: 'S', palavra: 'SAPO', youtubeId: 's6XAkz5lGxA' },
            { letra: 'T', palavra: 'TATU', youtubeId: '-FyHvZ9Hz0Y' },
            { letra: 'U', palavra: 'UVA', youtubeId: 'beFXQ-w5CKs' },
            { letra: 'V', palavra: 'VACA', youtubeId: 'cGJ2MXDMsgE' },
            { letra: 'W', palavra: 'WEB', youtubeId: 'An41gHwcEEw' },
            { letra: 'X', palavra: 'XÍCARA', youtubeId: 'zqrqp-RHFHs' },
            { letra: 'Y', palavra: 'YOUTUBE', youtubeId: 'NJLEAbML25A' },
            { letra: 'Z', palavra: 'ZEBRA', youtubeId: '-QBkzFZDWNU' }
        ],
        vogais: ['A', 'E', 'I', 'O', 'U'],
        consoantes: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'],
        sinaisDesenho: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        iniciais: [
            { nome: 'AVIÃO', certa: 'A', cat: 'TRANSPORTE' },
            { nome: 'ABACAXI', certa: 'A', cat: 'ALIMENTO' },
            { nome: 'ANEL', certa: 'A', cat: 'OBJETO' },
            { nome: 'ABELHA', certa: 'A', cat: 'NATUREZA' },
            { nome: 'BANANA', certa: 'B', cat: 'ALIMENTO' },
            { nome: 'BOLA', certa: 'B', cat: 'ESPORTE' },
            { nome: 'BICICLETA', certa: 'B', cat: 'TRANSPORTE' },
            { nome: 'BRASIL', certa: 'B', cat: 'PAÍS' },
            { nome: 'CASA', certa: 'C', cat: 'MORADIA' },
            { nome: 'CARRO', certa: 'C', cat: 'TRANSPORTE' },
            { nome: 'CAVALO', certa: 'C', cat: 'ANIMAL' },
            { nome: 'COMPUTADOR', certa: 'C', cat: 'TECNOLOGIA' },
            { nome: 'CADERNO', certa: 'C', cat: 'ESCOLA' },
            { nome: 'DADO', certa: 'D', cat: 'OBJETO' },
            { nome: 'DINHEIRO', certa: 'D', cat: 'CIDADANIA' },
            { nome: 'DENTE', certa: 'D', cat: 'SAÚDE' },
            { nome: 'ELEFANTE', certa: 'E', cat: 'ANIMAL' },
            { nome: 'ESCOLA', certa: 'E', cat: 'EDUCAÇÃO' },
            { nome: 'ESCADA', certa: 'E', cat: 'OBJETO' },
            { nome: 'ESTRELA', certa: 'E', cat: 'NATUREZA' },
            { nome: 'FACA', certa: 'F', cat: 'COZINHA' },
            { nome: 'FEIJÃO', certa: 'F', cat: 'ALIMENTO' },
            { nome: 'FAMÍLIA', certa: 'F', cat: 'SOCIEDADE' },
            { nome: 'GATO', certa: 'G', cat: 'ANIMAL' },
            { nome: 'GALINHA', certa: 'G', cat: 'ANIMAL' },
            { nome: 'GARFO', certa: 'G', cat: 'COZINHA' },
            { nome: 'IGREJA', certa: 'I', cat: 'COMUNIDADE' },
            { nome: 'ILHA', certa: 'I', cat: 'GEOGRAFIA' },
            { nome: 'JACARÉ', certa: 'J', cat: 'ANIMAL' },
            { nome: 'JANELA', certa: 'J', cat: 'MORADIA' },
            { nome: 'LÁPIS', certa: 'L', cat: 'ESCOLA' },
            { nome: 'LEÃO', certa: 'L', cat: 'ANIMAL' },
            { nome: 'LARANJA', certa: 'L', cat: 'ALIMENTO' },
            { nome: 'LIVRO', certa: 'L', cat: 'EDUCAÇÃO' },
            { nome: 'MALA', certa: 'M', cat: 'OBJETO' },
            { nome: 'MAÇÃ', certa: 'M', cat: 'ALIMENTO' },
            { nome: 'MACACO', certa: 'M', cat: 'ANIMAL' },
            { nome: 'MESA', certa: 'M', cat: 'MÓVEL' },
            { nome: 'NAVIO', certa: 'N', cat: 'TRANSPORTE' },
            { nome: 'NUVEM', certa: 'N', cat: 'NATUREZA' },
            { nome: 'OLHO', certa: 'O', cat: 'CORPO HUMANO' },
            { nome: 'ÓCULOS', certa: 'O', cat: 'OBJETO' },
            { nome: 'OVO', certa: 'O', cat: 'ALIMENTO' },
            { nome: 'PANELA', certa: 'P', cat: 'COZINHA' },
            { nome: 'PATO', certa: 'P', cat: 'ANIMAL' },
            { nome: 'PORTA', certa: 'P', cat: 'MORADIA' },
            { nome: 'QUEIJO', certa: 'Q', cat: 'ALIMENTO' },
            { nome: 'RATO', certa: 'R', cat: 'ANIMAL' },
            { nome: 'RELÓGIO', certa: 'R', cat: 'OBJETO' },
            { nome: 'SAPO', certa: 'S', cat: 'ANIMAL' },
            { nome: 'SAPATO', certa: 'S', cat: 'VESTUÁRIO' },
            { nome: 'SOL', certa: 'S', cat: 'NATUREZA' },
            { nome: 'TOMATE', certa: 'T', cat: 'ALIMENTO' },
            { nome: 'TELEFONE', certa: 'T', cat: 'COMUNICAÇÃO' },
            { nome: 'TRABALHO', certa: 'T', cat: 'CIDADANIA' },
            { nome: 'UVA', certa: 'U', cat: 'ALIMENTO' },
            { nome: 'URSO', certa: 'U', cat: 'ANIMAL' },
            { nome: 'VACA', certa: 'V', cat: 'ANIMAL' },
            { nome: 'VIOLÃO', certa: 'V', cat: 'MÚSICA' },
            { nome: 'XÍCARA', certa: 'X', cat: 'COZINHA' },
            { nome: 'ZEBRA', certa: 'Z', cat: 'ANIMAL' }
        ],
        silabas: [
            { consoante: 'B', vogal: 'A', palavra: 'BANANA' },
            { consoante: 'M', vogal: 'A', palavra: 'MALA' },
            { consoante: 'C', vogal: 'A', palavra: 'CASA' },
            { consoante: 'P', vogal: 'A', palavra: 'PATO' },
            { consoante: 'F', vogal: 'A', palavra: 'FACA' },
            { consoante: 'V', vogal: 'A', palavra: 'VACA' },
            { consoante: 'L', vogal: 'A', palavra: 'LATA' },
            { consoante: 'S', vogal: 'A', palavra: 'SAPO' }
        ],
        palavrasJogo: [
            { p: 'CARTAGO', s: ['CAR', 'TA', 'GO'] }, { p: 'BRASIL', s: ['BRA', 'SIL'] }, { p: 'ESCOLA', s: ['ES', 'CO', 'LA'] },
            { p: 'BONECA', s: ['BO', 'NE', 'CA'] }, { p: 'BULE', s: ['BU', 'LE'] }, { p: 'CASA', s: ['CA', 'SA'] },
            { p: 'BOLA', s: ['BO', 'LA'] }, { p: 'MACACO', s: ['MA', 'CA', 'CO'] }, { p: 'PANELA', s: ['PA', 'NE', 'LA'] },
            { p: 'TOMATE', s: ['TO', 'MA', 'TE'] }, { p: 'CAVALO', s: ['CA', 'VA', 'LO'] }, { p: 'ABACATE', s: ['A', 'BA', 'CA', 'TE'] },
            { p: 'BANANA', s: ['BA', 'NA', 'NA'] }, { p: 'GATO', s: ['GA', 'TO'] }, { p: 'PATO', s: ['PA', 'TO'] },
            { p: 'COMPUTADOR', s: ['COM', 'PU', 'TA', 'DOR'] }, { p: 'TELEFONE', s: ['TE', 'LE', 'FO', 'NE'] },
            { p: 'SAPO', s: ['SA', 'PO'] }, { p: 'RATO', s: ['RA', 'TO'] }, { p: 'MATO', s: ['MA', 'TO'] },
            { p: 'LATA', s: ['LA', 'TA'] }, { p: 'FADA', s: ['FA', 'DA'] }, { p: 'MALA', s: ['MA', 'LA'] },
            { p: 'BOCA', s: ['BO', 'CA'] }, { p: 'DADO', s: ['DA', 'DO'] }, { p: 'FOCA', s: ['FO', 'CA'] },
            { p: 'CADERNO', s: ['CA', 'DER', 'NO'] }, { p: 'TRABALHO', s: ['TRA', 'BA', 'LHO'] }, { p: 'CIDADE', s: ['CI', 'DA', 'DE'] },
            { p: 'PEIXE', s: ['PEI', 'XE'] }, { p: 'LIXO', s: ['LI', 'XO'] }, { p: 'RODA', s: ['RO', 'DA'] },
            { p: 'FOTO', s: ['FO', 'TO'] }, { p: 'LOBO', s: ['LO', 'BO'] }, { p: 'BOLO', s: ['BO', 'LO'] },
            { p: 'SELO', s: ['SE', 'LO'] }, { p: 'GELO', s: ['GE', 'LO'] }, { p: 'MESA', s: ['ME', 'SA'] },
            { p: 'PESO', s: ['PE', 'SO'] }, { p: 'VASO', s: ['VA', 'SO'] }, { p: 'SOPA', s: ['SO', 'PA'] },
            { p: 'MAPA', s: ['MA', 'PA'] }, { p: 'CAPA', s: ['CA', 'PA'] }, { p: 'LUVA', s: ['LU', 'VA'] },
            { p: 'UVA', s: ['U', 'VA'] }, { p: 'OVO', s: ['O', 'VO'] }, { p: 'NAVE', s: ['NA', 'VE'] },
            { p: 'VACA', s: ['VA', 'CA'] }, { p: 'FACA', s: ['FA', 'CA'] }, { p: 'VELA', s: ['VE', 'LA'] },
            { p: 'BARCO', s: ['BAR', 'CO'] }, { p: 'PORCO', s: ['POR', 'CO'] }, { p: 'JANELA', s: ['JA', 'NE', 'LA'] }
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
            { titulo: 'RECEITA MÉDICA', cat: 'SAÚDE E CUIDADO', textoFala: 'Atenção: Tomar um comprimido de dipirona a cada 8 horas.' },
            { titulo: 'LETREIRO DE ÔNIBUS', cat: 'MOBILIDADE URBANA', textoFala: 'Expresso: Linha Centro via Terminal Rodoviário.' },
            { titulo: 'LISTA DO MERCADO', cat: 'ECONOMIA DOMÉSTICA', textoFala: 'Lista de compras: 5 quilos de arroz, feijão e macarrão.' },
            { titulo: 'TREINO DA ACADEMIA', cat: 'BEM-ESTAR E SAÚDE', textoFala: 'Ficha de treino: Fazer 3 séries de 10 repetições.' },
            { titulo: 'COMPROVANTE BANCÁRIO', cat: 'EDUCAÇÃO FINANCEIRA', textoFala: 'Confira sempre o valor do pagamento e guarde o seu recibo.' },
            { titulo: 'AVISO DE TRABALHO', cat: 'AMBIENTE PROFISSIONAL', textoFala: 'Uso obrigatório de equipamento de proteção individual.' }
        ],
        animais: [
            { nome: 'CACHORRO', cat: 'ANIMAL DOMÉSTICO' }, { nome: 'GATO', cat: 'ANIMAL DOMÉSTICO' },
            { nome: 'VACA', cat: 'ANIMAL DO CAMPO' }, { nome: 'CAVALO', cat: 'ANIMAL DO CAMPO' },
            { nome: 'PORCO', cat: 'ANIMAL DO CAMPO' }, { nome: 'GALINHA', cat: 'AVE DOMÉSTICA' },
            { nome: 'PATO', cat: 'AVE AQUÁTICA' }, { nome: 'OVELHA', cat: 'ANIMAL DO CAMPO' },
            { nome: 'LEÃO', cat: 'VIDA SILVESTRE' }, { nome: 'ELEFANTE', cat: 'VIDA SILVESTRE' },
            { nome: 'MACACO', cat: 'VIDA SILVESTRE' }, { nome: 'URSO', cat: 'VIDA SILVESTRE' },
            { nome: 'SAPO', cat: 'ANFÍBIO' }, { nome: 'PEIXE', cat: 'VIDA AQUÁTICA' },
            { nome: 'PAPAGAIO', cat: 'AVE BRASILEIRA' }, { nome: 'COBRA', cat: 'RÉPTIL' },
            { nome: 'TARTARUGA', cat: 'RÉPTIL' }, { nome: 'COELHO', cat: 'MAMÍFERO' },
            { nome: 'ABELHA', cat: 'INSETO POLINIZADOR' }, { nome: 'BORBOLETA', cat: 'INSETO' }
        ],
        alunosProfessor: [
            {
                id: 101,
                nome: 'José Carlos da Silva',
                idade: 58,
                perfilEtario: 'Pessoa Adulta',
                serie: 'EJA - Fase I (2º Segmento)',
                tarefas: '14 tarefas no dia',
                pct: 92,
                corBarra: 'fill-verde',
                categoria: 'otimo',
                relatorio: 'Concluiu tarefas de Sons das Letras, Sílabas e Leitura Prática com 100% de aproveitamento.',
                orientacao: 'Avançar para leitura de frases completas',
                historico: [
                    'Realizou 14 exercícios hoje nos módulos 1, 5, 6 e 10.',
                    'Reconheceu todas as famílias silábicas trabalhadas e leu textos de saúde e transporte.',
                    'Apresenta autonomia plena no uso do dispositivo.'
                ]
            },
            {
                id: 102,
                nome: 'Maria Aparecida Oliveira',
                idade: 64,
                perfilEtario: 'Pessoa Adulta +',
                serie: 'EJA - Fase I (1º Segmento)',
                tarefas: '6 tarefas no dia',
                pct: 48,
                corBarra: 'fill-amarelo',
                categoria: 'dificuldade',
                relatorio: 'Apresentou dificuldade na tarefa de Formar Palavras (trocou sílabas das letras F e V).',
                orientacao: 'Reforçar Módulo 4 (Unindo Sons)',
                historico: [
                    'Realizou 6 tarefas hoje nos módulos 3 e 6.',
                    'Necessita de apoio na diferenciação sonora entre consoantes fricativas (F e V).',
                    'Concluiu corretamente o módulo de escrita do próprio nome.'
                ]
            },
            {
                id: 103,
                nome: 'Antônio Ferreira Santos',
                idade: 71,
                perfilEtario: 'Pessoa Adulta +',
                serie: 'EJA - Etapa Inicial (Alfabetização)',
                tarefas: '2 tarefas no dia',
                pct: 25,
                corBarra: 'fill-vermelho',
                categoria: 'plataforma',
                relatorio: 'Dificuldade de manuseio da plataforma; necessita de orientação para alternar entre os módulos.',
                orientacao: 'Orientar navegação + Alto Contraste',
                historico: [
                    'Realizou 2 tarefas no Módulo 1 (Sons das Letras).',
                    'Apresentou dificuldade no toque e rolagem da tela.',
                    'Recomendação: Habilitar o modo de Alto Contraste e fonte ampliada (A+) com acompanhamento inicial.'
                ]
            },
            {
                id: 104,
                nome: 'Sebastiana Rodrigues',
                idade: 52,
                perfilEtario: 'Pessoa Adulta',
                serie: 'EJA - Fase II (2º Segmento)',
                tarefas: '12 tarefas no dia',
                pct: 88,
                corBarra: 'fill-verde',
                categoria: 'otimo',
                relatorio: 'Excelente desempenho em Números de 1 a 100, Cores e Vocabulário.',
                orientacao: 'Estudante em ritmo avançado',
                historico: [
                    'Concluiu 12 tarefas hoje.',
                    'Realizou o traçado geométrico das letras A, B, C, D e E com alta precisão.',
                    'Ótima adaptação tanto em computador quanto em dispositivos móveis.'
                ]
            },
            {
                id: 105,
                nome: 'Lucas Gabriel Almeida',
                idade: 19,
                perfilEtario: 'Jovem',
                serie: 'EJA - Fase I (1º Segmento)',
                tarefas: '9 tarefas no dia',
                pct: 76,
                corBarra: 'fill-verde',
                categoria: 'otimo',
                relatorio: 'Domínio rápido da interface digital; bom progresso na formação de sílabas e palavras.',
                orientacao: 'Praticar caligrafia e leitura prática',
                historico: [
                    'Realizou 9 tarefas nos módulos 4, 5 e 6.',
                    'Utilizou o construtor deslizante de sílabas com agilidade.',
                    'Pronto para iniciar exercícios de interpretação de textos cotidianos.'
                ]
            },
            {
                id: 106,
                nome: 'Francisco Chagas Lima',
                idade: 67,
                perfilEtario: 'Pessoa Adulta +',
                serie: 'EJA - Etapa Inicial (Alfabetização)',
                tarefas: '5 tarefas no dia',
                pct: 42,
                corBarra: 'fill-amarelo',
                categoria: 'dificuldade',
                relatorio: 'Dificuldade na identificação de Som Inicial e no contorno completo das letras R e S.',
                orientacao: 'Reforçar Módulo 3 e Módulo 7',
                historico: [
                    'Realizou 5 tarefas no dia.',
                    'Interrompeu o traçado da letra S antes de completar a base inferior.',
                    'Indicado revisar os vídeos demonstrativos das docentes para as letras C, R e S.'
                ]
            }
        ]
    };

    /* ==========================================================================
       3. SINTETIZADOR DE VOZ (SEM .toUpperCase() PARA NÃO DISTORCER VOGAIS/SÍLABAS)
       ========================================================================== */
    var Voz = {
        synth: window.speechSynthesis || null,
        falar: function (texto) {
            if (!this.synth) return;
            try {
                this.synth.cancel();
                var declaracao = new SpeechSynthesisUtterance(String(texto));
                declaracao.lang = 'pt-BR';
                declaracao.rate = 0.92;
                this.synth.speak(declaracao);
            } catch (e) {}
        },
        falarVogal: function (vogal) {
            var som = MapaFoneticoVogais[vogal] || vogal.toLowerCase();
            this.falar(som);
        },
        falarConsoante: function (consoante) {
            var som = MapaFoneticoConsoantes[consoante] || consoante.toLowerCase();
            this.falar(som);
        },
        falarSilaba: function (silaba) {
            var chave = String(silaba).toUpperCase().trim();
            var som = MapaFoneticoSilabas[chave] || chave.toLowerCase();
            this.falar(som);
        },
        parar: function () {
            if (this.synth) {
                try { this.synth.cancel(); } catch (e) {}
            }
        }
    };

    /* ==========================================================================
       4. CONFIGURAÇÕES DE ACESSIBILIDADE E COOKIES (LGPD)
       ========================================================================== */
    var AppConfig = {
        tamanhoAtual: 100,
        alterarTamanhoFonte: function (inc) {
            var novo = this.tamanhoAtual + inc;
            if (novo >= 80 && novo <= 150) {
                this.tamanhoAtual = novo;
                document.documentElement.style.fontSize = this.tamanhoAtual + '%';
                var abaEscrever = document.getElementById('aba-escrever');
                if (QuadroInterativo && abaEscrever && abaEscrever.classList.contains('active')) {
                    setTimeout(function () { QuadroInterativo.redimensionar(); }, 50);
                }
            }
        },
        alternarAltoContraste: function () {
            var ativo = document.body.classList.toggle('alto-contraste');
            var botao = document.getElementById('btn-alto-contraste');
            if (botao) botao.setAttribute('aria-pressed', String(ativo));
            if (QuadroInterativo) QuadroInterativo.atualizarCorTraco();
        }
    };

    var GerenciadorCookies = {
        verificar: function () {
            var aceito = lerStorage('phoneticface_cookies_lgpd', '');
            var banner = document.getElementById('banner-cookies');
            if (!aceito && banner) {
                banner.style.display = 'flex';
            }
        },
        aceitar: function () {
            salvarStorage('phoneticface_cookies_lgpd', 'aceito');
            this.fechar();
        },
        fechar: function () {
            var banner = document.getElementById('banner-cookies');
            if (banner) banner.style.display = 'none';
        }
    };

    /* ==========================================================================
       5. MODAL DE VÍDEO DO ALFABETO (SOMENTE O VÍDEO DA DOCENTE, SEM VOZ SINTÉTICA)
       ========================================================================== */
    var InterfaceModal = {
        mostrarVideo: function (item) {
            var modal = document.getElementById('modal-letras');
            var titulo = document.getElementById('letra-display');
            var texto = document.getElementById('modal-texto-palavra');
            var iframe = document.getElementById('player-youtube');
            var linkDireto = document.getElementById('link-youtube-direto');

            if (!modal) return;
            /* Para qualquer voz sintética anterior para que o aluno escute apenas a docente no vídeo */
            Voz.parar();

            if (titulo) titulo.innerText = 'LETRA ' + item.letra.toUpperCase();
            if (texto) texto.innerText = item.letra.toUpperCase() + ' DE ' + item.palavra.toUpperCase();
            if (iframe) iframe.src = 'https://www.youtube.com/embed/' + item.youtubeId + '?rel=0&autoplay=1';
            if (linkDireto) linkDireto.href = 'https://www.youtube.com/watch?v=' + item.youtubeId;

            modal.classList.add('visivel');
            GerenciadorPerfil.registrarAcaoAluno('Assistiu ao vídeo da docente para a letra ' + item.letra + ' (' + item.palavra + ').');
        },
        fechar: function () {
            var modal = document.getElementById('modal-letras');
            var iframe = document.getElementById('player-youtube');
            if (modal) modal.classList.remove('visivel');
            Voz.parar();
            if (iframe) iframe.src = '';
        }
    };

    /* ==========================================================================
       6. CONSTRUTOR INTERATIVO DE SÍLABAS (MÓDULO 5: ARRASTAR CIMA/BAIXO)
       ========================================================================== */
    var ConstrutorSilabas = {
        consoantes: ['B', 'C', 'D', 'F', 'G', 'J', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'X', 'Z'],
        vogais: ['A', 'E', 'I', 'O', 'U'],
        idxConsoante: 0,
        idxVogal: 0,

        inicializar: function () {
            this.atualizarVisor(false);
            this.embaralharLetrasMisturadas();
            this.configurarArrasteRoleta('roleta-consoante', true);
            this.configurarArrasteRoleta('roleta-vogal', false);
        },

        mudarConsoante: function (direcao) {
            var total = this.consoantes.length;
            this.idxConsoante = (this.idxConsoante + direcao + total) % total;
            this.atualizarVisor(true);
        },

        mudarVogal: function (direcao) {
            var total = this.vogais.length;
            this.idxVogal = (this.idxVogal + direcao + total) % total;
            this.atualizarVisor(true);
        },

        selecionarLetraMisturada: function (letra) {
            var idxV = this.vogais.indexOf(letra);
            if (idxV !== -1) {
                this.idxVogal = idxV;
            } else {
                var idxC = this.consoantes.indexOf(letra);
                if (idxC !== -1) this.idxConsoante = idxC;
            }
            this.atualizarVisor(true);
        },

        atualizarVisor: function (falarAutomaticamente) {
            var c = this.consoantes[this.idxConsoante];
            var v = this.vogais[this.idxVogal];
            var silaba = c + v;
            var palavra = ExemplosSilabas[silaba] || 'PALAVRA';

            var elC = document.getElementById('visor-consoante-ativa');
            var elV = document.getElementById('visor-vogal-ativa');
            var elSil = document.getElementById('texto-silaba-formada');
            var elPal = document.getElementById('texto-palavra-silaba');

            if (elC) elC.innerText = c;
            if (elV) elV.innerText = v;
            if (elSil) elSil.innerText = silaba;
            if (elPal) elPal.innerText = silaba + ' DE ' + palavra;

            if (falarAutomaticamente) {
                this.falarResultadoAtual();
            }
        },

        falarResultadoAtual: function () {
            var c = this.consoantes[this.idxConsoante];
            var v = this.vogais[this.idxVogal];
            var silaba = c + v;
            var palavra = ExemplosSilabas[silaba] || '';
            var somSilaba = MapaFoneticoSilabas[silaba] || silaba.toLowerCase();
            Voz.falar(somSilaba + ', de ' + palavra.toLowerCase());
            GerenciadorPerfil.registrarAcaoAluno('Formou a sílaba ' + silaba + ' (' + silaba + ' de ' + palavra + ').');
        },

        embaralharLetrasMisturadas: function () {
            var container = document.getElementById('painel-letras-misturadas');
            if (!container) return;
            container.innerHTML = '';
            var todas = embaralharArray(this.consoantes.concat(this.vogais));
            var self = this;

            todas.forEach(function (letra) {
                var ehVogal = self.vogais.indexOf(letra) !== -1;
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-letra-misturada' + (ehVogal ? ' vogal-mista' : '');
                btn.innerText = letra;
                btn.onclick = function () { self.selecionarLetraMisturada(letra); };
                container.appendChild(btn);
            });
        },

        configurarArrasteRoleta: function (idElemento, ehConsoante) {
            var el = document.getElementById(idElemento);
            if (!el) return;
            var inicioY = null;
            var self = this;

            el.addEventListener('touchstart', function (e) {
                if (e.touches && e.touches.length > 0) inicioY = e.touches[0].clientY;
            }, { passive: true });

            el.addEventListener('touchend', function (e) {
                if (inicioY === null || !e.changedTouches || e.changedTouches.length === 0) return;
                var deltaY = e.changedTouches[0].clientY - inicioY;
                if (Math.abs(deltaY) > 24) {
                    var direcao = deltaY > 0 ? -1 : 1;
                    if (ehConsoante) self.mudarConsoante(direcao);
                    else self.mudarVogal(direcao);
                }
                inicioY = null;
            }, { passive: true });

            el.addEventListener('wheel', function (e) {
                e.preventDefault();
                var direcao = e.deltaY > 0 ? 1 : -1;
                if (ehConsoante) self.mudarConsoante(direcao);
                else self.mudarVogal(direcao);
            }, { passive: false });
        }
    };

    /* ==========================================================================
       7. CALIGRAFIA COM VALIDAÇÃO GEOMÉTRICA RIGOROSA (QUADRANTES + EXTENSÃO)
       ========================================================================== */
    function CanvasCaligrafia(idCanvas, idContainer, idGuia) {
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

    CanvasCaligrafia.prototype.atualizarCorTraco = function () {
        if (!this.ctx) return;
        this.ctx.strokeStyle = document.body.classList.contains('alto-contraste') ? '#FFFF00' : '#0056B3';
    };

    CanvasCaligrafia.prototype.redimensionar = function () {
        if (!this.container || !this.canvas || !this.ctx) return;
        var largura = this.container.clientWidth || 600;
        var altura = this.container.clientHeight || 420;

        var anterior = document.createElement('canvas');
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
            this.ctx.drawImage(anterior, 0, 0, anterior.width, anterior.height, 0, 0, largura, altura);
        }
    };

    CanvasCaligrafia.prototype.desenharMoldeLetra = function () {
        if (!this.canvas) return;
        var w = this.canvas.width;
        var h = this.canvas.height;
        if (!w || !h) return;

        this.canvasMolde.width = w;
        this.canvasMolde.height = h;
        this.ctxMolde.clearRect(0, 0, w, h);

        var tamFonte = w < 500 ? 180 : 240;
        if (this.guiaFundo) this.guiaFundo.style.fontSize = tamFonte + 'px';

        this.ctxMolde.font = '900 ' + tamFonte + 'px Arial, Helvetica, sans-serif';
        this.ctxMolde.textAlign = 'center';
        this.ctxMolde.textBaseline = 'middle';
        this.ctxMolde.lineWidth = 34;
        this.ctxMolde.lineJoin = 'round';
        this.ctxMolde.strokeStyle = '#000';
        this.ctxMolde.fillStyle = '#000';
        this.ctxMolde.strokeText(this.letraAtual, w / 2, h / 2);
        this.ctxMolde.fillText(this.letraAtual, w / 2, h / 2);
    };

    CanvasCaligrafia.prototype.obterCoordenadas = function (e) {
        var rect = this.canvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    CanvasCaligrafia.prototype.iniciarTraco = function (e) {
        clearTimeout(this.timerValidacao);
        this.desenhando = true;
        this.atualizarCorTraco();
        e.preventDefault();
        var pos = this.obterCoordenadas(e);
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    };

    CanvasCaligrafia.prototype.desenhar = function (e) {
        if (!this.desenhando) return;
        e.preventDefault();
        var pos = this.obterCoordenadas(e);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    };

    CanvasCaligrafia.prototype.finalizarTraco = function () {
        if (!this.desenhando) return;
        this.desenhando = false;
        this.ctx.beginPath();
        var self = this;
        this.timerValidacao = setTimeout(function () { self.validarDesenho(); }, 1250);
    };

    CanvasCaligrafia.prototype.atualizarAviso = function (texto, classe) {
        if (!this.barraStatus) return;
        this.barraStatus.innerText = texto;
        this.barraStatus.className = 'barra-status-tracado ' + (classe || '');
    };

    /* Validação rigorosa: exige que o aluno preencha topo, meio e base da letra sem rabiscar fora */
    CanvasCaligrafia.prototype.validarDesenho = function () {
        if (!this.canvas) return;
        var w = this.canvas.width;
        var h = this.canvas.height;
        if (!w || !h) return;

        this.desenharMoldeLetra();
        var dadosAluno = this.ctx.getImageData(0, 0, w, h).data;
        var dadosMolde = this.ctxMolde.getImageData(0, 0, w, h).data;

        var pintadosPeloAluno = 0;
        var pintadosDentroDaLetra = 0;
        var tamanhoMolde = 0;

        var moldeMinX = w, moldeMaxX = 0, moldeMinY = h, moldeMaxY = 0;
        var alunoMinX = w, alunoMaxX = 0, alunoMinY = h, alunoMaxY = 0;

        /* Divisão vertical em 3 faixas (topo, centro, base) para impedir aprovação de traço incompleto */
        var moldeFaixasY = [0, 0, 0];
        var alunoDentroFaixasY = [0, 0, 0];

        for (var y = 0; y < h; y += 2) {
            for (var x = 0; x < w; x += 2) {
                var idx = (y * w + x) * 4 + 3;
                var alunoRiscou = dadosAluno[idx] > 50;
                var dentroDaLetra = dadosMolde[idx] > 50;

                if (dentroDaLetra) {
                    tamanhoMolde++;
                    if (x < moldeMinX) moldeMinX = x;
                    if (x > moldeMaxX) moldeMaxX = x;
                    if (y < moldeMinY) moldeMinY = y;
                    if (y > moldeMaxY) moldeMaxY = y;
                }
                if (alunoRiscou) {
                    pintadosPeloAluno++;
                    if (x < alunoMinX) alunoMinX = x;
                    if (x > alunoMaxX) alunoMaxX = x;
                    if (y < alunoMinY) alunoMinY = y;
                    if (y > alunoMaxY) alunoMaxY = y;
                    if (dentroDaLetra) {
                        pintadosDentroDaLetra++;
                    }
                }
            }
        }

        if (pintadosPeloAluno === 0 || tamanhoMolde === 0) return;

        var alturaMolde = Math.max(1, moldeMaxY - moldeMinY);
        var larguraMolde = Math.max(1, moldeMaxX - moldeMinX);
        var alturaAluno = Math.max(0, alunoMaxY - alunoMinY);
        var larguraAluno = Math.max(0, alunoMaxX - alunoMinX);

        /* Verifica preenchimento nas 3 faixas verticais da letra (topo, meio e base) */
        for (var y2 = moldeMinY; y2 <= moldeMaxY; y2 += 2) {
            var faixa = Math.min(2, Math.floor(((y2 - moldeMinY) / alturaMolde) * 3));
            for (var x2 = moldeMinX; x2 <= moldeMaxX; x2 += 2) {
                var idx2 = (y2 * w + x2) * 4 + 3;
                if (dadosMolde[idx2] > 50) {
                    moldeFaixasY[faixa]++;
                    if (dadosAluno[idx2] > 50) {
                        alunoDentroFaixasY[faixa]++;
                    }
                }
            }
        }

        var faixasPreenchidas = 0;
        for (var f = 0; f < 3; f++) {
            var taxaFaixa = moldeFaixasY[f] > 0 ? (alunoDentroFaixasY[f] / moldeFaixasY[f]) : 1;
            if (taxaFaixa >= 0.22) faixasPreenchidas++;
        }

        var precisao = pintadosDentroDaLetra / pintadosPeloAluno;
        var preenchimentoTotal = pintadosDentroDaLetra / tamanhoMolde;
        var proporcaoAltura = alturaAluno / alturaMolde;
        var proporcaoLargura = larguraMolde > 30 ? (larguraAluno / larguraMolde) : 1;
        var self = this;

        /* Rejeita se saiu da linha, se preencheu menos de 38% do molde, se não cobriu topo/meio/base ou se rabiscou demais */
        if (
            precisao < 0.62 ||
            preenchimentoTotal < 0.38 ||
            faixasPreenchidas < 3 ||
            proporcaoAltura < 0.72 ||
            proporcaoLargura < 0.65 ||
            pintadosPeloAluno > tamanhoMolde * 1.32
        ) {
            this.atualizarAviso('ERROU, TENTE NOVAMENTE. CONTORNE A LETRA ' + this.letraAtual + ' COMPLETA E DENTRO DO MOLDE.', 'erro');
            Voz.falar('Errou, tente novamente.');
            GerenciadorPerfil.registrarDificuldadeAluno('Errou o traçado da letra ' + this.letraAtual + '.');
            setTimeout(function () { self.limparSilencioso(); }, 950);
        } else {
            this.atualizarAviso('PARABÉNS! TRAÇADO DA LETRA ' + this.letraAtual + ' REALIZADO CORRETAMENTE.', 'sucesso');
            Voz.falar('Correto! Parabéns pelo traçado da letra ' + this.letraAtual + '.');
            InteracaoApp.gerarConfetes();
            GerenciadorPerfil.registrarAcaoAluno('Concluiu corretamente o traçado da letra ' + this.letraAtual + '.');
            setTimeout(function () {
                self.limparSilencioso();
                self.atualizarAviso('CONTORNE A LETRA ' + self.letraAtual + ' SOBRE O MOLDE ABAIXO', '');
            }, 2400);
        }
    };

    CanvasCaligrafia.prototype.limparSilencioso = function () {
        if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    CanvasCaligrafia.prototype.limpar = function () {
        this.limparSilencioso();
        this.atualizarAviso('QUADRO APAGADO. CONTORNE A LETRA ' + this.letraAtual, '');
        Voz.falar('Quadro apagado.');
    };

    CanvasCaligrafia.prototype.definirGuia = function (letra, btnClicado) {
        this.letraAtual = letra;
        if (this.guiaFundo) this.guiaFundo.innerText = letra;
        if (btnClicado) {
            var bts = document.querySelectorAll('#botoes-desenho .btn-ferramenta');
            for (var i = 0; i < bts.length; i++) bts[i].classList.remove('letra-ativa');
            btnClicado.classList.add('letra-ativa');
        }
        this.limparSilencioso();
        this.desenharMoldeLetra();
        this.atualizarAviso('CONTORNE A LETRA ' + letra + ' INTEIRA SOBRE O MOLDE ABAIXO', '');
        Voz.falar('Contorne a letra ' + letra);
    };

    CanvasCaligrafia.prototype.vincularEventos = function () {
        var self = this;
        this.canvas.addEventListener('mousedown', function (e) { self.iniciarTraco(e); });
        this.canvas.addEventListener('mousemove', function (e) { self.desenhar(e); });
        this.canvas.addEventListener('mouseup', function () { self.finalizarTraco(); });
        this.canvas.addEventListener('touchstart', function (e) { self.iniciarTraco(e); }, { passive: false });
        this.canvas.addEventListener('touchmove', function (e) { self.desenhar(e); }, { passive: false });
        this.canvas.addEventListener('touchend', function () { self.finalizarTraco(); });
    };

    var QuadroInterativo = null;

    /* ==========================================================================
       8. JOGOS ALEATÓRIOS (SOM INICIAL, FORMAR PALAVRAS E NOME)
       ========================================================================== */
    var InteracaoApp = {
        filaIniciais: [],
        filaPalavras: [],
        itemInicialAtual: null,
        palavraAtual: null,
        silabasPreenchidas: 0,

        gerarOpcoesAleatorias: function (letraCerta) {
            var todasLetras = BancoDados.vogais.concat(BancoDados.consoantes);
            var outras = todasLetras.filter(function (l) { return l !== letraCerta; });
            var sorteadas = embaralharArray(outras).slice(0, 3);
            sorteadas.push(letraCerta);
            return embaralharArray(sorteadas);
        },

        verificarNome: function () {
            var input = document.getElementById('input-nome');
            if (!input) return;
            var nome = input.value.trim().toUpperCase();
            if (nome.length > 0) {
                salvarStorage('phoneticface_aluno', nome);
                var boasVindas = document.getElementById('mensagem-boas-vindas');
                if (boasVindas) {
                    boasVindas.innerText = 'ESTUDANTE: ' + nome;
                    boasVindas.style.display = 'block';
                }
                Voz.falar('Muito bem, ' + nome + '! Seu nome foi confirmado.');
                this.gerarConfetes();
                GerenciadorPerfil.registrarAcaoAluno('Confirmou a escrita do próprio nome (' + nome + ').');
            } else {
                Voz.falar('Por favor, digite o seu nome na caixa branca.');
            }
        },

        carregarNomeSalvo: function () {
            var nomeSalvo = lerStorage('phoneticface_aluno', '');
            if (nomeSalvo) {
                var boasVindas = document.getElementById('mensagem-boas-vindas');
                var input = document.getElementById('input-nome');
                if (boasVindas) {
                    boasVindas.innerText = 'ESTUDANTE: ' + nomeSalvo;
                    boasVindas.style.display = 'block';
                }
                if (input) input.value = nomeSalvo;
            }
        },

        gerarConfetes: function () {
            var cores = ['#0056B3', '#008B9E', '#2E7D32', '#F59E0B', '#5B21B6'];
            for (var i = 0; i < 48; i++) {
                (function () {
                    var confete = document.createElement('div');
                    confete.className = 'confete';
                    confete.style.left = Math.random() * 100 + 'vw';
                    confete.style.top = '-10px';
                    confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
                    confete.style.animationDuration = (Math.random() * 2 + 1.8) + 's';
                    document.body.appendChild(confete);
                    setTimeout(function () { confete.remove(); }, 3800);
                })();
            }
        },

        ouvirPalavraInicial: function () {
            if (this.itemInicialAtual) Voz.falar(this.itemInicialAtual.nome);
        },

        sortearNovaInicial: function () {
            this.carregarInicial();
            if (this.itemInicialAtual) Voz.falar(this.itemInicialAtual.nome);
        },

        carregarInicial: function () {
            var self = this;
            var elCat = document.getElementById('categoria-inicial-dica');
            var elDica = document.getElementById('nome-inicial-dica');
            var ct = document.getElementById('opcoes-iniciais');
            if (!elDica || !ct) return;

            if (this.filaIniciais.length === 0) {
                this.filaIniciais = embaralharArray(BancoDados.iniciais);
            }
            this.itemInicialAtual = this.filaIniciais.pop();
            var item = this.itemInicialAtual;

            if (elCat) elCat.innerText = 'TEMA: ' + item.cat;
            elDica.innerText = '_ ' + item.nome.substring(1).split('').join(' ');
            ct.innerHTML = '';

            var opcoes = this.gerarOpcoesAleatorias(item.certa);
            opcoes.forEach(function (op) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn-grande';
                b.style.backgroundColor = 'var(--cor-primaria)';
                b.innerText = op;
                b.onclick = function () {
                    if (op === item.certa) {
                        elDica.innerText = item.nome.split('').join(' ');
                        Voz.falar('Muito bem! ' + item.nome + ' começa com a letra ' + item.certa + '.');
                        self.gerarConfetes();
                        GerenciadorPerfil.registrarAcaoAluno('Acertou o som inicial da palavra ' + item.nome + '.');
                        setTimeout(function () { self.carregarInicial(); }, 2300);
                    } else {
                        Voz.falar('Errou, tente novamente.');
                        GerenciadorPerfil.registrarDificuldadeAluno('Dúvida na letra inicial da palavra ' + item.nome + '.');
                    }
                };
                ct.appendChild(b);
            });
        },

        carregarPalavra: function () {
            var self = this;
            var elDica = document.getElementById('dica-palavra');
            var slots = document.getElementById('slots-palavra');
            var soltas = document.getElementById('silabas-soltas');
            if (!elDica || !slots || !soltas) return;

            if (this.filaPalavras.length === 0) {
                this.filaPalavras = embaralharArray(BancoDados.palavrasJogo);
            }
            this.palavraAtual = this.filaPalavras.pop();
            this.silabasPreenchidas = 0;

            elDica.innerText = this.palavraAtual.p;
            slots.innerHTML = '';
            soltas.innerHTML = '';

            this.palavraAtual.s.forEach(function (_, i) {
                var slot = document.createElement('div');
                slot.className = 'slot-silaba';
                slot.id = 'slot-' + i;
                slots.appendChild(slot);
            });

            var embaralhadas = embaralharArray(this.palavraAtual.s);
            embaralhadas.forEach(function (silaba) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn-grande';
                b.style.backgroundColor = 'var(--cor-primaria)';
                b.innerText = silaba;
                b.onclick = function (e) {
                    var silabaCorreta = self.palavraAtual.s[self.silabasPreenchidas];
                    if (silaba === silabaCorreta) {
                        Voz.falarSilaba(silaba);
                        var sl = document.getElementById('slot-' + self.silabasPreenchidas);
                        if (sl) {
                            sl.innerText = silaba;
                            sl.style.backgroundColor = 'var(--cor-sucesso)';
                            sl.style.color = 'white';
                            sl.style.borderColor = 'var(--cor-sucesso)';
                        }
                        e.currentTarget.style.visibility = 'hidden';
                        self.silabasPreenchidas++;
                        if (self.silabasPreenchidas === self.palavraAtual.s.length) {
                            GerenciadorPerfil.registrarAcaoAluno('Formou corretamente a palavra ' + self.palavraAtual.p + '.');
                            setTimeout(function () {
                                Voz.falar('Parabéns! Você formou a palavra ' + self.palavraAtual.p.toLowerCase() + '.');
                                self.gerarConfetes();
                            }, 650);
                        }
                    } else {
                        Voz.falar('Errou, tente novamente.');
                        GerenciadorPerfil.registrarDificuldadeAluno('Trocou a ordem das sílabas da palavra ' + self.palavraAtual.p + '.');
                    }
                };
                soltas.appendChild(b);
            });
        },

        proximaPalavra: function () {
            this.carregarPalavra();
        }
    };

    /* ==========================================================================
       9. PAINEL DO PROFESSOR E MOTOR DE IMPRESSÃO (1 ALUNO POR FOLHA)
       ========================================================================== */
    var GerenciadorPerfil = {
        tarefasSessao: 4,
        historicoSessao: [
            'Iniciou sessão de estudos na plataforma PhoneticFace.',
            'Realizou atividades de consciência fonológica e associação.'
        ],
        ultimoDiagnostico: 'Participando regularmente das atividades na sessão atual.',
        fichaTextoAtual: '',
        indiceFichaAberta: 0,
        selecionadosImpressao: {},

        registrarAcaoAluno: function (acao) {
            this.tarefasSessao++;
            this.historicoSessao.unshift(acao);
            if (this.historicoSessao.length > 6) this.historicoSessao.pop();
        },

        registrarDificuldadeAluno: function (erro) {
            this.ultimoDiagnostico = erro;
            this.historicoSessao.unshift('Observação pedagógica: ' + erro);
        },

        abrirModal: function () {
            Voz.parar();
            var m = document.getElementById('modal-selecao-perfil');
            if (m) m.classList.add('visivel');
        },

        selecionar: function (perfil) {
            var m = document.getElementById('modal-selecao-perfil');
            if (m) m.classList.remove('visivel');

            var viewAluno = document.getElementById('view-aluno');
            var viewProf = document.getElementById('view-professor');
            var navAluno = document.getElementById('container-navegacao-aluno');
            var btnAluno = document.getElementById('btn-topo-aluno');
            var btnProf = document.getElementById('btn-topo-prof');

            if (perfil === 'professor') {
                if (viewAluno) viewAluno.style.display = 'none';
                if (navAluno) navAluno.style.display = 'none';
                if (viewProf) viewProf.style.display = 'block';
                if (btnAluno) btnAluno.classList.remove('ativo');
                if (btnProf) btnProf.classList.add('ativo');
                this.renderizarTabela('todos');
                Voz.falar('Painel do professor aberto.');
            } else {
                if (viewProf) viewProf.style.display = 'none';
                if (viewAluno) viewAluno.style.display = 'block';
                if (navAluno) navAluno.style.display = 'block';
                if (btnProf) btnProf.classList.remove('ativo');
                if (btnAluno) btnAluno.classList.add('ativo');
                var abaEscrever = document.getElementById('aba-escrever');
                if (QuadroInterativo && abaEscrever && abaEscrever.classList.contains('active')) {
                    setTimeout(function () { QuadroInterativo.redimensionar(); }, 60);
                }
                Voz.falar('Ambiente do aluno aberto.');
            }
        },

        obterAlunosCombinados: function () {
            var nomeAtual = lerStorage('phoneticface_aluno', 'Estudante da Sessão Atual');
            var pct = Math.min(100, 45 + (this.tarefasSessao * 8));
            var alunoAoVivo = {
                id: 100,
                nome: nomeAtual + ' (Sessão Atual)',
                idade: 28,
                perfilEtario: 'Pessoa Adulta',
                serie: 'EJA - Fase I (1º Segmento)',
                tarefas: this.tarefasSessao + ' tarefas no dia',
                pct: pct,
                corBarra: pct >= 70 ? 'fill-verde' : 'fill-amarelo',
                categoria: 'otimo',
                relatorio: this.ultimoDiagnostico,
                orientacao: 'Acompanhamento em andamento',
                historico: this.historicoSessao
            };
            return [alunoAoVivo].concat(BancoDados.alunosProfessor);
        },

        adicionarNovoAluno: function () {
            var inNome = document.getElementById('novo-aluno-nome');
            var inIdade = document.getElementById('novo-aluno-idade');
            var inPerfil = document.getElementById('novo-aluno-perfil');
            var inSerie = document.getElementById('novo-aluno-serie');
            if (!inNome || !inNome.value.trim()) {
                Voz.falar('Informe o nome completo do estudante para cadastrar.');
                return;
            }
            var idadeNum = parseInt(inIdade.value, 10) || 35;
            var novo = {
                id: Date.now(),
                nome: inNome.value.trim(),
                idade: idadeNum,
                perfilEtario: inPerfil ? inPerfil.value : 'Pessoa Adulta',
                serie: inSerie ? inSerie.value : 'EJA - Fase I (1º Segmento)',
                tarefas: '1 tarefa no dia',
                pct: 50,
                corBarra: 'fill-amarelo',
                categoria: 'otimo',
                relatorio: 'Estudante recém-cadastrado na turma pelo professor.',
                orientacao: 'Iniciar avaliação diagnóstica nos módulos 1 a 3',
                historico: ['Cadastro realizado no Painel de Gestão Docente.']
            };
            BancoDados.alunosProfessor.unshift(novo);
            inNome.value = '';
            if (inIdade) inIdade.value = '';
            this.renderizarTabela('todos');
            Voz.falar('Estudante incluído no relatório da turma.');
        },

        filtrarAlunos: function (categoria, btn) {
            if (btn) {
                var botoes = document.querySelectorAll('.btn-filtro');
                for (var i = 0; i < botoes.length; i++) botoes[i].classList.remove('active');
                btn.classList.add('active');
            }
            this.renderizarTabela(categoria);
        },

        alternarSelecaoAluno: function (indice, marcado) {
            this.selecionadosImpressao[indice] = marcado;
        },

        alternarSelecaoTodos: function (marcado) {
            var todos = this.obterAlunosCombinados();
            for (var i = 0; i < todos.length; i++) {
                this.selecionadosImpressao[i] = marcado;
            }
            var checks = document.querySelectorAll('.check-impressao-aluno');
            for (var j = 0; j < checks.length; j++) {
                checks[j].checked = marcado;
            }
        },

        renderizarTabela: function (categoria) {
            var tbody = document.getElementById('tabela-alunos-body');
            if (!tbody) return;
            tbody.innerHTML = '';

            var todos = this.obterAlunosCombinados();
            var kpiTotal = document.getElementById('kpi-total-alunos');
            if (kpiTotal) kpiTotal.innerText = String(todos.length);

            var self = this;
            todos.forEach(function (aluno, idx) {
                if (categoria && categoria !== 'todos' && aluno.categoria !== categoria) return;
                var marcado = !!self.selecionadosImpressao[idx];
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td style="text-align:center;"><input type="checkbox" class="check-impressao-aluno" ' + (marcado ? 'checked' : '') + ' onchange="GerenciadorPerfil.alternarSelecaoAluno(' + idx + ', this.checked)"></td>' +
                    '<td><strong>' + aluno.nome + '</strong></td>' +
                    '<td>' + aluno.idade + ' anos (' + aluno.perfilEtario + ')</td>' +
                    '<td>' + aluno.serie + '</td>' +
                    '<td><strong>' + aluno.tarefas + '</strong></td>' +
                    '<td><div class="barra-progresso-bg"><div class="barra-progresso-fill ' + aluno.corBarra + '" style="width:' + aluno.pct + '%;">' + aluno.pct + '%</div></div></td>' +
                    '<td>' + aluno.relatorio + '</td>' +
                    '<td><div class="acoes-linha-prof">' +
                    '<button type="button" class="btn-ver-ficha" onclick="GerenciadorPerfil.abrirFicha(' + idx + ')">VER FICHA</button>' +
                    '<button type="button" class="btn-imprimir-linha" onclick="GerenciadorPerfil.imprimirAlunoUnico(' + idx + ')">IMPRIMIR</button>' +
                    '</div></td>';
                tbody.appendChild(tr);
            });
        },

        abrirFicha: function (indice) {
            var aluno = this.obterAlunosCombinados()[indice];
            if (!aluno) return;
            this.indiceFichaAberta = indice;

            var elNome = document.getElementById('ficha-nome-aluno');
            var elResumo = document.getElementById('ficha-resumo-aluno');
            var elCorpo = document.getElementById('ficha-corpo-detalhes');
            var modalFicha = document.getElementById('modal-ficha-aluno');

            if (elNome) elNome.innerText = aluno.nome;
            if (elResumo) elResumo.innerText = 'Idade: ' + aluno.idade + ' anos (' + aluno.perfilEtario + ') | ' + aluno.serie + ' | Evolução: ' + aluno.pct + '%';

            var listaHtml = aluno.historico.map(function (h) { return '<li style="margin-bottom:6px;">' + h + '</li>'; }).join('');
            if (elCorpo) {
                elCorpo.innerHTML =
                    '<div class="ficha-item"><h4>Dados Escolares e Perfil</h4><p>Idade: ' + aluno.idade + ' anos — Classificação: ' + aluno.perfilEtario + '<br>Série/Etapa: ' + aluno.serie + '<br>Produção Diária: ' + aluno.tarefas + '</p></div>' +
                    '<div class="ficha-item"><h4>Diagnóstico Pedagógico e Uso da Plataforma</h4><p>' + aluno.relatorio + '</p></div>' +
                    '<div class="ficha-item" style="border-left-color:var(--cor-sucesso);"><h4>Histórico de Atividades</h4><ul style="padding-left:20px;margin-top:6px;">' + listaHtml + '</ul></div>' +
                    '<div class="ficha-item" style="border-left-color:var(--cor-roxo);"><h4>Encaminhamento Docente</h4><p>' + aluno.orientacao + '</p></div>';
            }

            this.fichaTextoAtual = 'Relatório individual de ' + aluno.nome + ', ' + aluno.idade + ' anos, ' + aluno.perfilEtario + ', matriculado na etapa ' + aluno.serie + '. Realizou ' + aluno.tarefas + '. Diagnóstico: ' + aluno.relatorio + '. Encaminhamento: ' + aluno.orientacao + '.';
            if (modalFicha) modalFicha.classList.add('visivel');
        },

        ouvirFichaAtual: function () {
            if (this.fichaTextoAtual) Voz.falar(this.fichaTextoAtual);
        },

        fecharFicha: function () {
            Voz.parar();
            var modalFicha = document.getElementById('modal-ficha-aluno');
            if (modalFicha) modalFicha.classList.remove('visivel');
        },

        montarFolhaHtmlAluno: function (aluno, dataEmissao) {
            var itensHist = aluno.historico.map(function (h) { return '<li>' + h + '</li>'; }).join('');
            return (
                '<section class="folha-relatorio-aluno">' +
                '<div class="cabecalho-folha-impressao">' +
                '<h2 style="font-size:1.4rem; margin-bottom:4px;">COLÉGIO ESTADUAL PROFESSORA IVONE SOARES CASTANHARO</h2>' +
                '<p style="font-size:0.95rem; font-weight:bold;">PHONETICFACE — FERRAMENTA TECNOLÓGICA DE APOIO DOCENTE NO PROCESSO DE ALFABETIZAÇÃO</p>' +
                '<p style="font-size:0.85rem;">RELATÓRIO INDIVIDUAL DE ACOMPANHAMENTO PEDAGÓGICO (EJA) — DATA: ' + dataEmissao + '</p>' +
                '</div>' +
                '<div class="grade-dados-impressao">' +
                '<div><strong>NOME DO ESTUDANTE:</strong> ' + aluno.nome + '</div>' +
                '<div><strong>IDADE E PERFIL:</strong> ' + aluno.idade + ' anos (' + aluno.perfilEtario + ')</div>' +
                '<div><strong>SÉRIE / ETAPA ESCOLAR:</strong> ' + aluno.serie + '</div>' +
                '<div><strong>PRODUÇÃO REGISTRADA:</strong> ' + aluno.tarefas + ' (' + aluno.pct + '% de evolução)</div>' +
                '</div>' +
                '<div class="secao-folha-impressao">' +
                '<h3 style="font-size:1rem; margin-bottom:6px;">1. DIAGNÓSTICO PEDAGÓGICO E ADAPTAÇÃO TECNOLÓGICA</h3>' +
                '<p>' + aluno.relatorio + '</p>' +
                '</div>' +
                '<div class="secao-folha-impressao">' +
                '<h3 style="font-size:1rem; margin-bottom:6px;">2. REGISTRO DE ATIVIDADES REALIZADAS</h3>' +
                '<ul style="padding-left:20px;">' + itensHist + '</ul>' +
                '</div>' +
                '<div class="secao-folha-impressao">' +
                '<h3 style="font-size:1rem; margin-bottom:6px;">3. ENCAMINHAMENTO E RECOMENDAÇÃO DOCENTE</h3>' +
                '<p>' + aluno.orientacao + '</p>' +
                '</div>' +
                '<div class="assinaturas-impressao">' +
                '<div class="linha-assinatura">Professor(a) Responsável / Monitoria</div>' +
                '<div class="linha-assinatura">Coordenação Pedagógica / Direção</div>' +
                '</div>' +
                '</section>'
            );
        },

        executarImpressaoFolhas: function (listaParaImprimir) {
            var area = document.getElementById('area-impressao-relatorios');
            if (!area || listaParaImprimir.length === 0) return;
            var hoje = new Date().toLocaleDateString('pt-BR');
            var self = this;
            area.innerHTML = listaParaImprimir.map(function (aluno) {
                return self.montarFolhaHtmlAluno(aluno, hoje);
            }).join('');
            window.print();
        },

        imprimirAlunoUnico: function (indice) {
            var aluno = this.obterAlunosCombinados()[indice];
            if (!aluno) return;
            this.executarImpressaoFolhas([aluno]);
        },

        imprimirSelecionados: function () {
            var todos = this.obterAlunosCombinados();
            var self = this;
            var selecionados = todos.filter(function (_, idx) {
                return !!self.selecionadosImpressao[idx];
            });
            if (selecionados.length === 0) {
                Voz.falar('Marque a caixa de seleção ao lado dos alunos que deseja imprimir.');
                alert('Selecione pelo menos um aluno na tabela marcando a caixa à esquerda para imprimir 1 aluno por folha.');
                return;
            }
            this.executarImpressaoFolhas(selecionados);
        },

        imprimirTodosIndividual: function () {
            var todos = this.obterAlunosCombinados();
            this.executarImpressaoFolhas(todos);
        }
    };

    /* ==========================================================================
       10. INICIALIZAÇÃO COMPLETA DE TODOS OS 13 MÓDULOS
       ========================================================================== */
    function inicializarTudo() {
        /* 1. Sons das Letras A-Z */
        var containerAlfabeto = document.getElementById('container-grid-alfabeto');
        if (containerAlfabeto) {
            containerAlfabeto.innerHTML = '';
            BancoDados.alfabeto.forEach(function (item) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-letra';
                btn.innerText = item.letra;
                btn.onclick = function () { InterfaceModal.mostrarVideo(item); };
                containerAlfabeto.appendChild(btn);
            });
        }

        /* 2. Vogais e Consoantes com som fonético exato */
        var v = document.getElementById('box-vogais');
        var c = document.getElementById('box-consoantes');
        if (v && c) {
            v.innerHTML = '';
            c.innerHTML = '';
            BancoDados.vogais.forEach(function (l) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn-grande';
                b.style.backgroundColor = 'var(--cor-destaque)';
                b.innerText = l;
                b.onclick = function () { Voz.falarVogal(l); };
                v.appendChild(b);
            });
            BancoDados.consoantes.forEach(function (l) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn-letra';
                b.style.width = '80px';
                b.innerText = l;
                b.onclick = function () { Voz.falarConsoante(l); };
                c.appendChild(b);
            });
        }

        /* 4. Unindo Sons (pronúncia direta ba, be, bi, bo, bu) */
        var bts = document.getElementById('botoes-familias');
        var res = document.getElementById('resultado-familia');
        var titulo = document.getElementById('titulo-familia-atual');
        if (bts && res && titulo) {
            bts.innerHTML = '';
            var mostrarUniao = function (consoante, falarAutomatico) {
                titulo.innerText = 'FAMÍLIA SILÁBICA DA LETRA ' + consoante + ':';
                res.innerHTML = '';
                var sonsDaFamilia = [];
                BancoDados.vogais.forEach(function (vogal) {
                    var silaba = consoante + vogal;
                    var somFonetico = MapaFoneticoSilabas[silaba] || silaba.toLowerCase();
                    sonsDaFamilia.push(somFonetico);

                    var btnF = document.createElement('button');
                    btnF.type = 'button';
                    btnF.className = 'btn-grande';
                    btnF.style.backgroundColor = 'var(--cor-sucesso)';
                    btnF.innerText = silaba;
                    btnF.onclick = function () { Voz.falarSilaba(silaba); };
                    res.appendChild(btnF);
                });
                if (falarAutomatico) {
                    Voz.falar(sonsDaFamilia.join(', '));
                }
            };
            BancoDados.consoantes.forEach(function (consoante) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn-letra';
                b.style.width = '65px';
                b.innerText = consoante;
                b.onclick = function () { mostrarUniao(consoante, true); };
                bts.appendChild(b);
            });
            mostrarUniao('B', false);
        }

        /* 5. Formar Sílabas (Construtor Deslizante + Lista de Exemplos) */
        ConstrutorSilabas.inicializar();
        var contSilabas = document.getElementById('container-silabas');
        if (contSilabas) {
            contSilabas.innerHTML = '';
            BancoDados.silabas.forEach(function (item) {
                var silaba = item.consoante + item.vogal;
                var somSil = MapaFoneticoSilabas[silaba] || silaba.toLowerCase();
                var cartao = document.createElement('div');
                cartao.className = 'cartao linha-silaba';
                cartao.innerHTML =
                    '<div class="bloco">' + item.consoante + '</div>' +
                    '<div style="color:var(--cor-primaria);font-size:2rem;">+</div>' +
                    '<div class="bloco">' + item.vogal + '</div>' +
                    '<div style="color:var(--cor-primaria);font-size:2rem;">=</div>' +
                    '<button type="button" class="bloco-resultado" onclick="Voz.falar(\'' + somSil + ', de ' + item.palavra.toLowerCase() + '\')">' +
                    '<span>' + silaba + ' DE ' + item.palavra + '</span></button>';
                contSilabas.appendChild(cartao);
            });
        }

        /* 7. Botões de Traçado em ordem alfabética fixa A-Z */
        var contDesenho = document.getElementById('botoes-desenho');
        if (contDesenho) {
            contDesenho.innerHTML = '';
            BancoDados.sinaisDesenho.forEach(function (sinal, index) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-ferramenta' + (index === 0 ? ' letra-ativa' : '');
                btn.innerText = sinal;
                btn.onclick = function (e) { if (QuadroInterativo) QuadroInterativo.definirGuia(sinal, e.currentTarget); };
                contDesenho.appendChild(btn);
            });
            var btnApagar = document.createElement('button');
            btnApagar.type = 'button';
            btnApagar.className = 'btn-ferramenta';
            btnApagar.style.backgroundColor = 'var(--cor-destaque)';
            btnApagar.innerText = 'APAGAR QUADRO';
            btnApagar.onclick = function () { if (QuadroInterativo) QuadroInterativo.limpar(); };
            contDesenho.appendChild(btnApagar);
        }

        /* 8. Cores */
        var ctCores = document.getElementById('container-cores');
        if (ctCores) {
            ctCores.innerHTML = '';
            BancoDados.cores.forEach(function (cor) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-letra';
                btn.innerText = cor.n;
                btn.style.backgroundColor = cor.c;
                btn.style.color = cor.txt;
                btn.style.fontSize = '1.35rem';
                btn.style.border = '2px solid rgba(0,0,0,0.15)';
                btn.onclick = function () { Voz.falar(cor.n.toLowerCase()); };
                ctCores.appendChild(btn);
            });
        }

        /* 10. Leitura Prática */
        var contDia = document.getElementById('container-dia-a-dia');
        if (contDia) {
            contDia.innerHTML = '';
            BancoDados.vidaPratica.forEach(function (item) {
                var card = document.createElement('div');
                card.className = 'card-interativo';
                card.onclick = function () { Voz.falar(item.textoFala); };
                card.innerHTML =
                    '<span class="selo-categoria-card">' + item.cat + '</span>' +
                    '<h2 style="font-size:1.55rem; color:var(--cor-primaria); margin-bottom:8px;">' + item.titulo + '</h2>' +
                    '<p style="font-size:0.95rem; color:var(--cor-texto-secundario); font-weight:600;">' + item.textoFala + '</p>';
                contDia.appendChild(card);
            });
        }

        /* 11. Vocabulário */
        var contAnimais = document.getElementById('container-animais');
        if (contAnimais) {
            contAnimais.innerHTML = '';
            BancoDados.animais.forEach(function (animal) {
                var card = document.createElement('div');
                card.className = 'card-interativo';
                card.onclick = function () { Voz.falar(animal.nome.toLowerCase()); };
                card.innerHTML =
                    '<span class="selo-categoria-card">' + animal.cat + '</span>' +
                    '<h2 style="font-size:1.85rem; color:var(--cor-primaria);">' + animal.nome + '</h2>' +
                    '<p style="font-size:0.82rem; color:var(--cor-texto-secundario); margin-top:6px; font-weight:700;">TOQUE PARA OUVIR A PRONÚNCIA</p>';
                contAnimais.appendChild(card);
            });
        }

        /* 12. Números 1 a 100 */
        var contNumeros = document.getElementById('container-numeros');
        if (contNumeros) {
            contNumeros.innerHTML = '';
            for (var i = 1; i <= 100; i++) {
                (function (num) {
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'btn-letra';
                    btn.style.height = '80px';
                    btn.style.fontSize = '2.1rem';
                    btn.innerText = num;
                    btn.onclick = function () { Voz.falar(String(num)); };
                    contNumeros.appendChild(btn);
                })(i);
            }
        }

        /* Navegação entre as 13 abas */
        var botoes = document.querySelectorAll('.btn-tab');
        var conteudos = document.querySelectorAll('.aba-conteudo');
        var menu = document.getElementById('menu-principal');

        for (var j = 0; j < botoes.length; j++) {
            botoes[j].addEventListener('click', function (e) {
                Voz.parar();
                for (var k = 0; k < botoes.length; k++) {
                    botoes[k].classList.remove('active');
                    botoes[k].setAttribute('aria-selected', 'false');
                }
                e.currentTarget.classList.add('active');
                e.currentTarget.setAttribute('aria-selected', 'true');

                var alvo = e.currentTarget.getAttribute('data-target');
                for (var m = 0; m < conteudos.length; m++) {
                    conteudos[m].classList.remove('active');
                    if (conteudos[m].id === alvo) {
                        conteudos[m].classList.add('active');
                        if (alvo === 'aba-escrever' && QuadroInterativo) {
                            setTimeout(function () { QuadroInterativo.redimensionar(); }, 50);
                        }
                    }
                }
                if (window.innerWidth <= 768 && menu) {
                    menu.classList.remove('aberto');
                }
            });
        }

        InteracaoApp.carregarInicial();
        InteracaoApp.carregarPalavra();
        InteracaoApp.carregarNomeSalvo();

        QuadroInterativo = new CanvasCaligrafia('canvas-caligrafia', 'container-canvas', 'guia-fundo');
        QuadroInterativo.redimensionar();

        GerenciadorPerfil.renderizarTabela('todos');
        GerenciadorCookies.verificar();
    }

    window.toggleMenuMobile = toggleMenuMobile;
    window.Voz = Voz;
    window.AppConfig = AppConfig;
    window.InterfaceModal = InterfaceModal;
    window.InteracaoApp = InteracaoApp;
    window.GerenciadorPerfil = GerenciadorPerfil;
    window.ConstrutorSilabas = ConstrutorSilabas;
    window.GerenciadorCookies = GerenciadorCookies;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarTudo);
    } else {
        inicializarTudo();
    }
})();
