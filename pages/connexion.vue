<script setup lang="ts">
const mode = ref<'login' | 'register'>('login')
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const resetMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

async function submit() {
  resetMessages()
  loading.value = true
  try {
    if (mode.value === 'login') {
      await $fetch('/api/auth/login', { method: 'POST', body: form })
    } else {
      await $fetch('/api/auth/register', { method: 'POST', body: form })
    }
    successMessage.value = mode.value === 'login' ? 'Connexion réussie. Bienvenue !' : 'Ton compte est créé. Bienvenue !'
    await navigateTo('/profil')
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.data?.message || 'Une erreur est survenue.'
  } finally {
    loading.value = false
  }
}

function switchMode(next: 'login' | 'register') {
  mode.value = next
  resetMessages()
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-intro">
      <span class="eyebrow"><span></span> mon espace</span>
      <h1>{{ mode === 'login' ? 'Content de te revoir.' : 'Bienvenue dans la bande.' }}</h1>
      <p>{{ mode === 'login' ? 'Retrouve ton humeur, ton suivi et ton petit espace personnel.' : 'Crée ton espace pour garder une trace de tes humeurs, à ton rythme.' }}</p>
      <div class="auth-quote">
        <span>★</span>
        <div><strong>Les Humeurs à la Funes</strong><small>Un petit moment pour soi, sans jugement.</small></div>
      </div>
    </div>

    <div class="auth-card">
      <div class="auth-switch">
        <button :class="{ active: mode === 'login' }" type="button" @click="switchMode('login')">Connexion</button>
        <button :class="{ active: mode === 'register' }" type="button" @click="switchMode('register')">Inscription</button>
      </div>

      <form @submit.prevent="submit">
        <label v-if="mode === 'register'">Prénom ou nom
          <input v-model="form.name" type="text" autocomplete="name" placeholder="Ton prénom" required>
        </label>
        <label>E-mail
          <input v-model="form.email" type="email" autocomplete="email" placeholder="toi@exemple.fr" required>
        </label>
        <label>Mot de passe
          <input v-model="form.password" type="password" autocomplete="new-password" placeholder="8 caractères minimum" required>
        </label>
        <label v-if="mode === 'register'">Confirmer le mot de passe
          <input v-model="form.confirmPassword" type="password" autocomplete="new-password" placeholder="Retape ton mot de passe" required>
        </label>

        <p v-if="errorMessage" class="auth-message auth-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="auth-message auth-success">{{ successMessage }}</p>

        <button class="auth-submit" type="submit" :disabled="loading">
          {{ loading ? 'Un instant…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte' }}
          <span>→</span>
        </button>
      </form>

      <p class="auth-foot">{{ mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?' }}
        <button type="button" @click="switchMode(mode === 'login' ? 'register' : 'login')">
          {{ mode === 'login' ? 'Créer un compte' : 'Se connecter' }}
        </button>
      </p>
    </div>
  </section>
</template>
