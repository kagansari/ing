import summary from 'rollup-plugin-summary';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import {rollupPluginHTML} from '@web/rollup-plugin-html';
import {copy} from '@web/rollup-plugin-copy';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

export default {
  output: {
    dir: 'build',
  },
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    rollupPluginHTML({
      publicPath: '/',
      input: 'index.html',
    }),
    // This is required by redux-toolkit
    replace({
      preventAssignment: false,
      'Reflect.decorate': 'undefined',
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'production'
      ),
    }),
    resolve(),
    // Required for @lit/localize
    dynamicImportVars(),
    /**
     * This minification setup serves the static site generation.
     * For bundling and minification, check the README.md file.
     */
    terser({
      ecma: 2021,
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    summary(),
    copy({
      patterns: ['assets/**/*', 'coverage/**/*'],
    }),
  ],
};
