import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect(){
  await ethereum.request({ method: 'eth_requestAccounts' })
  connectButton.innerHTML="Disconnect"
}

async function getBalance() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const balance = await provider.getBalance(contractAddress)
  alert(`Contract balance is: ${ethers.utils.formatEther(balance)} ETH`)
}

async function getContract() {
  const provider = getProvider()
  const signer = provider.getSigner()
  return new ethers.Contract(contractAddress, abi, signer)
}

function getProvider() {
  return new ethers.providers.Web3Provider(window.ethereum)
}

async function fund() {
  let ethAmount = document.getElementById('ethAmount').value
  const provider = getProvider()
  const contract = await getContract()
  try {
    const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
    await listenForTransactionMine(transactionResponse, provider)
    console.log("Done")
  } catch(error) {
    alert("Funding cancelled")
    console.log(error)
  }
}

async function withdraw() {
  const provider = getProvider()
  const contract = await getContract()
  try {
    const transactionResponse = await contract.withdraw()
    await listenForTransactionMine(transactionResponse, provider)
    console.log("Done")
  } catch(error) {
    alert("Funding cancelled")
    console.log(error)
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`Completed with ${transactionReceipt.confirmations}`)
      resolve()
    })
  })
}
