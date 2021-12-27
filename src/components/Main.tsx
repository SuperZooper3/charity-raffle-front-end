
import { useEthers } from "@usedapp/core"
import networkMapping from "../chain-info/deployments/map.json"
import helperConfig from "../helper-config.json"
import { constants } from "ethers";
import { InteractionMenu } from "./InteractionMenu";

export const Main = () => {
    const { chainId } = useEthers();
    const network = chainId ? helperConfig[chainId] : "development";
    const CharityRaffleAddress: string = chainId ? networkMapping[String(chainId)]["CharityRaffle"][0] : constants.AddressZero
    return (
        <div>
            <h1>Charity Raffle</h1>
            <p>Using contract {CharityRaffleAddress} on {chainId ? network : "disconnected"} network.</p>
            { CharityRaffleAddress !== constants.AddressZero ? <InteractionMenu /> : <p>No CharityRaffle contract deployed on this network.</p> }
        </div>
    ) 
}