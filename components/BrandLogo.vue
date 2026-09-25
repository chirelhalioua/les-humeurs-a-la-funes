<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <svg
    class="brand-logo"
    viewBox="0 0 430 118"
    role="img"
    aria-labelledby="brand-title brand-desc"
    v-bind="$attrs"
  >
    <title id="brand-title">Les Humeurs à la Funes</title>
    <desc id="brand-desc">Logo inspiré d'une scène de théâtre et du cinéma de Louis de Funès.</desc>

    <!-- Médaillon scène : rideaux clairement reconnaissables -->
    <g transform="translate(8 9)">
      <circle cx="50" cy="50" r="44" fill="var(--cocoa)"/>
      <circle cx="50" cy="50" r="36" fill="var(--paper)" stroke="var(--gold)" stroke-width="3"/>

      <!-- grand rideau gauche -->
      <path d="M18 25
               C28 18 37 18 43 23
               C39 31 39 38 42 46
               C38 52 38 60 42 69
               C34 72 26 69 20 63
               C25 54 25 44 21 35
               C20 31 19 28 18 25Z"
        fill="var(--peach)" stroke="var(--cocoa)" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- grand rideau droit -->
      <path d="M82 25
               C72 18 63 18 57 23
               C61 31 61 38 58 46
               C62 52 62 60 58 69
               C66 72 74 69 80 63
               C75 54 75 44 79 35
               C80 31 81 28 82 25Z"
        fill="var(--peach)" stroke="var(--cocoa)" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- cordeau du rideau -->
      <path d="M22 29c6-5 12-7 20-6M78 29c-6-5-12-7-20-6"
        fill="none" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/>

      <!-- ouverture de scène -->
      <rect x="42" y="27" width="16" height="43" rx="3" fill="var(--sage-soft)" stroke="var(--cocoa)" stroke-width="2.5"/>
      <path d="M50 31v35" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/>

      <!-- petites bulles = humeurs -->
      <circle cx="25" cy="77" r="6" fill="var(--gold)"/>
      <circle cx="50" cy="82" r="5" fill="var(--peach)"/>
      <circle cx="75" cy="77" r="6" fill="var(--sage)"/>
      <path d="M21 88l-4 5M79 88l4 5" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/>
    </g>

    <text x="112" y="52"
      fill="var(--cocoa)"
      font-family="Sora, Inter, Arial, sans-serif"
      font-size="34"
      font-weight="800"
      letter-spacing="-1.8">Les Humeurs</text>

    <path d="M114 66h72" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/>

    <text x="114" y="91"
      fill="var(--brown)"
      font-family="Caveat, Inter, cursive"
      font-size="27"
      font-weight="600">à la Funes</text>

    <circle cx="257" cy="84" r="4" fill="var(--gold)"/>
    <circle cx="272" cy="84" r="4" fill="var(--peach)"/>
    <circle cx="287" cy="84" r="4" fill="var(--sage)"/>
  </svg>
</template>
