<template>
  <div class="contracts">
    <div style="margin-bottom:1rem">
      <div style="display:flex; justify-content:space-between; margin-bottom:1rem">
        <b-dropdown v-model="selected" aria-role="list">
          <template v-if="selected === 0" #trigger>
            <b-button
              type="is-primary"
              label="All Contracts"
              icon-left="earth"
              icon-right="menu-down">
            </b-button>
          </template>
          <template v-else-if="selected === 1" #trigger>
            <b-button
              type="is-primary"
              label="My Contracts"
              icon-left="account-multiple"
              icon-right="menu-down">
            </b-button>
          </template>
          <template v-else-if="selected === 2" #trigger>
            <b-button
              type="is-primary"
              label="Ongoing"
              icon-left="play-circle"
              icon-right="menu-down">
            </b-button>
          </template>
          <template v-else-if="selected === 3" #trigger>
            <b-button
              type="is-primary"
              label="Ended"
              icon-left="stop-circle"
              icon-right="menu-down">
            </b-button>
          </template>
          <template v-else-if="selected === 4" #trigger>
            <b-button
              type="is-primary"
              label="Participation"
              icon-left="account-plus"
              icon-right="menu-down">
            </b-button>
          </template>

          <b-dropdown-item :value="0" aria-role="listitem">
            <div class="media">
              <b-icon class="media-left" icon="earth"></b-icon>
              <div class="media-content">
                <h3>All Contracts</h3>
              </div>
            </div>
          </b-dropdown-item>

          <b-dropdown-item :value="1" aria-role="listitem">
            <div class="media">
              <b-icon class="media-left" icon="account-multiple"></b-icon>
              <div class="media-content">
                <h3>My Contracts</h3>
              </div>
            </div>
          </b-dropdown-item>
          <b-dropdown-item :value="2" aria-role="listitem">
            <div class="media">
              <b-icon class="media-left" icon="play-circle"></b-icon>
              <div class="media-content">
                <h3>Ongoing</h3>
              </div>
            </div>
          </b-dropdown-item>
          <b-dropdown-item :value="3" aria-role="listitem">
            <div class="media">
              <b-icon class="media-left" icon="stop-circle"></b-icon>
              <div class="media-content">
                <h3>Ended</h3>
              </div>
            </div>
          </b-dropdown-item>
          <b-dropdown-item :value="4" aria-role="listitem">
            <div class="media">
              <b-icon class="media-left" icon="account-plus"></b-icon>
              <div class="media-content">
                <h3>Participation</h3>
              </div>
            </div>
          </b-dropdown-item>
        </b-dropdown>

        <router-link class="button is-primary" to="/create">
          Create
        </router-link>
      </div>
      <div v-if="!isMine" class="all">
        <div v-if="contracts.length > 0">
          <b-table
            :data="contracts"
            :paginated="true"
            :per-page="pageSize"
            :current-page.sync="currentPage"
            :is-loading="isLoading"
            pagination-position="bottom"
            :row-class="(row, index) => index%2 === 1 ? 'is-odd' : 'is-even'"
            @click="clickRow"
          >

            <b-table-column field="telegram" label="Telegram" width="180"
              centered v-slot="props">
              {{props.row.telegram}}
            </b-table-column>

            <b-table-column field="startTime" label="Start Time" width="180"
              centered v-slot="props">
              {{ props.row.startAt }}
            </b-table-column>

            <b-table-column field="endTime" label="End Time" width="180"
              centered v-slot="props">
              {{ props.row.endAt }}
            </b-table-column>

            <b-table-column field="minStakes" label="Min Stakes" centered width="200" v-slot="props">
              {{ props.row.minStakes }} QKC
            </b-table-column>

            <b-table-column field="maxStakers" label="Total Stakers"
              centered v-slot="props">
              {{props.row.poolSize}}/{{props.row.maxStakers}}
            </b-table-column>

            <b-table-column field="stakeRewards" label="Staker Rewards"
              centered v-slot="props">
              {{props.row.stakeRewards}}%
            </b-table-column>
          </b-table>
        </div>
        <div v-else style="text-align:center; padding:80px; color: #999999;" class="no-auction">
          <div>
            <font-awesome-icon size="2x" :icon="['fas', 'scroll']" />
          </div>
          <div style="margin-top:24px;">
            No Contracts
          </div>
        </div>
      </div>
      <div v-else class="mine">
        <div v-if="myContracts.length > 0">
          <b-table
            :data="myContracts"
            :paginated="true"
            :per-page="pageSize"
            :current-page.sync="currentPage"
            :is-loading="isLoading"
            pagination-position="bottom"
            :row-class="(row, index) => index%2 === 1 ? 'is-odd' : 'is-even'"
            @click="clickRow"
          >
            <b-table-column field="telegram" label="Telegram" width="180"
              centered numeric v-slot="props">
              {{props.row.telegram}}
            </b-table-column>

            <b-table-column field="startTime" label="Start Time"
              centered v-slot="props">
              {{ props.row.startAt }}
            </b-table-column>

            <b-table-column field="endTime" label="End Time"
              centered v-slot="props">
              {{ props.row.endAt }}
            </b-table-column>

            <b-table-column field="minStakes" label="Min Stakes" centered v-slot="props">
              {{ props.row.minStakes }} QKC
            </b-table-column>

            <b-table-column field="maxStakers" label="Total Stakers"
              centered v-slot="props">
              {{props.row.poolSize}}/{{props.row.maxStakers}}
            </b-table-column>

            <b-table-column field="stakeRewards" label="Staker Rewards"
              centered v-slot="props">
              {{props.row.stakeRewards}}%
            </b-table-column>
          </b-table>
        </div>
        <div v-else style="text-align:center; padding:80px; color: #999999;" class="no-auction">
          <div>
            <font-awesome-icon size="2x" :icon="['fas', 'scroll']" />
          </div>
          <div style="margin-top:24px;">
            No Contracts
          </div>
        </div>
      </div>
      <b-loading v-model="isLoading"></b-loading>
    </div>
  </div>
</template>

<script>
const factoryAbi = [
  "function allPoolsLength() external view returns (uint256)",
  "function userPoolsLength() external view returns (uint256)",
  "function getAllPools() external view returns (address[] memory)",
  "function getUserPools() external view returns (address[] memory)"
];

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
  name: 'ContractsView',
  components: {},
  data() {
    return {
      contractAddress: null,
      isMine: false,
      contracts: [],
      allContracts: [],
      myContracts: [],
      currentPage: 1,
      pageSize: 10,
      selected: 0,
      factoryContract: null,
      signer: null,
      isLoading: true,
    };
  },
  async mounted() {
    const intval = setInterval(async () => {
      const { chainConfig } = this.$store.state;
      if (chainConfig.chainId) {
        this.contractAddress = chainConfig.factory;
        const provider = new this.$ethers.providers.Web3Provider(window.ethereum);
        this.signer = provider.getSigner();
        this.factoryContract = new this.$ethers.Contract(this.contractAddress, factoryAbi, this.signer);

        await Promise.all([
          this.getAllContracts(),
          this.getUserContracts(),
        ]);
        this.isLoading = false;
        clearInterval(intval);
      }
    }, 3000);
  },
  watch: {
    selected(val) {
      if (val === 0) {
        this.isMine = false;
        this.contracts = this.allContracts;
      } else if (val === 1) {
        this.isMine = true;
      } else if (val === 2) {
        this.isMine = false;
        this.contracts = this.allContracts;
        this.contracts = this.contracts.filter(
          (contract) => Date.now() < Date.parse(contract.endAt),
        );
      } else if (val === 3) {
        this.isMine = false;
        this.contracts = this.allContracts;
        this.contracts = this.contracts.filter(
          (contract) => Date.now() >= Date.parse(contract.endAt),
        );
      } else if (val === 4) {
        this.isMine = false;
        this.contracts = this.allContracts;
        this.contracts = this.contracts.filter(
          (contract) => contract.userStakes.gt(0),
        );
      }
    },
  },
  methods: {
    async getAllContracts() {
      const allContractsArr = await this.factoryContract.getAllPools();
      this.allContracts = [];
      await Promise.all(allContractsArr.map(async (address, i) => {
        const poolContract = new this.$ethers.Contract(address, poolAbi, this.signer);
        const [
          startTime,
          endTime,
          minStakes,
          maxStakers,
          poolSize,
          minerFeeBp,
          protocolFeeBp,
          minerContact,
          userStakes
        ] = await Promise.all([
          poolContract.startTime(),
          poolContract.endTime(),
          poolContract.minStakes(),
          poolContract.maxStakers(),
          poolContract.poolSize(),
          poolContract.minerFeeBp(),
          poolContract.protocolFeeBp(),
          poolContract.minerContact(),
          poolContract.getStakes(this.$store.state.account),
        ]);
        this.allContracts.push({
          id: i,
          address: address,
          telegram: minerContact,
          startAt: (new Date(startTime * 1000)).toString().slice(4, 21),
          endAt: (new Date(endTime * 1000)).toString().slice(4, 21),
          minStakes: minStakes,
          maxStakers: maxStakers,
          stakeRewards: (10000-minerFeeBp-protocolFeeBp)/100,
          userStakes: userStakes,
          poolSize: poolSize,
        });
      }));
      this.allContracts = this.allContracts.sort(
        (a, b) => Date.parse(b.startTime) - Date.parse(a.startTime),
      );
      this.contracts = this.allContracts;
    },
    async getUserContracts() {
      const userContractsArr = await this.factoryContract.getUserPools();
      let myContracts = [];
      await Promise.all(userContractsArr.map(async (address, i) => {
        const poolContract = new this.$ethers.Contract(address, poolAbi, this.signer);
        const [
          startTime,
          endTime,
          minStakes,
          maxStakers,
          poolSize,
          minerFeeBp,
          protocolFeeBp,
          minerContact,
          userStakes
        ] = await Promise.all([
          poolContract.startTime(),
          poolContract.endTime(),
          poolContract.minStakes(),
          poolContract.maxStakers(),
          poolContract.poolSize(),
          poolContract.minerFeeBp(),
          poolContract.protocolFeeBp(),
          poolContract.minerContact(),
          poolContract.getStakes(this.$store.state.account),
        ]);
        myContracts.push({
          id: i,
          address: address,
          telegram: minerContact,
          startAt: (new Date(startTime * 1000)).toString().slice(4, 21),
          endAt: (new Date(endTime * 1000)).toString().slice(4, 21),
          minStakes: minStakes,
          maxStakers: maxStakers,
          stakeRewards: (10000-minerFeeBp-protocolFeeBp)/100,
          userStakes: userStakes,
          poolSize: poolSize,
        });
      }));
      myContracts = myContracts.sort(
        (a, b) => Date.parse(b.endTime) - Date.parse(a.endTime),
      );
      this.myContracts = myContracts;
    },

    clickRow(row) {
      this.$router.push({ name: 'contract', params: { address: row.address } });
    },
  }
}
</script>

<style>
.contracts{
  margin-top: 0.5rem;
  min-height: calc(100vh - 278px);
}
.input-area {
  margin: 0 20%;
}
.no-auction {
  border-radius: 8px;
  border: 1px solid #EEEEEE;
  margin: 24px auto;
}
.button {
  font-family: Nasalization;
}
.table th {
  background: #f4fbfb;
}
tr.is-odd {
  background: #f4f4f4;
}
td.has-text-centered {
  cursor: pointer;
}
</style>
