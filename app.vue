<script setup lang="ts">
const dark = ref(false)
const { loggedIn } = useUserSession()

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
      <NuxtLink to="/" class="brand" aria-label="Les Humeurs à la Funes"><BrandLogo /></NuxtLink>

      <nav class="desktop-nav" aria-label="Navigation principale">
        <NuxtLink to="/choisir-humeurs">Mon humeur</NuxtLink>
        <NuxtLink to="/suivi-humeurs">Mon suivi</NuxtLink>
        <NuxtLink v-if="loggedIn" to="/profil">Profil</NuxtLink>
        <NuxtLink v-else to="/connexion" class="nav-auth-link">Connexion</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
      </nav>

      <div class="top-actions">
        <button class="theme-button" type="button" :aria-label="dark ? 'Passer en mode clair' : 'Passer en mode sombre'" @click="dark=!dark">
          {{ dark ? '☀' : '☾' }}
        </button>
        <NuxtLink to="/choisir-humeurs" class="top-action">Comment ça va ? <span>→</span></NuxtLink>
      </div>
    </header>

    <main><NuxtPage /></main>

    <nav class="mobile-app-nav" aria-label="Navigation mobile">
      <NuxtLink to="/" class="mobile-app-item">
        <span class="mobile-app-icon">⌂</span>
        <small>Accueil</small>
      </NuxtLink>
      <NuxtLink to="/choisir-humeurs" class="mobile-app-item">
        <span class="mobile-app-icon">☻</span>
        <small>Humeur</small>
      </NuxtLink>
      <NuxtLink to="/suivi-humeurs" class="mobile-app-item">
        <span class="mobile-app-icon">◔</span>
        <small>Suivi</small>
      </NuxtLink>
      <NuxtLink v-if="loggedIn" to="/profil" class="mobile-app-item">
        <span class="mobile-app-icon">○</span>
        <small>Profil</small>
      </NuxtLink>
      <NuxtLink v-else to="/connexion" class="mobile-app-item">
        <span class="mobile-app-icon">↗</span>
        <small>Connexion</small>
      </NuxtLink>
    </nav>
  </div>
</template>
