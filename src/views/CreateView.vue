<template>
  <div class="create box" style="background-color: #eeeeee">
    <div class="subtitle">Create Contract</div>
    <div class="input-area">
      <div class="block">
        <b-field>
          <b-numberinput v-model="minStake" placeholder="Minimum Stake Amount" :min="1"></b-numberinput>
        </b-field>
      </div>
      <div class="block">
        <b-field>
          <b-numberinput v-model="maxStakers" placeholder="Max Stakers" :min="1"></b-numberinput>
        </b-field>
      </div>
      <div class="block">
        <b-field>
          <b-datetimepicker
            v-model="startTime"
            placeholder="Mining Start Time"
            icon="calendar"
            :timepicker="timepicker"
            :min-datetime="minDatetime"
            :max-datetime="maxDatetime"
          >
          </b-datetimepicker>
        </b-field>
      </div>
      <div class="block">
        <b-field>
          <b-input
            v-model="minerContact"
            placeholder="Telegram Username"
            type="search"
            icon="account"
            >
          </b-input>
        </b-field>
      </div>
      <div class="block" style="text-align:left">
        <div class="block">Miner Fee:</div>
        <b-field>
          <b-slider
            v-model="minerFeeBp"
            :max="10000"
            format="percent"
            tooltip-always
            indicator>
          </b-slider>
        </b-field>
      </div>
      <div class="block">
        <div class="block" style="text-align:left">Mining Cycle:</div>
        <div style="display:flex;justify-content:space-between">
          <b-radio v-model="miningCycle"
            native-value="0">
            1 Week
          </b-radio>
          <b-radio v-model="miningCycle"
            native-value="1">
            1 Month
          </b-radio>
          <b-radio v-model="miningCycle"
            native-value="2">
            3 Months
          </b-radio>
          <b-radio v-model="miningCycle"
            native-value="3">
            1 Year
          </b-radio>
        </div>
      </div>
      <div class="block" style="margin-top:3rem">
        <b-button class="is-primary" expanded @click="create">
          Create
        </b-button>
      </div>
      <b-loading v-model="isLoading"></b-loading>
    </div>
  </div>
</template>

<script>
const factoryAbi = [
  "function allPoolsLength() external view returns (uint256)",
  "function createPool(string calldata minerContact, uint256 minerFeeBp, uint256 minStakes, uint256 maxStakers, uint256 startTime, uint8 period) external returns (address pool)",
  "event PoolCreated(address indexed miner, address pool, uint256 minerFeeBp, uint256 startTime)"
];

export default {
  name: 'CreateView',
  data() {
    const min = new Date();
    const max = new Date();
    max.setDate(max.getDate() + 14);
    max.setHours(12);
    max.setMinutes(0);
    max.setSeconds(0);
    return {
      count: 0,
      minerFeeBp: 5000,
      minStake: null,
      maxStakers: null,
      timepicker: {
        incrementMinutes: 15,
      },
      startTime: new Date(),
      miningCycle: 0,
      minDatetime: min,
      maxDatetime: max,
      minerContact: null,
      isLoading: false,
      contractAddress: null,
    };
  },
  async mounted() {
  },

  methods: {
    async create() {
      const chainConfigIntval = setInterval(async () => {
        const { chainConfig } = this.$store.state;
        if (chainConfig.chainId) {
          this.contractAddress = chainConfig.factory;
          this.isLoading = true;
          const provider = new this.$ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const factoryContract = new this.$ethers.Contract(this.contractAddress, factoryAbi, signer);
          const startTimestamp = parseInt(this.startTime.getTime() / 1000);
          const tx = await factoryContract.createPool(this.minerContact, this.minerFeeBp, this.minStake, this.maxStakers, startTimestamp, this.miningCycle);
          const intval = setInterval(async () => {
            console.log(tx);
            const txReceipt = await provider.getTransaction(tx.hash);
            if (txReceipt && txReceipt.blockNumber) {
              this.isLoading = false;
              this.$buefy.toast.open({
                message: 'Contract created successfully!',
                type: 'is-success'
              })
              clearInterval(intval);
            }
          }, 3000);
          clearInterval(chainConfigIntval);
        }
      }, 3000);
      // const filter = factoryContract.filters.PoolCreated(this.$store.state.account);
      // factoryContract.on(filter, (miner, pool) => {
      //   this.isLoading = false;
      //   this.$router.push({ name: 'contract', params: { address: pool } });
      // });
    },
  },
}
</script>

<style>
.create{
  margin-top: 0.5rem;
  min-height: calc(100vh - 278px);
}
.input-area {
  margin: 0 20%;
}
.icon svg {
  width: 1.5rem!important;
}
</style>
