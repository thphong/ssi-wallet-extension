import sveltePreprocess from 'svelte-preprocess';

export default {
    preprocess: sveltePreprocess(),  // enables TypeScript in Svelte, plus SCSS, etc. if needed
    compilerOptions: {
        dev: false  // set true for development builds for easier debugging
    }
};
