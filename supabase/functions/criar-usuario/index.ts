// supabase/functions/criar-usuario/index.ts
// Edge Function para criar usuario no Supabase Auth + tabela usuarios
// Requer SUPABASE_SERVICE_ROLE_KEY configurada no ambiente

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Nao autorizado" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseAnon = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authErr } = await supabaseAnon.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Sessao invalida" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { data: caller } = await supabaseAnon
      .from("usuarios")
      .select("role")
      .eq("auth_id", user.id)
      .single();

    if (!caller || caller.role !== "master") {
      return new Response(JSON.stringify({ error: "Permissao insuficiente. Apenas master pode criar usuarios." }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { nome, email, role, senha } = await req.json();
    if (!nome || !email || !role || !senha) {
      return new Response(JSON.stringify({ error: "Campos obrigatorios: nome, email, role, senha" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const rolesValidos = ["padrao", "operacional", "master"];
    if (!rolesValidos.includes(role)) {
      return new Response(JSON.stringify({ error: "Role invalido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

    if (createErr) {
      return new Response(JSON.stringify({ error: createErr.message }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { error: insertErr } = await supabaseAdmin
      .from("usuarios")
      .insert({ auth_id: newUser.user.id, nome, email, role, is_corretor: false, ativo: true });

    if (insertErr) {
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return new Response(JSON.stringify({ error: "Erro ao salvar usuario: " + insertErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, user_id: newUser.user.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Erro interno" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
