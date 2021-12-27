import { useContractCall, useContractFunction, useEthers} from "@usedapp/core"
import { Contract } from "@ethersproject/contracts";
import { utils} from "ethers"
import CharityRaffle from "../chain-info/contracts/CharityRaffle.json";
import { Button, Alert, Stack } from "@mui/material";

export interface CollectRaffleProps {
    id: number;
    CharityRaffleAddress: string;
}

export const CollectRaffle = ({id, CharityRaffleAddress}: CollectRaffleProps) => {
    const { account } = useEthers()
    const { abi } = CharityRaffle;
    const RaffleInterface = new utils.Interface( abi )
    const [, ben, winner,, endTime] = useContractCall(
        {
            abi: RaffleInterface,
            address: CharityRaffleAddress,
            method: "GetRaffleInfo",
            args: [id]
        }
        ) ?? []
    const [expirationPeriod] = useContractCall(
        {
            abi: RaffleInterface,
            address: CharityRaffleAddress,
            method: "expirationPeriod",
            args: []
        }
        ) ?? []
    const [,,,ticketCount,] = useContractCall(
            {
                abi: RaffleInterface,
                address: CharityRaffleAddress,
                method: "GetRaffleTicketInfo",
                args: [id]
            }
            ) ?? []
    const endDate = new Date(Number(endTime) * 1000)
    const expirationDate = new Date(Number(endTime) * 1000 + Number(expirationPeriod) * 1000)

    const RaffleContract = new Contract(CharityRaffleAddress, abi)
    const { state: collectState , send: collectSend} = useContractFunction(RaffleContract, "ClaimRaffle", {transactionName: "Purchase Tickets"})
    const handleCollect = () => {
        collectSend(id)
    }
    return (
        <div>
        { ben !== account ? (<Alert severity="error">You are not the beneficiary of this raffle</Alert>) : null}
        { ben === account && endDate > new Date()? (<Alert severity="error">The raffle has not ended!</Alert>) : null }
        { ben === account && expirationDate < new Date()?  (<Alert severity="error">The raffle has expired!</Alert>) : null }
        { ben === account && endDate < new Date() && Number(ticketCount) === 0 ? (<Alert severity="error">There are no tickets purchased!</Alert>) : null }
        { ben === account && winner !== 0x0000000000000000000000000000000000000000 ? (<Alert severity="info">The raffle has already been claimed!</Alert>) : null }
        { ben === account && endDate < new Date() && expirationDate > new Date() && winner === "0x0000000000000000000000000000000000000000" && ticketCount > 0 ? (
        <div>
            <Stack spacing={2} direction="row">
                <Alert severity="success">The raffle has ended!</Alert>
                <p>Make sure to fund the contract with LINK!</p>
                <Button color="primary" variant="contained" onClick={handleCollect}>Collect the raffle!</Button>
                {collectState.status === "Exception" ? (<Alert severity="error">{collectState.errorMessage}</Alert>) : null}
                {collectState.status === "Mining" ? (<Alert severity="info">Collecting the raffle...</Alert>) : null}
                {collectState.status === "Success" ? (<Alert severity="success">The raffle has been collected! It will take a bit for the money to be transfered and the winner to be selected while the randomness is being generated.</Alert>) : null}
            </Stack>
        </div>
        ) : null }
        </div>
    )
}
