// @ts-nocheck
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const condition = true;
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="font-bold flex text-4xl text-center">Welcome to Remix</h1>
      <p
        className={`text-center ${
          condition ? "text-red-500" : "text-blue-500"
        }`}
      >
        This is a dynamic paragraph with conditional Tailwind classes.
      </p>
    </div>
  );
}
