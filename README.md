# 🎓 PhoneticFace — Plataforma de Alfabetização Fônica e Gestão Pedagógica (EJA)

![Status do Projeto](https://img.shields.io/badge/Status-Em_Produção-28A745?style=for-the-badge)
![Alinhamento MEC](https://img.shields.io/badge/Alinhamento-Programa_Brasil_Alfabetizado-007AFF?style=for-the-badge)
![Desafio EPT](https://img.shields.io/badge/Desafio_EPT-2026-FFCC00?style=for-the-badge&logoColor=black)
![Acessibilidade](https://img.shields.io/badge/Acessibilidade-WCAG_Alto_Contraste_%26_Voz-7C3AED?style=for-the-badge)

> **Tecnologia educacional (EdTech / GovTech) desenvolvida para acelerar a alfabetização fônica de jovens, adultos e idosos (EJA), integrando aprendizagem multissensorial para o estudante e monitoramento pedagógico em tempo real para o professor.**

---

## 📌 Sobre o Projeto

O **PhoneticFace** nasceu para solucionar dois grandes desafios da Educação de Jovens e Adultos (EJA) no Brasil: a necessidade de uma **metodologia fônica visual e auditiva acessível** fora do horário escolar e a falta de **indicadores pedagógicos claros** para que o professor acompanhe onde cada aluno está travando.

Alinhado às diretrizes do **Programa Brasil Alfabetizado (PBA)**, o sistema funciona direto no navegador — em **Celulares, Tablets e Computadores** — sem exigir instalação complexa, garantindo inclusão digital imediata para estudantes de qualquer faixa etária.

---

## 🚀 Principais Funcionalidades

### 👨‍🎓 1. Ambiente do Aluno (13 Módulos Fônicos Interativos)
1. **Sons das Letras (A a Z):** Teclado alfabético interativo com pronúncia imediata e vídeo demonstrativo da articulação fônica gravado pela equipe docente.
2. **Vogais e Consoantes:** Diferenciação prática entre sons vocálicos abertos e sons consonantais.
3. **Som Inicial:** Jogo de associação auditiva e visual para identificar o fonema inicial de palavras do cotidiano.
4. **Unindo Sons:** Laboratório interativo de formação de famílias silábicas (`Consoante + Vogal`).
5. **Formar Sílabas:** Visualização lógica da soma sonora com áudio contextualizado.
6. **Formar Palavras:** Desafio progressivo de ordenação silábica com dezenas de palavras.
7. **Traçado Digital Inteligente (Caligrafia):** Quadro interativo em `HTML5 Canvas` com **validação geométrica por máscara de pixels**, que identifica se o estudante contornou a letra corretamente ou se riscou fora do molde.
8. **Cores:** Reconhecimento visual e auditivo de 18 cores com contraste adaptado.
9. **Meu Nome (Identidade e Cidadania):** Treino de digitação e reconhecimento do próprio nome com salvamento local.
10. **Leitura Prática do Dia a Dia:** Letramento funcional com textos reais (Receita Médica, Letreiro de Ônibus, Lista de Mercado e Ficha de Academia).
11. **Expansão de Vocabulário:** Cartões interativos ilustrados com áudio em português.
12. **Números de 1 a 100:** Grade numérica completa com leitura em voz alta para autonomia matemática e financeira.
13. **Equipe Docente:** Apresentação institucional das docentes formadoras atuantes no projeto.

---

### 👨‍🏫 2. Painel de Gestão do Professor (Dashboard Pedagógico)
* **Métricas da Turma em Tempo Real:** Indicadores de alunos ativos, total de tarefas realizadas no dia, módulos com maior índice de dúvida e alunos que precisam de auxílio no manuseio do celular.
* **Filtros Inteligentes:** Segmentação rápida entre todos os alunos, estudantes com dificuldade em tarefas fônicas, alunos que precisam de ajuda para mexer no aplicativo e alunos em ritmo avançado.
* **Ficha Individual do Aluno:** Relatório detalhado do que cada estudante fez no dia, diagnóstico pedagógico, leitura do relatório em voz alta e botão para **impressão/exportação em PDF**.

---

## ♿ Acessibilidade e Inclusão Digital

Projetado especificamente para o público da EJA e pessoas com baixa visão ou pouca familiaridade tecnológica:
* 🔊 **Instruções 100% Narradas:** Uso da `Web Speech API` (`pt-BR`) em todos os módulos, botões e feedbacks de acerto ou erro.
* 🌓 **Modo de Alto Contraste:** Alternância instantânea para o padrão de acessibilidade visual (fundo preto absoluto `#000000` com elementos em amarelo de alta visibilidade `#FFFF00`).
* 🔍 **Zoom Tipográfico Dinâmico (`A+` / `A-`):** Ampliação proporcional de toda a interface sem quebrar o layout.
* 📱 **Design Responsivo Automático:** Adaptação fluida para telas de **Computador**, **Tablet** e **Celular**.

---

## 🛠️ Arquitetura e Tecnologias Utilizadas

O projeto foi construído seguindo boas práticas de **Engenharia de Software Front-End**, priorizando desempenho, zero dependências pesadas e carregamento instantâneo em redes móveis:

* **HTML5 Semântico & WAI-ARIA:** Estrutura acessível com suporte a leitores de tela e navegação lógica.
* **CSS3 Moderno:** Uso de *CSS Custom Properties* (variáveis de tema), *CSS Grid*, *Flexbox* e *Media Queries* para responsividade multiplataforma.
* **JavaScript Vanilla (ES6+):**
  * **HTML5 Canvas 2D API:** Motor de caligrafia com comparação matricial de pixels (`getImageData`) para validação real do traçado das letras.
  * **Web Speech API (`speechSynthesis`):** Sintetizador de voz nativo sem custo de servidor externo.
  * **Web Storage API (`localStorage`):** Persistência segura da identidade e do progresso da sessão do estudante.

---

## 📂 Estrutura de Arquivos do Repositório

```text
📦 phoneticface
 ┣ 📜 index.html        # Estrutura principal, portal Aluno/Professor e motor integrado
 ┣ 📜 style.css         # Folha de estilos, temas de alto contraste e responsividade
 ┣ 📜 app.js            # Lógica modular de jogos, voz, caligrafia e painel docente
 ┣ 🖼️ kaiologoteste.jpg # Logotipo oficial do projeto PhoneticFace
 ┣ 🖼️ imgem1.jpg        # Foto institucional - Equipe Docente (Poliana)
 ┣ 🖼️ imgem2.jpg        # Foto institucional - Equipe Docente (Mirella)
 ┣ 🖼️ imgem3.jpg        # Foto institucional - Equipe Docente (Maria Eduarda)
 ┗ 📜 README.md         # Documentação oficial do repositório
