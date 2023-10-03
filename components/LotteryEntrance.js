
// we are going to use Moralis hook for our contract functions

import { useWeb3Contract,useMoralis } from "react-moralis"
import {abi,contractAddresses} from "../constants" //index.js represents whole folder
import { useEffect ,useState} from "react";
import {ethers} from "ethers"
import { useNotification } from "web3uikit"; // useNotification is a hool and returns a dispatch




export default function LotteryEntrance(){

    const {chainId : chainIdHex, isWeb3Enabled} = useMoralis() // this will return chain ID in hex form
    const chainId = parseInt(chainIdHex);

    /* 
    The reason moralis knows about chainID (what chain we are on) is because in our Header component, the header 
    actually passes up all the info about the Metamask to the moralisprovider
    and then the moralis provider passes it down to all the components inside those moralis provider tags
    */
    const raffleAddress = chainId in contractAddresses? (contractAddresses[chainId][0]) : (null);


    const [entranceFee, setEntranceFee] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");
    const [numberOfPlayers, setNumberOfPlayers] = useState("0");


    const dispatch = useNotification();

    //grabing enterRaffle() from onchain contract
    const {runContractFunction: enterRaffle, isLoading, isFetching} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkID
        functionName: "enterRaffle",
        param: {},
        msgValue: entranceFee
        //runContractFunction can both send transaction and read state
    })
    
    // grabing getEntranceFee()........
    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkID
        functionName: "getEntranceFee",
        param: {},
        //runContractFunction can both send transaction and read state
    })

    // grabing getNumberOfPlayer()...
    const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkID
        functionName: "getNumberOfPlayers",
        param: {},
        //runContractFunction can both send transaction and read state
    })
     
    // grabing getRecentWinnerAddress() from onchainContract
    const {runContractFunction: getRecentWinnerAddress} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkID
        functionName: "getRecentWinnerAddress",
        param: {},
        //runContractFunction can both send transaction and read state
    })

    // to update the UI after the every Nitification we are putting this updateUI function here
    async function updateUI(){
        const entranceFeeFromContract =( await getEntranceFee()).toString();
        const numberOfPlayers =( await getNumberOfPlayers()).toString();
        const recentWinner = (await getRecentWinnerAddress()).toString();
        console.log(recentWinner)
        setEntranceFee(entranceFeeFromContract)
        setNumberOfPlayers(numberOfPlayers)
        setRecentWinner(recentWinner)
    }




    // updates UI when some variable changes
    useEffect(()=>{
        if(isWeb3Enabled){
            // try to read raffle entrance Fee
            updateUI();
            if (raffleAddress) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(raffleAddress, abi, provider);
                contract.on("WinnerPicked", () => {
                  updateUI();
                  console.log("We've got a winner!");
                });
              }
        }
    },[isWeb3Enabled])


    // function to handle transaction completion 
    const handleSuccess = async(tx)=>{
        await tx.wait(1);
        handleNewNotification(tx);
        updateUI();
    }

    // function for notification
    function handleNewNotification(tx){
        dispatch({
            type:"info",
            message:"Transaction Completed",
            title:"Tx Notification",
            position: "topR",
            icon:"bell"
        })
    }





    // returned HTML content

    return (
        <div className="pt-40 text-white">

            <div className="mb-10 text-3xl text-center">Welcome to Decentralized Lottery </div>
            { raffleAddress 
            ?   <div className="border-4 border-solid border-orange-700 rounded-3xl p-8 w-4/6 max-w-2xl ml-auto mr-auto mt-3/4 bg-neutral-900 ">
                    
                    <button 
                        className=" bg-blue-700 hover:bg-blue-900 text-white font-sans py-2 px-r rounded-3xl border-2 border-slate-100 hover:border-slate-400   w-36" 
                        onClick={async()=>{
                            await enterRaffle({onSuccess: handleSuccess,onError: (error) => console.log(error)})}
                            } 
                        disabled={isLoading|| isFetching}
                    > 
            
                        {isFetching||isLoading 
                            ? <div role="status">
                                <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                Processing...
                            </div>
                            :<div>Enter Raffle</div>
                        }
                
                    </button> <br/>
                    
                    Entrance fee for lottery is : {ethers.utils.formatUnits(entranceFee,"ether")} Ether  <br/>
                    Number of Players entered the lottery : {numberOfPlayers} <br/>
                    Last winner is : {recentWinner}


                </div>

            : <div className="border-4 border-solid border-orange-700 rounded-3xl p-8 w-4/6 max-w-2xl ml-auto mr-auto mt-3/4 bg-neutral-700 "> No raffleAddress detcted ! </div>
            }
        </div>
    )
}


