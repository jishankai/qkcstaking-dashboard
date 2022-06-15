<template>
  <div class="home">
    <div>
      <video-background
        ref="videobackground"
        src="/background.mp4"
        poster="/placehold.png"
        style="max-height: 600px; height: 100vh; justify-content:center; align-items:center;"
        playsWhen="canplaythrough"
      >
        <div style="padding-top:16rem">
          <div class="title" style="color:#fff">Make QKC More Profitable</div>
          <div class="subtitle" style="color:#fff">The First Staking Dapp on QuarkChain</div>
          <router-link class="button is-success" to="/contracts">
            LAUNCH APP
          </router-link>
        </div>
      </video-background>
    </div>
    <div class="level box" style="margin:2.5rem 0;">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Contracts</p>
          <p class="title">{{totalContracts}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Stakers</p>
          <p class="title">{{totalStakers}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">QKC Staked</p>
          <p class="title">{{totalStakes}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Miners</p>
          <p class="title">{{totalMiners}}</p>
        </div>
      </div>
    </div>
    <div class="block" style="margin:2.5rem 0;padding:3.5rem 0;">
      <b-steps v-model="activeStep" label-position="right" :has-navigation="false">
        <template v-for="(step, index) in steps">
          <b-step-item
            clickable
            :key="index"
            :label="step.label">
            {{ step.content }}
          </b-step-item>
        </template>
      </b-steps>
    </div>
    <div class="columns">
      <div class="column boxx" style="padding:5rem 1rem; margin-right:0.5rem">
        <b-icon
          icon="bitcoin"
          custom-size="mdi-48px">
        </b-icon>
        <h1 class="title" style="padding:2rem">For Holders</h1>
        <h2 class="subtitle" style="text-align:justify">
          No matter you are small or big holder of QKC, whether you own rigs or not, you can join PoSW mining now.
        </h2>
      </div>
      <div class="column boxx" style="padding:5rem 1rem">
        <b-icon
          icon="expansion-card"
          custom-size="mdi-48px">
        </b-icon>
        <h1 class="title" style="padding:2rem">For Miners</h1>
        <h2 class="subtitle" style="text-align:justify">
          Don't need to worry about the wasting of your hashing power or buying more QKC any more.
        </h2>
      </div>
      <div class="column boxx" style="padding:5rem 1rem; margin-left:0.5rem">
        <b-icon
          icon="shield-check"
          custom-size="mdi-48px">
        </b-icon>
        <h1 class="title" style="padding:2rem">For QuarkChain</h1>
        <h2 class="subtitle" style="text-align:justify">
          More QKC staking, more hashing power, much safer.
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
const factoryAbi = [
  "function allPoolsLength() external view returns (uint256)",
  "function getAllPools() external view returns (address[] memory)",
];
const poolAbi = [
  "function totalStakes() public view returns (uint256)",
  "function poolSize() public view returns (uint256)",
  "function miner() public view returns (address)",
  "function minerContact() public view returns (string memory)",
];

export default {
  name: 'HomeView',
  data() {
    return {
      totalContracts: 0,
      totalMiners: 0,
      totalStakers: 0,
      totalStakes: 0,
      activeStep: 0,
      steps: [
        {
          label: '2022H1',
          content: 'Testnet Release',
        },
        {
          label: '2022H2',
          content: 'Mainnet Release / Airdrop',
        },
        {
          label: '2023H1',
          content: '',
        },
        {
          label: '2023H2',
          content: '',
        }
      ],
      contractAddress: null,
      intval: null,
    };
  },
  async mounted() {
    this.intval = setInterval(async () => {
      const { chainConfig } = this.$store.state;
      if (chainConfig.chainId) {
        this.contractAddress = chainConfig.factory;
        const provider = new this.$ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const factoryContract = new this.$ethers.Contract(this.contractAddress, factoryAbi, signer);
        this.totalContracts = await factoryContract.allPoolsLength();
        const allContractsArr = await factoryContract.getAllPools();
        let miners = [];
        await Promise.all(allContractsArr.map(async (address) => {
          const poolContract = new this.$ethers.Contract(address, poolAbi, signer);
          const [
            poolSize,
            miner,
            totalStakes
          ] = await Promise.all([
            poolContract.poolSize(),
            poolContract.miner(),
            poolContract.totalStakes(),
          ]);
          this.totalStakers += parseInt(poolSize);
          this.totalStakes += parseInt(totalStakes);
          miners.push(miner);
        }));
        const newMiners = [...new Set(miners)];
        this.totalMiners = newMiners.length;
      }
    }, 3000);
  },
  destroyed() {
    clearInterval(this.intval);
  },
}
</script>

<style scoped>
.home {
  margin-top:-60px;
  margin-bottom: 5rem;
}
.boxx {
  background-color: white;
  border-radius: 6px;
  -webkit-box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 1px rgb(10 10 10 / 2%);
  box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 1px rgb(10 10 10 / 2%);
  display: block;
  color: #4a4a4a;
}
</style>
