# CERTEIRO ONE — CONTEXTO ESTRATÉGICO
> Documento para iniciar novas conversas no Claude.ai (Claudion).
> Serve como base para planejar melhorias, novas funcionalidades e decisões estratégicas.
> Atualizado em: 07/04/2026

---

## 1. O NEGÓCIO

**Gabriel Certeiro Imóveis** é uma corretagem boutique de alto padrão em Itajaí/SC.
CRECI 22.249/SC. Foco exclusivo em imóveis residenciais prontos de 3 e 4 suítes
nos bairros Fazenda e Praia Brava.

### Modelo econômico
- Ticket médio: R$ 2M–2,5M (Fazenda) / R$ 3M+ (Praia Brava)
- Comissão: 6% inegociável (exceção: construtoras, 5%)
- Meta 2026: R$ 100M em VGV → ~R$ 5M receita bruta → ~R$ 3,5M lucro líquido
- ~20% das vendas em parceria (comissão 50/50)
- ~80–90% dos negócios envolvem permuta

### O que diferencia
Gabriel não opera como imobiliária. Opera como **projeto por imóvel**:
cada exclusividade recebe Repaginação Certeiro (R$ 70K–400K de capital próprio),
vídeo Certeiro Apresenta (10–15 min no YouTube para pré-qualificação),
tráfego pago dedicado, e Gabriel conduz ~90% das visitas pessoalmente.

**Resultado histórico:** saiu de imobiliária com 25 corretores (R$ 50M VGV, 20% margem)
para operação solo com retaguarda (R$ 80M VGV, 60% margem, 5x mais lucro).

**O insight central:** o valor do negócio está na capacidade de gerar demanda,
não em ter corretores. Escala sem escalar corretores.

---

## 2. POR QUE O CERTEIRO ONE EXISTE

### O problema que resolve
Gabriel opera um negócio de R$ 80M+ sem **nenhuma visibilidade de dados em tempo real**:
- Sem DRE há 2 anos
- Sem dashboard de exclusividades ativas
- Sem registro estruturado de visitas e propostas
- Contexto vive na cabeça de Gabriel — se ele para, a operação para

**O Certeiro One é a solução para esse problema.**
É o ERP operacional da corretagem — o lugar onde toda a operação de
exclusividades é registrada, acompanhada e analisada.

### O que o sistema faz hoje
1. **Pipeline de exclusividades** — visão do portfólio com funil de vendas por imóvel
2. **Funil de barras** — leads, visitas e propostas realizados vs. esperados (proporcional ao tempo)
3. **Timeline operacional** — marcos de cada exclusividade (repaginação, gravação, campanha, etc.)
4. **Registro de visitas** — cada visita documentada com objeções, intenção, qualificação
5. **Registro de propostas** — valor, forma de pagamento, status de negociação
6. **Controle de mídia** — gasto realizado vs. planejado proporcional ao tempo
7. **Disparos para base e parceiros** — registro e acompanhamento
8. **Ações de venda** — checklist de ações por exclusividade
9. **Relatório do vendedor** — link compartilhável com o proprietário mostrando o trabalho
10. **Alertas automáticos** — contratos vencendo, metas atrasadas, anomalias operacionais

### O que o sistema NÃO faz ainda
- Módulo Financeiro (DRE, custos, margem por exclusividade)
- Módulo Análise (conversão consolidada por canal)
- Módulo Vendas (tracking de VGV fechado e comissões recebidas)
- Integração com Pipedrive (fonte real de leads)

---

## 3. VISÃO DE LONGO PRAZO

O Certeiro One não é só um dashboard. É a **infraestrutura de dados** que vai
permitir Gabriel escalar sem perder controle — e que sustenta a transição
do modelo de corretagem para algo maior.

### Ecossistema estratégico (por ordem de prioridade)
1. **Gabriel Certeiro Corretor** (ativo) — financia tudo. Meta R$ 100M VGV 2026.
2. **Certeiro Construtora** (iniciando) — Angélica lidera. 1º projeto ~R$ 4M.
3. **Certeiro Capital** (pausado) — estruturação de negócios imobiliários. Retoma quando a operação principal for autônoma.
4. **Certeiro Real Estate** (futuro 2028–29) — internacionalização, Flórida, visto EB-1.

**A lógica:** corretagem (tira % do que já existe) → estruturação (cria valor)
→ incorporação (constrói patrimônio). Cada passo morde uma fatia maior do negócio.

### O papel do Certeiro One nessa visão
- **Hoje:** dar visibilidade operacional da corretagem (o que está acontecendo agora)
- **Curto prazo:** DRE e financeiro (quanto está sobrando de verdade)
- **Médio prazo:** BI consolidado (marketing + CRM + financeiro numa tela só)
- **Longo prazo:** base de dados para decisões da Certeiro Capital e Construtora

---

## 4. A EQUIPE QUE USA O SISTEMA

| Pessoa | Papel | Uso do sistema |
|--------|-------|----------------|
| **Gabriel Certeiro** | Closer, estratégia | Valida tudo. Vê alertas e pipeline. |
| **Rafaela** | Ops/CRM, pré-vendas | Registra visitas, propostas, alimenta funil |
| **Gabriel Marketing** | Execução técnica | Mantém o sistema, executa melhorias |
| **Robson Souza** | Corretor parceiro | Registra suas visitas |
| **Camila** | Coordenadora | Monitora qualidade dos dados |

---

## 5. ESTADO ATUAL DA PLATAFORMA — versão 1.2.0

### O que está funcionando
- Pipeline de exclusividades com funil de barras (dados reais)
- Alertas automáticos (6 regras)
- Timeline operacional
- Modal de nova exclusividade (criação em cascata)
- Registro de visitas e propostas com editar/excluir
- Disparos para base e parceiros
- Checkboxes de ações de venda
- Controle de mídia planejada vs. realizada
- Relatório do vendedor (link público)
- Visual profissional estilo Pipedrive
- PWA instalável no iOS

### O que NÃO funciona ainda
- Cadastro de novos usuários (bug técnico — Edge Function pendente)
- Módulos em breve: Análise, Captação, Vendas, Marketing, Conteúdo, Financeiro

---

## 6. BACKLOG — PRÓXIMAS MELHORIAS

### Alta prioridade (impacto operacional direto)
- [ ] Cadastro de usuários via Edge Function (service_role)
- [ ] Módulo Análise — conversão consolidada por canal de aquisição
- [ ] Módulo Vendas — registro de vendas fechadas e tracking de VGV realizado
- [ ] Integração Pipedrive → funil (hoje dados de leads são manuais)

### Média prioridade
- [ ] Módulo Financeiro — DRE simplificado (receitas, custos, margem por exclusividade)
- [ ] Dashboard para a Rafaela — visão de disparos e pré-vendas
- [ ] Logs de auditoria (quem fez o quê no sistema)
- [ ] Controle de acesso por role no frontend

### Segurança e estrutura
- [ ] Anon Key exposta no repositório — mover para variável de ambiente
- [ ] Repositório público — tornar privado
- [ ] Branches para desenvolvimento (hoje vai direto para produção)
- [ ] Backup automatizado documentado

### Futuro (quando a base estiver sólida)
- [ ] BI consolidado: Lovable (frontend) + n8n (middleware) + Supabase (banco)
- [ ] Integração com Controlle (financeiro)
- [ ] Visão da Certeiro Construtora no sistema

---

## 7. TENSÕES ESTRATÉGICAS ATIVAS

Questões que afetam decisões. Levar em conta ao sugerir melhorias:

1. **Fazenda vs. Praia Brava** — focar 100% no Fazenda ou manter os dois?
2. **Modelo atual vs. próximo nível** — corretagem (6%) vs. estruturação/incorporação (fatia maior). Como transicionar sem matar caixa?
3. **Centralização vs. autonomia** — tudo depende de Gabriel. Agentes de IA ajudam, mas gestão formal ainda não existe.
4. **Carteira inexplorada** — ~100 clientes pós-venda com zero follow-up. Oportunidade enorme.
5. **Pré-vendas** — Rafaela testando SDR. Sem script formal ainda.
6. **Financeiro cego** — sem DRE há 2 anos. O sistema precisa resolver isso.

---

## 8. REFERÊNCIA TÉCNICA RÁPIDA

**URL:** https://dashboard-certeiro.vercel.app
**Repo:** github.com/gabrielcerteiro/dashboard-certeiro
**Stack:** HTML/CSS/JS puro + Supabase + Vercel
**Deploy:** automático ao fazer push no branch main

**Arquivos principais:**
- `index.html` — dashboard principal (126KB)
- `registro.html` — visitas e propostas
- `vendedor.html` — relatório público
- `CONTEXTO_CLAUDE_CODE.md` — contexto técnico para Claude Code
- `CLAUDION_BRIEFING.md` — briefing de contexto para novas sessões

**Para iniciar conversa técnica (Claude Code):**
Usar `CONTEXTO_CLAUDE_CODE.md` + Prompt 0 de onboarding.

---

## 9. PRINCÍPIOS DE DESENVOLVIMENTO

- **Nada exige entrada manual** — dados fluem automaticamente do Supabase
- **Gabriel fora do sistema** — o sistema existe para liberar Gabriel para vender
- **Simples > sofisticado** — otimização antes de inovação
- **Dados reais > campos manuais** — funil lê das tabelas transacionais, não de campos editados
- **Mobile first** — Rafaela e Robson usam no celular no campo

---

## 10. COMO USAR ESTE DOCUMENTO

Cole no início de qualquer nova conversa no Claude.ai:

```
Sou Gabriel Certeiro. Leia o arquivo CERTEIRO_ONE_CONTEXTO_ESTRATEGICO.md
no repositório github.com/gabrielcerteiro/dashboard-certeiro
para entender o negócio e o estado atual da plataforma Certeiro One
antes de começarmos a planejar melhorias.
```
