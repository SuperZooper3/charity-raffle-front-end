import { useContractCall, useContractFunction, useEthers, useTokenBalance} from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Contract } from "@ethersproject/contracts";
import { utils, constants} from "ethers"
import CharityRaffle from "../chain-info/contracts/CharityRaffle.json";
import Stack from '@mui/material/Stack';
import { Button, TextField, Alert } from "@mui/material";
import { useState } from "react";


export interface PurchaseTicketProps {
    id: number;
    CharityRaffleAddress: string;
}

export const PurchaseTicket = ({id, CharityRaffleAddress}: PurchaseTicketProps) => {
    const { account, chainId} = useEthers();
    const { abi } = CharityRaffle;
    const RaffleInterface = new utils.Interface( abi )
    const [name,rawStartTime,rawEndTime,ticketCount, ticketPrice] = useContractCall(
        {
            abi: RaffleInterface,
            address: CharityRaffleAddress,
            method: "GetRaffleTicketInfo",
            args: [id]
        }
        ) ?? []
    const ticketPriceEth = Number(ticketPrice) ? Number(ticketPrice) * 10**-18 : 0
    const [purchaseTicketCount, setPurchaseTicketCount] = useState<number>(0)
    const handleTCInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {setPurchaseTicketCount(event.target.value === "" ? 0 : Number(event.target.value))};
    const startTime = Number(rawStartTime) * 1000
    const endTime = Number(rawEndTime) * 1000

    const RaffleContract = new Contract(CharityRaffleAddress, abi)
    const { state: purchaseState , send: purchaseSend } = useContractFunction(RaffleContract, "BuyTickets", {transactionName: "Purchase Tickets"})

    // Ticket purchase logic
    const usePurchaseTickets = () => {
        const sendValue = purchaseTicketCount * Number(ticketPriceEth) * 10**18
        purchaseSend(id, BigInt(purchaseTicketCount), {value: BigInt(sendValue)})
    }

    return (
        <div>
            {Number(startTime) < Date.now() && Number(endTime) > Date.now() - 10 ? 
            (
                <div>
                    <Alert severity="success">Raffle is OPEN!</Alert> <br></br>
                    <Stack spacing={2} direction="row">
                        <TextField id="purchase-ticket-count" label="Ticket Purchase" type="number" value={purchaseTicketCount} onChange={handleTCInputChange} InputLabelProps={{ shrink: true,}}/>
                        <p>The price of {purchaseTicketCount} tickets is {purchaseTicketCount*Number(ticketPriceEth)} ETH.</p>
                        <Button color="primary" variant="contained" disabled={purchaseTicketCount<= 0} onClick={usePurchaseTickets}>Purchase {purchaseTicketCount} tickets!</Button>
                        {purchaseState.status === "Mining" ? <Alert severity="info">Purchase in progress...</Alert> : null}
                        {purchaseState.status === "Success" ? <Alert severity="success">Purchase successful!</Alert> : null}
                        {purchaseState.status === "Fail" ? <Alert severity="error">Purchase failed!</Alert> : null}
                    </Stack>
                </div>
            ) : (
                <Alert severity="error">Raffle is not open for ticket buying.</Alert>
            )}
        </div>
    )
}
