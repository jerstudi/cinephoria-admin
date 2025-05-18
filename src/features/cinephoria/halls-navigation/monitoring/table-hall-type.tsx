import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Halls } from "../data/schema";

type TableHallTypeProps = {
  hallsData: Halls;
};

export function TableHallType({ hallsData }: TableHallTypeProps) {
  const halls = hallsData.hall;
  const cinemas = hallsData.cinema;
  const cities = hallsData.cities;

  return (
    <div className="my-4 w-full rounded-lg border-none border-primary bg-white/5 p-4">
      <Table>
        <TableCaption>Spécificités des salles par type</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-fit text-center">
              Type de salle
            </TableHead>
            <TableHead className="min-w-fit text-center">
              Capacité (Cp)
            </TableHead>
            <TableHead className="flex min-w-fit flex-col items-center justify-center">
              <span>Nombre de</span>
              <span>places réservées (Dp)</span>
            </TableHead>
            <TableHead className="min-w-fit text-center">
              <span>Proportion </span>
              <span>(Dp / Cp)</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {halls.map((hall) => (
            <TableRow key={hall.id}>
              <TableCell className="font-medium">
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm font-medium uppercase">{hall.type}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm font-medium uppercase">
                    {hall.capacity}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm font-medium uppercase">
                    {hall.disabled_places}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm font-medium uppercase">
                    {((hall.disabled_places / hall.capacity) * 100).toFixed(2)}{" "}
                    %
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
