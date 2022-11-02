// webpack.mix.js
let mix = require('laravel-mix');

mix.setPublicPath('build')
    .ts('src/index.tsx', 'build/givewp-form-builder.js').react()
    .sass('src/App.scss', 'build/givewp-form-builder.css');
