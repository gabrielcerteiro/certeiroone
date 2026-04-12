# BRIEFING TECNICO - Implementacao Aba Vendas no Certeiro One
# Para uso em sessoes Claude Code (Sonnet)

---

## CONTEXTO RAPIDO

O Certeiro One (certeiroone.vercel.app) e a plataforma operacional da Gabriel Certeiro Imoveis.
Stack: HTML/CSS/JS puro + Supabase + Vercel.
Repo: github.com/gabrielcerteiro/certeiroone
Supabase project ID: vtykzralkxlbqqkleofl
Docs de contexto no repo: CONTEXTO_CLAUDE_CODE.md, CLAUDION_BRIEFING.md

A aba Vendas e um NOVO modulo que precisa ser criado. Nao existe ainda.

---

## PASSO 1 - SQL NO SUPABASE

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
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcelas_comissao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vendas_all" ON vendas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "parcelas_all" ON parcelas_comissao FOR ALL USING (true) WITH CHECK (true);
```

### 1.5 Seed dos dados classificados
Importar do arquivo vendas_classificadas_completo.csv (92 registros).
Script de seed sera gerado na sessao de Claude Code.

---

## PASSO 2 - INTERFACE NO CERTEIRO ONE

### 2.1 Arquivo: vendas.html (novo)

Criar pagina seguindo o padrao visual do index.html existente.

#### Tela de listagem/consulta
- Tabela com todas as vendas
- Filtros: ano, tipo, exclusividade, construtora, parceria, status, categoria
- Ordenacao por: data_venda, valor_contrato, vgv, TMM
- Cards de resumo: total VGV, total vendas, ticket medio contrato, ticket medio VGV
- TMM = VGV / (dias_para_vender / 30) - so para vendas com exclusividade

#### Tela de registro (nova venda)
- Formulario com todos os campos do schema
- Dropdown de exclusividades (codigo + imovel_nome + proprietario)
- Auto-preenche imovel_nome e vendedor_nome quando seleciona exclusividade
- Secao de parcelas (adicionar/remover dinamicamente)

#### Tela de edicao (venda existente)
- Mesmos campos, preenchidos
- Secao de parcelas editavel
- Secao de pos-venda (reviews, depoimentos)

#### Tela de detalhe
- Overview completo
- Timeline de parcelas
- Link para exclusividade

### 2.2 Navegacao
Adicionar aba Vendas no menu do Certeiro One

---

## CAMPOS E ENUMS - REFERENCIA RAPIDA

imovel_tipologia: mobiliado, vazio, repaginado, terreno, permuta, na_planta
status_venda: contrato_assinado, negocio_concluido, cancelado, sem_comissao
tipo_participacao: corretor (6%), gestao (~1%)
categoria: 1 (original), 2 (pagamento do 1o), 3 (pagamento do 2o), 4 (raro)
forma_pagamento: a_vista, financiamento, parcelado_direto, permuta, misto
imovel_regiao: fazenda, praia_brava, cabecudas, ressacada, outro
parcelas status: pendente, recebida, atrasada, cancelada
correcao_tipo: igpm, ipca, percentual_fixo

---

## REGRAS DE NEGOCIO PARA A INTERFACE

1. numero_controle sequencial, NUNCA buraco - sistema sugere proximo
2. VGV = valor_honorarios / 0.05 - calculado no frontend, editavel
3. percentual_comissao default 6 - editavel (5% construtora, ~1% gestao)
4. TMM so aparece para vendas com exclusividade vinculada
5. Parcelas: fixas (data definitiva) ou evento (condicao + estimativa)
6. Dropdown exclusividades auto-preenche imovel e vendedor
7. Filtro padrao: exclui cancelado e sem_comissao
8. Rankings TMM: so exclusividades, decrescente

---

## WEBHOOK PIPEDRIVE -> N8N -> SUPABASE

1. Deal Won no Pipedrive -> webhook
2. n8n recebe -> extrai campos
3. INSERT na tabela vendas com status contrato_assinado
4. Notifica via WhatsApp

URL n8n: gabrielcerteiro.app.n8n.cloud

---

*Briefing tecnico gerado em 12/04/2026 - Sessao Claudion*