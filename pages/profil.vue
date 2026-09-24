<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'] })

const { user, clear: clearSession } = useUserSession()

async function logout() {
  await clearSession()
  await navigateTo('/')
}

async function deleteAccount() {
  if (!window.confirm('Supprimer définitivement ton profil ?')) return
  await $fetch('/api/auth/delete-account', { method: 'DELETE' })
  await clearSession()
  await navigateTo('/')
}
</script>

<template>
  <section class="profile-page">
    <div class="profile-head">
      <div>
        <span class="eyebrow"><span></span> mon espace</span>
        <h1>Mon profil,<br><i>à ma façon.</i></h1>
        <p>Ton espace personnel pour retrouver tes informations et tes humeurs.</p>
      </div>
      <div class="profile-head-actions">
        <button class="profile-logout profile-head-logout" type="button" @click="logout">Se déconnecter <span>↗</span></button>
        <div class="profile-avatar">☺</div>
      </div>
    </div>

    <div class="profile-grid">
      <article class="profile-card profile-main-card">
        <span class="card-kicker">MON COMPTE</span>
        <h2>{{ user?.name || 'Membre' }}</h2>
        <p>{{ user?.email }}</p>
        <div class="profile-status"><span></span> Compte connecté</div>
      </article>

      <article class="profile-card">
        <span class="card-kicker">MON SUIVI</span>
        <h3>Mes humeurs</h3>
        <p>Retrouve bientôt ton évolution et tes repères dans le temps.</p>
        <NuxtLink to="/suivi-humeurs" class="profile-link">Voir mon suivi <span>→</span></NuxtLink>
      </article>

      <article class="profile-card">
        <span class="card-kicker">MON ESPACE</span>
        <h3>Préférences</h3>
        <p>Le mode sombre est disponible depuis le bouton ☾ en haut de l’écran.</p>
        <div class="profile-actions">
          <NuxtLink to="/modifier-mot-de-passe" class="profile-link">Modifier mon mot de passe <span>→</span></NuxtLink>
          <NuxtLink to="/conditions-generales" class="profile-link">Conditions générales <span>→</span></NuxtLink>
        </div>
      </article>
      <article class="profile-card profile-danger">
        <span class="card-kicker">ZONE COMPTE</span>
        <h3>Supprimer mon profil</h3>
        <p>Cette action supprime ton compte. Elle est définitive.</p>
        <button class="profile-delete" type="button" @click="deleteAccount">Supprimer mon profil</button>
      </article>
    </div>
  </section>
</template>
