import Image from "next/image";
import { clsx, type ClassValue } from "clsx";

import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva("bg-pink-500 text-black", {
  variants: {
    intent: {
      primary: ["your", "primary", "classes"],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

const classes = {
  container: twMerge(
    `flex flex-col items-stretch mt-4 text-[20px] lg:text-red-500`
  ),
  col1: twMerge(`flex flex-col w-[55.56%]`),
  col2: twMerge(`flex flex-1`),
};

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export interface ButtonVariants extends VariantProps<typeof buttonVariants> {}

export const button = (variants: ButtonVariants) =>
  twMerge(buttonVariants(variants));

export default function Home() {
  const scrolled = false; 
  const bgColor = "pink"
  return (
    <main className="flex flex-col justify-between items-center p-24 min-h-screen">
      <animate
        className={cn(
          'z-40 relative flex border-gray-200 border-b w-full transition-all duration-300',
          bgColor,
          scrolled ? 'shadow-md' : ''
        )}
      ></animate>
      <span
        className={clsx(
          "inline-flex items-center px-2 py-1 rounded-full text-sm",
          {
            "bg-gray-100 text-gray-500": status === "pending",
            "bg-green-500 text-white": status === "paid",
          }
        )}
      ></span>
      <div className="z-10 lg:flex justify-between items-center w-full max-w-5xl font-mono text-sm">
        <p className="top-0 left-0 lg:static fixed flex justify-center lg:bg-gray-200 lg:dark:bg-zinc-800/30 dark:bg-zinc-800/30 bg-gradient-to-b from-zinc-200 dark:from-inherit backdrop-blur-2xl lg:p-4 pt-8 pb-6 lg:border border-gray-300 dark:border-neutral-800 border-b lg:rounded-xl w-full lg:w-auto">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="bottom-0 left-0 lg:static fixed flex justify-center items-end bg-gradient-to-t from-white dark:from-black via-white dark:via-black lg:bg-none w-full lg:w-auto h-48 lg:h-auto">
          <a
            className="flex place-items-center gap-2 p-8 lg:p-0 pointer-events-none lg:pointer-events-auto"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="z-[-1] after:-z-20 before:absolute after:absolute relative flex place-items-center before:bg-gradient-radial before:dark:bg-gradient-to-br after:bg-gradient-conic before:dark:from-transparent before:from-white after:dark:from-sky-900 after:from-sky-200 after:dark:via-[#0141ff] after:via-blue-200 before:dark:to-blue-700 before:to-transparent before:dark:opacity-10 after:dark:opacity-40 before:blur-2xl after:blur-2xl before:rounded-full sm:before:w-[480px] sm:after:w-[240px] before:w-full after:w-full before:h-[300px] before:lg:h-[360px] after:h-[180px] before:content-[''] after:content-[''] before:-translate-x-1/2 after:translate-x-1/3">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="grid lg:grid-cols-4 mb-32 lg:mb-0 lg:w-full lg:max-w-5xl lg:text-left text-center">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group hover:bg-gray-100 hover:dark:bg-neutral-800/30 px-5 py-4 border hover:border-gray-300 hover:dark:border-neutral-700 border-transparent rounded-lg transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{" "}
            <span className="inline-block motion-reduce:transform-none transition-transform group-hover:translate-x-1">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group hover:bg-gray-100 hover:dark:bg-neutral-800/30 px-5 py-4 border hover:border-gray-300 hover:dark:border-neutral-700 border-transparent rounded-lg transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{" "}
            <span className="inline-block motion-reduce:transform-none transition-transform group-hover:translate-x-1">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group hover:bg-gray-100 hover:dark:bg-neutral-800/30 px-5 py-4 border hover:border-gray-300 hover:dark:border-neutral-700 border-transparent rounded-lg transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{" "}
            <span className="inline-block motion-reduce:transform-none transition-transform group-hover:translate-x-1">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group hover:bg-gray-100 hover:dark:bg-neutral-800/30 px-5 py-4 border hover:border-gray-300 hover:dark:border-neutral-700 border-transparent rounded-lg transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block motion-reduce:transform-none transition-transform group-hover:translate-x-1">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
