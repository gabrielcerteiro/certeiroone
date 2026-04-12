# BRIEFING TECNICO -- Implementacao Aba Vendas no Certeiro One
# Para uso em sessoes Claude Code (Sonnet)
# Referencia: BACKUP_SESSAO_CLAUDION_12ABR2026.md

---

## CONTEXTO RAPIDO

O Certeiro One (certeiroone.vercel.app) e a plataforma operacional da Gabriel Certeiro Imoveis.
Stack: HTML/CSS/JS puro + Supabase + Vercel.
Repo: github.com/gabrielcerteiro/certeiroone
Supabase project ID: vtykzralkxlbqqkleofl
Docs de contexto no repo: CONTEXTO_CLAUDE_CODE.md, CLAUDION_BRIEFING.md

A aba Vendas e um NOVO modulo que precisa ser criado. Nao existe ainda.

IMPORTANTE: Antes de construir qualquer modulo novo, a navegacao do Certeiro One precisa ser reestruturada (Passo 0). Ninguem esta usando o sistema ainda -- risco zero de breaking change. E a hora certa.

---

## PASSO 0 -- REESTRUTURAR NAVEGACAO DO CERTEIRO ONE

### Objetivo
Transformar o Certeiro One de uma single-page com abas em uma aplicacao multi-pagina com navegacao lateral profissional, estilo Pipedrive.

### Arquitetura de paginas
Cada modulo = arquivo HTML separado com URL propria:
- `index.html` -- Dashboard (home)
- `exclusividades.html` -- Modulo de exclusividades (migrar do index.html atual)
- `vendas.html` -- Modulo de vendas (novo, Passo 2)
- `registro.html` -- Registro de visitas/propostas (ja existe)
- `usuarios.html` -- Gestao de usuarios (migrar do index.html atual)
- Futuros: `marketing.html`, `financeiro.html`

### Navegacao lateral (sidebar)
- Sidebar fixa a esquerda, estilo Pipedrive
- Logo Gabriel Certeiro no topo
- Icones + labels empilhados verticalmente (Dashboard, Exclusividades, Vendas, Registro, Usuarios)
- Indicador visual de pagina ativa
- Perfil/logout na parte inferior
- Colapsavel em mobile (hamburger menu)
- Arquivo compartilhado: `nav.js` -- importado por TODAS as paginas. Muda em um lugar, atualiza em todas.

### Hash routing dentro de cada pagina
Cada pagina usa hash routing internamente para sub-views:
- `exclusividades.html#lista` -- listagem
- `exclusividades.html#detalhe/UUID` -- detalhe de uma exclusividade
- `exclusividades.html#editar/UUID` -- edicao
- Botao voltar do navegador funciona corretamente
- Links diretos compartilhaveis

### Paleta de cores da marca (Design System)
- Principal: #191949 (navy escuro)
- Secundaria: #FFFFFF (branco)
- Complementar: #CCCCCC (cinza claro)
- NAO usar dourado/gold -- nao e cor da marca

### Abordagem em duas etapas
1. FUNCIONAL PRIMEIRO: Reestruturar navegacao, migrar modulos existentes, tudo funcionando
2. VISUAL DEPOIS: Aplicar identidade visual da marca, polir espacamentos, tipografia, microinteracoes

### Arquivo nav.js -- Estrutura base
```javascript
// nav.js - Navegacao compartilhada do Certeiro One
// Importar em todas as paginas: <script src="nav.js"></script>

function renderNav(activePage) {
  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: '&#x1F4CA;', url: 'index.html' },
    { id: 'exclusividades', label: 'Exclusividades', icon: '&#x1F4DD;', url: 'exclusividades.html' },
    { id: 'vendas', label: 'Vendas', icon: '&#x1F4B0;', url: 'vendas.html' },
    { id: 'registro', label: 'Registro', icon: '&#x1F4CB;', url: 'registro.html' },
    { id: 'usuarios', label: 'Usuarios', icon: '&#x1F465;', url: 'usuarios.html' }
  ];
  // Renderizar sidebar com pagina ativa destacada
  // Incluir logo, links, indicador ativo, perfil/logout
}
```

### Sequencia de execucao do Passo 0
1. Criar `nav.js` com sidebar completa
2. Criar `exclusividades.html` -- migrar todo o conteudo de exclusividades do index.html atual
3. Criar `usuarios.html` -- migrar o modulo de usuarios do index.html atual
4. Refatorar `index.html` -- manter apenas Dashboard (overview cards + alertas)
5. Atualizar `registro.html` -- integrar nav.js (ja e pagina separada)
6. Testar: navegacao entre paginas, botao voltar, links diretos, mobile

### ATENCAO
- O index.html atual tem MUITA logica. A migracao para exclusividades.html precisa levar toda a logica de CRUD de exclusividades, funil_snapshot, vEdit, alertas de prazo, etc.
- NAO refatorar a logica interna dos modulos durante a migracao -- apenas mover para arquivos separados.
- Testar exaustivamente que nada quebrou antes de avancar pro Passo 1.

---

## PASSO 1 -- SQL NO SUPABASE

Rodar no SQL Editor do Supabase. Criar em sequencia:

### 1.1 Alter exclusividades (adicionar codigo sequencial)
```sql
ALTER TABLE exclusividades ADD COLUMN IF NOT EXISTS codigo SERIAL;
```

### 1.2 Criar tabela vendas
```sql
CREATE TABLE vendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_controle TEXT UNIQUE NOT NULL,
  exclusividade_id UUID REFERENCES exclusividades(id),
  data_venda DATE,
  competencia DATE,
  status_venda TEXT CHECK (status_venda IN ('contrato_assinado', 'negocio_concluido', 'cancelado', 'sem_comissao')) DEFAULT 'contrato_assinado',
  
  -- Comprador
  comprador_nome TEXT,
  comprador_cpf_cnpj TEXT,
  comprador_telefone TEXT,
  comprador_email TEXT,
  
  -- Vendedor/Proprietario
  vendedor_nome TEXT,
  vendedor_cpf_cnpj TEXT,
  construtora TEXT,
  
  -- Imovel
  imovel_nome TEXT,
  imovel_regiao TEXT CHECK (imovel_regiao IN ('fazenda', 'praia_brava', 'cabecudas', 'ressacada', 'outro')),
  imovel_tipologia TEXT CHECK (imovel_tipologia IN ('mobiliado', 'vazio', 'repaginado', 'terreno', 'permuta', 'na_planta')),
  imovel_metragem NUMERIC,
  
  -- Valores comerciais
  valor_contrato NUMERIC,
  valor_honorarios NUMERIC,
  vgv NUMERIC, -- calculado no frontend (valor_honorarios / 0.05) mas editavel manualmente
  percentual_comissao NUMERIC DEFAULT 6, -- 6% padrao, 5% construtora, ~1% gestao
  is_parceria BOOLEAN DEFAULT FALSE,
  parceiro_nome TEXT,
  
  -- Classificacao
  is_construtora BOOLEAN DEFAULT FALSE,
  tipo_participacao TEXT CHECK (tipo_participacao IN ('corretor', 'gestao')) DEFAULT 'corretor',
  categoria INTEGER CHECK (categoria IN (1, 2, 3, 4)) DEFAULT 1,
  forma_pagamento TEXT CHECK (forma_pagamento IN ('a_vista', 'financiamento', 'parcelado_direto', 'permuta', 'misto')),
  banco_financiamento TEXT,
  envolve_permuta BOOLEAN DEFAULT FALSE,
  descricao_permuta TEXT,
  
  -- Pos-venda
  entrega_chaves_data DATE,
  presente_entregue BOOLEAN DEFAULT FALSE,
  review_google_comprador BOOLEAN DEFAULT FALSE,
  review_google_vendedor BOOLEAN DEFAULT FALSE,
  depoimento_comprador BOOLEAN DEFAULT FALSE,
  depoimento_vendedor BOOLEAN DEFAULT FALSE,
  depoimento_parceiro BOOLEAN DEFAULT FALSE,
  
  -- Links
  link_contrato TEXT,
  link_pipedrive TEXT,
  link_pasta_drive TEXT,
  observacoes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_vendas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vendas_updated_at
  BEFORE UPDATE ON vendas
  FOR EACH ROW
  EXECUTE FUNCTION update_vendas_updated_at();
```

### 1.3 Criar tabela parcelas_comissao
```sql
CREATE TABLE parcelas_comissao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venda_id UUID REFERENCES vendas(id) ON DELETE CASCADE,
  numero_parcela INTEGER NOT NULL,
  valor NUMERIC NOT NULL,
  data_prevista DATE,
  data_recebimento DATE,
  status TEXT CHECK (status IN ('pendente', 'recebida', 'atrasada', 'cancelada')) DEFAULT 'pendente',
  condicao_evento TEXT,
  correcao_tipo TEXT CHECK (correcao_tipo IN ('igpm', 'ipca', 'percentual_fixo')),
  correcao_percentual NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.4 RLS Policies
```sql
-- Habilitar RLS
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcelas_comissao ENABLE ROW LEVEL SECURITY;

-- Policies para anon (mesmo padrao do resto do Certeiro One)
CREATE POLICY "vendas_all" ON vendas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "parcelas_all" ON parcelas_comissao FOR ALL USING (true) WITH CHECK (true);
```

### 1.5 Seed dos dados classificados (83 vendas ativas + 8 especiais)
```sql
-- Importar do arquivo vendas_classificadas_completo.csv
-- Script de seed sera gerado na sessao de Claude Code
-- Cada INSERT tera: numero_controle, imovel_nome, imovel_tipologia, status_venda, is_construtora, is_parceria
-- Campos de valor (valor_contrato, valor_honorarios) serao preenchidos incrementalmente
```

---

## PASSO 2 -- INTERFACE NO CERTEIRO ONE

### 2.1 Arquivo: vendas.html (novo)

Criar pagina seguindo o padrao visual do index.html existente.
Componentes necessarios:

#### Tela de listagem/consulta
- Tabela com todas as vendas
- Filtros: ano, tipo (mobiliado/vazio/repaginado/terreno/permuta/na_planta), exclusividade (sim/nao), construtora (sim/nao), parceria (sim/nao), status, categoria (1a/2a/3a/4a)
- Ordenacao por: data_venda, valor_contrato, vgv, TMM (calculado)
- Cards de resumo no topo: total VGV, total vendas, ticket medio contrato, ticket medio VGV
- TMM = VGV / (dias_para_vender / 30) -- so para vendas com exclusividade vinculada
- Tempo de venda = data_venda - exclusividade.data_inicio (via JOIN)

#### Tela de registro (nova venda)
- Formulario com todos os campos do schema
- Dropdown de exclusividades (puxa da tabela exclusividades com codigo)
- Auto-preenche imovel_nome e vendedor_nome quando seleciona exclusividade
- Secao de parcelas (adicionar/remover parcelas dinamicamente)
- Botao salvar -> INSERT no Supabase

#### Tela de edicao (venda existente)
- Mesmos campos do registro, preenchidos com dados existentes
- Secao de parcelas editavel
- Secao de pos-venda (reviews, depoimentos, entrega de chaves)

#### Tela de detalhe
- Overview da venda com todos os dados
- Timeline de parcelas (recebidas vs pendentes)
- Link para exclusividade vinculada
- Link para pasta no Drive

### 2.2 Navegacao
Vendas ja estara no nav.js apos o Passo 0. A pagina vendas.html importa nav.js e se integra automaticamente.

---

## PASSO 3 -- SEED DE DADOS INICIAIS

O arquivo vendas_classificadas_completo.csv contem 91 registros (83 ativos + 8 especiais).
Para cada registro, criar INSERT com os campos disponiveis.
Campos que ainda nao temos (valor_contrato, valor_honorarios, comprador, vendedor, etc.) ficam NULL -- serao preenchidos incrementalmente.

Dados de prazo estao no arquivo prazos_vendas.csv (data_autorizacao, data_venda, prazo_dias para exclusividades).
Esses dados NAO vao na tabela vendas -- o prazo e calculado via JOIN com exclusividades.

---

## PASSO 4 -- WEBHOOK PIPEDRIVE -> N8N -> SUPABASE

### Fluxo:
1. Deal marcado como "Won" no Pipedrive -> webhook dispara
2. n8n recebe -> extrai campos do deal (nome, valor, imovel)
3. n8n faz INSERT na tabela vendas no Supabase com status 'contrato_assinado'
4. n8n notifica via WhatsApp (Claudia ou grupo)

### Campos mapeados do Pipedrive:
- Deal title -> imovel_nome
- Deal value -> valor_contrato (campo "Valor do contrato" do Pipedrive)
- Person name -> comprador_nome
- Person phone -> comprador_telefone
- Custom field "Origem" -> vem da exclusividade, nao precisa mapear
- Pipeline -> identifica se e Funil de Exclusividades ou Funil de Vendas

### Configuracao n8n:
- URL: gabrielcerteiro.app.n8n.cloud
- Trigger: Pipedrive webhook (deal.update, status = won)
- Action: Supabase INSERT
- Notification: HTTP request para WhatsApp API ou OpenClaw

---

## PASSO 5 -- CONTA AZUL

### Acoes da Victoria:
1. Ativar Conta Azul plano R$ 180/mes
2. Criar categorias do Plano v4 (documento Plano_de_Contas_v4_Gabriel_Certeiro.docx)
3. Desativar categorias antigas (nao deletar)
4. Reclassificar lancamentos 2023+ para categorias v4

### Centros de custo:
- OPERAR
- CRESCER

### Estrutura DRE:
(+) Receitas: 1.01 e 1.02
(-) Impostos: 2.01
(-) Operar: 2.02 a 2.05
(-) Crescer: 3.01 a 3.08
(=) Lucro Operacional
(-) Diretoria: 4.01
(=) Resultado Final

---

## CAMPOS E ENUMS -- REFERENCIA RAPIDA

### imovel_tipologia
mobiliado, vazio, repaginado, terreno, permuta, na_planta

### status_venda
contrato_assinado, negocio_concluido, cancelado, sem_comissao

### tipo_participacao
corretor (padrao 6%), gestao (retem ~1% repassa ~5%)

### categoria
1 = negocio original
2 = entrou como pagamento do 1o
3 = entrou como pagamento do 2o
4 = raro

### forma_pagamento
a_vista, financiamento, parcelado_direto, permuta, misto

### imovel_regiao
fazenda, praia_brava, cabecudas, ressacada, outro

### parcelas status
pendente, recebida, atrasada, cancelada

### correcao_tipo
igpm, ipca, percentual_fixo

---

## REGRAS DE NEGOCIO PARA A INTERFACE

1. numero_controle e sequencial e NUNCA pode ter buraco -- sistema sugere proximo numero automaticamente
2. VGV e calculado no frontend (valor_honorarios / 0.05) -- campo editavel manualmente para casos de gestao e parceria que distorcem o calculo automatico
3. TMM so aparece para vendas com exclusividade vinculada
4. Parcelas podem ser fixas (data_prevista definitiva) ou atreladas a evento (condicao_evento preenchido, data_prevista e estimativa)
5. Dropdown de exclusividades mostra: codigo + imovel_nome + proprietario
6. Ao selecionar exclusividade, auto-preenche: imovel_nome, vendedor_nome, imovel_regiao, imovel_tipologia
7. Filtro padrao da listagem: exclui cancelado e sem_comissao (toggle pra mostrar tudo)
8. Rankings por TMM: so exclusividades, ordenadas por TMM decrescente

---

## ARQUIVOS DE REFERENCIA

- BACKUP_SESSAO_CLAUDION_12ABR2026.md -- todas as decisoes e analises
- vendas_classificadas_completo.csv -- 91 vendas para seed
- prazos_vendas.csv -- dados de prazo das exclusividades
- Plano_de_Contas_v4_Gabriel_Certeiro.docx -- plano de contas
- CONTEXTO_CLAUDE_CODE.md (no repo) -- contexto tecnico do Certeiro One
- CLAUDION_BRIEFING.md (no repo) -- briefing geral

---

*Briefing tecnico gerado em 12/04/2026 -- Sessao Claudion*
*Atualizado em 12/04/2026 -- Adicionado Passo 0 (reestruturacao navegacao), paleta de cores corrigida, VGV editavel*

## INSTRUCAO PARA PROXIMA SESSAO
Abrir Sonnet. Mandar este briefing como contexto. Dizer:
"Le o briefing e executa o Passo 0 (reestruturar navegacao com sidebar lateral). Depois Passo 1 (SQL no Supabase)."
Ler o skill de frontend design (/mnt/skills/public/frontend-design/SKILL.md) antes de construir qualquer HTML.
