<script setup lang="ts">
const email = ref('')
const sent = ref(false)
const error = ref('')
async function submit() {
  error.value=''
  try { await $fetch('/api/auth/password-reset/request',{method:'POST',body:{email:email.value}}); sent.value=true }
  catch(e:any){ error.value=e?.data?.statusMessage || 'Une erreur est survenue.' }
}
</script>
<template>
  <section class="auth-page">
    <div class="auth-intro"><span class="eyebrow"><span></span> accès au compte</span><h1>Mot de passe<br><i>oublié ?</i></h1><p>Entre ton adresse e-mail pour demander une réinitialisation.</p></div>
    <div class="auth-card">
      <template v-if="!sent"><form @submit.prevent="submit"><label>E-mail<input v-model="email" type="email" autocomplete="email" required></label><p v-if="error" class="auth-message auth-error">{{ error }}</p><button class="auth-submit">Réinitialiser mon mot de passe <span>→</span></button></form></template>
      <p v-else class="auth-message auth-success">Si un compte correspond à cette adresse, une demande de réinitialisation a été enregistrée. Vérifie ta messagerie.</p>
      <p class="auth-foot"><NuxtLink to="/connexion">← Retour à la connexion</NuxtLink></p>
    </div>
  </section>
</template>
