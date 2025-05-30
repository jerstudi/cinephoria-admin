export const SiteConfig = {
  title: "Cinephoria",
  description: "The best of cinema",
  prodUrl: "https://cinephoria-group.vercel.app",
  domain: "vercel.app",
  appIcon: "/assets/svg/Pyramid_red.svg",
  logo: "/assets/svg/Logo_full_a.svg",
  company: {
    name: "Cinephoria",
    address: "", // Remove if not needed
  },
  brand: {
    primary: "#007291", // You can adjust this to your brand color
  },
  email: {
    from: "Cinephoria <test@resend.dev>",
    contact: "test@resend.dev",
  },
  maker: {
    image: "https://melvynx.com/images/me/twitter-en.jpg",
    website: "https://melvynx.com",
    twitter: "https://twitter.com/melvyn_me",
    name: "Melvynx",
  },
  features: {
    /**
     * If enable, you need to specify the logic of upload here : src/features/images/uploadImageAction.tsx
     * You can use Vercel Blob Storage : https://vercel.com/docs/storage/vercel-blob
     * Or you can use Cloudflare R2 : https://mlv.sh/cloudflare-r2-tutorial
     * Or you can use AWS S3 : https://mlv.sh/aws-s3-tutorial
     */
    enableImageUpload: false as boolean,
    /**
     * If enable, you need to go to src/lib/auth/auth.ts and uncomment the line with the emoji 🔑
     * This feature will authorize users to login with a password.
     * Customize the signup form here : app/auth/signup/page.tsx
     */
    enablePasswordAuth: true as boolean,
    /**
     * If enable, the user will be redirected to `/orgs` when he visits the landing page at `/`
     * The logic is located in middleware.ts
     */
    enableLandingRedirection: false as boolean,
    /**
     * If enable, the user will be able to create only ONE organization and all his settings will be synced with it.
     * It's disable the `/settings` page from the organization and the `/orgs/new` page.
     */
    enableSingleMemberOrg: false as boolean,
  },
};
