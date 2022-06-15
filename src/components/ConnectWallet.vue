<template>
  <div class="connect" id="wallet">
    <button
      class="btn-connect pixel-font"
      :style="this.isUnsupportedChain ? 'color: red' : 'color: white'"
      v-if="!this.currentAccount || this.isUnsupportedChain"
      @click="connectWallet"
    >
      {{ this.walletLabel }}
    </button>
    <div class="account pixel-font" v-if="this.currentAccount && !this.isUnsupportedChain">
      <img class="add-img" :src="require('../assets/metamask.png')" alt/>
      {{ this.accountShort }}
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { chains } from '@/store/state';
export default {
  name: 'ConnectWallet',
  props: {
    chainId: String,
  },
  data() {
    return {
      currentAccount: null,
      currentChainId: null,
      isUnsupportedChain: false,
    };
  },
  created() {
    window.ethereum.on("chainChanged", this.handleChainChanged);
    window.ethereum.on("accountsChanged", this.handleAccountsChanged);
  },
  mounted() {
    this.connectWallet();
  },
  watch: { 
    chainId: function() { // watch it
      this.handleChainChanged();
    }
  },
  computed: {
    accountShort() {
      return (
        this.currentAccount.substring(0, 6) +
        "..." +
        this.currentAccount.substring(
          this.currentAccount.length - 4,
          this.currentAccount.length
        )
      );
    },
    walletLabel() {
      return this.isUnsupportedChain ? "Unsupported Chain" : "Connect";
    },
  },
  methods:{
    ...mapActions(["setChainConfig", "setAccount"]),
    async handleChainChanged() {
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
      const { chainConfig } = this.$store.state;
      if (!(chainConfig.chainId) || this.chainId != currentChainId) {
        const c = chains.find((v) => v.chainId == this.chainId);
        this.setChainConfig(JSON.parse(JSON.stringify(c)));
        console.log(c);
        try {
          // check if the chain to connect to is installed
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: this.chainId }], // chainId must be in hexadecimal numbers
          });
        } catch (error) {
          // This error code indicates that the chain has not been added to MetaMask
          // if it is not, then install it into the user MetaMask
          if (error.code === 4902) {
            // try {
            //   await window.ethereum.request({
            //     method: 'wallet_addEthereumChain',
            //     params: [
            //       {
            //         chainId: this.chainId,
            //         rpcUrls: c.rpcUrl,
            //       },
            //     ],
            //   });
            // } catch (addError) {
            //   console.error(addError);
            // }
            this.$buefy.toast.open({
              duration: 10000,
              message: `Add ${c.name} to the MetaMask(ChainID: ${c.chainId}, RPC: ${c.rpcUrl})`,
              position: 'is-bottom',
              type: 'is-danger'
            })
          }
          console.error(error);
        }
      }
    },
    async handleAccountsChanged(accounts) {
      await this.handleChainChanged();
      if (accounts.length === 0) {
        this.currentAccount = null;
        console.warn(
          "MetaMask is locked or the user has not connected any accounts"
        );
        return;
      }
      if (accounts[0] !== this.currentAccount) {
        this.currentAccount = accounts[0];
        this.setAccount(accounts[0]);
      }
    },
    connectWallet: async function (){
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then(this.handleAccountsChanged)
            .catch((err) => {
              if (err.code === 4001) {
                // EIP-1193 userRejectedRequest error
                // If this happens, the user rejected the connection request.
                console.log("user rejected.");
              } else {
                console.error(err);
              }
            });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#wallet {
  display: flex;
  justify-content: center;
}
.account {
  width: 200px;
  height: 30px;
  padding: 0;
  font-size: small;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-img {
  margin-right: 8px;
  margin-bottom: 5px;
  height: 25px;
}

.account:hover {
  color: #ffffff !important;
}
.btn-connect {
  width: 120px;
  height: 44px;
  border: 2px solid #ffffff;
  border-radius: 30px;
  background-color: transparent;
  color: #ffffff;
  cursor: pointer;
}
#wallet:hover,
.btn-connect:hover {
  color: #DF9345 !important;
  border-color: #DF9345 !important;
}
</style>
