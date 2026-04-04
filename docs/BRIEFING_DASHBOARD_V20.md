# INSTRUCAO DE EXECUCAO — Dashboard v20
# Gabriel Certeiro — Dashboard Operacional de Exclusividades

---

## INSTRUCAO PARA O CLAUDE (NOVA CONVERSA)

Voce vai implementar o layout v20 do dashboard operacional no repositorio `gabrielcerteiro/dashboard-certeiro`.

**PASSO 1:** Leia o arquivo `index.html` atual do repositorio `gabrielcerteiro/dashboard-certeiro` (branch `main`). Esse e o dashboard que esta em producao. O deploy e automatico via Vercel.

**PASSO 2:** Leia os mockups de referencia que estao no mesmo repositorio:
- `docs/mockups/funil_v10_card_resumo.jsx` — layout do card resumo (React JSX de referencia)
- Este arquivo contem toda a especificacao do layout da tela de detalhe (v20) logo abaixo

**PASSO 3:** Reescreva as funcoes `renderCard()` e `renderDetail()` do `index.html` para implementar o novo layout conforme as specs abaixo. Mantenha toda a estrutura existente (navegacao, views, Supabase, alertas, edicao, etc.). Altere APENAS o card resumo e a tela de detalhe.

**PASSO 4:** Adicione uma query a tabela `visitas` do Supabase para alimentar os dados de visitas na tela de detalhe. A tabela ja existe e e populada pelo site `visitas.gabrielcerteiro.com.br`.

**PASSO 5:** Antes de fazer push, valide que o conteudo do arquivo NAO tem: unicode escapes, acentos dentro do JS, barras invertidas extras. Se tiver, corrija. Se a API do GitHub corromper, gere o arquivo para download manual.

**PASSO 6:** Faca push do `index.html` atualizado via GitHub API.

---

## CUIDADOS CRITICOS (LER ANTES DE TUDO)

Na tentativa anterior de atualizar este arquivo, o conteudo ficou corrompido. As causas foram:

1. Caracteres unicode escapados apareceram dentro do JS (ex: `\\u00ed` em vez de texto limpo)
2. Barras invertidas nos fechamentos de tag (`<\\/` em vez de `</`)
3. Acentos dentro de blocos `<script>` quebraram na serializacao JSON da API do GitHub

**Regras obrigatorias:**
- **ZERO acentos dentro de blocos `<script>`** — usar apenas ASCII puro no JavaScript. Se precisar de texto com acento, usar HTML entities ou manter fora do JS
- **Emojis como HTML entities** (ex: `&#128202;` em vez do emoji literal)
- **Sem barras invertidas nos fechamentos de tag** — usar `</` normal
- **Validar o conteudo do arquivo antes de fazer push** — verificar que nao ha corrupcao
- **Se a API do GitHub corromper, gerar o arquivo para download manual**

---

## ARQUITETURA

- **Frontend:** HTML/CSS/JS puro (arquivo unico `index.html`)
- **Backend:** Supabase (mesma instancia do site de visitas)
  - URL: `https://vtykzralkxlbqqkleofl.supabase.co`
  - Key anon: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0eWt6cmFsa3hsYnFxa2xlb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjMyNjAsImV4cCI6MjA4OTkzOTI2MH0.rYBifw2NXqVDGrKbDWKJgrFAIdoruxxsIPc9RXibgy0`
- **Font:** Nunito Sans (Google Fonts)
- **Repositorio:** `gabrielcerteiro/dashboard-certeiro`
- **Deploy:** Vercel (automatico ao push na main)

---

## PALETA DE CORES

```
navy: #191949
white: #FFFFFF
bg: #F5F5F8
text: #191949
muted: #8E8EA0
s2: #ECECF1
s3: #B0B0BE
green: #10B981
greenBg: rgba(16,185,129,0.08)
red: #EF4444
redBg: rgba(239,68,68,0.08)
yellow: #F59E0B
yellowBg: rgba(245,158,11,0.08)
blue: #3B82F6
blueBg: rgba(59,130,246,0.08)
```

---

## O QUE MANTER DO DASHBOARD ATUAL

- Header navy com nome + data
- Card de VGV em carteira (topo navy)
- Stats row (Total | Em Venda | Com Proposta)
- Bottom navigation (Alertas, Imoveis, Captacao, Vendas, Mkt, Content)
- Tela de alertas
- Telas "coming soon" (Captacao, Vendas, Marketing, Conteudo)
- Tela de edicao (formulario de atualizacao manual dos dados)
- Conexao com Supabase (client ja existe)
- Logica de calculos (VGV, proporcional, etc.)

## O QUE MUDAR

- **Card resumo:** substituir `renderCard()` pelo layout v10 (4 barras proporcionais + midia/CPL + borda lateral colorida pelo pior indicador)
- **Tela de detalhe:** substituir `renderDetail()` pela v20 completa (todas as 12 secoes descritas abaixo)
- **Dados de visitas:** adicionar query a tabela `visitas` do Supabase para alimentar secoes 9-12 automaticamente

---

## CARD RESUMO DE EXCLUSIVIDADE (layout v10)

O mockup JSX completo esta em `docs/mockups/funil_v10_card_resumo.jsx` no repositorio. Leia esse arquivo.

**Resumo:**
- Header: Nome (uppercase, 13px, weight 800) + Preco (15px, weight 800) — mesma linha, space-between
- 4 barras identicas: Tempo, Leads, Visitas, Propostas
  - Cada barra: label (58px) + barra (height 7px) + numeros (real / esperado de total)
  - Barra clara = esperado proporcional (cor do semaforo, opacity 0.18)
  - Barra solida = realizado (cor do semaforo cheia)
  - Marcador vertical no ponto esperado (2px navy)
  - Barra de Tempo: navy opacity 0.35, sem marcador, sem semaforo
- Semaforo: verde >= meta, amarelo >= 80%, vermelho < 80%
- Linha Midia + CPL: Ads R$ X / Y de Z | CPL R$ X ref. Y
- Borda lateral esquerda 4px = cor do pior indicador
- Acoes: "Atualizar" (navy) | "Ver detalhe ->" (blue)
- Calculo proporcional: esperado = Math.round(meta * diasPassados / diasTotal)

---

## TELA DE DETALHE DA EXCLUSIVIDADE (layout v20)

### Header
- Botao "Voltar" (blue, com seta SVG)
- Nome + Preco (mesma linha)
- **"Ultima visita ha X dias"** — cor: muted se <=7d, amarelo se 8-14d, vermelho se 15+d
- Calcular X = dias desde a data_visita mais recente na tabela `visitas` para aquele imovel

### Secao 1: FUNIL
Mesmo layout do card resumo: 4 barras (Tempo, Leads, Visitas, Propostas) + linha Midia/CPL
Dentro de um card branco (border-radius 14px, padding 16px, margin-bottom 14px)

### Secao 2: TIMELINE OPERACIONAL
Timeline vertical com 10 marcos:
1. Autorizacao assinada
2. Imovel repaginado (quando houver)
3. Material pronto
4. Disparo para base
5. Disparo para parceiros
6. Campanha no ar
7. Primeira visita
8. Primeira proposta
9. Prazo final meta
10. Prazo final autorizacao

Cada marco:
- Dot 12px (verde=ok, cinza=pendente, vermelho=atrasado) com box-shadow 3px
- Linha vertical 2px conectando dots
- Label (12px, weight 700) + data (10px, muted)
- Lado direito: "meta Xd -> real Yd" com badge de atraso/antecipacao

### Secao 3: ACOES DE VENDA (checklist)
- Header: titulo + barrinha de progresso (40px largura, 5px altura) + score X/Y
- Cor da barra: verde >=80%, amarelo >=50%, vermelho <50%
- Lista de items com checkbox visual (16x16px, border-radius 4px):
  - Cadastrado no DWV
  - Cadastrado no site
  - No catalogo do Gabriel
  - No catalogo da Rafaela
  - Video no YouTube
  - Postagem Instagram
  - Postagem TikTok
  - Postagem Facebook

### Secao 4: CANAIS DE AQUISICAO
Tabela HTML `<table>` nativa com 7 colunas que CABEM SEM SCROLL horizontal:
| Canal (22%) | Inv. (13%) | Ld (9%) | Vis (9%) | Pr (9%) | C/Vis (19%) | C/Pr (19%) |

10 canais: Meta Ads, Google Ads, YouTube, TikTok, Site/Org., Insta Org., Indicacao, Disp. base, Oferta ativa, Parceria

Linha Total: border-top 2px navy, com custos consolidados
C/Vis = investimento / visitas (por canal). C/Pr = investimento / propostas. Mostrar "-" se divisao por zero.
Font: header 7px, cells 8.5-9px, nomes canais 9px

### Secao 5: DISPAROS PARA BASE
Mini-funil horizontal: 4 numeros em linha com setinha "→" entre cada:
Disparos -> Impactados -> Visitas -> Propostas
Numeros: 16px weight 900. Labels: 7.5px uppercase muted
Conversao embaixo: "Conversao: X%" (Impactados->Visitas)

### Secao 6: DISPAROS PARA PARCEIROS
Mini-funil horizontal: Disparos -> Contatados -> Visitas -> Propostas
Conversao embaixo: (Contatados->Visitas %)

### Secao 7: CAMPANHA META ADS
3 boxes lado a lado (flex, gap 8px): Anuncios | Alcance | Freq.
Cada box: bg #F5F5F8, border-radius 10px, padding 10px 8px, text-align center
Label 8px muted uppercase. Valor 15px weight 900.

### Secao 8: CONVERSOES
2 boxes lado a lado (flex, gap 8px):
- Lead -> Visita: valor% (18px weight 900)
- Visita -> Proposta: valor%
Bg #F5F5F8, border-radius 10px

### Secao 9: PERFORMANCE POR CORRETOR
Lista de corretores. Cada item:
- Avatar: circle 28px, bg navy, iniciais brancas (10px weight 800)
- Nome: 11px weight 700
- Visitas: numero 14px weight 900 + label "VISITAS" 7.5px muted
- Propostas: numero 14px weight 900 (verde se >0, muted se 0) + label "PROPOSTAS"

**REGRA DE AGRUPAMENTO:** O campo `corretor` no Supabase contem "Gabriel Certeiro", "Rafaela Ariadrina" ou "Robson Souza".
- "Gabriel Certeiro" + "Rafaela Ariadrina" = agrupar como "Gabriel Certeiro" (time interno)
- "Robson Souza" = separado
- Qualquer outro = "Outro"

Proposta = visita onde intencao === "Quer comprar"

### Secao 10: INTENCAO POS-VISITA
Barras horizontais com percentual — agregado de TODAS as visitas daquele imovel
Categorias: Quer comprar, Esta pensando, Nao gostou, Quer segunda visita
Cada barra: label (90px) + barra (cor navy, opacity 0.75) + pct% (10px weight 800) + count (9px muted)
Titulo: "Intencao pos-visita (X visitas)"

### Secao 11: PRINCIPAIS OBJECOES
Barras horizontais VERMELHAS — agregado de todas as visitas
Categorias dinamicas baseadas no campo `objections` (array jsonb) de cada visita
Ordenar por frequencia decrescente
Mesmo layout visual da secao 10, mas cor vermelha

### Secao 12: RELATORIO DE VISITAS
Lista completa de visitas individuais. Cada item:
- Avatar: circle 30px, cor baseada em hash do nome, inicial branca
- Nome (12px weight 700) + "data - origem" (10px muted)
- Badge de intencao (9px weight 700, border-radius 10px):
  - Quer comprar: verde bg/cor
  - Esta pensando: amarelo
  - Nao gostou: vermelho
  - Segunda visita: azul
- Tags de objecoes (pills: 9px, padding 2px 7px, border-radius 8px, bg #F5F5F8, navy)
- Forma de pagamento (10px muted, se houver)
- Observacoes (10px, bg #F5F5F8, border-radius 6px, padding 6px 8px)

---

## DADOS DO SUPABASE

### Tabela `visitas` (ja existente — populada pelo site visitas.gabrielcerteiro.com.br)
Campos:
- `imovel_id` (uuid) — FK para tabela imoveis
- `imovel_nome` (text)
- `data_visita` (date)
- `hora_visita` (time)
- `corretor` (text) — "Gabriel Certeiro", "Rafaela Ariadrina" ou "Robson Souza"
- `parceiro` (text, nullable)
- `origem` (text) — um dos 10 canais
- `nome_interessado` (text)
- `objections` (jsonb array de strings)
- `observacoes` (text)
- `intencao` (text) — "Quer comprar", "Esta pensando", "Nao gostou", "Quer segunda visita"
- `qualificado_financeiramente` (boolean)
- `formas_pagamento` (jsonb array de strings)
- `pagto_detalhes` (text, nullable)

### Tabela `imoveis` (ja existente)
Campos: `id`, `nome`, `proprietario`, `bairro`, `status`, `preco`, `ativo`

### View/Tabela `dashboard_imoveis` (ja existente — usada pelo dashboard atual)
Contem dados da exclusividade: datas, metas, funil, timeline, campanha.
Verificar estrutura exata lendo o `index.html` atual.

### Como carregar visitas
Adicionar ao `loadDashboard()`:
1. Depois de carregar imoveis, fazer query: `sb.from('visitas').select('*').order('data_visita', {ascending: false})`
2. Agrupar por `imovel_id` ou `imovel_nome` num mapa
3. Passar o array de visitas para `renderDetail()`

---

## FLUXO DE IMPLEMENTACAO

1. Leia `index.html` do GitHub (`gabrielcerteiro/dashboard-certeiro`, branch `main`)
2. Leia `docs/mockups/funil_v10_card_resumo.jsx` do mesmo repositorio
3. Entenda a estrutura existente (views, navegacao, Supabase client, funcoes JS)
4. Reescreva `renderCard()` seguindo o mockup v10
5. Reescreva `renderDetail()` implementando TODAS as 12 secoes da v20
6. Adicione query a tabela `visitas` no Supabase
7. Gere o HTML completo — SEM ACENTOS NO JS, SEM EMOJIS LITERAIS, SEM CORRUPCAO
8. Valide o conteudo (grep por unicode escapes, acentos, barras invertidas extras)
9. Push via GitHub API (ou gere arquivo para download se API corromper)

---

FIM DO BRIEFING.
