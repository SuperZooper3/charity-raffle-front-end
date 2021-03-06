import { useContractCall, useEthers } from "@usedapp/core"
import { utils, constants} from "ethers"
import CharityRaffle from "../chain-info/contracts/CharityRaffle.json";

export interface RaffleInfoProps {
    id: number;
    CharityRaffleAddress: string;
}

export const RaffleBasicInfo = ({id, CharityRaffleAddress}: RaffleInfoProps) => {
    const { account } = useEthers()
    const { abi } = CharityRaffle;
    const RaffleInterface = new utils.Interface( abi )
    const [name, ben, winner, startTime, endTime] = useContractCall(
        {
            abi: RaffleInterface,
            address: CharityRaffleAddress,
            method: "GetRaffleInfo",
            args: [id]
        }
        ) ?? []
    const startDate = new Date(Number(startTime) * 1000)
    const endDate = new Date(Number(endTime) * 1000)
    const winnerText = winner !== "0x0000000000000000000000000000000000000000" ? `Winner: ${winner}` : "Winner: No winner yet"
    return (
        <div>
            {
                (ben !== constants.AddressZero) ? (
                    <div>
                        <p>Name: {name}</p>
                        <p>Beneficiary: {account === ben ? <b>{ben}</b> : ben}</p>
                        <p>{winnerText === ben ? <b>{winnerText}</b> : winnerText}</p>
                        <p>Start date: {startDate.toLocaleString()}</p>
                        <p className = {(Number(endTime) * 1000) <= Date.now() ? "red": ""}>End date: {endDate.toLocaleString()}</p>
                    </div>
                ) : (
                    <p>No raffle with id {id}</p>
                )
            }
        </div> 
    )
}

export const RaffleTicketInfo = ({id, CharityRaffleAddress}: RaffleInfoProps) => {
    const { abi } = CharityRaffle;
    const RaffleInterface = new utils.Interface( abi )
    const [,startTime,,ticketCount, ticketPrice] = useContractCall(
        {
            abi: RaffleInterface,
            address: CharityRaffleAddress,
            method: "GetRaffleTicketInfo",
            args: [id]
        }
        ) ?? []
    const ticketPriceEth = Number(ticketPrice) ? Number(ticketPrice)* 10**-18 : "0"
    return (
        <div>
            {
                (Number(startTime) !== 0) ? (
                    <div>
                        <p>Ticket Price: {Number(ticketPriceEth)} ETH</p>
                        <p>Ticket Count: {Number(ticketCount)}</p>
                    </div>
                ) : (
                    <p>No ticket info for {id}</p>
                )
            }
        </div> 
    )
}

export const RaffleParticipantInfo = ({id, CharityRaffleAddress}: RaffleInfoProps) => {
    const { account } = useEthers();
    const { abi } = CharityRaffle;
    const RaffleInterface = new utils.Interface( abi )
    const [rawTicketBalance] = useContractCall(
        {
            abi: RaffleInterface,
            address: CharityRaffleAddress,
            method: "GetRaffleBalance",
            args: [id, account]
        }
        ) ?? []
    const [,,,rawTicketCount,] = useContractCall(
            {
                abi: RaffleInterface,
                address: CharityRaffleAddress,
                method: "GetRaffleTicketInfo",
                args: [id]
            }
            ) ?? []
    const ticketBalance = Number(rawTicketBalance) ?? 0
    const winProb = ((Number(ticketBalance) / Number(rawTicketCount) ) * 100)
    
    return (
        <div>
            {ticketBalance !== 0 ? (
                <div>
                    <p> Ticket Balance: {ticketBalance} </p>
                    <p> Win Probability: {winProb >= 0.01? winProb.toFixed(2): "<0.01"} % </p>
                </div>
            ) : null
            }
        </div>
    )
}