<script setup lang="ts">
const dark = ref(false)

onMounted(() => {
  dark.value = localStorage.getItem('humeurs-theme') === 'dark'
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
})

watch(dark, value => {
  if (import.meta.client) {
    document.documentElement.dataset.theme = value ? 'dark' : 'light'
    localStorage.setItem('humeurs-theme', value ? 'dark' : 'light')
  }
})
</script>

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
        <NuxtLink to="/connexion" class="nav-auth-link">Connexion</NuxtLink>
      </nav>

      <div class="top-actions">
        <button class="theme-button" type="button" :aria-label="dark ? 'Passer en mode clair' : 'Passer en mode sombre'" @click="dark=!dark">
          {{ dark ? '☀' : '☾' }}
        </button>
        <NuxtLink to="/choisir-humeurs" class="top-action">Ça va comment ? <span>→</span></NuxtLink>
      </div>
    </header>

    <main><NuxtPage /></main>

    <footer class="site-footer">
      <NuxtLink to="/contact" class="footer-contact">Contact</NuxtLink>
      <span class="footer-separator">·</span>
      <span>Développé avec <span class="footer-heart">♥</span> par <a href="https://chirelhalioua.fr/" target="_blank" rel="noopener noreferrer">Chire Dev</a></span>
    </footer>

    <nav class="mobile-nav" aria-label="Navigation mobile">
      <NuxtLink to="/"><span>⌂</span>Accueil</NuxtLink>
      <NuxtLink to="/choisir-humeurs"><span>☻</span>Humeur</NuxtLink>
      <NuxtLink to="/suivi-humeurs"><span>◔</span>Suivi</NuxtLink>
      <NuxtLink to="/profil"><span>○</span>Profil</NuxtLink>
    </nav>
  </div>
</template>
