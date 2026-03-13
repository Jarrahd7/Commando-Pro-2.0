import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useCommands() {
  return useQuery({
    queryKey: [api.commands.list.path],
    queryFn: async () => {
      const res = await fetch(api.commands.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch commands");
      return api.commands.list.responses[200].parse(await res.json());
    },
  });
}
