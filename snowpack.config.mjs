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
   '@snowpack/plugin-optimize'
  // '@snowpack/plugin-webpack'
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
     {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    bundle:true,
    minify:true,
    sourcemap:false,
    target: 'es2017',
    
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
