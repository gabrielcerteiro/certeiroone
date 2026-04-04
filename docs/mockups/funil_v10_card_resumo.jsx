import { useState } from "react";

const T = {
  navy: "#191949", white: "#FFFFFF", bg: "#F5F5F8", text: "#191949",
  muted: "#8E8EA0", s2: "#ECECF1", s3: "#D9D9E3",
  green: "#10B981", greenBg: "rgba(16,185,129,0.08)",
  red: "#EF4444", redBg: "rgba(239,68,68,0.08)",
  yellow: "#F59E0B", yellowBg: "rgba(245,158,11,0.08)",
  blue: "#3B82F6",
};

function sem(real, esperado) {
  if (esperado === 0) return "green";
  var ratio = real / esperado;
  if (ratio >= 1) return "green";
  if (ratio >= 0.8) return "yellow";
  return "red";
}
function semColor(s) { return s === "green" ? T.green : s === "yellow" ? T.yellow : T.red; }

function BarRow({ label, real, esperado, total, isTempo }) {
  var pctReal = total > 0 ? Math.min((real / total) * 100, 100) : 0;
  var pctEsperado = total > 0 ? Math.min((esperado / total) * 100, 100) : 0;
  var color = isTempo ? "navy" : sem(real, esperado);
  var c = isTempo ? T.navy : semColor(color);
  var isBehind = !isTempo && real < esperado;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{ width: 58, fontSize: 11, fontWeight: 700, color: T.text, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1 }}>
        <div style={{ position: "relative", height: 7, background: T.s2, borderRadius: 4 }}>
          {!isTempo && <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: pctEsperado + "%", background: c, opacity: 0.18, borderRadius: 4 }} />}
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: pctReal + "%", background: c, opacity: isTempo ? 0.35 : 1, borderRadius: 4 }} />
          {!isTempo && <div style={{ position: "absolute", top: -3, bottom: -3, left: pctEsperado + "%", width: 2, background: T.navy, borderRadius: 2, zIndex: 2 }} />}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2, flexShrink: 0, justifyContent: "flex-end" }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: isBehind ? semColor(color) : T.text }}>{real}</span>
        {!isTempo && <span style={{ fontSize: 10, color: T.muted }}>/ {esperado}</span>}
        <span style={{ fontSize: 9, color: T.s3 }}>{isTempo ? "/ " + total + "d" : "de " + total}</span>
      </div>
    </div>
  );
}

function Card({ nome, preco, data, diasPassados, diasTotal, espLeads, espVisitas, espPropostas, espMidia, metaLeads, metaVisitas, metaPropostas, metaMidia, cplRef }) {
  var cplReal = data.leads > 0 ? Math.round(data.midia / data.leads) : 0;
  var cplOver = cplReal > cplRef;
  var midiaIsBehind = data.midia < espMidia;
  var colors = [sem(data.leads, espLeads), sem(data.visitas, espVisitas), sem(data.propostas, espPropostas)];
  var worstColor = colors.indexOf("red") >= 0 ? T.red : colors.indexOf("yellow") >= 0 ? T.yellow : T.green;
  return (
    <div style={{ background: T.white, borderRadius: 14, padding: 16, border: "1px solid " + T.s2, boxShadow: "0 1px 3px rgba(25,25,73,0.06)", borderLeft: "4px solid " + worstColor, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.3, color: T.text, flex: 1, paddingRight: 8, lineHeight: 1.3 }}>{nome}</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.text, whiteSpace: "nowrap" }}>{preco}</div>
      </div>
      <BarRow label="Tempo" real={diasPassados} esperado={diasPassados} total={diasTotal} isTempo={true} />
      <BarRow label="Leads" real={data.leads} esperado={espLeads} total={metaLeads} />
      <BarRow label="Visitas" real={data.visitas} esperado={espVisitas} total={metaVisitas} />
      <BarRow label="Propostas" real={data.propostas} esperado={espPropostas} total={metaPropostas} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid " + T.s2, marginTop: 6, paddingTop: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: T.muted }}>Ads</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: midiaIsBehind ? T.red : T.text }}>R$ {data.midia.toLocaleString("pt-BR")}</span>
          <span style={{ fontSize: 8, color: T.muted }}>/ {espMidia.toLocaleString("pt-BR")}</span>
          <span style={{ fontSize: 7, color: T.s3 }}>de {metaMidia.toLocaleString("pt-BR")}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontSize: 7, fontWeight: 700, background: T.navy, color: "#fff", padding: "1px 4px", borderRadius: 3 }}>CPL</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: cplOver ? T.red : T.green }}>R$ {cplReal}</span>
          <span style={{ fontSize: 8, color: T.muted }}>ref. {cplRef}</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 8, borderTop: "1px solid " + T.s2 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.navy, cursor: "pointer" }}>Atualizar</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.blue, cursor: "pointer" }}>Ver detalhe &#8594;</div>
      </div>
    </div>
  );
}

// MOCKUP v10 - Card Resumo de Exclusividade (layout final aprovado)
export default function FunilV10() {
  var diasPassados = 40;
  var diasTotal = 60;
  var fator = diasPassados / diasTotal;
  var metaLeads = 50;
  var metaVisitas = 12;
  var metaPropostas = 3;
  var metaMidia = 12000;
  var cplRef = 100;
  var espLeads = Math.round(metaLeads * fator);
  var espVisitas = Math.round(metaVisitas * fator);
  var espPropostas = Math.round(metaPropostas * fator);
  var espMidia = Math.round(metaMidia * fator);
  var r1 = { leads: 28, visitas: 9, propostas: 2, midia: 8200 };
  var r2 = { leads: 12, visitas: 2, propostas: 0, midia: 3200 };
  var r3 = { leads: 38, visitas: 10, propostas: 3, midia: 7800 };
  var shared = { diasPassados, diasTotal, espLeads, espVisitas, espPropostas, espMidia, metaLeads, metaVisitas, metaPropostas, metaMidia, cplRef };
  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'Nunito Sans', sans-serif" }}>
      <div style={{ padding: "14px 16px 24px", maxWidth: 480, margin: "0 auto" }}>
        <Card nome="Soho 1102 - Cristiano Molina" preco="R$ 2,2M" data={r3} {...shared} />
        <Card nome="Cezanne 1701 - Flavio Mussi" preco="R$ 7,2M" data={r1} {...shared} />
        <Card nome="Marechiaro 402 - Elaine" preco="R$ 3,5M" data={r2} {...shared} />
      </div>
    </div>
  );
}
