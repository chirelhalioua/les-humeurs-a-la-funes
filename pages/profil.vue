<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'] })

const { user, fetch: refreshSession, clear: clearSession } = useUserSession()
const editingName = ref(false)
const newName = ref('')
const nameSaving = ref(false)
const nameError = ref('')
const nameSuccess = ref('')

function startNameEdit() {
  newName.value = user.value?.name || ''
  nameError.value = ''
  nameSuccess.value = ''
  editingName.value = true
}

function cancelNameEdit() {
  editingName.value = false
  nameError.value = ''
}

async function saveName() {
  nameError.value = ''
  nameSuccess.value = ''
  const name = newName.value.trim()
  if (name.length < 2) {
    nameError.value = 'Ton prénom ou nom doit contenir au moins 2 caractères.'
    return
  }
  nameSaving.value = true
  try {
    await $fetch('/api/auth/update-name', { method: 'PATCH', body: { name } })
    await refreshSession()
    editingName.value = false
    nameSuccess.value = 'Ton nom a bien été modifié.'
  } catch (error: any) {
    nameError.value = error?.data?.statusMessage || 'Impossible de modifier ton nom.'
  } finally {
    nameSaving.value = false
  }
}

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
      <div class="profile-avatar">{{ (user?.name || 'M').charAt(0).toUpperCase() }}</div>
      <div class="profile-head-copy">
        <span class="eyebrow"><span></span> mon espace</span>
        <h1>Mon profil,<br><i>à ma façon.</i></h1>
        <p>Ton espace personnel pour retrouver tes informations et tes humeurs.</p>
      </div>
    </div>

    <div class="profile-grid">
      <article class="profile-card profile-main-card">
        <span class="card-kicker">MON COMPTE</span>
        <template v-if="!editingName">
          <h2>{{ user?.name || 'Membre' }}</h2>
          <p>{{ user?.email }}</p>
          <button class="profile-edit-name" type="button" @click="startNameEdit">Modifier mon nom <span>↗</span></button>
        </template>
        <form v-else class="profile-name-form" @submit.prevent="saveName">
          <label for="profile-name">Prénom ou nom</label>
          <div class="profile-name-row">
            <input id="profile-name" v-model="newName" type="text" autocomplete="name" maxlength="80" required>
            <button type="submit" :disabled="nameSaving">{{ nameSaving ? '…' : 'Enregistrer' }}</button>
          </div>
          <button class="profile-name-cancel" type="button" @click="cancelNameEdit">Annuler</button>
        </form>
        <p v-if="nameError" class="profile-name-message profile-name-error">{{ nameError }}</p>
        <p v-if="nameSuccess" class="profile-name-message profile-name-success">{{ nameSuccess }}</p>
        <div class="profile-status-row">
          <div class="profile-status"><span></span> Compte connecté</div>
          <button class="profile-logout profile-card-logout" type="button" @click="logout">Se déconnecter <span>↗</span></button>
        </div>
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
