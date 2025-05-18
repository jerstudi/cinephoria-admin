import { ListPlus, Plus, type LucideProps } from "lucide-react";

const AddButton = {
  icon: "icon",
  simple: "simple",
  text: "text",
} as const;

export type AddButton = (typeof AddButton)[keyof typeof AddButton];

type AddButtonStyleProps = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  simple: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
};

export const AddButtonStyle: AddButtonStyleProps = {
  icon: ListPlus,
  simple: Plus,
  text: "Ajouter",
};
