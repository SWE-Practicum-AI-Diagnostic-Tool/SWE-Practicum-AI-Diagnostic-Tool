<script setup>
const props = defineProps({
  mainPhoto: { type: String, default: '/assets/images/car.svg' },
  themeColor: { type: String, default: '#407BFF' },
  heroHeading: { type: String, default: 'Fix Your Car with Ai' },
  buttonTry: { type: String, default: 'Try it Out' }
})
</script>

<template>
  <div class="untree_co-hero" id="home-section">
    <div class="container">
      <div class="row align-items-start">
        <div class="col-12">
          <div class="dots" aria-hidden="true"></div>
          <div class="row align-items-center">
            <div
              class="col-lg-7 ml-auto order-lg-2"
              data-aos="fade-right"
              data-aos-delay="400"
            >
              <img :src="props.mainPhoto" alt="Image" class="img-fluid" />
            </div>
            <div class="col-lg-5">
              <h1 class="heading" data-aos="fade-up" data-aos-delay="0">
                {{ props.heroHeading }}
              </h1>
              <div class="excerpt" data-aos="fade-up" data-aos-delay="100">
                <p>
                  Working on a vehicle yourself can be intimidating and confusing without some level of guidance.
                  Whether you're a trained professional, hobbyist, or just someone trying not to give $1000s to a repair shop,
                  Our Ai-powered diagnostic tool can help you identify and fix issues with your vehicle quickly and easily.
                </p>
              </div>
              <p data-aos="fade-up" data-aos-delay="0">
                <a
                  href="#features-section"
                  class="btn btn-primary smoothscroll"
                  style="margin-right: 5px"
                  :style="[{ background: props.themeColor }, { borderColor: props.themeColor }]"
                  >{{ props.buttonTry }}</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Minimal, portable subset of the template's hero styles.
   Copy this component and its small CSS into another project and place assets
   (car image + dots background) into the public/static assets. */
.untree_co-hero {
  padding: 4rem 0 0;
  min-height: calc(100vh - 80px);
  box-sizing: border-box;
  position: relative;
}
.untree_co-hero .heading {
  font-size: 70px;
  line-height: 1;
  font-weight: 700;
  color: #000;
  margin-bottom: 30px;
}
@media (max-width: 991.98px) {
  .untree_co-hero .heading { font-size: 50px; }
  .untree_co-hero { text-align: center; }
}
.untree_co-hero .dots { position: absolute; width: 100%; height: 100%; pointer-events: none; }
.untree_co-hero .dots:before {
  z-index: -1;
  right: 0;
  transform: translateX(60%);
  position: absolute;
  content: "";
  width: 304px;
  height: 264px;
  /* default background for dots; expected to live in the consuming app's public assets */
  background: url('/images/dots.png') right top no-repeat;
}
.untree_co-hero .excerpt { margin-bottom: 30px; color: #666; }
.btn { padding: 15px 30px; border-radius: 30px; font-weight:700; text-transform:uppercase; color:#fff; }
.img-fluid { max-width: 100%; height: auto; }
.container { max-width: 1140px; margin: 0 auto; padding: 0 15px; }
.row { display:flex; flex-wrap:wrap; align-items:center; }
.col-lg-7 { flex: 0 0 58.3333%; max-width:58.3333%; }
.col-lg-5 { flex: 0 0 41.6667%; max-width:41.6667%; }
@media (max-width: 992px) {
  .row{flex-direction:column}
  .col-lg-7, .col-lg-5 { max-width:100%; flex: 0 0 100%; }
}
</style>
