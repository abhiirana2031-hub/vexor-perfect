import 'piccolore';
import { o as decodeKey } from './chunks/astro/server_D8lp7jSv.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_Cj9HbhRN.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/abhay/Downloads/vexora%20perfect/vexora-tech-main/","cacheDir":"file:///C:/Users/abhay/Downloads/vexora%20perfect/vexora-tech-main/node_modules/.astro/","outDir":"file:///C:/Users/abhay/Downloads/vexora%20perfect/vexora-tech-main/dist/","srcDir":"file:///C:/Users/abhay/Downloads/vexora%20perfect/vexora-tech-main/src/","publicDir":"file:///C:/Users/abhay/Downloads/vexora%20perfect/vexora-tech-main/public/","buildClientDir":"file:///C:/Users/abhay/Downloads/vexora%20perfect/vexora-tech-main/dist/client/","buildServerDir":"file:///C:/Users/abhay/Downloads/vexora%20perfect/vexora-tech-main/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/cms/[collection]/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/cms\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"cms","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["collection","id"],"component":"src/pages/api/cms/[collection]/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/cms/[collection]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/cms\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"cms","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}]],"params":["collection"],"component":"src/pages/api/cms/[collection].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/contact","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/contact\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/contact.ts","pathname":"/api/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.BBsdOeEa.css"},{"type":"inline","content":"@keyframes scanMask{0%{-webkit-mask-position:0% 200%;mask-position:0% 200%}to{-webkit-mask-position:0% -100%;mask-position:0% -100%}}img[src*=\"12d367_71ebdd7141d041e4be3d91d80d4578dd\"]{-webkit-mask-image:linear-gradient(to bottom,transparent 0%,rgba(255,255,255,1) 50%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0%,rgba(255,255,255,1) 50%,transparent 100%);-webkit-mask-size:100% 200%;mask-size:100% 200%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;animation:scanMask 2s linear infinite}:where([style*=--img-aspect-ratio]){aspect-ratio:var(--img-aspect-ratio)}:where([style*=--img-default-width]){width:var(--img-default-width);max-width:100%}\n"}],"routeData":{"route":"/[...slug]","isIndex":false,"type":"page","pattern":"^(?:\\/(.*?))?\\/?$","segments":[[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/[...slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/abhay/Downloads/vexora perfect/vexora-tech-main/src/pages/[...slug].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/cms/[collection]/[id]@_@ts":"pages/api/cms/_collection_/_id_.astro.mjs","\u0000@astro-page:src/pages/api/cms/[collection]@_@ts":"pages/api/cms/_collection_.astro.mjs","\u0000@astro-page:src/pages/api/contact@_@ts":"pages/api/contact.astro.mjs","\u0000@astro-page:src/pages/[...slug]@_@astro":"pages/_---slug_.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BQRYltVs.mjs","C:/Users/abhay/Downloads/vexora perfect/vexora-tech-main/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_nImR3v-4.mjs","@/components/Router":"_astro/Router.Cy9FAt1V.js","@astrojs/react/client.js":"_astro/client.9JsEUElb.js","C:/Users/abhay/Downloads/vexora perfect/vexora-tech-main/src/pages/[...slug].astro?astro&type=script&index=0&lang.ts":"_astro/_...slug_.astro_astro_type_script_index_0_lang.D39gXpL9.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/abhay/Downloads/vexora perfect/vexora-tech-main/src/pages/[...slug].astro?astro&type=script&index=0&lang.ts","document.documentElement.style.height=\"100%\";document.body.style.height=\"100%\";const t=document.getElementById(\"root\");t&&(t.style.height=\"100%\",t.style.width=\"100%\");"]],"assets":["/_astro/8vIH7w4qzmVxm2NL9G78HEZnMg.D7C2x2Q6.woff2","/_astro/8vIH7w4qzmVxm2BL9G78HEY.BBZcRa21.woff2","/_astro/V8mDoQDjQSkFtoMM3T6r8E7mPb54C_k3HqUtEw.zl6yUm_6.woff2","/_astro/8vIH7w4qzmVxm25L9G78HEZnMg.DcRrHcIQ.woff2","/_astro/3XFsErsiyJsY9O_Gepph-HHkVfX82dZIZ0SnVQ.BrZ5jGwb.woff2","/_astro/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.DPT1xrvW.woff2","/_astro/V8mDoQDjQSkFtoMM3T6r8E7mPb94C_k3HqUtEw.wJGaI8U0.woff2","/_astro/3XFuErsiyJsY9O_Gepph-HHhZfn23vRK.UgQwO16B.woff2","/_astro/3XFsErsiyJsY9O_Gepph-HHkVfv82dZIZ0Q.DDkw8K3q.woff2","/_astro/3XFuErsiyJsY9O_Gepph-HHvZfn23vRKV0U.Dhj3l3pv.woff2","/_astro/_slug_.BBsdOeEa.css","/error.svg","/vexor-logo.png","/vexor-logo.svg","/_astro/client.9JsEUElb.js","/_astro/index.CfTCg2BY.js","/_astro/Router.Cy9FAt1V.js","/fonts/azeretmono/v21/3XFsErsiyJsY9O_Gepph-HHkVfv82dZIZ0Q.woff2","/fonts/azeretmono/v21/3XFsErsiyJsY9O_Gepph-HHkVfX82dZIZ0SnVQ.woff2","/fonts/azeretmono/v21/3XFuErsiyJsY9O_Gepph-HHhZfn23vRK.woff2","/fonts/azeretmono/v21/3XFuErsiyJsY9O_Gepph-HHvZfn23vRKV0U.woff2","/fonts/syne/v24/8vIH7w4qzmVxm25L9G78HEZnMg.woff2","/fonts/syne/v24/8vIH7w4qzmVxm2BL9G78HEY.woff2","/fonts/syne/v24/8vIH7w4qzmVxm2NL9G78HEZnMg.woff2","/fonts/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb54C_k3HqUtEw.woff2","/fonts/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPb94C_k3HqUtEw.woff2","/fonts/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2"],"buildFormat":"directory","checkOrigin":false,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"Md/RC+3JS3bxa7Hvv3bRNexr4rnppMIdY4uIYUgGOJ0="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
