import { Typography } from "@/components/ui/typography";
import { Layout, LayoutContent } from "@/features/page/layout";
import { SiteConfig } from "@/site-config";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-background">
      <Layout size="lg" className="py-24">
        <LayoutContent className="mx-auto flex w-full max-w-7xl justify-between max-lg:flex-col">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/svg/Logo_group.svg"
                alt="Cinephoria group logo"
                width={100}
                height={100}
                className="w-60"
              />
              <Image
                src="/assets/svg/GEI.svg"
                alt="Cinephoria group logo"
                width={100}
                height={100}
                className="w-40"
              />
            </div>
            <Typography variant="muted" className="italic">
              © {new Date().getFullYear()}{" "}
              <Link href="/">{SiteConfig.company.name}</Link> - All rights
              reserved.
            </Typography>
          </div>
          <div className="flex flex-col items-end gap-4">
            <Typography variant="large">Legal</Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
              href="/legal/terms"
            >
              Terms
            </Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
              href="/legal/privacy"
            >
              Privacy
            </Typography>
          </div>
          <div className="flex flex-col items-end gap-4">
            <Typography variant="large">Resources</Typography>
            {/* <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
              href="/posts"
            >
              Blog
            </Typography> */}
            <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
              href="/orgs"
            >
              Dashboard
            </Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
              href="/account"
            >
              Account
            </Typography>
          </div>
        </LayoutContent>
      </Layout>
    </footer>
  );
};
