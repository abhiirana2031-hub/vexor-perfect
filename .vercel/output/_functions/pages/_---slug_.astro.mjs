/* empty css                                  */
import { e as createComponent, k as renderComponent, l as renderHead, n as renderScript, r as renderTemplate } from '../chunks/astro/server_D8lp7jSv.mjs';
import 'piccolore';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
export { renderers } from '../renderers.mjs';

const Head = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
    /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
    /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://static.parastorage.com" })
  ] });
};

const prerender = false;
const $$ = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" class="w-full h-full"> <head>${renderComponent($$result, "Head", Head, {})}<meta charset="utf-8"><title>Vexor IT Solutions - Transform Your Business</title>${renderHead()}</head> <body class="w-full h-full overflow-x-hidden"> <div id="root" class="w-full h-full"> ${renderComponent($$result, "AppRouter", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/components/Router", "client:component-export": "default" })} </div> ${renderScript($$result, "C:/Users/abhay/Downloads/vexora perfect/vexora-tech-main/src/pages/[...slug].astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "C:/Users/abhay/Downloads/vexora perfect/vexora-tech-main/src/pages/[...slug].astro", void 0);

const $$file = "C:/Users/abhay/Downloads/vexora perfect/vexora-tech-main/src/pages/[...slug].astro";
const $$url = "/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
