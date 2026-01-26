import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { type InsertSubscriber } from "@shared/schema";

export function useSubscribeToNewsletter() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSubscriber) => {
      const validated = api.newsletter.subscribe.input.parse(data);
      
      const res = await fetch(api.newsletter.subscribe.path, {
        method: api.newsletter.subscribe.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        // Handle specific error codes if needed
        if (res.status === 409) {
          throw new Error("You are already subscribed!");
        }
        if (res.status === 400) {
          const error = api.newsletter.subscribe.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to subscribe. Please try again.");
      }

      return api.newsletter.subscribe.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
