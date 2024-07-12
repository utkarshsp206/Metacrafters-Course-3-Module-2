import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  const disconnectAccount = async() => {
    setAccount(undefined);
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount} style={{backgroundColor: "#4CAF50", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer", marginLeft:"10px"}}>Connect Your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        {/* <h1>Welcome to Utkarsh's ATM powered by Metacrafters</h1> */}
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <div style={{display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px"}}>
          <button onClick={withdraw} style={{backgroundColor: "#4CAF50", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer"}}>Withdraw 1 ETH</button>
          <button onClick={deposit} style={{backgroundColor: "#4CAF50", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer"}}>Deposit 1 ETH</button>
        </div>
        <button onClick={disconnectAccount} style={{backgroundColor: "#ff0000", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer"}}>Disconnect Account</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <>    
<nav style={{display:"flex", flexDirection:"column", backgroundColor:"#333", padding:"10px", borderRadius:"10px", boxShadow:"0 0 10px rgba(0,0,0,0.5)"}}>
  <label class="logo" style={{fontWeight:"bold", fontSize:"20px", color:"#fff", marginBottom:"20px", justifyContent:"center"}}>Utkarsh's ATM</label>
  <ul style={{listStyle:"none", padding:"0", margin:"0", display:"flex", justifyContent:"space-between"}}>
    <li style={{flexBasis:"20%"}}><a class="active" href="#" style={{textDecoration:"none", color:"#fff", backgroundColor:"#444", padding:"10px 20px", borderRadius:"10px"}}>Home</a></li>
    <li style={{flexBasis:"20%"}}><a href="#" style={{textDecoration:"none", color:"#fff", padding:"10px 20px", borderRadius:"10px"}}>About</a></li>
    <li style={{flexBasis:"20%"}}><a href="#" style={{textDecoration:"none", color:"#fff", padding:"10px 20px", borderRadius:"10px"}}>Services</a></li>
    <li style={{flexBasis:"20%"}}><a href="#" style={{textDecoration:"none", color:"#fff", padding:"10px 20px", borderRadius:"10px"}}>Contact</a></li>
    <li style={{flexBasis:"20%"}}><a href="#" style={{textDecoration:"none", color:"#fff", padding:"10px 20px", borderRadius:"10px"}}>Feedback</a></li>
  </ul>
</nav>
    <main className="container" style={{backgroundColor: "rgb(211 193 133)", minHeight: "85vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
    <h1>Welcome to Utkarsh's ATM <br></br>powered by Metacrafters</h1>
      {initUser()}
      <style jsx>{`
      .container {
          text-align: center
        },
         
      `}
      </style>
    </main>
    </>

  )
}