// Shim: the installed version of @tanstack/react-router ships without its
// bundled .d.ts files, so TypeScript cannot find declarations automatically.
// This module augmentation silences the "implicitly has an 'any' type" error
// until the package is re-installed with complete type artifacts.
declare module "@tanstack/react-router";
