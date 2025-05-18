import { CirclePlay, Star, Video, VideoOff } from "lucide-react";

export const genders = [
  { value: "action", label: "Action" },
  { value: "aventure", label: "Aventure" },
  { value: "animation", label: "Animation" },
  { value: "comedie", label: "Comédie" },
  { value: "drame", label: "Drame" },
  { value: "historique", label: "Historique" },
  { value: "fantastique", label: "Fantastique" },
  { value: "horreur", label: "Horreur" },
  { value: "romance", label: "Romance" },
  { value: "science-fiction", label: "Science-fiction" },
  { value: "thriller", label: "Thriller" },
] as const;

export const statuses = [
  {
    value: "active",
    label: "Active",
    icon: Video,
  },
  {
    value: "disabled",
    label: "Disabled",
    icon: VideoOff,
  },
];

export const favorites = [
  {
    value: "favorite",
    label: "Favorite",
    icon: Star,
  },
  {
    value: "others",
    label: "Others",
    icon: CirclePlay,
  },
];
