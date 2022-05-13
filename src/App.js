import { useState } from "react";
import {Contract, ethers} from "ethers";
import {abi,address} from "./constant"

function App() {
  const [instance,setInstance] = useState(null)
  const [currAccount,setCurrAccount] = useState("")
  const [watchsMinted,setWatchsMinted] = useState(0)
  const [bagsMinted,setBagsMinted] = useState(0)
  const [winesMinted,setWinesMinted] = useState(0)
  const [accessoriesMinted,setAccessoriesMinted] = useState(0)
  const [totalMinted,setTotalMinted] = useState(0)
  const connect = async()=>{
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setCurrAccount(await signer.getAddress());
      const contract = new Contract(address,abi,signer)
      setInstance(contract)
      setWatchsMinted((await contract.watchsMinted()).toNumber())
      setBagsMinted((await contract.bagsMinted()).toNumber())
      setWinesMinted((await contract.winesMinted()).toNumber())
      setAccessoriesMinted((await contract.accessoriesMinted()).toNumber())
      setTotalMinted((await contract.totalMinted()).toNumber())
    }
    catch(err){
      alert(err)
    }
  }
  console.log(instance)
  var totalAmount = totalMinted;
  var totalWatch = watchsMinted;
  var totalBag = bagsMinted;
  var totalWine = winesMinted;
  var totalAccessories = accessoriesMinted;
  const mint = async(name) => {
    try{
      if(name == "all"){
        let amount = parseInt(document.getElementsByClassName("amount")[0].value);
        if(amount*4+totalAmount>40000){
          throw new error("minting reached limit")
        }
        let ids = []
        let amounts =[]
        for(let i=0;i<amount;i++){
          totalAccessories++
          totalBag++
          totalWine++
          totalWatch++
          ids[i]=totalWatch
          ids[i+amount]=totalBag+10000
          ids[i+(2*amount)]=totalWine+20000
          ids[i+(3*amount)]=totalAccessories+30000
          amounts[i]=1
          amounts[i+amount]=1
          amounts[i+(2*amount)]=1
          amounts[i+(3*amount)]=1
        }
        console.log(amounts)
        console.log(ids)
        const tx = await instance.mintAll(ids,amounts)
        await tx.wait()
        setWatchsMinted((await instance.watchsMinted()).toNumber())
        setBagsMinted((await instance.bagsMinted()).toNumber())
        setWinesMinted((await instance.winesMinted()).toNumber())
        setAccessoriesMinted((await instance.accessoriesMinted()).toNumber())
        setTotalMinted((await instance.totalMinted()).toNumber())
        alert("minted all nfts");
      }
      else if(name == "watch"){
        let amount = parseInt(document.getElementsByClassName("amount")[1].value);
        if((amount+totalWatch)>10000){
          throw new error("minting reached limit")
        }
        let ids = []
        let amounts =[]
        for(let i=0;i<amount;i++){
          totalWatch++;
          ids[i]=totalWatch
          amounts[i]=1
        }
        console.log(amounts)
        console.log(ids)
        const tx =await instance.mintWatch(ids,amounts)
        await tx.wait()
        setWatchsMinted((await instance.watchsMinted()).toNumber())
        setTotalMinted((await instance.totalMinted()).toNumber())
        alert("minted watchs");
      }
      else if(name == "bag"){
        let amount = parseInt(document.getElementsByClassName("amount")[2].value);
        if(amount+totalBag>10000){
          throw new error("minting reached limit")
        }
        let ids = []
        let amounts =[]
        for(let i=0;i<amount;i++){
          totalBag++;
          ids[i]=totalBag+10000
          amounts[i]=1
        }
        console.log(amounts)
        console.log(ids)
        const tx = await instance.mintBag(ids,amounts)
        await tx.wait()
        setBagsMinted((await instance.bagsMinted()).toNumber())
        setTotalMinted((await instance.totalMinted()).toNumber())
        alert("minted bags");
      }
      else if(name == "wine"){
        let amount = parseInt(document.getElementsByClassName("amount")[3].value);
        if(amount+totalWine>10000){
          throw new error("minting reached limit")
        }
        let ids = []
        let amounts =[]
        for(let i=0;i<amount;i++){
          totalWine++;
          ids[i]=totalWine+20000
          amounts[i]=1
        }
        totalAmount+=amount
        console.log(amounts)
        console.log(ids)
        const tx = await instance.mintWine(ids,amounts)
        await tx.wait()
        setWinesMinted((await instance.winesMinted()).toNumber())
        setTotalMinted((await instance.totalMinted()).toNumber())
        alert("minted wines");
      }
      else if(name == "accessories"){
        let amount = parseInt(document.getElementsByClassName("amount")[4].value);
        if(amount+totalAccessories>10000){
          throw new error("minting reached limit")
        }
        let ids = []
        let amounts =[]
        for(let i=0;i<amount;i++){
          totalAccessories++;
          ids[i]=totalAccessories+30000
          amounts[i]=1
        }
        totalAmount+=amount
        console.log(amounts)
        console.log(ids)
        const tx = await instance.mintAccessories(ids,amounts)
        await tx.wait()
        setAccessoriesMinted((await instance.accessoriesMinted()).toNumber())
        setTotalMinted((await instance.totalMinted()).toNumber())
        alert("minted accessories");
      }
    }
    catch(err){
      alert(err)
    }
    
  }
  const changeOwner = async()=>{
    try{
      let add = (document.getElementsByClassName("amount")[5].value);
      console.log(add.length)
      const tx = await instance.transferOwnership(add)
      await tx.wait()
      alert("Change Owner")
    }
    catch(err){
      alert(arr);
    }
  }
  return (
    <div>
      <div className="nav">
        {currAccount == "" ?
        <button onClick={connect}>Connect wallet</button>
        :
        <button>connected {currAccount.slice(0,6)}</button>
        }
      </div>
      <div className="mint_page">
        <div className="minting">
          <h1>Minting All Nfts</h1>
          <input type="number" className="amount" placeholder="enter amount"></input>
          <button onClick={()=>mint("all")}>mint</button>
          <div className="minting_count">
            <h2>Nfts minted: {totalMinted}</h2>
            <h2>Nfts left : {totalAmount}</h2>
          </div>
        </div>
        
        <div className="minting">
          <h1>Minting Watchs</h1>
          <input type="number" className="amount" placeholder="enter amount"></input>
          <button onClick={()=>mint("watch")}>mint</button>
          <div className="minting_count">
            <h2>Watchs minted: {watchsMinted}</h2>
            <h2>Watchs left : {totalWatch}</h2>
          </div>
        </div>
        
        <div className="minting">
          <h1>Minting Bags</h1>
          <input type="number" className="amount" placeholder="enter amount"></input>
          <button onClick={()=>mint("bag")}>mint</button>
          <div className="minting_count">
            <h2>Bags left : {bagsMinted}</h2>
            <h2>Bags left : {totalBag}</h2>
          </div>
        </div>
        <div className="minting">
          <h1>Minting Wines </h1>
          <input type="number" className="amount" placeholder="enter amount"></input>
          <button onClick={()=>mint("wine")}>mint</button>
          <div className="minting_count">
            <h2>Wines minted: {winesMinted}</h2>
            <h2>Wines left: {totalWine}</h2>
          </div>
        </div>
        
        <div className="minting">
          <h1>Minting Accessories</h1>
          <input type="number" className="amount" placeholder="enter amount"></input>
          <button onClick={()=>mint("accessories")}>mint</button>
          <div className="minting_count">
            <h2>Accessories minted: {accessoriesMinted}</h2>
            <h2>Accessories left : {totalAccessories}</h2>
          </div>
        </div>

        <div className="minting">
          <h1>Change owner</h1>
          <input type="text" className="amount" placeholder="enter address" ></input>
          <button onClick={changeOwner}>Change</button>
        </div>
      </div>
    </div>
  );
}

export default App;
