import { ConnectButton } from "web3uikit"



export default function Header(){
     return (
        <div className="flex flex-row  bg-black h-14" >
            <div className=" ml-auto  py-2">

                <ConnectButton moralisAuth={false} />
            </div>

            {/* moralisAuth = false means we are not trying to connect to a server */}
        </div>)
}