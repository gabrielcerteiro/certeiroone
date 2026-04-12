# CONTEXTO COMPLETO — PLATAFORMA CERTEIRO
> Arquivo para onboarding de nova sessao no Claude Code.
> Atualizado em: 12/04/2026 — v1.4.0 em andamento

---

## 0. SKILL DE FRONTEND — LER ANTES DE QUALQUER TRABALHO VISUAL

Um skill de design de frontend esta instalado em `~/.claude/skills/frontend-design/`.

**REGRA OBRIGATORIA:** antes de criar, editar ou refatorar qualquer HTML/CSS
que envolva layout, componentes visuais, formularios, modais, cards ou qualquer
elemento de interface, leia o SKILL.md do skill:

```
~/.claude/skills/frontend-design/SKILL.md
```

Isso se aplica a TODA sessao que tocar em visual — sem excecao.
O skill define tokens de design, padroes de componentes e regras de layout
que devem sobrepor qualquer convencao generica.

### Padrao de layout obrigatorio para formularios
- Formularios em paginas inteiras: `max-width: 800px; margin: 0 auto;`
- Modais: `max-width: 720px; margin: 0 auto;`
- Campos curtos (data, numero, status, %): grid 3 ou 4 colunas
- Campos medios (nome, valor R$): grid 2 colunas
- Campos longos (observacao, textarea): 1 coluna dentro do container
- Gap: 12px horizontal, 14px vertical
- Campo de data nunca excede ~220px de largura visual
- Agrupar campos por secao com label uppercase acima

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
| `exclusividades.html` | Modulo de exclusividades (pipeline, detalhe, edicao) |
| `vendas.html` | Modulo de vendas (listagem, registro, edicao) |
| `registro.html` | Registro de visitas e propostas (SEM criacao de imovel) |
| `usuarios.html` | Gestao de usuarios |
| `vendedor.html` | Relatorio publico para proprietario (link compartilhavel) |
| `nav.js` | Navegacao compartilhada (sidebar) — importado por todas as paginas |
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
- `vendas` — ALL
- `parcelas_comissao` — ALL

### 4.2 Tabelas

#### `imoveis`
- `id` uuid PK
- `nome`, `proprietario`, `bairro`, `status`, `preco` text
- `ativo` boolean (default true)
- `created_at` timestamptz

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
- `midia_total_planejada` numeric
- `disparos_base`, `impactados_base`, `visitas_base`, `propostas_base` int
- `disparos_parceiros`, `contatados_parceiros`, `visitas_parceiros`, `propostas_parceiros` int
- `data_disparo_base`, `data_disparo_parceiros` date
- `cad_dwv`, `cad_site`, `cat_gabriel`, `cat_rafaela` boolean DEFAULT false
- `video_youtube`, `post_instagram`, `post_tiktok`, `post_facebook` boolean DEFAULT false

#### `vendas` (criada em 12/04/2026 — 94 registros historicos inseridos)
- `id` uuid PK
- `numero_controle` text UNIQUE NOT NULL
- `exclusividade_id` uuid FK → exclusividades.id (nullable)
- `data_venda` date, `competencia` date
- `status_venda` text CHECK ('contrato_assinado','negocio_concluido','cancelado','sem_comissao')
- `comprador_nome`, `comprador_cpf_cnpj`, `comprador_telefone`, `comprador_email` text
- `vendedor_nome`, `vendedor_cpf_cnpj`, `construtora` text
- `imovel_nome`, `imovel_regiao`, `imovel_tipologia` text
- `imovel_metragem` numeric
- `valor_contrato`, `valor_honorarios` numeric
- `vgv` numeric GENERATED ALWAYS AS (valor_honorarios / 0.05) — READONLY, nunca incluir em INSERT/UPDATE
- `percentual_comissao` numeric default 6
- `is_parceria` boolean, `parceiro_nome` text
- `is_construtora` boolean, `tipo_participacao` text
- `categoria` int CHECK (1,2,3,4)
- `forma_pagamento` text, `banco_financiamento` text
- `envolve_permuta` boolean, `descricao_permuta` text
- `entrega_chaves_data` date
- `presente_entregue`, `review_google_comprador`, `review_google_vendedor` boolean
- `depoimento_comprador`, `depoimento_vendedor`, `depoimento_parceiro` boolean
- `link_contrato`, `link_pipedrive`, `link_pasta_drive`, `observacoes` text
- `created_at`, `updated_at` timestamptz

#### `parcelas_comissao`
- `id` uuid PK, `venda_id` uuid FK → vendas.id ON DELETE CASCADE
- `numero_parcela` int, `valor` numeric
- `data_prevista` date, `data_recebimento` date
- `status` text CHECK ('pendente','recebida','atrasada','cancelada')
- `condicao_evento` text
- `correcao_tipo` text, `correcao_percentual` numeric
- `created_at` timestamptz

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

### 4.3 Views

#### `dashboard_imoveis`
JOIN funil_snapshot + exclusividades + imoveis. Campos calculados:
- `dias_restantes`, `tl_hoje_pct`, `status_repaginacao`, `data_meta_interna`
- `cpl_metaads`, `conv_lead_visita`, `conv_visita_prop`, `dash_status`
- `count_propostas` — COUNT real (SEMPRE no FINAL do SELECT)

> CRITICO: novos campos na view devem vir DEPOIS de count_propostas.

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
- Icones: SVG inline estilo Lucide. ZERO emojis.
- Labels de secao: uppercase, font-size 11px, letter-spacing 1px, cor --muted
- Badges: ativa #D1FAE5/#065F46 | vendida #DBEAFE/#1E40AF | repaginacao #FEF3C7/#92400E
- Inputs: border 1px solid --s3, border-radius 8px, padding 10px 12px
- Botao primario: background --navy, texto branco
- Botao destrutivo: border 1px solid --red, texto --red, sem fundo

### Layout
- Mobile (< 900px): sidebar colapsavel, coluna unica
- Desktop (>= 900px): sidebar fixa esquerda + conteudo

---

## 6. NAVEGACAO

- Sidebar compartilhada via `nav.js` — importado por todas as paginas
- Hash routing interno em cada pagina:
  - `exclusividades.html#lista` — listagem
  - `exclusividades.html#detalhe/UUID` — detalhe
  - `exclusividades.html#editar/UUID` — edicao
  - `exclusividades.html#alertas` — alertas de prazo
  - `exclusividades.html#analise` — analise

---

## 7. FLUXO DE CRIACAO DE EXCLUSIVIDADE

Modal "+ Nova Exclusividade" no index.html.
INSERT sequencial: imoveis → exclusividades → funil_snapshot
registro.html NAO tem criacao de imovel.

---

## 8. DASHBOARD — GRUPOS

### GRUPO 1 — EM CAMPANHA (status = 'ativa')
Cards completos. Grid 3 colunas no desktop.

### GRUPO 2 — EM REPAGINACAO (status = 'repaginacao')
Card simplificado: nome, proprietario, preco, barra de progresso.

### GRUPO 3 — AGUARDANDO (status = 'aguardando')
Card minimalista: nome, proprietario, tag aguardando.

### GRUPO 4 — VENDIDAS (status = 'vendida')
Oculto por padrao, expande ao clicar. NAO conta no VGV.

---

## 9. HISTORICO DE VERSOES

### v1.3.0 — 08/04/2026
Dashboard em 4 grupos. Grid 3 colunas. Visual estilo Pipedrive.

### v1.3.1 — 12/04/2026
Sidebar lateral, modulos em HTMLs separados (exclusividades, vendas, usuarios).
Hash routing em exclusividades.html.
Nav duplicada e header superior removidos.
"Plataforma Operacional" removido da sidebar.
Tabelas vendas e parcelas_comissao criadas.
Bug leads_abertos corrigido no banco.
94 registros historicos inseridos na tabela vendas.
Skill frontend-design instalado.

---

## 10. PENDENCIAS ATIVAS — v1.4.0

### Alta prioridade
- [ ] Layout de formularios: max-width + grid por tipo de campo
      (registro.html primeiro, depois modais do index.html)
- [ ] Testar vendas.html com os 94 registros historicos
- [ ] Botao excluir no formulario de edicao (vEdit)
- [ ] Campo status inicial no modal de nova exclusividade
- [ ] Cadastro de usuarios via Edge Function (service_role)
- [ ] Anon Key — mover para variavel de ambiente no Vercel

### Media prioridade
- [ ] Webhook Pipedrive -> n8n -> Supabase (Passo 4)
- [ ] Conta Azul — Victoria criar categorias v4 (Passo 5)
- [ ] Controle de acesso por role no frontend
- [ ] Repositorio privado no GitHub

### Backlog futuro
- [ ] URLs limpas (/exclusividades/26) via vercel.json rewrites + slug no banco
- [ ] Aba Analise para Rafaela
- [ ] Modulo Financeiro

---

## 11. REGRAS DE EDICAO

- SEMPRE fazer `get_file_contents` antes de editar — obter SHA atual
- Nunca usar SHA de memoria
- Nunca usar GitHub MCP para arquivos HTML/JS grandes (> 50KB) — usar Claude Code
- Zero acentos dentro de blocos `<script>` — GitHub API corrompe
- `vgv` e GENERATED ALWAYS — nunca incluir em INSERT ou UPDATE
- Roles: master / operacional / padrao (NAO admin/editor)

---

## 12. ATUALIZAR ESTE ARQUIVO AO FINAL DE CADA SESSAO

1. Registrar versao entregue no historico (secao 9)
2. Remover pendencias concluidas da secao 10
3. Fazer push junto com os demais arquivos alterados
