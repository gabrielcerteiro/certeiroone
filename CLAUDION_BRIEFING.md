# CLAUDION BRIEFING — CERTEIRO ONE
> Documento de contexto para iniciar novas conversas no Claude.ai (Claudion ou Gabriel Marketing).
> Atualizado em: 08/04/2026 — v1.3.0 em producao, v1.3.1 em andamento

---

## O QUE E O CERTEIRO ONE

Plataforma ERP operacional interna da Gabriel Certeiro Imoveis.
Controla exclusividades imobiliarias: funil de vendas, visitas, propostas,
timeline operacional, disparos de marketing e relatorio para proprietarios.

**URL de producao:** https://certeiroone.vercel.app
**Repositorio:** github.com/gabrielcerteiro/certeiroone
**Deploy:** automatico via Vercel ao fazer push no branch main

---

## ESTADO ATUAL — versao 1.3.0 (08/04/2026)

### O que esta funcionando
- Dashboard em 4 grupos: Em Campanha / Em Repaginacao / Aguardando / Vendidas
- Grid 3 colunas para exclusividades Em Campanha
- Pipeline de exclusividades com funil de barras (dados reais)
- Sistema de alertas automaticos (6 regras)
- Timeline operacional por exclusividade
- Modal "+ Nova Exclusividade" com status inicial
- Registro de visitas e propostas (cadastrar, editar, excluir)
- Botao Editar em propostas no registro.html (adicionado hoje)
- RLS DELETE configurado para visitas e propostas (corrigido hoje)
- Banco limpo: duplicatas removidas, imoveis orfaos deletados
- Paineis de disparos para base e parceiros
- Checkboxes de acoes de venda com auto-save
- Relatorio do vendedor (link compartilhavel por imóvel)
- Visual estilo Pipedrive, PWA instalavel no iOS

---

## DECISOES ARQUITETURAIS TOMADAS HOJE (08/04/2026) — PENDENTES DE IMPLEMENTACAO

### 1. Tabela `usuarios` — fonte unica de verdade

Decisao: unificar tabelas `perfis` e `corretores` em uma unica tabela `usuarios`.
Isso elimina o problema de uma pessoa ter dois cadastros (um como usuario do sistema
e outro como corretor).

Estrutura definida:
```
id uuid PK
auth_id uuid (nullable — link com Supabase Auth, so quem tem login)
nome text NOT NULL
email text (nullable)
role text CHECK ('master','operacional','padrao')
is_corretor boolean (se aparece no select de corretor)
creci text (nullable)
foto_url text (nullable)
ativo boolean
created_at timestamptz
```

Mapeamento da equipe atual:
- Gabriel Certeiro → role='master', is_corretor=true, creci='22249/SC'
- Rafaela → role='operacional', is_corretor=false
- Robson Souza → role='padrao', is_corretor=true, creci='36145/SC'

### 2. Matriz de permissoes definida

| Acao | master | operacional | padrao |
|------|--------|-------------|--------|
| Ver exclusividades | sim | sim | sim |
| Criar exclusividade | sim | sim | nao |
| Editar exclusividade | sim | sim | nao |
| Excluir exclusividade | sim | sim | nao |
| Ver visitas | sim | sim | so proprias |
| Criar visita | sim | sim | sim |
| Editar visita | sim | sim | so proprias |
| Excluir visita | sim | sim | so proprias |
| Ver propostas | sim | sim | so proprias |
| Criar proposta | sim | sim | sim |
| Editar proposta | sim | sim | so proprias |
| Excluir proposta | sim | sim | so proprias |
| Modulo Financeiro | sim | nao | nao |
| Gerenciar usuarios | sim | nao | nao |

"So proprias" = registros onde criado_por_id = id do usuario logado.
Isso exige campo `criado_por_id` nas tabelas visitas e propostas.

### 3. SQL de migracao preparado (NAO executado ainda)

```sql
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  nome text NOT NULL,
  email text,
  role text NOT NULL DEFAULT 'padrao'
    CHECK (role IN ('master','operacional','padrao')),
  is_corretor boolean NOT NULL DEFAULT false,
  creci text,
  foto_url text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

INSERT INTO usuarios (nome, creci, foto_url, is_corretor, role, ativo)
SELECT nome, creci, foto_url, true,
  CASE WHEN nome ILIKE '%gabriel certeiro%' THEN 'master' ELSE 'padrao' END,
  ativo
FROM corretores ON CONFLICT DO NOTHING;

ALTER TABLE visitas ADD COLUMN IF NOT EXISTS criado_por_id uuid REFERENCES usuarios(id);
ALTER TABLE propostas ADD COLUMN IF NOT EXISTS criado_por_id uuid REFERENCES usuarios(id);
```

PENDENTE: verificar email exato do Gabriel no Supabase Auth antes de rodar o UPDATE do auth_id.
SQL para verificar: SELECT id, email FROM auth.users ORDER BY created_at;

### 4. Busca de registros no registro.html — prompt preparado

Refatoracao completa do modulo de historico:
- Remover listagem automatica dos ultimos 20 registros
- Adicionar painel de busca com 4 filtros: Tipo / Exclusividade / Corretor / Periodo
- Busca dinamica no Supabase, so executa ao clicar "Buscar"
- Filtro de corretor so se aplica a visitas (propostas nao tem campo corretor)
- Resultados exibem cards com Editar e Excluir funcionando normalmente

---

## PROXIMOS PASSOS — ORDEM DE EXECUCAO

1. Abrir nova conversa no Claude.ai (Claudion)
2. Colar o briefing de contexto abaixo
3. Verificar email dos usuarios no Supabase Auth
4. Executar SQL de migracao da tabela usuarios
5. Rodar Prompt A (gerenciamento de usuarios no index.html)
6. Rodar Prompt B (busca de registros no registro.html)
7. Atualizar CONTEXTO_CLAUDE_CODE.md
8. Fechar versao 1.3.1 no Google Doc

---

## ARQUITETURA TECNICA

**Stack:** HTML/CSS/JS puro + Supabase + Vercel
**Sem framework** — arquivos estaticos, sem build step

**Tabelas ativas:**
- imoveis, exclusividades, funil_snapshot
- visitas (tem campo corretor como texto)
- propostas (NAO tem campo corretor)
- corretores (sera substituida por usuarios)
- perfis (sera substituida por usuarios)

**Imoveis ativos no sistema:**
- Cezanne 1701, Soho 1102, Casa Ressacada n81, Marechiaro 402
- Felicita 802, Felicita 505, Laguna 1202 (encerrada)
- Reserva Perequê 2101, Smart Sao Joao 506

**Design System:**
- --navy: #191949 | --bg: #F5F5F8
- --green: #10B981 | --red: #EF4444 | --yellow: #F59E0B
- Icones: SVG inline estilo Lucide (ZERO emojis)
- ZERO acentos dentro de script — ASCII puro no JS

---

## EQUIPE

| Pessoa | Papel | Role no sistema |
|--------|-------|-----------------|
| Gabriel Certeiro | Dono, corretor principal | master |
| Rafaela | Ops/CRM, usa sistema diariamente | operacional |
| Gabriel Marketing | Executa Claude Code | - |
| Robson Souza | Corretor parceiro, CRECI 36145/SC | padrao |

---

## DOCUMENTOS DE REFERENCIA

| Documento | Onde |
|-----------|------|
| Contexto tecnico para Claude Code | CONTEXTO_CLAUDE_CODE.md no repo |
| Guia operacional Gabriel Marketing | GUIA_GABRIEL_MARKETING.md no repo |
| Contexto estrategico | CERTEIRO_ONE_CONTEXTO_ESTRATEGICO.md no repo |
| Versionamento e backlog | Google Doc: https://docs.google.com/document/d/12I9mgnHr1AK79a9PQhKWztBEVtBOwvC9ebI1pzhC8YQ |

---

## COMO INICIAR NOVA CONVERSA NO CLAUDE.AI

### Para o Claudion (Gabriel Certeiro) — use este texto:

```
Sou Gabriel Certeiro. Estamos trabalhando na plataforma Certeiro One
(certeiroone.vercel.app). Leia o arquivo CLAUDION_BRIEFING.md
no repositorio github.com/gabrielcerteiro/certeiroone
para ter o contexto completo antes de continuar.
Estamos no meio da v1.3.1 — foco nos proximos passos definidos no briefing.
```

### Para o Gabriel Marketing:

```
Sou Gabriel Marketing da Gabriel Certeiro Imoveis.
Preciso executar melhorias na plataforma Certeiro One.
Leia o CLAUDION_BRIEFING.md e o CONTEXTO_CLAUDE_CODE.md
no repositorio github.com/gabrielcerteiro/certeiroone
para entender o estado atual antes de comecar.
```

---

## REGRAS CRITICAS DE CODIGO

1. ZERO acentos dentro de script — ASCII puro no JS
2. ZERO emojis — SVG inline estilo Lucide
3. create_or_update_file individualmente (nao push_files para arquivos grandes)
4. SHA obrigatorio ao atualizar arquivo existente
5. Sempre get_file_contents antes de editar
6. Atualizar CONTEXTO_CLAUDE_CODE.md ao final de cada sessao

---

## NOTAS IMPORTANTES

- URL antiga dashboard-certeiro.vercel.app DESATIVADA — usar certeiroone.vercel.app
- Propostas NAO tem coluna corretor — nunca incluir no payload
- registro.html NAO tem criacao de imovel — apenas visitas e propostas
- Supabase view: novos campos sempre DEPOIS de count_propostas no SELECT
- RLS DELETE configurado para visitas e propostas (corrigido 08/04/2026)
