
import { useEthers, useNotifications} from "@usedapp/core"
import networkMapping from "../chain-info/deployments/map.json"
import helperConfig from "../helper-config.json"
import { constants } from "ethers";
import { InteractionMenu } from "./InteractionMenu";
import { useEffect, useState } from "react";

function shortenAddress(address: string) {
    return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

export const Main = () => {
    const {account, chainId, error} = useEthers();
    const { notifications } = useNotifications()
    useEffect(() => {
        if (notifications.length > 0) {
            console.log(notifications)
            if ( notifications[notifications.length - 1].type === "transactionSucceed") {console.log("Transaction succeed")}
            else if ( notifications[notifications.length - 1].type === "transactionFailed") {console.log("Transaction failed")}
        }
    }, [notifications])
    console.log(notifications)
    const network = chainId ? helperConfig[chainId] : "development";
    const CharityRaffleAddress: string = chainId ? networkMapping[String(chainId)]["CharityRaffle"][0] : constants.AddressZero
    return (
        <div>
            <h1>Charity Raffle</h1>
            <p>Using contract {CharityRaffleAddress} on {chainId ? network : "disconnected"} network.</p>
            { CharityRaffleAddress != constants.AddressZero ? <InteractionMenu /> : <p>No CharityRaffle contract deployed on this network.</p> }
        </div>
    )
    
}