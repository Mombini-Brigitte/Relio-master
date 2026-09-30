import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteClient, listClients } from "@/lib/clients.functions";

type Row = Awaited<ReturnType<typeof listClients>>[number];

export function RelioClientRecords() {
  const fetchClients = useServerFn(listClients);
  const removeClient = useServerFn(deleteClient);
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    fetchClients().then(setRows).catch(() => setRows([]));
  }, [fetchClients]);

  async function handleDelete(row: Row) {
    try {
      await removeClient({ data: { id: row.id } });
      setRows((r) => r?.filter((x) => x.id !== row.id) ?? null);
      toast.success(`Fiche de ${row.firstName} supprimée définitivement.`);
    } catch {
      toast.error("La suppression a échoué.");
    }
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-5xl px-4 pb-12 sm:px-8">
      <div className="rounded-[var(--radius-panel)] border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Fiches enregistrées & droit à l'oubli</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Supprimez une fiche et tout son historique sur simple demande du client. Les numéros des clients sans passage depuis 3 ans sont effacés automatiquement chaque nuit.
            </p>
          </div>
        </div>

        <ul className="mt-5 divide-y divide-border">
          {rows === null ? (
            <li className="py-3 text-sm text-muted-foreground">Chargement…</li>
          ) : rows.length === 0 ? (
            <li className="py-3 text-sm text-muted-foreground">Aucun client enregistré pour l'instant.</li>
          ) : (
            rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{row.firstName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {row.phone} · {row.messageCount} message{row.messageCount > 1 ? "s" : ""}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 aria-hidden="true" /> Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer la fiche de {row.firstName} ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Le numéro, les préférences et tout l'historique des messages seront effacés définitivement. Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(row)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
