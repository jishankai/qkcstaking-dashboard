<template>
  <div class="contract">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title" style="justify-content:center">
          <span style="margin-right:1rem">Contract {{ address }}</span>
          <span>Miner Telegram: <a :href="minerContactUrl">{{minerContact}}</a></span>
        </p>
        <button class="card-header-icon" aria-label="more options">
          <font-awesome-icon :icon="['fas', 'angle-down']" aria-hidden="true"/>
        </button>
      </header>
      <div class="card-content">
        <div class="content">
          <div class="level block" style="margin-bottom:1.5rem;">
            <div class="level-item has-text-centered">
              <b-skeleton size="is-large" :active="loading"></b-skeleton>
              <div v-if="!loading">
                <p class="heading">Total Stakes</p>
                <p class="title">{{totalStakes}} QKC</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <b-skeleton size="is-large" :active="loading"></b-skeleton>
              <div v-if="!loading">
                <p class="heading">Start At</p>
                <p class="title">{{ startTimeStr }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <b-skeleton size="is-large" :active="loading"></b-skeleton>
              <div v-if="!loading">
                <p class="heading">End At</p>
                <p class="title">{{  endTimeStr }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <b-skeleton size="is-large" :active="loading"></b-skeleton>
              <div v-if="!loading">
                <p class="heading">Minimum Stakes</p>
                <p class="title">{{minStakes}} QKC</p>
              </div>
            </div>
          </div>
          <div class="block">
            <b-skeleton size="is-large" :active="loading"></b-skeleton>
            <div v-if="!loading">
              Total Stakers
              <b-progress 
                :value="parseInt(poolSize/maxStakers*100)" 
                size="is-medium" 
                show-value
              >
                {{poolSize}} / {{maxStakers}}
              </b-progress>
            </div>
          </div>
          <div class="columns block">
            <div class="column">
              <b-skeleton size="is-large" :active="loading"></b-skeleton>
              <div v-if="!loading">
                Staker Rewards
                <b-progress 
                  :value="(10000-minerFeeBp-protocolFeeBp)/100"
                  :rounded="false" 
                  type="is-success" 
                  size="is-medium"
                  show-value
                  format="percent"
                ></b-progress>
              </div>
            </div>
            <div class="column">
              <b-skeleton size="is-large" :active="loading"></b-skeleton>
              <div v-if="!loading">
                Miner Rewards
                <b-progress 
                  :value="minerFeeBp/100"
                  :rounded="false" 
                  type="is-primary" 
                  size="is-medium"
                  show-value
                  format="percent"
                ></b-progress>
              </div>
            </div>
            <div class="column">
              <b-skeleton size="is-large" :active="loading"></b-skeleton>
              <div v-if="!loading">
                Protocol Rewards
                <b-progress 
                  :value="protocolFeeBp/100"
                  :rounded="false" 
                  type="is-warning" 
                  size="is-medium"
                  show-value
                  format="percent"
                ></b-progress>
              </div>
            </div>
          </div>
          <div class="level block" style="margin:1rem 0;">
            <div class="level-item has-text-centered">
              <b-skeleton size="is-large" :active="loading"></b-skeleton>
              <div v-if="!loading">
                <p class="heading">User Stakes</p>
                <p class="title">{{userStakes}} QKC</p>
                <b-field>
                  <b-input expanded v-model="stakeAmount" placeholder="0.00"></b-input>
                  <p class="control">
                    <b-button type="is-success" @click="stake" label="STAKE" />
                  </p>
                </b-field>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <b-skeleton size="is-large" :active="loading"></b-skeleton>
              <div v-if="!loading">
                <p class="heading">User Rewards</p>
                <p class="title">{{ userRewards }}</p>
                <b-button type="is-success" @click="withdraw">WITHDRAW {{userBalance}} QKC</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

const poolAbi = [
  "function startTime() public view returns (uint256)",
  "function endTime() public view returns (uint256)",
  "function minStakes() public view returns (uint256)",
  "function maxStakers() public view returns (uint256)",
  "function totalStakes() public view returns (uint256)",
  "function getStakes(address) public view returns (uint256)",
  "function getPayout(address) public view returns (uint256)",
  "function getMinerFee() public view returns (uint256)",
  "function poolSize() public view returns (uint256)",
  "function miner() public view returns (address)",
  "function minerFeeBp() public view returns (uint256)",
  "function protocolFeeBp() public view returns (uint256)",
  "function minerContact() public view returns (string memory)",
  "function withdraw() public",
  "function withdrawMinerFee() public",
];

export default {
  name: 'ContractComponent',
  props: {
    address: String
  },
  data() {
    return {
      startTime: null,
      endTime: null,
      minStakes: 0,
      maxStakers: 0,
      totalStakes: 0,
      poolSize: 0,
      miner: '',
      minerFeeBp: 0,
      protocolFeeBp: 0,
      minerContact: '',
      userStakes: 0,
      stakeAmount: 0,
      userRewards: 0,
      minerRewards: 0,
      timer: null,
      signer: null,
      provider: null,
      poolContract: null,
      loading: true
    };
  },
  computed: {
    startTimeStr() {
      return moment(this.startTime*1000).format('DD/MM/YYYY HH:MM')
    },
    endTimeStr() {
      return moment(this.endTime*1000).format('DD/MM/YYYY HH:MM')
    },
    userBalance() {
      const a = this.$ethers.BigNumber.from(this.userStakes);
      const b = this.$ethers.BigNumber.from(this.userRewards);
      return a.add(b).toString();
    },
    minerContactUrl() {
      return "https://t.me/" + this.minerContact;
    }
  },
  watch: {
  },
  methods: {
    async stake() {
      const params = [{
        from: this.$store.state.account,
        to: this.address,
        value: this.$ethers.utils.parseEther(this.stakeAmount).toHexString()
      }];

      const tx = await this.provider.send('eth_sendTransaction', params)
      console.log(tx);
    },
    async withdraw() {
      const tx = await this.poolContract.withdraw();
      console.log(tx);
    }
  },
  mounted() {
    this.provider = new this.$ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.poolContract = new this.$ethers.Contract(this.address, poolAbi, this.signer);
    this.timer = setInterval(async () => {
      const account = this.$store.state.account;
      if (account) {
        [
          this.startTime,
          this.endTime,
          this.minStakes,
          this.maxStakers,
          this.totalStakes,
          this.poolSize,
          this.miner,
          this.minerFeeBp,
          this.protocolFeeBp,
          this.minerContact,
          this.userStakes,
          this.userRewards,
          this.minerRewards,
        ] = await Promise.all([
          this.poolContract.startTime(),
          this.poolContract.endTime(),
          this.poolContract.minStakes(),
          this.poolContract.maxStakers(),
          this.poolContract.totalStakes(),
          this.poolContract.poolSize(),
          this.poolContract.miner(),
          this.poolContract.minerFeeBp(),
          this.poolContract.protocolFeeBp(),
          this.poolContract.minerContact(),
          this.poolContract.getStakes(account),
          this.poolContract.getPayout(account),
          this.poolContract.getMinerFee(),
        ]);
        this.loading = false;
      }
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
