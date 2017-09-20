import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import flow from 'rollup-plugin-flow';

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    resolve(),
    flow(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  dest: 'bundle.js'
};
