<template>
  <div class="app-shell">
    <header class="topbar">
      <NuxtLink to="/" class="brand" aria-label="Les Humeurs à la Funes">
        <span class="brand-mark">☺</span>
        <span>Les Humeurs <em>à la Funes</em></span>
      </NuxtLink>
      <nav class="desktop-nav" aria-label="Navigation principale">
        <NuxtLink to="/choisir-humeurs">Mon humeur</NuxtLink>
        <NuxtLink to="/suivi-humeurs">Mon suivi</NuxtLink>
        <NuxtLink to="/profil">Profil</NuxtLink>
      </nav>
      <NuxtLink to="/choisir-humeurs" class="top-action">Ça va comment ? <span>→</span></NuxtLink>
    </header>

    <main><NuxtPage /></main>

    <nav class="mobile-nav" aria-label="Navigation mobile">
      <NuxtLink to="/"><span>⌂</span>Accueil</NuxtLink>
      <NuxtLink to="/choisir-humeurs"><span>☻</span>Humeur</NuxtLink>
      <NuxtLink to="/suivi-humeurs"><span>◔</span>Suivi</NuxtLink>
      <NuxtLink to="/profil"><span>○</span>Profil</NuxtLink>
    </nav>
  </div>
</template>