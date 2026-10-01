<script setup lang="ts">
function stylePhonePreview(event: Event) {
  const frame = event.target as HTMLIFrameElement
  try {
    const doc = frame.contentDocument
    if (!doc) return
    const style = doc.createElement('style')
    style.textContent = 'html,body{overflow:hidden!important}.topbar,.site-footer{display:none!important}.mobile-app-nav{display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:none!important}.app-shell>main{padding-bottom:84px!important;min-height:0!important}a,button{pointer-events:none!important}'
    doc.head.appendChild(style)
  } catch { /* visual-only fallback */ }
}

const steps = [
  {
    number: '01',
    title: 'Je choisis',
    text: 'Je prends quelques secondes pour dire comment je me sens.'
  },
  {
    number: '02',
    title: 'Je retrouve',
    text: 'Matin, après-midi, soir : mes ressentis restent au fil de mes journées.'
  },
  {
    number: '03',
    title: 'Je regarde',
    text: 'Je découvre mon évolution sans transformer mes émotions en tableau de statistiques.'
  }
]

const moods = [
  { emoji: '🤩', name: 'Heureux', tone: 'gold' },
  { emoji: '😌', name: 'Bien', tone: 'sage' },
  { emoji: '😐', name: 'Moyen', tone: 'sand' },
  { emoji: '😴', name: 'Fatigué', tone: 'peach' },
  { emoji: '😡', name: 'Énervé', tone: 'cocoa' }
]
</script>

<template>
  <div class="landing">
    <header class="landing-nav">
      <NuxtLink to="/landing" class="landing-brand" aria-label="Les Humeurs à la Funes">
        <BrandLogo class="landing-logo" />
      </NuxtLink>

      <NuxtLink to="/" class="landing-nav-cta">Accéder à l'application <span>→</span></NuxtLink>
    </header>

    <main>
      <section class="landing-hero">
        <div class="hero-copy">
          <span class="hero-kicker"><i></i> CINÉMA &amp; HUMEUR</span>
          <h1>Et toi, aujourd’hui…<br><em>tu te sens comment ?</em></h1>
          <p>Une petite pause pour écouter ton humeur, au fil de la journée.</p>

          <div class="hero-moods" aria-label="Exemples d'humeurs">
            <span v-for="mood in moods" :key="mood.name" :class="'mood-'+mood.tone">
              <b>{{ mood.emoji }}</b>
              <small>{{ mood.name }}</small>
            </span>
          </div>

          <NuxtLink to="/" class="landing-main-cta">Découvrir l’application <span>→</span></NuxtLink>

          <div class="hero-points">
            <span><b>⌁</b> Simple<br>et rapide</span>
            <span><b>♥</b> Un univers<br>unique et positif</span>
            <span><b>▮▮▮</b> Ton suivi<br>dans le temps</span>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-circle"></div>
          <div class="film-strip">▦</div>
          <div class="hero-portrait">
            <img
              src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Louis%20de%20Fun%C3%A8s%204%20%E2%80%94%20L%27Homme%20orchestre%20%281970%29.jpg"
              alt="Louis de Funès pendant le tournage de L'Homme orchestre"
            >
          </div>
          <div class="hero-quote">« Le rire…<br>ça fait du bien. »</div>
          <div class="hero-spark spark-a">✦</div>
          <div class="hero-spark spark-b">✦</div>
          <span class="hero-dot dot-one"></span>
          <span class="hero-dot dot-two"></span>
        </div>
      </section>

      <section id="principe" class="landing-section principle">
        <div class="section-heading">
          <span>01 · LE PRINCIPE</span>
          <h2>Trois étapes, <em>tout simplement.</em></h2>
          <p>Pas besoin d'en faire des tonnes pour prendre un petit moment pour soi.</p>
        </div>

        <div class="steps">
          <article v-for="step in steps" :key="step.number" class="step-card">
            <span class="step-number">{{ step.number }}</span>
            <div class="step-icon">{{ step.number === '01' ? '☻' : step.number === '02' ? '◷' : '▥' }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </article>
        </div>
      </section>

      <section id="univers" class="quote-band">
        <div class="quote-photo">
          <img
            src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Louis%20de%20Fun%C3%A8s%204%20%E2%80%94%20L%27Homme%20orchestre%20%281970%29.jpg"
            alt=""
          >
        </div>
        <div>
          <p>« C’est une médecine pour moi le rire, une médecine qui fait beaucoup de bien aux gens. »</p>
          <small>— Louis de Funès · Entretien avec Georges Lourier, janvier 1963</small>
        </div>
        <span class="quote-star">✦</span>
      </section>

      <section id="apercu" class="landing-section preview-section">
        <div class="section-heading">
          <span>02 · L'APPLICATION</span>
          <h2>Un aperçu de <em>ton espace.</em></h2>
          <p>La landing présente l'univers. L'application garde la même identité, jusque dans chaque écran.</p>
        </div>

        <div class="phone-stage">
          <div class="phone-glow"></div>
          <div class="phone">
            <div class="phone-bar">
              <span>9:41</span>
              <span>● ◔ ▰</span>
            </div>
            <div class="phone-screen">
              <iframe
                src="/"
                title="Aperçu de la page d'accueil de Les Humeurs à la Funes"
                loading="lazy"
                scrolling="no"
                tabindex="-1"
                @load="stylePhonePreview"
              ></iframe>
            </div>
            <div class="phone-home"></div>
          </div>
        </div>

        <div class="preview-note">
          <span>01</span>
          <div><b>La vraie page d'accueil</b><p>L'aperçu ci-dessus reprend directement l'accueil actuel de l'application.</p></div>
        </div>
      </section>

      <section class="landing-final">
        <span class="clapper">🎬</span>
        <div>
          <span>03 · À TOI DE JOUER</span>
          <h2>Alors, on fait le point ?</h2>
          <p>Rejoins Les Humeurs à la Funes et commence à suivre ton humeur, simplement.</p>
          <NuxtLink to="/" class="landing-main-cta">Commencer <span>→</span></NuxtLink>
        </div>
        <span class="reel">●●</span>
      </section>
    </main>

    <footer class="landing-footer">
      <NuxtLink to="/contact">Contact</NuxtLink>
      <span>·</span>
      <span>Développé avec <b>♥</b> par <a href="https://chirelhalioua.fr/" target="_blank" rel="noopener noreferrer">Chirel Dev</a></span>
    </footer>
  </div>
</template>

<style scoped>
.landing :global(.topbar),
.landing :global(.site-footer),
.landing :global(.mobile-app-nav){display:none!important}
.landing :deep(.brand-logo text:last-of-type){fill:#392b24!important}
:global(.app-shell>main.landing-main){flex:0 0 auto!important;min-height:0!important;padding-bottom:0!important;background:#f6efe3!important}
.landing{
  --ink:#392b24;
  --muted:#806f63;
  --cream:#f6efe3;
  --paper:#fffaf2;
  --sage:#a9b89d;
  --sage-soft:#e9eadf;
  --gold:#e7bd58;
  --line:rgba(57,43,36,.13);
  min-height:0;
  background:var(--cream);
  color:var(--ink);
  font-family:Inter,ui-sans-serif,system-ui,sans-serif;
  overflow:hidden;
}
.landing :deep(a){text-decoration:none;color:inherit}
.landing-nav{
  height:76px;
  padding:0 clamp(18px,7vw,92px);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:28px;
  background:var(--cream);
  position:relative;
  z-index:5;
}
.landing-brand{display:flex;align-items:center;gap:9px;font-family:Sora,Inter,sans-serif;font-size:13px;line-height:1.08;letter-spacing:-.04em}
.landing-brand b{font-weight:800}
.brand-round{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--gold);border:2px solid var(--ink);font-size:19px}
.landing-nav nav{display:flex;gap:30px;font-size:12px;color:var(--muted)}
.landing-nav nav a:hover{text-decoration:underline}
.landing-nav-cta,.landing-main-cta{display:inline-flex;align-items:center;justify-content:center;gap:14px;border-radius:999px;background:var(--ink);color:#fffaf2!important;font-weight:800}
.landing-nav-cta{padding:11px 17px;font-size:11px}
 .landing-hero{
  min-height:590px;
  overflow:clip;
  padding:70px clamp(24px,10vw,130px) 45px;
  display:grid;
  grid-template-columns:minmax(0,1fr) minmax(360px,.8fr);
  align-items:center;
  gap:5vw;
  position:relative;
  background:radial-gradient(circle at 86% 30%,rgba(231,189,88,.20),transparent 28%),var(--cream);
}
.landing-hero:after{content:"";position:absolute;right:-130px;bottom:-180px;width:390px;height:390px;border-radius:50%;background:#eee0b7;opacity:.55;z-index:0;pointer-events:none}
.hero-copy{position:relative;z-index:2;max-width:650px}
.landing-logo{display:block;width:190px;height:auto}
.hero-dot{position:absolute;display:block;border-radius:50%;background:#a9b89d;z-index:4;opacity:.85}
.dot-one{width:17px;height:17px;right:2%;bottom:23%}
.dot-two{width:9px;height:9px;left:13%;bottom:14%;background:#8fa184}
.hero-kicker{font-size:10px;font-weight:800;letter-spacing:.18em;color:var(--muted);display:flex;gap:8px;align-items:center}
.hero-kicker i{width:20px;height:2px;background:var(--gold);display:inline-block}
.hero-copy h1,.section-heading h2,.landing-final h2{font-family:Sora,Inter,sans-serif;letter-spacing:-.065em;line-height:.98}
.hero-copy h1{font-size:clamp(46px,6.2vw,78px);margin:18px 0 18px}
.hero-copy h1 em,.section-heading h2 em{font-family:Caveat,cursive;font-weight:600;color:#392b24;letter-spacing:-.02em}
.hero-copy>p{max-width:480px;color:#66564b;font-size:17px;line-height:1.5;margin:0 0 25px}
.hero-moods{display:flex;gap:10px;margin-bottom:25px;flex-wrap:wrap}
.hero-moods>span{min-width:70px;display:flex;flex-direction:column;align-items:center;gap:5px}
.hero-moods b{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;font-size:25px;background:#f5dfac}
.hero-moods small{font-size:10px;font-weight:700}
.hero-moods .mood-sage b{background:#eee6d7}.hero-moods .mood-sand b{background:#e8decb}.hero-moods .mood-peach b{background:#f0c8b8}.hero-moods .mood-cocoa b{background:#c9b7ad}
.landing-main-cta{padding:14px 22px;font-size:13px;box-shadow:0 12px 24px rgba(57,43,36,.12)}
.hero-points{display:flex;gap:30px;margin-top:30px;color:var(--muted);font-size:10px;line-height:1.35}
.hero-points span{display:flex;gap:8px;align-items:center}.hero-points b{font-size:18px;color:var(--brown)}
.hero-visual{height:490px;position:relative;display:grid;place-items:center;z-index:1;isolation:isolate;overflow:hidden}
.hero-circle{position:absolute;width:420px;height:420px;border-radius:50%;background:#eadfc9;right:4%;bottom:0;z-index:0;pointer-events:none}
.hero-portrait{position:absolute;width:320px;height:430px;right:12%;bottom:0;overflow:hidden;border-radius:170px 170px 28px 28px;z-index:2;mix-blend-mode:multiply}
.hero-portrait img{width:100%;height:100%;object-fit:cover;object-position:center}
.hero-quote{position:absolute;right:52%;top:65px;width:185px;font-family:Caveat,cursive;font-size:27px;line-height:1.02;transform:rotate(-4deg);z-index:3}
.hero-spark{position:absolute;color:#d99f22;font-size:34px;z-index:4}.spark-a{left:6%;top:40%}.spark-b{right:3%;top:12%}
.film-strip{position:absolute;right:-1%;top:5%;font-size:130px;line-height:1;opacity:.12;transform:rotate(18deg)}
.landing-section{padding:72px clamp(20px,8vw,110px)}
.principle{background:var(--paper)}
.section-heading{text-align:center;max-width:650px;margin:0 auto 38px}.section-heading>span,.landing-final>div>span{font-size:9px;letter-spacing:.18em;font-weight:800;color:var(--muted)}.section-heading h2{font-size:clamp(36px,4.5vw,56px);margin:12px 0 10px}.section-heading p{margin:0;color:var(--muted);font-size:14px;line-height:1.5}
.steps{max-width:1080px;margin:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.step-card{min-height:210px;border:1px solid rgba(57,43,36,.1);border-radius:28px;background:#fff8e9;padding:28px 25px;position:relative;text-align:center}
.step-number{position:absolute;top:-14px;left:50%;transform:translateX(-50%);width:29px;height:29px;border-radius:50%;display:grid;place-items:center;background:var(--gold);font-size:10px;font-weight:900}
.step-icon{font-size:28px;color:#6f5842;margin:3px 0 8px}.step-card h3{font-family:Sora,Inter,sans-serif;font-size:17px;margin:0 0 8px}.step-card p{font-size:12px;line-height:1.5;color:var(--muted);margin:0}
.quote-band{min-height:170px;background:#eee6d7;border-radius:34px;margin:0;display:flex;align-items:center;justify-content:center;gap:35px;padding:25px clamp(25px,9vw,120px);position:relative;overflow:hidden}
.quote-photo{width:150px;height:170px;align-self:flex-end;overflow:hidden;border-radius:80px 80px 0 0;flex:none}.quote-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;filter:grayscale(1)}
.quote-band p{font-family:Caveat,cursive;font-size:31px;line-height:1.05;max-width:780px;margin:0 0 8px}.quote-band small{font-size:10px;color:var(--muted)}.quote-star{position:absolute;right:7%;top:22px;color:#d99f22;font-size:32px}
.preview-section{background:var(--cream)}
.phone-stage{position:relative;display:flex;justify-content:center;margin:20px auto 30px;max-width:1000px}
.phone-glow{position:absolute;width:450px;height:450px;border-radius:50%;background:#eadfbf;opacity:.75;top:30px}
.phone{position:relative;width:290px;padding:10px 9px 13px;border-radius:36px;background:#2d2520;box-shadow:0 24px 50px rgba(57,43,36,.2);z-index:1}
.phone-bar{height:22px;color:#fff;font-size:7px;display:flex;justify-content:space-between;padding:0 10px;align-items:center}
.phone-screen{height:510px;border-radius:26px;overflow:hidden;background:var(--cream);border:2px solid #5d514a}
.phone-screen iframe{width:100%;height:100%;border:0;display:block;transform:scale(.68);transform-origin:top left}
.phone-screen{position:relative}
.phone-screen iframe{width:147.1%;height:147.1%}
.phone-home{width:70px;height:4px;border-radius:10px;background:#fff;margin:9px auto 0;opacity:.7}
.preview-note{max-width:480px;margin:auto;display:flex;gap:13px;align-items:flex-start;background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:14px 17px}.preview-note>span{font-size:9px;color:var(--muted);font-weight:800}.preview-note b{font-size:12px}.preview-note p{margin:3px 0 0;font-size:10px;line-height:1.4;color:var(--muted)}
.landing-final{margin:0 0 0;min-height:230px;padding:50px 8vw;background:#f0e2bf;display:flex;align-items:center;justify-content:center;gap:30px;text-align:center;position:relative}.landing-final>div{max-width:600px}.landing-final h2{font-size:clamp(35px,4.8vw,55px);margin:9px 0 7px}.landing-final p{margin:0 auto 18px;max-width:500px;color:var(--muted);font-size:13px}.clapper,.reel{font-size:55px;opacity:.9}.reel{font-size:38px;transform:rotate(20deg)}
@media(max-width:850px){
  .landing-nav{height:66px;padding:0 18px}.landing-nav nav{display:none}.landing-nav-cta{font-size:9px;padding:10px 12px}.landing-logo{width:164px}
  .landing-hero{grid-template-columns:1fr;min-height:0;padding:46px 20px 35px;text-align:center;gap:25px}.hero-copy{margin:auto}.hero-kicker{justify-content:center}.hero-copy h1{font-size:clamp(40px,11vw,62px)}.hero-copy>p{font-size:14px;margin-left:auto;margin-right:auto}.hero-moods{justify-content:center}.hero-points{justify-content:center;gap:14px}.hero-visual{height:410px}.hero-circle{width:340px;height:340px;right:50%;transform:translateX(50%)}.hero-portrait{width:245px;height:330px;right:50%;transform:translateX(50%)}.hero-quote{right:auto;left:4%;top:28px;font-size:23px}.film-strip{right:3%;font-size:95px}
  .steps{grid-template-columns:1fr;max-width:480px}.step-card{min-height:155px;padding:24px 22px}.quote-band{border-radius:0;gap:18px}.quote-photo{width:105px;height:125px}.quote-band p{font-size:25px}.landing-section{padding:58px 18px}
}
@media(max-width:560px){
  .landing-nav{height:62px}.landing-nav-cta{font-size:8px;padding:9px 11px}.landing-logo{width:142px}
  .landing-hero{padding:35px 16px 25px;gap:18px}.hero-copy h1{font-size:clamp(37px,11.5vw,49px);margin:13px 0}.hero-copy>p{font-size:12px;line-height:1.45}.hero-moods{gap:4px;margin-bottom:18px}.hero-moods>span{min-width:57px}.hero-moods b{width:41px;height:41px;font-size:21px}.hero-moods small{font-size:8px}.landing-main-cta{font-size:11px;padding:12px 17px}.hero-points{font-size:8px;gap:9px;margin-top:21px}.hero-points b{font-size:15px}.hero-visual{height:300px}.hero-circle{width:280px;height:280px}.dot-one{width:12px;height:12px;right:5%;bottom:17%}.dot-two{width:7px;height:7px;left:8%;bottom:12%}.hero-portrait{width:190px;height:255px}.hero-quote{left:1%;top:10px;width:125px;font-size:20px}.film-strip{font-size:70px;top:0}.spark-a{left:2%;font-size:24px}.spark-b{right:0;font-size:23px}
  .landing-section{padding:48px 14px}.section-heading{margin-bottom:28px}.section-heading h2{font-size:36px}.section-heading p{font-size:12px}.step-card{border-radius:22px}.quote-band{padding:24px 17px;gap:12px}.quote-photo{width:80px;height:105px}.quote-band p{font-size:22px}.quote-band small{font-size:8px}.quote-star{right:4%;font-size:22px}
  .phone{width:250px;border-radius:31px;padding:8px 7px 10px}.phone-screen{height:450px;border-radius:23px}.phone-screen iframe{transform:scale(.62);transform-origin:top left;width:161.3%;height:161.3%}.phone-home{width:58px}
  .preview-note{margin:0 4px}.landing-final{padding:42px 18px;min-height:260px}.clapper,.reel{display:none}.landing-final h2{font-size:37px}.landing-final p{font-size:11px}.landing-footer{display:flex;justify-content:center;align-items:center;gap:8px;width:100%;box-sizing:border-box;padding:17px 12px 22px;background:#f6efe3;border-top:1px solid rgba(57,43,36,.13);color:#66564b;font-size:9px;line-height:1.4;text-align:center}.landing-footer a{color:#392b24;font-weight:700}.landing-footer b{color:#d9a52e}.landing-footer span{white-space:nowrap}
}
</style>
