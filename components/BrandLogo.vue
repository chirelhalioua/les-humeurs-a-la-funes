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
    <desc id="brand-desc">Logo des Humeurs à la Funes avec un visage expressif inspiré du cinéma.</desc>

    <!-- Emblème : bulle + visage expressif, volontairement différent de l'ancien logo -->
    <g transform="translate(8 9)">
      <rect x="4" y="4" width="92" height="92" rx="30" fill="var(--sage-soft)"/>
      <path d="M27 87c10 9 24 13 39 10l15 9-2-17c10-7 17-18 17-32 0-25-20-45-45-45S6 32 6 57c0 12 5 23 13 31Z"
        fill="var(--paper)" stroke="var(--cocoa)" stroke-width="5"/>

      <!-- sourcils / regard très expressif -->
      <path d="M30 48c5-5 12-6 18-2M61 46c6-4 13-3 18 2"
        fill="none" stroke="var(--cocoa)" stroke-width="5" stroke-linecap="round"/>

      <!-- yeux -->
      <circle cx="43" cy="55" r="3.2" fill="var(--cocoa)"/>
      <circle cx="69" cy="55" r="3.2" fill="var(--cocoa)"/>

      <!-- sourire -->
      <path d="M35 68c8 13 28 15 39 2"
        fill="none" stroke="var(--cocoa)" stroke-width="5.5" stroke-linecap="round"/>

      <!-- petit accent cinéma / humeur -->
      <path d="M18 22l-7-10M25 17l-2-12"
        stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/>
      <path d="M82 21l8-9"
        stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="17" cy="84" r="7" fill="var(--peach)"/>
    </g>

    <g fill="var(--cocoa)">
      <text x="120" y="51"
        font-family="Sora, Inter, Arial, sans-serif"
        font-size="35"
        font-weight="800"
        letter-spacing="-1.8">Les Humeurs</text>
      <text x="121" y="82"
        font-family="Caveat, Inter, cursive"
        font-size="27"
        font-weight="600">à la Funes</text>
    </g>

    <!-- deux petits traits dorés encadrent la signature -->
    <rect x="264" y="70" width="24" height="4" rx="2" fill="var(--gold)"/>
    <rect x="384" y="70" width="24" height="4" rx="2" fill="var(--gold)"/>
  </svg>
</template>
