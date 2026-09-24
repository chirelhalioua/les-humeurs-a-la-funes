<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'] })
const form = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const message = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  message.value=''; error.value=''; loading.value=true
  try {
    await $fetch('/api/auth/change-password',{method:'POST',body:form})
    message.value='Mot de passe modifié avec succès.'
    form.currentPassword=''; form.newPassword=''; form.confirmPassword=''
  } catch (e:any) { error.value=e?.data?.statusMessage || 'Impossible de modifier le mot de passe.' }
  finally { loading.value=false }
}
</script>
<template>
  <section class="auth-page">
    <div class="auth-intro"><span class="eyebrow"><span></span> sécurité</span><h1>Modifier mon<br><i>mot de passe.</i></h1><p>Choisis un nouveau mot de passe pour sécuriser ton espace.</p></div>
    <div class="auth-card">
      <form @submit.prevent="submit">
        <label>Mot de passe actuel<input v-model="form.currentPassword" type="password" autocomplete="current-password" required></label>
        <label>Nouveau mot de passe<input v-model="form.newPassword" type="password" autocomplete="new-password" minlength="8" required></label>
        <label>Confirmer<input v-model="form.confirmPassword" type="password" autocomplete="new-password" minlength="8" required></label>
        <p v-if="error" class="auth-message auth-error">{{ error }}</p><p v-if="message" class="auth-message auth-success">{{ message }}</p>
        <button class="auth-submit" :disabled="loading">{{ loading ? 'Un instant…' : 'Modifier le mot de passe' }} <span>→</span></button>
      </form>
    </div>
  </section>
</template>
