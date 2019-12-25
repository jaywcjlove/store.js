const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const banner = require('bannerjs');
const zlib = require('zlib');
require('colors-cli/toxic');

// see below for details on the options
const inputOptions = {
  input: 'lib/main.js',
  plugins: [
    nodeResolve(), // so Rollup can find `ms`
    commonjs(), // so Rollup can convert `ms` to an ES module
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
    }),
  ],
};

(async () => {
  const bundle = await rollup.rollup(inputOptions);
  const umd = await bundle.write({
    file: 'dist/store.js',
    format: 'umd',
    name: 'store',
    banner: banner.multibanner(),
  });
  report(umd, 'dist/store.js');

  const iife = await bundle.write({
    file: 'dist/store.min.js',
    name: 'store',
    banner: banner.onebanner(),
    format: 'iife',
    plugins: [terser()]
  });
  report(iife, 'dist/store.min.js');

  const esm = await bundle.write({
    file: 'dist/store.esm.js',
    format: 'esm',
    name: 'store',
    banner: banner.multibanner(),
  });
  report(esm, 'dist/store.esm.js');

  const cjs = await bundle.write({
    file: 'dist/store.cjs.js',
    format: 'cjs',
    name: 'store',
    banner: banner.multibanner(),
  });
  report(cjs, 'dist/store.cjs.js');

})();

function report(result, outpath, extra) {
  const code = result.output[0].code;
  zlib.gzip(code, (_err, zipped) => {
    if (_err) return reject(_err);
    extra = `(gzipped: ${getSize(zipped).green_bt})`;
    console.log(`${(outpath).blue_bt} ${getSize(code).green_bt + (extra || '')}`);
  });
}

function getSize(code) {
  return `${(code.length / 1024).toFixed(2)}kb`;
}
