# CONTEXTO COMPLETO — PLATAFORMA CERTEIRO
> Arquivo para onboarding de nova sessão no Claude Code.
> Atualizado em: 08/04/2026 — v1.3.0 fechada, repo renomeado para certeiroone

---

## 1. VISÃO GERAL DO PROJETO

**Nome:** Plataforma Certeiro (Certeiro One)
**Dono:** Gabriel Certeiro — Gabriel Certeiro Imóveis, Itajaí/SC
**Conceito:** ERP operacional de exclusividades imobiliárias.

---

## 2. REPOSITÓRIO E DEPLOY

| Item | Valor |
|------|-------|
| Repo principal | `github.com/gabrielcerteiro/certeiroone` |
| Branch | `main` (auto-deploy via Vercel) |
| URL produção | `https://certeiroone.vercel.app` |

---

## 3. ARQUIVOS DO PROJETO

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Dashboard principal — lista em grupos, detalhe, edição, nova exclusividade |
| `registro.html` | Registro de visitas e propostas (SEM criacao de imovel) |
| `vendedor.html` | Relatório para proprietário (link compartilhável) |
| `CONTEXTO_CLAUDE_CODE.md` | Este arquivo — SEMPRE atualizar ao final de cada sessao |

---

## 4. SUPABASE

| Item | Valor |
|------|-------|
| Project ID | `vtykzralkxlbqqkleofl` |
| URL | `https://vtykzralkxlbqqkleofl.supabase.co` |
| Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0eWt6cmFsa3hsYnFxa2xlb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjMyNjAsImV4cCI6MjA4OTkzOTI2MH0.rYBifw2NXqVDGrKbDWKJgrFAIdoruxxsIPc9RXibgy0` |

### 4.1 RLS Policies (ja configuradas)
- `propostas` — INSERT, UPDATE
- `visitas` — INSERT, UPDATE
- `funil_snapshot` — ALL
- `exclusividades` — ALL
- `imoveis` — INSERT, UPDATE

### 4.2 Tabelas

#### `imoveis`
- `id` uuid PK
- `nome`, `proprietario`, `bairro`, `status`, `preco` text
- `ativo` boolean (default true)
- `created_at` timestamptz

**Imoveis no sistema (pos limpeza v1.3.0):**
- Cezanne 1701, Soho 1102, Casa Ressacada n81, Marechiaro 402
- Felicita 802, Felicita 505 (dois apartamentos diferentes)
- Laguna 1202 (encerrada — preencher dados historicos)
- Reserva Perequê 2101 (ativa)
- Smart Sao Joao 506 (ativa)
- Deletados: Lago di Garda 1301 e "teste"

#### `exclusividades`
- `id` uuid PK, `imovel_id` uuid FK → imoveis.id
- `data_inicio` date, `dias_contrato` int (default 120)
- `status` text CHECK ('ativa','encerrada','renovada')
- `observacoes` text, `created_at`, `updated_at` timestamptz

#### `funil_snapshot`
- `id` uuid PK, `exclusividade_id` uuid FK → exclusividades.id
- `imovel_nome`, `proprietario`, `preco` text
- `status_exclusividade` text
  CHECK ('ativa','vendida','perdida','encerrada','repaginacao','aguardando')
- `data_inicio`, `data_fim` date
- `prazo_contrato_dias` int (default 120)
- `prazo_repaginacao_dias` int
- `data_repaginacao_concluida`, `data_gravacao_conteudo`, `data_midia_entregue` date
- `prazo_interno_dias` int
- `meta_leads`, `meta_visitas`, `meta_propostas` int
- `meta_investimento` numeric (default 1500) — NOME CORRETO (nao usar meta_gastos_ads)
- `meta_cpl` numeric (default 65)
- `total_leads`, `total_visitas`, `total_propostas` int — legado/manual
- `leads_abertos`, `leads_perdidos` int
- `leads_meta_ads`, `leads_google_ads`, `leads_instagram_org`, `leads_youtube`,
  `leads_tiktok`, `leads_site_org`, `leads_indicacao`, `leads_corretor_parc`,
  `leads_relacionamento`, `leads_disparo_base`, `leads_oferta_ativa`, `leads_outdoor` int
- `gastos_metaads` numeric, `alcance_metaads` int, `frequencia_metaads` numeric
- `localizacao`, `tipo_imovel` text — tipo: Mobiliado, Vazio, Repaginado
- `atualizado_em` timestamptz, `fonte` text (default 'pipedrive_n8n')
- `midia_total_planejada` numeric — orcamento total do contrato
- `disparos_base`, `impactados_base`, `visitas_base`, `propostas_base` int
- `disparos_parceiros`, `contatados_parceiros`, `visitas_parceiros`, `propostas_parceiros` int
- `data_disparo_base`, `data_disparo_parceiros` date
- `cad_dwv`, `cad_site`, `cat_gabriel`, `cat_rafaela` boolean DEFAULT false
- `video_youtube`, `post_instagram`, `post_tiktok`, `post_facebook` boolean DEFAULT false

#### `visitas`
- `id` uuid PK, `imovel_id` uuid FK → imoveis.id
- `imovel_nome`, `corretor`, `parceiro`, `origem`, `nome_interessado` text
- `data_visita` date, `hora_visita` time
- `objections` text[], `observacoes` text
- `intencao` text ('Quer comprar','Esta pensando','Nao gostou','Quer segunda visita')
- `qualificado_financeiramente` boolean
- `formas_pagamento` text[], `pagto_detalhes` text, `created_at` timestamptz

#### `propostas`
- `id` uuid PK, `imovel_id` uuid FK → imoveis.id
- `nome_interessado` text, `data` date, `valor_proposto` numeric
- `forma_pagamento` text CHECK ('a_vista','financiamento','parcelamento_direto',
  'dacao_a_vista','dacao_financiamento','dacao_parcelamento_direto',
  'parcelamento_direto_financiamento')
- `status` text CHECK ('em_andamento','aceita','recusada','desistiu')
- `observacao` text, `created_at`, `updated_at` timestamptz
- NAO tem coluna `corretor`

#### `corretores`
- Gabriel Certeiro — CRECI 22249/SC
- Robson Souza — CRECI 36145/SC

### 4.3 Views

#### `dashboard_imoveis`
JOIN funil_snapshot + exclusividades + imoveis. Campos calculados:
- `dias_restantes`, `tl_hoje_pct`, `status_repaginacao`, `data_meta_interna`
- `cpl_metaads`, `conv_lead_visita`, `conv_visita_prop`, `dash_status`
- Todos os campos de funil_snapshot
- `count_propostas` — COUNT real (SEMPRE no FINAL do SELECT)

> CRITICO: novos campos na view devem vir DEPOIS de count_propostas.

#### `dashboard_visitas_detalhe`
View de visitas com JOIN em exclusividades para retornar `exclusividade_id`.

---

## 5. ARQUITETURA DO FRONTEND

### Stack
- HTML/CSS/JS puro — zero frameworks
- Supabase JS SDK v2 via CDN
- Font: Nunito Sans (Google Fonts)
- Sem build step

### Design System
```css
:root {
  --navy: #191949;
  --white: #FFFFFF;
  --bg: #F5F5F8;
  --text: #191949;
  --muted: #8E8EA0;
  --s2: #ECECF1;
  --s3: #D9D9E3;
  --green: #10B981;
  --red: #EF4444;
  --yellow: #F59E0B;
  --blue: #3B82F6;
  --card-radius: 14px;
}
```

### Padroes visuais
- **Icones:** SVG inline estilo Lucide. ZERO emojis.
- **Labels de secao:** uppercase, font-size 11px, letter-spacing 1px, cor --muted
- **Badges de status:**
  - ativa: bg #D1FAE5, texto #065F46
  - vendida: bg #DBEAFE, texto #1E40AF
  - repaginacao: bg #FEF3C7, texto #92400E
  - aguardando/encerrada: bg #F3F4F6, texto #6B7280
- **Border-left icards:** ativa dash_status, repaginacao --yellow, aguardando --muted, vendida --green
- **Inputs:** border 1px solid --s3, border-radius 8px, padding 10px 12px
- **Botao primario:** background --navy, texto branco
- **Botao destrutivo:** border 1px solid --red, texto --red, sem fundo
- **Bottom-nav PWA:** height 64px + env(safe-area-inset-bottom), icones 24px

### Layout
- **Mobile** (< 900px): bottom-nav fixa, coluna única, max-width 480px
- **Desktop** (>= 900px): sidebar esquerda + grid 3 colunas para cards EM CAMPANHA

---

## 6. NAVEGAÇÃO

### Icones SVG (Lucide)
- Alertas: bell | Exclusividades: home | Registro: clipboard-list
- Mais: more-horizontal | Captacao: target | Vendas: trending-up
- Marketing: megaphone | Conteudo: film | Financeiro: bar-chart-2
- Usuarios: user | Sair: log-out

---

## 7. FLUXO DE CRIACAO DE EXCLUSIVIDADE

Modal "+ Nova Exclusividade" no index.html.
Campos: Nome, Proprietario, Bairro (Fazenda/Praia Brava/Ressacada/Outro),
Tipo (Mobiliado/Vazio/Repaginado), Preco, Data inicio,
Prazo (120/180 dias), Tem repaginacao?, Status inicial (ativa/repaginacao/aguardando)
INSERT sequencial: imoveis → exclusividades → funil_snapshot

> registro.html NAO tem criacao de imovel.

---

## 8. DASHBOARD — GRUPOS (v1.3.0)

### GRUPO 1 — EM CAMPANHA (status = 'ativa')
Cards completos. Grid 3 colunas no desktop, de fora a fora.

### GRUPO 2 — EM REPAGINACAO (status = 'repaginacao')
Card simplificado: nome, proprietario, preco, barra de progresso, Ver detalhe.

### GRUPO 3 — AGUARDANDO (status = 'aguardando')
Card minimalista: nome, proprietario, tag aguardando, Ver detalhe.

### GRUPO 4 — VENDIDAS (status = 'vendida')
Oculto por padrao, expande ao clicar. NAO conta no VGV.
Base historica para indicadores futuros.

Grupo vazio nao exibe titulo.

---

## 9. MÓDULOS

### index.html — funcoes principais
- `loadDashboard()`, `saveSnapshot()`, `salvarNovaExcl()`
- `funilBarras(im)`, `excluirExclusividade()`, `_doExcluirExclusividade()`
- `disparosBaseHtml(im)`, `disparosParcHtml(im)`
- `salvarDisparosBase(id)`, `salvarDisparosParc(id)`
- `toggleAcaoVenda(id, key, current)`, `acoesVendaHtml(im)`

### registro.html
- Visitas e propostas: cadastrar, editar, excluir
- Payload de proposta NAO inclui `corretor`
- Protecao contra duplo envio

### vendedor.html
- Relatorio publico por `?id=<exclusividade_id>&from=internal`

---

## 10. FUNIL — LÓGICA DE BARRAS

```
fator = diasPassados / diasTotal
esperado = Math.round(meta * fator)
```
Verde >= esperado | Amarelo >= 80% | Vermelho < 80%

---

## 11. HISTORICO DE VERSOES

### v1.0.0 — 06/04/2026
Pipeline, alertas, timeline, registro, relatorio vendedor, autenticacao.

### v1.1.0 — 07/04/2026
RLS configurado. Propostas salvando. Funil com dados reais.
Nova exclusividade, disparos, acoes de venda, midia planejada vs realizada.
Editar e excluir visitas e propostas. Protecao contra duplo envio.

### v1.2.0 — 07/04/2026
Visual estilo Pipedrive. Fluxo de criacao unificado no Dashboard.

### v1.2.1 — 07/04/2026
Corrigido: painel de propostas no Registro nao exibia registros.

### v1.3.0 — 08/04/2026
Dashboard em 4 grupos. Grid 3 colunas. Barra de topo simplificada.
Novos status: repaginacao e aguardando.
URL: certeiroone.vercel.app. Repo: github.com/gabrielcerteiro/certeiroone.
Banco: criados Laguna 1202, Reserva Perequê 2101, Smart Sao Joao 506.
Banco: deletados Lago di Garda 1301 e registros de teste.

---

## 12. PENDENCIAS ATIVAS — v1.3.1

### Alta prioridade
- [ ] Botao excluir no formulario de edicao (vEdit)
- [ ] Campo status inicial no modal de nova exclusividade
- [ ] Aba Analise: tabela de disparos consolidados para a Rafaela
- [ ] Cadastro de usuarios via Edge Function (service_role)
- [ ] Anon Key exposta no repositorio — mover para variavel de ambiente
- [ ] Controle de acesso por role no frontend

### Media prioridade
- [ ] Repositorio privado no GitHub
- [ ] Branches para desenvolvimento
- [ ] Logs de auditoria + Backup automatizado documentado

### Backlog futuro
- [ ] Modulo Analise completo, Modulo Vendas, Modulo Financeiro
- [ ] Migrar index.html para modulos separados
- [ ] Testes automatizados antes do deploy

---

## 13. CONTEXTO OPERACIONAL

- **Equipe:** Gabriel Certeiro + Robson Souza + Rafaela
- **Foco:** imoveis R$630K–R$3M+ em Itajai/SC
- **Stack:** GHL + WhatsApp API + n8n + Pipedrive + Supabase + Vercel

---

## 14. REGRAS DE EDICAO

SEMPRE fazer `get_file_contents` antes de editar — obter SHA atual.
Verificar integridade do index.html antes de editar (historico de truncamento).
Nunca usar SHA de memoria.

---

## 15. ATUALIZAR ESTE ARQUIVO AO FINAL DE CADA SESSAO

1. Registrar versao entregue no historico (secao 11)
2. Atualizar funcoes alteradas (secao 9)
3. Remover pendencias concluidas da secao 12
4. Fazer push junto com os demais arquivos alterados
