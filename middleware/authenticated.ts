export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = await useUserSession()
  if (!loggedIn.value) return navigateTo('/connexion')
})
