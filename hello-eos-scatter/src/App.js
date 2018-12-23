import React, { Component } from 'react';
import './App.css';
import ScatterJS from 'scatter-js/dist/scatter.esm';
import Eos from 'eosjs';
import Button from '@material-ui/core/Button'

class App extends Component {
  network =  {
	//本地环境
    //blockchain:'eos',
    //protocol:'http',
    //host:'192.168.124.128',
    //port:7777,
    //chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
	
	//测试环境
	blockchain:'eos',
    protocol:'http',
    host:'api.kylin.eosbeijing.one',
    port:8880,
    chainId:'5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
	
  };
  currentAccount = null;
  connected = false;

  async connect(){
    //change name 'hello-scatter' to your application's name
    this.connected = await ScatterJS.scatter.connect('scatter')
    console.log(this.connected);
  }

  // login with eos account via scatter
  async login(){
    if (!this.connected) {
      console.log('not connected');
      return;
    }
    try {
      let result = await ScatterJS.scatter.getIdentity({accounts:[this.network]})
	  this.currentAccount = result.accounts[0];
      console.log("login success,", this.currentAccount)
      alert("login success" + JSON.stringify(this.currentAccount))
    } catch (e) {
      alert("login fail")
      console.log("login fail,", e)
    }
  }
  //获取链上最新出块信息
  async getInfo(){
    if (this.currentAccount == null) {
      await this.handleLogin()
    }
	//获取eos对象
    let eos = ScatterJS.scatter.eos(this.network, Eos);
    try{
      let result = await eos.getInfo({}).then(result => { 
		console.log(result) 
	})
    } catch(e) {
      console.log("error", e)
    }
  }
   //获取指定区块信息
  async getBlock(){
    if (this.currentAccount == null) {
      await this.handleLogin()
    }
	//获取eos对象
    let eos = ScatterJS.scatter.eos(this.network, Eos);
    try{
      let result = await eos.getBlock(1).then(result => { console.log(result) })
    } catch(e) {
      console.log("error", e)
    }
  }
  
   //获取表数据
  async getTable(){
    if (this.currentAccount == null) {
      await this.handleLogin()
    }
	//获取eos对象
    let eos = ScatterJS.scatter.eos(this.network, Eos);
    try{
      let result = await eos.getTableRows({"scope":'wuxiaopeng12', "code":'wuxiaopeng12', "table":"people", "json": true}).then(result => { console.log(result) })
    } catch(e) {
      console.log("error", e)
    }
  }
  
    //获取指定账户余额
  async getCurrencyBalance(){
    if (this.currentAccount == null) {
      await this.handleLogin()
    }
	//获取eos对象
    let eos = ScatterJS.scatter.eos(this.network, Eos);
    try{
      let result = await eos.getCurrencyBalance({ code: "eosio.token", account: "bob", symbol: "SYS" }).then(result => console.log(result))
    } catch(e) {
      console.log("error", e)
    }
  }
  
   async upsert(){
    if (this.currentAccount == null) {
      await this.handleLogin()
    }
    //please change hello_contract_name to your contract account(部署合约账户)
    let contract_name = 'wuxiaopeng12';
    let eos = ScatterJS.scatter.eos(this.network, Eos);
    try{
      let data = {
		user:'wuxiaopeng12',
		first_name:'firstName',
		last_name:'lastName',
		street:'世纪城',
		city:'贵阳',
		state:'正常'
      }
      let tr = await eos.transaction(
        {
            actions: [
                {
                    account: contract_name,
                    name: 'upsert',
                    authorization: [{
                      actor: 'wuxiaopeng12',
                      permission: 'active'
                    }],
                    data,
                }
            ]
        }
      )
      console.log(tr)
    } catch(e) {
      console.log("error", e)
    }
  }
 
  
  async create(){
    if (this.currentAccount == null) {
      await this.handleLogin()
    }
    //please change hello_contract_name to your contract account(部署合约账户)
    let contract_name = 'wuxiaopeng12';
    let eos = ScatterJS.scatter.eos(this.network, Eos);
    try{
      let data = {
		author:'wuxiaopeng12',
		id:4,
		description:"这是一个创建测试"
      }
      let tr = await eos.transaction(
        {
            actions: [
                {
                    account: contract_name,
                    name: 'create',
                    authorization: [{
                      actor: 'wuxiaopeng12',
                      permission: 'active'
                    }],
                    data,
                }
            ]
        }
      )
      console.log(tr)
    } catch(e) {
      console.log("error", e)
    }
  }
  
  async issue(){
    if (this.currentAccount == null) {
      await this.handleLogin()
    }
    //please change hello_contract_name to your contract account(部署合约账户)
    let hello_contract_name = 'eosio.token';
    let eos = ScatterJS.scatter.eos(this.network, Eos);
    try{
      let data = {
		to:'alice',
		quantity:'100.0000 SYS',
		memo:"memo"
      }
	  console.log("currentAccount", this.currentAccount.name)
      let tr = await eos.transaction(
        {
            actions: [
                {
                    account: hello_contract_name,
                    name: 'issue',
                    authorization: [{
                      actor: 'testissuer',
                      permission: 'active'
                    }],
                    data,
                }
            ]
        }
      )
      console.log(tr)
    } catch(e) {
      console.log("error", e)
    }
  }
  
  async transfer(){
    if (this.currentAccount == null) {
      await this.handleLogin()
    }
    //please change hello_contract_name to your contract account(部署合约账户)
    let hello_contract_name = 'eosio.token';
    let eos = ScatterJS.scatter.eos(this.network, Eos);
    try{
      let data = {
		from:'alice',
		to:'bob',
		quantity:'20.0000 SYS',
		memo:'momo'
      }
      let tr = await eos.transaction(
        {
            actions: [
                {
                    account: hello_contract_name,
                    name: 'transfer',
                    authorization: [{
                      actor: 'alice',
                      permission: 'active'
                    }],
                    data,
                }
            ]
        }
      )
      console.log(tr)
    } catch(e) {
      console.log("error", e)
    }
  }
   async move(){
    if (this.currentAccount == null) {
      await this.handleLogin()
    }
    //please change hello_contract_name to your contract account(部署合约账户)
    let hello_contract_name = 'wuxiaopeng12';
    let eos = ScatterJS.scatter.eos(this.network, Eos);
    try{
      let data = {
		challenger: "wuxiaopeng11",
		host: "wuxiaopeng12",
		by: "wuxiaopeng12",
		row: 2,
		column: 1
      }
      let tr = await eos.transaction(
        {
            actions: [
                {
                    account: hello_contract_name,
                    name: 'move',
                    authorization: [{
                      actor: 'wuxiaopeng12',
                      permission: 'active'
                    }],
                    data,
                }
            ]
        }
      )
      console.log(tr)
    } catch(e) {
      console.log("error", e)
    }
  }
  async sayHello(){
    if (this.currentAccount == null) {
      await this.handleLogin()
    }
    //please change hello_contract_name to your contract account(部署合约账户)
    let hello_contract_name = 'itleakstoken';
    let eos = ScatterJS.scatter.eos(this.network, Eos);
    try{
      let data = {
        user:this.currentAccount.name
      }
      let tr = await eos.transaction(
        {
            actions: [
                {
                    account: hello_contract_name,
                    name: 'hi',
                    authorization: [{
                      actor: this.currentAccount.name,
                      permission: this.currentAccount.authority
                    }],
                    data,
                }
            ]
        }
      )
      console.log(tr)
    } catch(e) {
      console.log("error", e)
    }
  }

  
  async claimeeth(){
    if (this.currentAccount == null) {
      await this.handleLogin()
    }
    //please change hello_contract_name to your contract account
    let hello_contract_name = 'ethsidechain';
    let eos = ScatterJS.scatter.eos(this.network, Eos);
    try{
      let data = {
        from:this.currentAccount.name,
        quantity:'0.0000 EETH'
      }
      let tr = await eos.transaction(
        {
            actions: [
                {
                    account: hello_contract_name,
                    name: 'signup',
                    authorization: [{
                      actor: this.currentAccount.name,
                      permission: this.currentAccount.authority
                    }],
                    data,
                }
            ]
        }
      )
      console.log(tr)
    } catch(e) {
      console.log("error", e)
    }
  }

  async logout() {
    ScatterJS.scatter.forgetIdentity();
  }

  async handleLogin() {
    await this.connect()
    await this.login()
  }

  render() {
    document.title="hello-eos-scatter";
    return (
      <div className="App">
      <div className="BtnDiv">
          <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.handleLogin.bind(this)}>login</Button>
          </div>
		  <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.logout.bind(this)}>logout</Button>
          </div>
          <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.sayHello.bind(this)}>sayHi</Button>
          </div>
		  <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.create.bind(this)}>create</Button>
          </div>
		  <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.issue.bind(this)}>issue</Button>
          </div>
		   <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.transfer.bind(this)}>transfer</Button>
          </div>
		   <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.upsert.bind(this)}>upsert</Button>
          </div>
		  <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.move.bind(this)}>move</Button>
          </div>
		  <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.getInfo.bind(this)}>获取最新块：getInfo</Button>
          </div>
		  <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.getBlock.bind(this)}>获取指定区块：getBlock</Button>
          </div>
		  <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.getTable.bind(this)}>获取指定区块：getTable</Button>
          </div>
		  <div className="Btn">
            <Button variant="contained" color="primary" onClick={this.getCurrencyBalance.bind(this)}>获取指定账户余额：getCurrencyBalance</Button>
          </div>
          <div className="Btn">
            <p>如果当前账号没有eeth，则可以claim, 会消耗0.24k Ram,  会获得3500 EETH</p>
            <Button variant="contained" color="primary" onClick={this.claimeeth.bind(this)}>claim eeth</Button>
          </div>
      </div>
      </div>
    );
  }
}

export default App;
