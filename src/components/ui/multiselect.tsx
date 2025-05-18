"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

const movieGenders = [
  { value: "action", label: "Action" },
  { value: "aventure", label: "Aventure" },
  { value: "animation", label: "Animation" },
  { value: "comedie", label: "Comédie" },
  { value: "drame", label: "Drame" },
  { value: "fantastique", label: "Fantastique" },
  { value: "horreur", label: "Horreur" },
  { value: "romance", label: "Romance" },
  { value: "science-fiction", label: "Science-fiction" },
  { value: "thriller", label: "Thriller" },
] as const;

type MultiSelectProps = {
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
};

export function MultiSelect({
  selected,
  onChange,
  placeholder = "Sélectionnez les genres...",
}: MultiSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "max-w-xl justify-between overflow-auto",
            !selected.length && "text-muted-foreground",
          )}
        >
          {selected.length > 0
            ? selected
                .map(
                  (value) =>
                    movieGenders.find((gender) => gender.value === value)
                      ?.label,
                )
                .join(", ")
            : placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher un genre..." className="h-9" />
          <CommandList>
            <CommandEmpty>Aucun genre trouvé.</CommandEmpty>
            <CommandGroup>
              {movieGenders.map((gender) => (
                <CommandItem
                  key={gender.value}
                  value={gender.value}
                  onSelect={(currentValue) => {
                    const value = currentValue;
                    onChange(
                      selected.includes(value)
                        ? selected.filter((item) => item !== value)
                        : [...selected, value],
                    );
                  }}
                  className="data-[disabled]:pointer-events-auto"
                >
                  {gender.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selected.includes(gender.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
