/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

declare module '*.svelte' {
    import type { ComponentType, SvelteComponent } from 'svelte';
    const component: ComponentType<SvelteComponent>;
    export default component;
}
