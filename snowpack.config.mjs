/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public:'/',
    src:'/dist',
  },
  plugins: [
   '@snowpack/plugin-react-refresh',
   '@snowpack/plugin-dotenv',
   '@snowpack/plugin-postcss',
  '@snowpack/plugin-webpack'
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
     {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    bundle:true,
    minify:true,
    target: 'es2018',
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    tailwindConfig:'./tailwind.config.js'
  },
  buildOptions: {
    /* ... */
  },
};
