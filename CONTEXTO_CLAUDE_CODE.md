# CONTEXTO COMPLETO — PLATAFORMA CERTEIRO
> Arquivo para onboarding de nova sessao no Claude Code.
> Atualizado em: 13/04/2026 — v1.4.0 entregue

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
| `index.html` | Dashboard — overview cards e alertas |
| `exclusividades.html` | Modulo principal: pipeline, grupos, detalhe, edicao |
| `vendas.html` | Modulo de vendas: listagem, registro, edicao |
| `registro.html` | Registro de visitas e propostas |
| `usuarios.html` | Gestao de usuarios |
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

### v1.3.0 — 08/04/2026
Dashboard em grupos. Visual estilo Pipedrive.

### v1.3.1 — 12/04/2026
Sidebar lateral, modulos separados, hash routing, tabelas vendas/parcelas criadas,
94 registros historicos, skill frontend-design instalado.

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

## 9. PENDENCIAS ATIVAS — v1.5.0

### Alta prioridade
- [ ] Redesign tela detalhe/edicao exclusividade: dois paineis (dados + timeline/acoes)
      com edicao por secao inline (nao mais formulario full-page)
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
