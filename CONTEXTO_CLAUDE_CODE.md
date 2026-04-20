# CONTEXTO COMPLETO — PLATAFORMA CERTEIRO
> Arquivo para onboarding de nova sessao no Claude Code.
> Atualizado em: 19/04/2026 — v1.5.5 entregue
>
> REGRA DE VERSIONAMENTO: git tag e Google Doc usam SEMPRE o mesmo numero. Sem consolidacao, sem granularidade desalinhada.

---

## 0. SKILL DE FRONTEND — LER ANTES DE QUALQUER TRABALHO VISUAL

Skill instalado em `~/.claude/skills/frontend-design/SKILL.md`.
OBRIGATORIO antes de qualquer HTML/CSS. Sem excecao.

### Padrao de layout global (classes no nav.js)
```css
.cn-form   { max-width: 760px; margin: 0 auto; }
.cn-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.cn-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.cn-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
.cn-full   { grid-column: 1 / -1; }
```
Aplicar cn-form em TODOS os formularios de edicao.
Campos curtos: cn-grid-3/4 | Campos medios: cn-grid-2 | Longos: cn-full.

---

## 1. VISAO GERAL DO PROJETO

**Nome:** Plataforma Certeiro (Certeiro One)
**Dono:** Gabriel Certeiro — Gabriel Certeiro Imoveis, Itajai/SC
**Conceito:** ERP operacional de exclusividades imobiliarias.

---

## 2. REPOSITORIO E DEPLOY

| Item | Valor |
|------|-------|
| Repo principal | `github.com/gabrielcerteiro/certeiroone` |
| Branch | `main` (auto-deploy via Vercel) |
| URL producao | `https://certeiroone.vercel.app` |

---

## 3. ARQUIVOS DO PROJETO

| Arquivo | Descricao |
|---------|-----------|
| `pipeline.html` | Porta de entrada: dashboard executivo + TMM header + 6 grupos de cards (v10, resumido, historico) |
| `index.html` | Redirect minimo para pipeline.html (meta refresh + location.replace) |
| `exclusividades.html` | Modulo principal: pipeline, grupos, detalhe, edicao. Hash routing #detalhe/UUID e #editar/UUID abrem modal automaticamente |
| `vendas.html` | Modulo de vendas: listagem, registro, edicao |
| `repaginacao.html` | Gestao de obras de repaginacao: cards, abas, Gantt, orcamento |
| `registro.html` | Registro de visitas e propostas |
| `usuarios.html` | Gestao de usuarios |
| `detalhe.html` | Detalhe operacional por exclusividade (14 blocos) — acesso via detalhe.html?id=UUID |
| `vendedor.html` | Relatorio publico para proprietario |
| `nav.js` | Sidebar + CSS global (cn-form, cn-grid-*) — importado por todas as paginas |
| `CONTEXTO_CLAUDE_CODE.md` | Este arquivo — SEMPRE atualizar ao final de cada sessao |

---

## 4. SUPABASE

| Item | Valor |
|------|-------|
| Project ID | `vtykzralkxlbqqkleofl` |
| URL | `https://vtykzralkxlbqqkleofl.supabase.co` |
| Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0eWt6cmFsa3hsYnFxa2xlb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjMyNjAsImV4cCI6MjA4OTkzOTI2MH0.rYBifw2NXqVDGrKbDWKJgrFAIdoruxxsIPc9RXibgy0` |

### 4.1 Status validos (constraints atualizadas 13/04/2026)

funil_snapshot.status_exclusividade:
  ativa | gestao | repaginando | aguardando | vendida | perdida

exclusividades.status:
  ativa | gestao | repaginando | aguardando | vendida | perdida

REMOVIDOS: encerrada, inativa, renovada

### 4.2 Tabelas principais

**Codigos sequenciais (v1.5.4):**
- `visitas.codigo` — integer UNIQUE, sequence `visitas_codigo_seq`, exibido como VS0001, VS0002...
- `propostas.codigo` — integer UNIQUE, sequence `propostas_codigo_seq`, exibido como P0001, P0002...
- `disparos.codigo` — integer UNIQUE, sequence `disparos_codigo_seq`, exibido como DS0001, DS0002...
- Padding de 4 digitos padrao do projeto (igual a numero_controle de vendas V0349)
- Helper global: `window.fmtCodigo(prefix, num)` e `window.parseCodigoBusca(termo)` em nav.js

#### `funil_snapshot` — campos relevantes
- `status_exclusividade` — ver constraint acima
- `tipo_imovel` — Mobiliado | Vazio | Repaginado (usado no calculo do TMM)
- `prazo_interno_dias` — meta interna de vendas (NAO usar para TMM)
- `atualizado_em` timestamptz — usado para indicador "sem atualizacao"
- Todos os campos de leads por canal (leads_meta_ads, leads_google_ads, etc.)
- Todos os campos de disparos (disparos_base, disparos_parceiros, etc.)

#### `vendas` — 94 registros historicos + novos
- `numero_controle` UNIQUE — sequencial V0001, V0002...
- Ultimo numero: V0348. Proximo: V0349.
- `vgv` GENERATED ALWAYS (valor_honorarios / 0.05) — NUNCA incluir em INSERT/UPDATE
- `tipo_participacao`: 'corretor' (padrao 6%) ou 'gestao' (~1%)

### 4.3 Views
- `dashboard_imoveis` — JOIN funil_snapshot + exclusividades + imoveis
- `count_propostas` sempre no FINAL do SELECT da view

---

## 5. LOGICA DE NEGOCIO CRITICA

### TMM (Tempo Medio de Mercado)
Formula: TMM = preco × (30 / dias_tipo)
NAO usa honorarios. NAO usa prazo_interno_dias.

```javascript
function diasTMM(im) {
  var tipo = (im.tipo_imovel || '').toLowerCase();
  if (tipo.indexOf('repag') >= 0) return 40;
  if (tipo.indexOf('mob') >= 0) return 80;
  return 120; // Vazio
}
var tmmVal = parsePrecM(im.preco) * 1000000 / (diasTMM(im) / 30);
if (im.status_exclusividade === 'gestao') tmmVal = tmmVal / 5;
```

Validacao:
- Soho 1102 (Vazio, R$ 2.200.000)       → R$ 550.000/mes
- Casa Ressacada (Mobiliado, R$ 3.100.000) → R$ 1.162.500/mes
- Marechiaro 402 (Mobiliado, R$ 3.500.000) → R$ 1.312.500/mes

Meta TMM: R$ 5.800.000/mes (fixo, hardcoded).
Barra de progresso: TMM_ativo / 5.800.000. Verde >= 100%, Amarelo 70-99%, Vermelho < 70%.
TMM futuro = soma TMM de repaginando + aguardando (exibido separado, nao entra na meta).

### Formato de preco
Precos devem ser armazenados como "3.100.000" (com pontos, sem M).
parsePrecM("3.100.000") = 3.1 (retorna em milhoes).
NUNCA armazenar com sufixo M (ex: "1.750M" causa erro no calculo).

### Numero de controle de vendas
Ordenar por numero_controle DESC para sugerir o proximo:
```javascript
var r = await sb.from('vendas').select('numero_controle')
  .order('numero_controle', { ascending: false }).limit(1);
```

### Arquitetura de leads (v1.5.1+)

A tabela public.leads e espelho do Pipedrive via n8n.
Nao manipular diretamente neste projeto — apenas consultar via dashboard_imoveis.

Campos relevantes de public.leads:
- id-pipedrive: unique, chave de ligacao com Pipedrive
- exclusividade_id: FK para exclusividades
- nome, origem (15 canais), etapa, data_entrada

A view dashboard_imoveis agrega leads via LATERAL JOIN:
- total_leads: COUNT(*)
- leads_abertos: etapa != 'Fechamento'
- leads_perdidos: etapa == 'Fechamento'
- Breakdown por canal: leads_meta_ads, leads_google_ads, leads_instagram, leads_youtube, leads_tiktok_ads, leads_tiktok_org, leads_site, leads_facebook, leads_whatsapp, leads_indicacao, leads_corretor_parc, leads_relacionamento, leads_disparo_base, leads_oferta_ativa, leads_outdoor

IMPORTANTE:
- total_leads e calculado, NUNCA editar em form
- meta_leads, meta_visitas, meta_propostas continuam editaveis manualmente em funil_snapshot

---

## 6. ARQUITETURA DO FRONTEND

### Stack
HTML/CSS/JS puro | Supabase JS SDK v2 CDN | Nunito Sans | Sem build step

### Design System
```css
:root {
  --navy:#191949; --white:#FFFFFF; --bg:#F5F5F8; --text:#191949;
  --muted:#8E8EA0; --s2:#ECECF1; --s3:#D9D9E3;
  --green:#10B981; --red:#EF4444; --yellow:#F59E0B; --blue:#3B82F6;
  --card-radius:14px;
}
```

### Grupos do pipeline (exclusividades.html)
Ordem: EM CAMPANHA → GESTAO → EM REPAGINANDO → AGUARDANDO → VENDIDAS (colapsado) → PERDIDAS (colapsado)

Badges:
- ativa: #D1FAE5 / #065F46
- gestao: #EDE9FE / #5B21B6
- repaginando: #FEF3C7 / #92400E
- aguardando: #F3F4F6 / #6B7280
- vendida: #DBEAFE / #1E40AF
- perdida: #FEE2E2 / #991B1B

### Regras de permissao de edicao
Botao Atualizar/Editar aparece em TODOS os status para roles master e operacional.
O status NAO bloqueia edicao — apenas a role bloqueia.

---

## 7. NAVEGACAO

Sidebar via nav.js. Hash routing interno:
- exclusividades.html#lista | #alertas | #analise | #detalhe/UUID | #editar/UUID

---

## 8. HISTORICO DE VERSOES

### v1.5.5 — 19/04/2026
- Corrigido: edicao de exclusividades pelo modal nao persistia (meta, prazo, datas, valor)
  - imovelData.nome usava `|| null` em campo NOT NULL — corrigido para fallback no currentRec.imovel_nome
  - excData.dias_contrato usava `parseInt() || null` em campo NOT NULL — corrigido para fallback 120
  - snapData nao incluia imovel_nome (NOT NULL em funil_snapshot) — adicionado defensivamente
- Corrigido: dropdown de exclusividades no cadastro de disparo aparecia vazio
  - dashboard_imoveis tem coluna `nome` (nao `imovel_nome`); query estava selecionando coluna inexistente
  - Corrigido: select/order/referencias de imovel_nome -> nome em registro.html
- Renomeado: menu lateral "Registro" -> "Atividades" (nav.js + titulo/auth-sub de registro.html)
- UX Pipeline: removido botao "+ Nova exclusividade" da barra superior
- UX Pipeline: removida linha duplicada de cards numericos (stat-box row)
- UX Pipeline: VGV em Carteira movido para barra superior compacta (ph-vgv-lbl/ph-vgv-val)
- UX Pipeline: TMM e Pipeline futuro agora exibem formato completo R$ X.XXX.XXX (sem K/M)
- Simplificado: campo intencao no wizard de visita de 4 -> 3 opcoes
  (Tem interesse no imovel / Ainda nao se posicionou / Descartou o imovel)
- Migracao banco: 18 registros de visitas.intencao migrados para 3 novos valores
  (Ainda nao se posicionou=12, Tem interesse=5, Descartou=1)
- Corrigido: icones SVG gigantes na tela de Revisao do wizard (width/height="16" adicionados)
- Atualizado: detalhe.html — grafico de intencao pos-visita usa 3 novos labels

### v1.5.4 — 19/04/2026
- Adicionada coluna `codigo` sequencial (sequence Postgres + UNIQUE) em visitas, propostas, disparos
- Padding de 4 digitos padronizado com numero_controle de vendas (V0349): VS0001, P0001, DS0001
- Backfill ordenado por created_at: 19 visitas, 1 proposta backfillados; disparos vazia (sequence ativa)
- Helper global `window.fmtCodigo(prefix, num)` e `window.parseCodigoBusca(termo)` adicionados em nav.js
- registro.html: VS#### exibido nos cards de visitas, P#### nas propostas, DS#### nos disparos
- registro.html: campo readonly Codigo no topo dos modais de edicao (visita, proposta, disparo)
- registro.html: campo "Nome ou codigo" na busca; busca por VS/P/DS extrai inteiro via parseCodigoBusca
- detalhe.html: VS#### exibido no card de cada visita no drill-down; P#### nos cards de propostas
- Nova regra de versionamento: git tag e Google Doc usam sempre o mesmo numero

### v1.5.3 — 19/04/2026
- registro.html: nova secao Disparos com wizard de 2 passos (disparo_form → revisao_disp)
- registro.html: CRUD completo de disparos (list cards com tipo badge, alcance, data, edit/delete)
- registro.html: busca ampliada para incluir tipo 'disparos'
- registro.html: origens de visitas recebe 'Disparo de parceiros'
- registro.html: propostas ganham campo origem (16 canais) em criacao e edicao
- detalhe.html: disparosHtml substituido por funil Base|Parceiros com Alcance→Disparos→Visitas→Propostas + conv rates
- detalhe.html: bloco Propostas por Fonte removido (integrado no funil de disparos)
- detalhe.html: fix filtros disparosHtml para 'Offline - Disparo de base/parceiros' (era sem prefixo)
- detalhe.html: prazoHtml/funilHtml/midiaHtml/canaisLeadsHtml/canaisVisitasHtml removidos (12 → 8 blocos)
- detalhe.html: andamentoHtml unificado (span 2 cols) — barra Tempo + Leads/Visitas/Propostas + Ads/CPL/Alcance/Freq + conv
- detalhe.html: tabelaCanaisHtml (grid-column:1/-1) — Canal|Midia|Leads|Visitas|Propostas|R$/Lead|R$/Visita|R$/Proposta + TOTAL
- exclusividades.html: bloco Metas e Investimento no modal de edicao (meta_leads/visitas/propostas/cpl/investimento)
- exclusividades.html: abrirEdit async com fetch de funil_snapshot; salvarEdicao faz UPSERT funil_snapshot

### v1.5.2.1 — 19/04/2026
- detalhe.html: grid 3-col dense (grid-auto-flow: row dense) para preencher lacunas
- detalhe.html: timeline redesenhada como stepper vertical com CSS ::before pseudo-elements

### v1.5.2 — 19/04/2026
- detalhe.html criado: pagina operacional completa (14 blocos) acessada via detalhe.html?id=UUID
- pipeline.html: todos os card clicks e botao Detalhe apontam para detalhe.html?id=

### v1.5.1 — 19/04/2026
- Migration dashboard_imoveis: INNER JOIN -> LEFT JOIN, agora retorna todas as 57 exclusividades
- Trigger auto-snapshot: toda nova exclusividade nasce com funil_snapshot automaticamente
- Backfill de 47 snapshots para exclusividades historicas (fonte='backfill_v1_5_1')
- pipeline.html criado: dashboard executivo + TMM header + 6 grupos de cards (v10, resumido, historico)
- index.html vira redirect para pipeline.html
- exclusividades.html: hash routing para URLs compartilhaveis por exclusividade
- index.html fix: alertas operacionais so para status 'ativa' (guard adicionado)
- Arquitetura de leads documentada: tabela public.leads (196 rows, espelha Pipedrive via n8n, chave id-pipedrive) agregada via LATERAL JOIN na view dashboard_imoveis

### v1.3.0 — 08/04/2026
Dashboard em grupos. Visual estilo Pipedrive.

### v1.3.1 — 12/04/2026
Sidebar lateral, modulos separados, hash routing, tabelas vendas/parcelas criadas,
94 registros historicos, skill frontend-design instalado.

### v1.5.0 — 18/04/2026
- Reorganizacao do menu do nav.js: nova ordem Pipeline, Exclusividades, Vendas, Repaginacao, Registro, Usuarios. Icones novos 'coin' (dollar-sign Lucide, Vendas) e 'brush' (paintbrush Lucide, Repaginacao). Pipeline assume icone 'chart'. Vendas perde soon:true.
- Sincronizacao do origin/main: descartados 4 commits de docs estrategicos commitados no repo errado (WhatsApp/CRM/IA) via force-with-lease; push do commit 85a62dc (repaginacao.html) que estava apenas local.

### v1.4.0 — 13/04/2026
- CSS global cn-form/cn-grid no nav.js aplicado em todos os formularios
- Pipeline header redesenhado: contadores + TMM + meta fixa + pipeline futuro
- Grupos redesenhados: Gestao, Repaginando, Aguardando, Perdidas
- Status clicavel direto no card (popover inline)
- Indicador "Sem atualizacao ha Xd" nos cards
- Prazo contrato: input digitavel (nao mais select 120/180)
- Formula TMM corrigida: preco * (30/dias_tipo), sem honorarios, sem prazo_interno
- TMM individual nos cards Repaginando e Aguardando
- Bug editar em todos os status corrigido
- sugerirNumeroControle ordenando por numero_controle DESC
- vendas.html: mascara R$, comissao auto, Tipo da Venda, filtro formato

---

## 9. PENDENCIAS ATIVAS — v1.6.0

### Alta prioridade
- [ ] Cadastro de usuarios via Edge Function (service_role)
- [ ] Anon Key — mover para variavel de ambiente no Vercel

### Media prioridade
- [ ] Webhook Pipedrive → n8n → Supabase (Passo 4)
- [ ] Conta Azul — Victoria criar categorias v4 (Passo 5)
- [ ] Controle de acesso por role no frontend
- [ ] Repositorio privado no GitHub

### Backlog futuro
- [ ] Command palette (Cmd+K) para navegacao rapida
- [ ] Filtros salvos no pipeline
- [ ] Aba Analise para Rafaela
- [ ] Modulo Financeiro
- [ ] URLs limpas via vercel.json

---

---

## 10. REGRAS DE EDICAO

- SEMPRE get_file_contents antes de editar — obter SHA atual
- Nunca usar SHA de memoria
- Nunca usar GitHub MCP para arquivos HTML/JS > 50KB — usar Claude Code
- Zero acentos dentro de blocos script — GitHub API corrompe
- vgv e GENERATED ALWAYS — nunca incluir em INSERT ou UPDATE
- Roles: master / operacional / padrao (NAO admin/editor)
- Precos: armazenar como "3.100.000" nunca com sufixo M

---

## 11. ATUALIZAR ESTE ARQUIVO AO FINAL DE CADA SESSAO

1. Registrar versao no historico (secao 8)
2. Remover pendencias concluidas (secao 9)
3. Push junto com os demais arquivos
