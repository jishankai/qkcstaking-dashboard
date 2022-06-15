import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ethers from './plugins/ethers';
import store from './store';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faYoutube, faTwitter, faTelegram, faMedium, faDiscord
} from '@fortawesome/free-brands-svg-icons';
import {
    faMinus, faPlus, faUser, faCalendar, faBook,
    faShieldAlt, faExternalLinkAlt, faComputer, faCoins, faShieldVirus, faScroll,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Plugin } from 'vue-responsive-video-background-player';

Vue.config.productionTip = false;
Vue.use(ethers);
Vue.use(Plugin);
library.add(
    faMinus, faPlus, faUser, faCalendar, faYoutube, faTwitter, faTelegram, faMedium, faDiscord, faShieldAlt, faExternalLinkAlt, faComputer, faCoins, faShieldVirus, faScroll, faBook,
);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(Buefy);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
