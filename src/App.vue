<template>
 <div id="app" class="container">
    <div id="nav">
      <b-navbar>
        <template #brand>
          <b-navbar-item class="nav-logo" tag="router-link" :to="{ path: '/' }">
            <img style="max-height: 100%;" src="./assets/logo.png" >
          </b-navbar-item>
        </template>
        <template #start>
            <b-navbar-item tag="router-link" to="/">
              Home
            </b-navbar-item>
            <b-navbar-item tag="router-link" to="/contracts">
              Contracts
            </b-navbar-item>
        </template>
        <template #end>
          <b-navbar-item>
            <b-dropdown v-model="currentChain" aria-role="list">
              <template #trigger>
                <b-button
                  :label="currentChain.name"
                  outlined
                  size="is-small"
                  icon-left="earth"
                  icon-right="menu-down" />
              </template>
              <b-dropdown-item
                v-for="(chain, index) in chains"
                :key="index"
                :value="chain" aria-role="listitem">
                <div class="media">
                  <div class="media-content">
                    <h3>{{chain.name}}</h3>
                  </div>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </b-navbar-item>
          <b-navbar-item><ConnectWallet :chainId="currentChain.chainId" /></b-navbar-item>
        </template>
      </b-navbar>
    </div>
    <router-view/>
    <footer class="footer">
      <div class="content has-text-centered footer-content">
          <a href="https://jishankai.medium.com/" target="_blank">
              <font-awesome-icon size="2x" :icon="['fab', 'medium']" />
          </a>
          <a href="https://t.me/x_qwerty" target="_blank">
              <font-awesome-icon size="2x" :icon="['fab', 'telegram']" />
          </a>
          <a href="https://twitter.com/hashlord_eth" target="_blank">
              <font-awesome-icon size="2x" :icon="['fab', 'twitter']" />
          </a>
          <a href="https://docs.padit.finance">
            <font-awesome-icon size="2x" :icon="['fas', 'book']" />
          </a>
      </div>
    </footer>
  </div>
</template>

<script>
import ConnectWallet from "@/components/ConnectWallet.vue";
import { chains } from '@/store/state';

export default {
  name: 'App',
  data() {
    return {
      chains: chains,
      currentChain: {
        name: 'QKC Dev S0',
        chainId: '0x1adb1',
        rpcUrl: 'http://eth-jrpc.devnet.quarkchain.io:39900',
        factory: '0xf4Dfc7226e984D39cc8bB01Bb50780A414fc0EDb'
      },
    };
  },
  computed: {
  },
  components: {
    ConnectWallet
  },
  methods: {
    toast() {
      this.$buefy.toast.open('Coming Soon')
    },
  },
}
</script>

<style scoped>
@font-face {
  font-family: Quantum;
  src: url("./assets/Quantum.otf");
}
@font-face {
  font-family: Nasalization;
  src: url("./assets/nasalization-rg.otf");
}
#app {
  color: #fff;
  max-width: 1200px;
  min-height: 100vh;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Nasalization;
}

body, button, input, optgroup, select, textarea {
  font-family: AlibabaSans, KGBrokenVesselsSketch!important;
}

.media-content {
  text-align: left;
}

.label {
  color: #fff!important;
}

.nav {
    padding-top: 12px;
}
.lang {
    padding: 0 2px;
    border: solid;
}
.nav a {
  color: #fff;
}
.nav-logo {
  width:226px;
  height:61px;
  padding:0;
}
.navbar-item {
  color: #fff!important;
  padding: 0.5rem 1rem;
}
a.navbar-item:focus-within,
a.navbar-item:hover,
a.navbar-item.is-active,
.router-link-exact-active,
.navbar-item:focus,
.navbar-link:focus,
.navbar-link:focus-within,
.navbar-link:hover,
.navbar-link.is-active {
  color: #FFC601!important;
  background-color:transparent!important;
}
:focus {
  outline: -webkit-focus-ring-color auto 0px;
}
.navbar {
  background-color: transparent!important;
}

.footer {
  padding-top: 23px!important;
  padding-bottom: 23px!important;
  background-color: transparent!important;
  height: 78px;
  width: 100%;
}
.footer a {
  color: #fff;
  font-size: 14px;
  padding: 12px;
  vertical-align: middle;
}
.footer-poptip{
  color: #fff;
  font-size: 14px;
  padding: 12px;
  width: 52px;
  vertical-align: middle;
}
.tabs ul {
  height: 70px;
  border-radius: 10px 10px 0 0;
  border-bottom-style: none;
}
.tabs a {
  color: #ffffff;
  font-size: 16px;
  border-bottom-style: none;

}
.tabs a:hover {
  color: #FFC601;
}
.tabs li.is-active a {
  color: #FFC601!important;
  text-decoration: underline;
}

.footer-content{
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
}
.footer-poptip-layout{
  padding: 10px;
  background: #293030;
  border: 2px solid #293030;
  border-radius: 7px !important;
}
@media screen and (max-width: 1023px) {
  .navbar-menu {
    background-color: transparent!important;
  }
  .nav-logo {
    height:52px;
    width: 190px;
    padding-top: 6px;
    padding-bottom: 6px;
  }
  .navbar-brand .navbar-item {
    justify-content: center;
  }
  .nav {
    padding-bottom: 0;
  }

  .footer a {
    padding: 8px;
  }
  .footer-poptip{
    padding: 8px;
    width: 44px;
  }
}
.modal-background {
  background-color: rgba(52, 52, 52, 0.86)!important;
}

</style>
