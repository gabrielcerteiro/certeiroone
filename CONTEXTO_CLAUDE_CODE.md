# CONTEXTO COMPLETO — PLATAFORMA CERTEIRO
> Arquivo para onboarding de nova sessão no Claude Code.
> Atualizado em: 07/04/2026 — pós Fase 1 concluída

---

## 1. VISÃO GERAL DO PROJETO

**Nome:** Plataforma Certeiro
**Dono:** Gabriel Certeiro — Gabriel Certeiro Imóveis, Itajaí/SC
**Conceito:** ERP operacional de exclusividades imobiliárias. Dashboard interno de controle de captações, funil de vendas, visitas, propostas e linha do tempo operacional.

---

## 2. REPOSITÓRIO E DEPLOY

| Item | Valor |
|------|-------|
| Repo principal | `github.com/gabrielcerteiro/dashboard-certeiro` |
| Branch | `main` (auto-deploy via Vercel) |
| URL produção | `https://dashboard-certeiro.vercel.app` |
| Repo secundário (legado) | `github.com/gabrielcerteiro/visitas-gabrielcerteiro` |
| URL secundária | `https://visitas.gabrielcerteiro.com.br` |

---

## 3. ARQUIVOS DO PROJETO

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Dashboard interno principal — lista de exclusividades, detalhe, edição |
| `registro.html` | Módulo de registro de visitas e propostas |
| `vendedor.html` | Relatório para proprietário (link compartilhável) |
| `docs/BRIEFING_DASHBOARD_V20.md` | Briefing de produto com specs funcionais |
| `SPEC_VENDEDOR.md` | Especificação da página do vendedor |
| `CONTEXTO_CLAUDE_CODE.md` | Este arquivo |

---

## 4. SUPABASE

| Item | Valor |
|------|-------|
| Project ID | `vtykzralkxlbqqkleofl` |
| URL | `https://vtykzralkxlbqqkleofl.supabase.co` |
| Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0eWt6cmFsa3hsYnFxa2xlb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjMyNjAsImV4cCI6MjA4OTkzOTI2MH0.rYBifw2NXqVDGrKbDWKJgrFAIdoruxxsIPc9RXibgy0` |

### 4.1 Tabelas

#### `imoveis`
Cadastro base dos imóveis.
- `id` uuid PK
- `nome` text
- `proprietario` text
- `bairro` text
- `status` text
- `preco` text
- `ativo` boolean (default true)
- `created_at` timestamptz

#### `exclusividades`
Contrato de exclusividade por imóvel.
- `id` uuid PK
- `imovel_id` uuid FK → imoveis.id
- `data_inicio` date
- `dias_contrato` int (default 120)
- `status` text CHECK ('ativa','encerrada','renovada')
- `observacoes` text
- `created_at`, `updated_at` timestamptz

#### `funil_snapshot`
Dados operacionais atualizados manualmente ou via n8n/Pipedrive.
- `id` uuid PK
- `exclusividade_id` uuid FK → exclusividades.id
- `imovel_nome`, `proprietario`, `preco` text
- `status_exclusividade` text CHECK ('ativa','vendida','perdida','encerrada')
- `data_inicio`, `data_fim` date
- `prazo_contrato_dias` int (default 120)
- `prazo_repaginacao_dias` int
- `data_repaginacao_concluida` date
- `data_gravacao_conteudo` date
- `data_midia_entregue` date
- `prazo_interno_dias` int
- `meta_leads`, `meta_visitas`, `meta_propostas` int
- `meta_investimento` numeric (default 1500) — CAMPO CORRETO para meta de mídia
- `meta_cpl` numeric (default 65)
- `total_leads`, `total_visitas`, `total_propostas` int — campos manuais (legado)
- `leads_abertos`, `leads_perdidos` int
- `leads_meta_ads`, `leads_google_ads`, `leads_instagram_org`, `leads_youtube`, `leads_tiktok`, `leads_site_org`, `leads_indicacao`, `leads_corretor_parc`, `leads_relacionamento`, `leads_disparo_base`, `leads_oferta_ativa`, `leads_outdoor` int
- `gastos_metaads` numeric
- `alcance_metaads` int
- `frequencia_metaads` numeric
- `localizacao` text
- `tipo_imovel` text
- `atualizado_em` timestamptz
- `fonte` text (default 'pipedrive_n8n')

> **PENDENTE — migração futura:** adicionar colunas para disparos e checklist de acoes de venda.
> Ver secao 13 para lista completa.

#### `visitas`
Visitas registradas por imóvel.
- `id` uuid PK
- `imovel_id` uuid FK → imoveis.id
- `imovel_nome` text
- `data_visita` date
- `hora_visita` time
- `corretor` text
- `parceiro` text
- `origem` text
- `nome_interessado` text
- `objections` text[]
- `observacoes` text
- `intencao` text (valores: 'Quer comprar', 'Esta pensando', 'Nao gostou', 'Quer segunda visita')
- `qualificado_financeiramente` boolean
- `formas_pagamento` text[]
- `pagto_detalhes` text
- `created_at` timestamptz

#### `propostas`
Propostas de compra registradas.
- `id` uuid PK
- `imovel_id` uuid FK → imoveis.id
- `nome_interessado` text
- `data` date
- `valor_proposto` numeric
- `forma_pagamento` text CHECK ('a_vista','financiamento','parcelamento_direto','dacao_a_vista','dacao_financiamento','dacao_parcelamento_direto','parcelamento_direto_financiamento')
- `status` text CHECK ('em_andamento','aceita','recusada','desistiu')
- `observacao` text
- `created_at`, `updated_at` timestamptz

> **IMPORTANTE:** a tabela `propostas` NAO tem coluna `corretor`. O payload de salvarProposta()
> em registro.html NAO deve incluir esse campo (já corrigido na Fase 1).

#### `corretores`
- `id` uuid PK
- `nome` text
- `creci` text
- `tipo` text CHECK ('pessoa_fisica','pessoa_juridica')
- `ativo` boolean
- `foto_url` text
- `created_at` timestamptz

**Corretores cadastrados:**
- Gabriel Certeiro — id: `8dcc5e44-...` — CRECI 22249/SC
- Robson Souza — id: `0e5d9faf-...` — CRECI 36145/SC

**Fotos (Storage bucket `corretores`, público):**
- `https://vtykzralkxlbqqkleofl.supabase.co/storage/v1/object/public/corretores/Foto%20Gabriel%20Certeiro.jpeg`
- `https://vtykzralkxlbqqkleofl.supabase.co/storage/v1/object/public/corretores/Foto%20Robson%20Souza.jpg`

### 4.2 Views

#### `dashboard_imoveis`
View principal usada pelo `index.html`. Faz JOIN de `funil_snapshot` + `exclusividades` + `imoveis`.

**Campos calculados:**
- `dias_restantes` — dias até data_fim
- `tl_hoje_pct` — % do contrato consumido
- `status_repaginacao` — ('nao_se_aplica','pendente','ok','atrasado')
- `data_meta_interna` — data_midia_entregue + prazo_interno_dias
- `cpl_metaads` — gastos_metaads / leads_meta_ads
- `conv_lead_visita`, `conv_visita_prop` — taxas de conversão
- `dash_status` — ('ok','melhoria','atencao','vendida','perdida','encerrada')
- `count_propostas` — COUNT real da tabela `propostas` WHERE imovel_id = i.id (adicionado Fase 1)

> **IMPORTANTE:** `count_propostas` foi adicionado ao FINAL da lista SELECT da view
> (limitacao do PostgreSQL: CREATE OR REPLACE VIEW so aceita novas colunas no final).

#### `dashboard_visitas_detalhe`
View de visitas com JOIN em exclusividades para retornar `exclusividade_id`.

---

## 5. ARQUITETURA DO FRONTEND

### Stack
- HTML/CSS/JS puro — zero frameworks
- Supabase JS SDK v2 via CDN
- Font: Nunito Sans (Google Fonts)
- Sem build step — arquivos estáticos diretos

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

### Layout
- **Mobile** (< 900px): nav fixa na parte inferior (`bottom-nav`), conteúdo em coluna única, `max-width: 480px` centralizado
- **Desktop** (>= 900px): sidebar lateral esquerda, conteúdo à direita em grid 2 colunas

### Regras críticas de código
1. **ZERO acentos dentro de `<script>`** — usar apenas ASCII puro no JS
2. **Emojis como HTML entities** — ex: `&#128202;` para 📊
3. **`create_or_update_file` individualmente** para cada arquivo (nao usar `push_files` para arquivos grandes — pode truncar)
4. **SHA obrigatório** ao atualizar arquivo existente no GitHub

---

## 6. NAVEGAÇÃO

### Mobile (bottom-nav — 5 botões)
| Botão | data-tab | Ação |
|-------|----------|------|
| Alertas | alertas | switchTab('alertas') |
| Exclusividades | excl | switchTab('excl') |
| Registro | registro | window.location → registro.html |
| Analise | analise | switchTab('analise') |
| Mais | mais | abrirMais() → drawer |

### Desktop (sidebar)
- Mesma estrutura, sem o botão "Mais"
- Item "Registro" redireciona para `registro.html`
- Extras: Captação, Vendas, Marketing, Conteúdo (todos "Em breve")

### Bug pendente — indicador ativo mobile
O item ativo no mobile nao tem destaque visual claro (so opacity: 1 vs 0.35).
Opcoes para corrigir: linha navy em cima do botão (estilo iOS), ponto navy embaixo do ícone,
ou ícone + label em navy bold. Gabriel ainda nao escolheu o estilo.

---

## 7. MÓDULOS DO index.html

### Views (mostradas/ocultadas com classe `on`)
- `vAlertas` — alertas críticos e de atencao por exclusividade
- `vList` — lista de cards de exclusividades + VGV
- `vDetail` — detalhe completo de uma exclusividade
- `vEdit` — formulário de edicao (atualiza `funil_snapshot`)
- `vAnalise` — placeholder "Em construção"

### Componentes principais
- **VGV card (navy):** total de portfólio + barra de meta (R$100M) + 3 categorias
- **icard:** card de exclusividade com funil de barras (Tempo/Leads/Visitas/Propostas + Ads/CPL)
- **Detail grid:** Funil, Timeline, Acoes de Venda, Meta Ads, Conversões, Corretores, Canais, Disparos Base, Disparos Parceiros, Intencao, Objecoes, Relatório de Visitas, Propostas
- **Edit form:** secoes Exclusividade, Linha do Tempo, Funil, Origem de Leads, Meta Ads

### Funcoes relevantes
- `saveSnapshot()` — UPDATE em `funil_snapshot`, recalcula `data_fim` de `data_inicio + prazo_contrato_dias`
- `funilBarras()` — renderiza barras do funil. Visitas: usa `visitasMap[imovel_id]` (real). Propostas: usa `count_propostas` da view (real). Midia: usa `meta_investimento` (nome correto do campo)
- `excluirExclusividade()` + `_doExcluirExclusividade()` — deleta funil_snapshot e exclusividades em cascata (NAO deleta imoveis)

---

## 8. MÓDULO registro.html

- Registrar nova visita (form completo)
- Registrar nova proposta — payload NAO inclui campo `corretor` (nao existe na tabela)
- Listar visitas e propostas recentes

---

## 9. MÓDULO vendedor.html

Relatório público para proprietário. Acesso por `?id=<exclusividade_id>&from=internal`.
Spec completa em `SPEC_VENDEDOR.md`.

---

## 10. FUNIL — LÓGICA DE BARRAS

```
fator = diasPassados / diasTotal
esperado = Math.round(meta * fator)
```

Cores: verde se realizado >= esperado, amarelo se >= 80%, vermelho se < 80%.

**Fontes de dados por barra (pós Fase 1):**
- Leads: `total_leads` (funil_snapshot — manual, ok por enquanto)
- Visitas: `visitasMap[imovel_id].length` (tabela `visitas` — REAL)
- Propostas: `count_propostas` (view dashboard_imoveis — REAL via subquery)
- Midia: `meta_investimento` (funil_snapshot — editavel pelo form)

---

## 11. TIMELINE OPERACIONAL (marcos)

1. Assinatura do contrato
2. Repaginacao concluída (opcional)
3. Material pronto / Gravacao
4. Disparo para base — campos `data_disparo_base` PENDENTES no banco
5. Disparo para parceiros — campos `data_disparo_parceiros` PENDENTES no banco
6. Campanha no ar
7. Primeira visita
8. Primeira proposta
9. Prazo final meta (data_midia_entregue + prazo_interno_dias)
10. Prazo final autorizacao (data_fim)

---

## 12. ALERTAS

- Contrato vencendo em <= 30 dias → CRITICO
- Contrato vencido → CRITICO
- Meta interna ultrapassada → CRITICO
- Campanha no ar sem visita → ATENCAO
- 3+ visitas sem proposta → ATENCAO
- 30+ dias sem gravacao após assinatura → ATENCAO

---

## 13. PENDÊNCIAS ATIVAS

### Bugs
- [ ] **Indicador ativo mobile** — sem destaque visual no bottom-nav

### Fase 2 — CRUD operacional faltante (proxima)
Requer migracao SQL no Supabase ANTES de implementar no front:

**Colunas a adicionar em `funil_snapshot`:**
- `disparos_base` int
- `impactados_base` int
- `visitas_base` int
- `propostas_base` int
- `disparos_parceiros` int
- `contatados_parceiros` int
- `visitas_parceiros` int
- `propostas_parceiros` int
- `data_disparo_base` date
- `data_disparo_parceiros` date
- `cad_dwv` boolean — Acao: cadastro DWV
- `cad_site` boolean — Acao: cadastro no site
- `cat_gabriel` boolean — Acao: enviado para carteira Gabriel
- `cat_rafaela` boolean — Acao: enviado para carteira Rafaela
- `video_youtube` boolean — Acao: video publicado YouTube
- `post_instagram` boolean — Acao: post Instagram
- `post_tiktok` boolean — Acao: post TikTok
- `post_facebook` boolean — Acao: post Facebook

**Funcionalidades de UI a implementar:**
- [ ] Botao + modal para cadastrar nova exclusividade (cria em imoveis + exclusividades + funil_snapshot)
- [ ] Painel de disparos base e parceiros no detalhe (edita funil_snapshot)
- [ ] Secao de acoes de venda com checkboxes no detalhe (edita funil_snapshot)
- [ ] Garantir que exclusividade criada no Registro apareca no dashboard

### Fase 3 — Midia planejada vs realizada
- [ ] Campo `midia_total_planejada` (a definir onde armazenar)
- [ ] Calculo proporcional: midia_esperada = total * (dias_passados / dias_total)
- [ ] Exibicao comparativa previsto x realizado no detalhe

### Fase 4 — Visual e UX (apos funcionalidades)
- [ ] Remover emojis, substituir por SVG inline
- [ ] Melhorar densidade de informacao
- [ ] Corrigir indicador ativo mobile
- [ ] Border-left colorida nos cards por dash_status

### Fase 5 — Cadastro de usuários (sessao separada)
- [ ] Reescrever criacao de usuario via Edge Function com service_role
- [ ] Hoje usa sb.auth.signUp() que troca a sessao ativa — nao funciona

---

## 14. CONTEXTO OPERACIONAL

- **Equipe:** Gabriel Certeiro (dono/corretor) + Robson Souza (corretor parceiro) + Rafaela (ops/CRM)
- **Foco:** imóveis residenciais R$630K – R$3M+ em Itajaí/SC
- **Stack adicional:** GHL + WhatsApp Business API + n8n + Pipedrive (CRM fonte dos dados de funil)

---

## 15. SHA DOS ARQUIVOS (verificar antes de editar)

> SEMPRE fazer `get_file_contents` antes de editar para obter SHA atual e verificar integridade.
> Os SHAs abaixo podem estar desatualizados — use apenas como referencia.

| Arquivo | SHA referencia |
|---------|---------------|
| `index.html` | verificar antes de editar |
| `registro.html` | verificar antes de editar |
| `vendedor.html` | verificar antes de editar |

> **ATENCAO:** `index.html` tem 126KB. Historico de truncamento ao usar `create_or_update_file`
> com arquivo grande. Verificar integridade (tamanho, ultima funcao) antes de qualquer edicao.
