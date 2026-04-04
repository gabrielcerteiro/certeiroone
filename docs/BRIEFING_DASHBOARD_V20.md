# BRIEFING — Implementacao Dashboard v20
# Gabriel Certeiro — Dashboard Operacional de Exclusividades

---

## OBJETIVO

Reescrever o `index.html` do repositorio `gabrielcerteiro/dashboard-certeiro` (branch `main`) para implementar o novo layout aprovado do dashboard operacional de exclusividades.

O deploy e automatico via Vercel em `dashboard-certeiro.vercel.app`.

**SHA atual do arquivo index.html:** `6e14ad63fea12323c5e3a710539709938152693b`

---

## CUIDADOS CRITICOS (LER ANTES DE TUDO)

Na tentativa anterior de atualizar este arquivo, o conteudo ficou corrompido. As causas foram:

1. Caracteres unicode escapados apareceram dentro do JS (ex: `\u00ed` em vez de texto limpo)
2. Barras invertidas nos fechamentos de tag (`<\/` em vez de `</`)
3. Acentos dentro de blocos `<script>` quebraram na serializacao JSON da API do GitHub

**Regras obrigatorias:**
- **ZERO acentos dentro de blocos `<script>`** — usar apenas ASCII puro no JavaScript
- **Emojis como HTML entities** (ex: `&#128202;` em vez do emoji literal)
- **Sem barras invertidas nos fechamentos de tag** — usar `</` normal
- **Validar o conteudo do arquivo antes de fazer push**
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

Para especificacao completa do layout, consultar o arquivo BRIEFING_DASHBOARD_V20.md gerado pelo Claudion.

Os mockups de referencia estao em:
- `docs/mockups/funil_v10_card_resumo.jsx` — layout do card resumo
- `docs/mockups/funil_v20_tela_detalhe.jsx` — layout da tela de detalhe
