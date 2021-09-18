<template>
  <div id="app">
    <div class="md:container sm:mx-auto lg:max-w-1024 flex flex-col px-8 pt-16 sm:pt-56">
      <h1 class="text-4xl font-light sm:text-6xl text-gray-darkest">Crypto Exchange</h1>
      <span class="text-xl font-normal text-gray-darkest pt-4">Exchange fast and easy</span>
      <div class="flex flex-col sm:flex-row justify-between items-center pt-14">
        <div class="left-currency w-full relative mt-4 sm:max-w-440 sm:mt-0">
          <input type="text" :placeholder="minAmount" v-model="sum" class="box-border rounded w-full h-xl bg-gray-lighter border border-gray-light pl-4 focus:outline-none">
          <model-list-select class="absolute top-0 right-0"
            :list="currency"
            option-value="name"
            :custom-text="createCustomText"
            v-model="selectedCurrencyLeft"
            :placeholder="selectedCurrencyLeft.ticker">
          </model-list-select>
        </div>
        <svg class="self-end sm:self-center mt-4 sm:mt-0 " width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.99 17H20V19H7.99V22L4 18L7.99 14V17Z" fill="#11B3FE"/>
          <path d="M16.01 8H4V10H16.01V13L20 9L16.01 5V8Z" fill="#11B3FE"/>
        </svg>
        <div class="right-currency w-full mt-4 sm:max-w-440 sm:mt-0 sm:m-0 relative">
          <input type="text" name="" id=""  :value="finalPrice" placeholder="" class="box-border rounded w-full h-xl bg-gray-lighter border border-gray-light pl-4 focus:outline-none">
          <model-list-select class="absolute top-0 right-0"
            :list="currency"
            option-value="name"
            :custom-text="createCustomText"
            v-model="selectedCurrencyRight"
            :placeholder="selectedCurrencyRight.ticker">
          </model-list-select>
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

export default {
  name: 'App',
  components: {
    ModelListSelect ,
  },
  data(){
    return {
      apiKey: 'c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd',
      currency: [],
      selectedCurrencyLeft: {},
      selectedCurrencyRight: {},
      minAmount: '',
      estimatedAmount: '',
      sum: null,
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
        this.finalPrice = '--';
      } else {
        this.finalPrice = newSum * this.estimatedAmount;
        this.error = null
        }
    },
    selectedCurrencyLeft: function(newObj){
      if(Object.keys(newObj).length !== 0){
        this.showMinimalExchangeAmount()
      }
    },
    selectedCurrencyRight: function(objName){
      if(objName.length !== 0){
        this.showMinimalExchangeAmount()
      }
    },
  },
  computed: {
    error: {
      get: function(){
            if(this.sum === ""){
              return null
            } else if(this.finalPrice == '--'){
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
    finalPrice: {
      get: function(){
        if((this.sum < this.minAmount) && (this.sum !== null)){
          return '--'
        } else if(this.sum === null){
          return ''
        } else
        return this.sum * this.estimatedAmount
      },
      set: function(){
      }
    }
  },
  methods: {
    async getCurrency(){
      await fetch
      ('https://api.changenow.io/v1/currencies?active=true&fixedRate=true')
      .then(response => response.json())
      .then(data => {
        this.currency = data;
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
          this.getEstimatedAmount(response.data.minAmount)
        })
        .catch(er => {
          this.error = er.message
          })
      }
    },
    getEstimatedAmount(minAmount){
      axios.get(`https://api.changenow.io/v1/exchange-amount/${minAmount}/${this.selectedCurrencyLeft.ticker}_${this.selectedCurrencyRight.ticker}?api_key=${this.apiKey}`)
        .then(response => {
          this.estimatedAmount = response.data.estimatedAmount
        })
        .catch(error => console.log(error))
    },
  }
}
</script>

<style src="./assets/tailwind.css"/>
