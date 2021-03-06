<template>
  <div id="app">
    <div class="md:container sm:mx-auto lg:max-w-1024 flex flex-col px-8 pt-16 sm:pt-56">
      <h1 class="text-4xl font-light sm:text-6xl text-gray-darkest">Crypto Exchange</h1>
      <span class="text-xl font-normal text-gray-darkest pt-4">Exchange fast and easy</span>
      <div class="flex flex-col sm:flex-row justify-between items-center pt-14">
        <div class="left-currency box-border w-full relative mt-4 sm:max-w-440 sm:mt-0">
          <input type="number" :placeholder="minAmount" v-model="sum" class="box-border rounded w-full h-xl bg-gray-lighter border border-gray-light pl-4 focus:outline-none">
          <v-select class="style-chooser" :filter="fuseSearch" :options="currency" :get-option-label="(option) => option.ticker" :placeholder="selectedCurrencyLeft.ticker" v-model="selectedCurrencyLeft">
            <template v-slot:option="option">
              <div class="select-option">
                <img :class="option.icon" class="icon" :src="option.image">
                <div class="select-option__ticker">{{ option.ticker }}</div>
                <div class="select-option__name"> {{ option.name }} </div>
              </div>
            </template>
          </v-select>
        </div>
        <svg class="self-end sm:self-center mt-4 sm:mt-0 " width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.99 17H20V19H7.99V22L4 18L7.99 14V17Z" fill="#11B3FE"/>
          <path d="M16.01 8H4V10H16.01V13L20 9L16.01 5V8Z" fill="#11B3FE"/>
        </svg>
        <div class="right-currency w-full mt-4 sm:max-w-440 sm:mt-0 sm:m-0 relative">
          <input type="number" name="" id=""  :value="estimatedAmount" placeholder="" class="box-border rounded w-full h-xl bg-gray-lighter border border-gray-light pl-4 focus:outline-none">
          <v-select class="style-chooser" :filter="fuseSearch" :options="currency" :get-option-label="(option) => option.ticker" :placeholder="selectedCurrencyRight.ticker" v-model="selectedCurrencyRight">
            <template v-slot:option="option">
              <div class="select-option">
                <img :class="option.icon" class="icon" :src="option.image">
                <div class="select-option__ticker">{{ option.ticker }}</div>
                <div class="select-option__name"> {{ option.name }} </div>
              </div>
            </template>
          </v-select>
        </div>
      </div>
      <label class="text-base font-normal text-gray-darkest pt-8 pb-2">Your Ethereum address</label>
      <div class="flex flex-col justify-between sm:flex-row">
        <input type="text" class="box-border rounded max-w-723 w-full h-xl bg-gray-lighter border border-gray-light pl-4 focus:outline-none">
        <div class="w-full sm:max-w-205 sm:m-0 sm:ml-4">
          <button class="bg-blue hover:bg-blue-dark text-white font-bold text-base uppercase w-full sm:max-w-205 mt-4 sm:m-0  rounded h-xl">Exchange</button>
          <span class="error block w-full sm:max-w-205 text-base text-center text-red mt-2" v-if="error !== null">{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ModelListSelect  } from 'vue-search-select'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'


vSelect.props.components.default = () => ({
  OpenIndicator: 
  {
    render: createElement => createElement("span", {
      class: 'my-arrow'
    }, [
      createElement('span', {
        class: 'my-span-arrow-left'
      }),
      createElement('span', {
        class: 'my-span-arrow-right'
      })
    ]),
  },
});
import Fuse from 'fuse.js'

export default {
  name: 'App',
  components: {
    ModelListSelect ,
    vSelect
  },
  data(){
    return {
      apiKey: '8318962763600c23507f3d1bffcc9167bb48bd8c021037789cf0fe18a697411c',
      currency: [],
      selectedCurrencyLeft: {},
      selectedCurrencyRight: {},
      minAmount: '',
      estimatedAmount: '',
      sum: null,
      name: ''
    }
  },
  async created(){
    await this.getCurrency();
    this.showMinimalExchangeAmount()
  },
  mounted(){
  },
  updated(){
  },
  watch: {
    sum: function(newSum){
      if(newSum < this.minAmount){
        this.estimatedAmount = '';
      } else if(newSum == ''){
        this.estimatedAmount = '';
      } else{
        this.getEstimatedAmount();
        this.error = null
        }
    },
    selectedCurrencyLeft: function(newObj){
      if(Object.keys(newObj).length !== 0){
        this.showMinimalExchangeAmount()
        if(this.sum !== null && this.sum !== ''){
          this.getEstimatedAmount()
        }
        
      }
    },
    selectedCurrencyRight: function(objName){
      if(objName.length !== 0){
        this.showMinimalExchangeAmount()
        if(this.sum !== null  && this.sum !== ''){
          this.getEstimatedAmount()
        }
      }
    },
  },
  computed: {
    error: {
      get: function(){
            if(this.sum === "" || this.sum === null){
              return null
            } else if(this.sum < this.minAmount){
              return `Error: min sum ${this.minAmount}`
            } else if(this.minAmount === null){
                  return 'this pair is disabled now'
            } else if(this.estimatedAmount === null){
                  return 'this pair is disabled now'
                }
          },
      set: function(){
          
      }
    },
  },
  methods: {
    async getCurrency(){
      await axios
      .get('https://api.changenow.io/v1/currencies?active=true&fixedRate=true')
      .then(response => {
        this.currency = response.data
        this.selectedCurrencyLeft = this.currency[0]
        this.selectedCurrencyRight = this.currency[1]
      })
    },
    createCustomText(item) {
        return `${item.ticker} - ${item.name}`
      },
    showMinimalExchangeAmount(){
      if(Object.keys(this.selectedCurrencyLeft).length !== 0 && Object.keys(this.selectedCurrencyRight).length !== 0 ){
        axios.get(`https://api.changenow.io/v1/min-amount/${this.selectedCurrencyLeft.ticker}_${this.selectedCurrencyRight.ticker}?api_key=${this.apiKey}`)
        .then(response => {
          this.minAmount = response.data.minAmount
        })
        .catch(er => {
          this.error = er.message
          })
      }
    },
    getEstimatedAmount(){
      axios.get(`https://api.changenow.io/v1/exchange-amount/${this.sum}/${this.selectedCurrencyLeft.ticker}_${this.selectedCurrencyRight.ticker}?api_key=${this.apiKey}`)
        .then(response => {
          this.estimatedAmount = response.data.estimatedAmount
        })
        .catch(error => console.log(error))
    },
    fuseSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: ['ticker', 'name'],
        shouldSort: true,
      })
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list
    },
  }
}
</script>

<style>
    
</style>
