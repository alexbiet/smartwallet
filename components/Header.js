import { ConnectButton } from "web3uikit";
import { Blockie } from "web3uikit";
import { NativeBalance } from "web3uikit";

export default function Header() {
    return(
    <nav>
        <a href="index.js">Home</a>
    <ConnectButton moralisAuth={false} />
    </nav>
    );
}