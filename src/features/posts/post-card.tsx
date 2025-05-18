import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Post } from "./post-manager";

type PostCardProps = {
  post: Post;
  className?: string;
};

export const PostCard = (props: PostCardProps) => {
  return (
    <Link href={`/posts/${props.post.slug}`}>
      <Card className={cn("transition-all hover:shadow-xl", props.className)}>
        <CardHeader className="h-fit">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md">
            <img
              src={props.post.attributes.coverUrl}
              alt={props.post.attributes.title}
              className="size-full object-cover"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="space-y-2">
          <CardTitle>{props.post.attributes.title}</CardTitle>
          <CardDescription>{props.post.attributes.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};
