import { supabase } from "$lib/db/supabase-client";

export async function load() {
  const { data } = await supabase.from("countries").select("*");

  console.log(data);

  return {
    countries: data ?? [],
  };
}
