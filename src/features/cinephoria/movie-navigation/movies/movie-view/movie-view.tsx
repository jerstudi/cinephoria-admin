"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/typography";
import { imageLoader, parseStringToArray } from "@/lib/utils";
import type { Row } from "@tanstack/react-table";
import {
  CircleUser,
  Clock2,
  Dot,
  Eye,
  SquareCheckBig,
  Star,
  Video,
  VideoOff,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import type { Movie } from "../data/schema";
import { UpdateMovieForm } from "../update/update-movie-form";

type MovieViewProps = {
  row: Row<Movie>;
};

export function MovieView({ row }: MovieViewProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [showEdit, setShowEdit] = React.useState<boolean>(false);

  const session = useSession();
  const router = useRouter();
  const params = useParams<{ orgSlug: string }>();

  const movie = row.original;

  const handleEditClose = React.useCallback(() => {
    setShowEdit(false);
  }, []);

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  const rowGenders = movie.gender
    ? parseStringToArray({ str: movie.gender })
    : [];

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant={"ghost"} size={"sm"}>
                  <Eye className="size-5" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Overview</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="min-w-[96vw] max-w-fit rounded-lg lg:min-w-[680px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SquareCheckBig className="size-5" />
              {movie.identifier}
            </DialogTitle>
            <DialogDescription>{movie.description}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 items-start justify-center gap-4 lg:grid-cols-3">
            {/* Poster */}
            <div className="flex w-full items-center justify-center">
              {movie.poster ? (
                <div className="size-auto px-4">
                  <Image
                    loader={({ src, width, quality }) =>
                      imageLoader({
                        src,
                        width,
                        quality: quality ?? 75,
                        host: "https",
                        domain: "image.tmdb.org",
                      })
                    }
                    src={movie.poster}
                    alt={movie.title}
                    width={800}
                    height={800}
                    className="rounded-md"
                  />
                </div>
              ) : (
                <div className="size-24 rounded-md bg-muted" />
              )}
            </div>
            {/* Infos */}
            <div className="grid grid-cols-1 gap-0 lg:col-span-2">
              <Typography variant={"p"} className="mb-2 text-xs text-zinc-500">
                {movie.movieDate ? (
                  movie.movieDate
                ) : (
                  <span className="italic">No date</span>
                )}
              </Typography>
              <Typography variant={"h2"} className="">
                {movie.title ? (
                  movie.title
                ) : (
                  <span className="italic">Movie without title</span>
                )}
              </Typography>
              <div className="flex flex-wrap items-center gap-0">
                {rowGenders.length > 0 ? (
                  rowGenders.map((g, idx) => {
                    const isLast = idx === rowGenders.length - 1;
                    return (
                      <p key={g} className="flex items-center gap-0">
                        <span className="text-[0.8rem] uppercase text-zinc-500">
                          {g}
                        </span>
                        {!isLast && (
                          <Dot className="size-8 text-muted-foreground" />
                        )}
                      </p>
                    );
                  })
                ) : (
                  <Badge variant={"outline"} className="text-muted">
                    No gender
                  </Badge>
                )}
              </div>
              <div className="my-4 text-sm text-muted-foreground">
                {movie.synopsis && movie.synopsis.length > 700
                  ? `${movie.synopsis.slice(0, 700)}...`
                  : movie.synopsis || (
                      <span className="italic">No synopsis</span>
                    )}
              </div>
              <Separator className="my-2" />
              <div className="my-2">
                <Typography
                  variant={"p"}
                  className="!mt-0 text-sm text-muted-foreground"
                >
                  Director :{" "}
                  {movie.directors ? (
                    movie.directors
                  ) : (
                    <span className="italic">No directors</span>
                  )}
                </Typography>
                <Typography
                  variant={"p"}
                  className="!mt-0 text-sm text-muted-foreground"
                >
                  Music Composer :{" "}
                  {movie.musicComposer ? (
                    movie.musicComposer
                  ) : (
                    <span className="italic">No music composer</span>
                  )}
                </Typography>
                <Typography
                  variant={"p"}
                  className="!mt-0 text-sm text-muted-foreground"
                >
                  Actors :{" "}
                  {movie.actors ? (
                    movie.actors
                  ) : (
                    <span className="italic">No actors</span>
                  )}
                </Typography>
              </div>
              <div className="my-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock2 className="size-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {`${movie.duration} min`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <CircleUser className="size-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{`${movie.ageLimit} +`}</p>
                </div>
                <div className="flex items-center gap-1">
                  {movie.favorite && (
                    <Star className="size-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {movie.active ? (
                    <Video className="size-4 text-muted-foreground" />
                  ) : (
                    <VideoOff className="size-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-10 sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="w-24"
              onClick={() => {
                setOpen(false);
                setShowEdit(true);
              }}
            >
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showEdit && (
        <UpdateMovieForm
          row={row}
          isDialogOpen={true}
          onClose={handleEditClose}
          icon={false}
        />
      )}
    </>
  );
}
