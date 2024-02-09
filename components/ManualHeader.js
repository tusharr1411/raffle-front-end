import { useMoralis } from "react-moralis"
import { useEffect } from "react"; // core react hook
import { color } from "web3uikit";


export default ()=>{
    const {enableWeb3,isWeb3Enabled,account,Moralis,deactivateWeb3,isWeb3EnableLoading} = useMoralis();// enableWeb3 is a function
    // use moralis is a hook
    // Hooks allow function components to have 
    // access to state and other React features.
    // Because of this, class components are generally no longer needed.
    /*
    There are 3 rules for hooks:
    1. Hooks can only be called inside React function components.
    2. Hooks can only be called at the top level of a component.
    3. Hooks cannot be conditional
    */
    /* isWeb3Enabled(bool) tracks whether or not web3 wallet connected */
    /* account()  check wheter there is an account or not */

    useEffect(()=>{
        if(isWeb3Enabled) return
        console.log(` This is isWeb3Enabled : ${isWeb3Enabled}`)
        if(typeof window !== "undefined"){
            if(window.localStorage.getItem("connected")){
                enableWeb3();
            }
        }
        // enableWeb3() // if we are not connected to web3

    }, [isWeb3Enabled])
    // takes 2 parameters, a function and a dependencies array(optional)
    // useEffects gonna check continuously the values in array changes or not, if they do then it calls function
    // automatically run on load
    // then it will run checking the value
    // No dependencies array : run anytime something changes(re-render)
    // blank array : run once on load
    //
    
    
    /* Local Storage */

    useEffect(()=>{
        Moralis.onAccountChanged((newAccount)=>{
            console.log(`Account changed to ${newAccount}`)
            if(newAccount == null){
                window.localStorage.removeItem("connected");
                deactivateWeb3();// sets isWeb3Enabled to false
                console.log("Null account found")
            }
        })
    },[])




    
    return(
        <div>
            {account
            ? ( <div> Connected to {account.slice(0,6)}...{account.slice(account.length-4)} </div>)

            : (
                <button  onClick={async()=>{
                    const CONNECTED  = await enableWeb3();
                    if(typeof window !== "undefined" && typeof CONNECTED !== "undefined"){ 
                        window.localStorage.setItem("connected", "inject")
                    }
                }}

                    disabled = {isWeb3EnableLoading}
                >
                    Connect Wallet
                </button> 
            )
            }
        </div>
    )
}