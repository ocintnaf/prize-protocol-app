import { LoadingOutlined } from '@ant-design/icons'
import { notification, Skeleton } from 'antd'
import Link from 'next/link'
import React, { FunctionComponent, useState } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { gql, useQuery } from 'urql'
import { prizeProtocolABI } from '../../utils/abis/prizeProtocolABI'
import { PROTOCOL_ADDRESS } from '../../utils/constants'
import { n2 } from '../../utils/formatters'
import TransactionPending from '../TransactionPending/TransactionPending'
import {
  PlayerCardBodyWrapper,
  PlayerCardButton,
  PlayerCardHeaderWrapper,
  PlayerCardLink,
  PlayerCardText,
  PlayerCardTitle,
  PlayerStatsCardWrapper,
} from './PlayerStats.style'

export interface PlayerstatsProps {
  profileLink?: boolean
  button?: boolean
  account: string
}

export interface PlayerInfo {
  player: {
    balance: string
  }
}

const playerInfoQuery = gql`
  query ($id: String) {
    player(id: $id) {
      balance
    }
  }
`

const openNotification = (err: Error) => {
  notification['error']({
    message: err.message,
    description: `We weren't able to process the transaction - Reason: ${err.message}`,
    duration: 5,
  })
}

const PlayerStats: FunctionComponent<PlayerstatsProps> = ({
  profileLink = true,
  button = true,
  account: address,
}) => {
  const [isRedeemLoading, setIsRedeemLoading] = useState(false)
  const [isTransactionPending, setIsTransactionPending] = useState(false)
  const [txHash, setTxHash] = useState('')
  const { Moralis } = useMoralis()
  const [{ data }] = useQuery<PlayerInfo>({
    query: playerInfoQuery,
    variables: { id: address },
  })

  const { runContractFunction: redeem } = useWeb3Contract({
    abi: prizeProtocolABI,
    contractAddress: PROTOCOL_ADDRESS,
    functionName: 'redeem',
    params: {
      _tokenAmount: data?.player ? data.player.balance : null,
    },
  })

  const handleRedeemClick = async () => {
    setIsRedeemLoading(true)

    await redeem({
      onSuccess: async (tx: any) => {
        setTxHash(tx.hash)
        setIsTransactionPending(true)
        await tx.wait(1)
        setIsRedeemLoading(false)
        setIsTransactionPending(false)
      },
      onError: (err) => {
        openNotification(err)
        setIsRedeemLoading(false)
        setIsTransactionPending(false)
      },
    })
  }

  if (data && data.player)
    return (
      <>
        <PlayerStatsCardWrapper>
          <PlayerCardHeaderWrapper>
            <PlayerCardTitle>Dashboard</PlayerCardTitle>
            {address && profileLink && (
              <Link href={`/players/${address}`}>
                <PlayerCardLink>Profile</PlayerCardLink>
              </Link>
            )}
          </PlayerCardHeaderWrapper>
          <PlayerCardBodyWrapper>
            <div className="space-y-1">
              <h3 className="text-sm text-white sm:text-base">Balance</h3>
              <PlayerCardText>
                {data && data.player
                  ? n2.format(
                      parseFloat(Moralis.Units.FromWei(data.player.balance))
                    )
                  : '0'}
                <span className="text-xl"> USDT</span>
              </PlayerCardText>
            </div>
            {button && (
              <PlayerCardButton onClick={handleRedeemClick}>
                {isRedeemLoading ? <LoadingOutlined /> : 'Redeem All Balance'}
              </PlayerCardButton>
            )}
          </PlayerCardBodyWrapper>
        </PlayerStatsCardWrapper>
        <TransactionPending isVisible={isTransactionPending} txHash={txHash} />
      </>
    )

  if (data && !data.player)
    return (
      <>
        <PlayerStatsCardWrapper>
          <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-2">
            <div>
              <h1 className="text-xl font-semibold text-white sm:text-2xl">
                You haven't joined a lottery yet!
              </h1>
              <h2 className="text-sm text-white sm:text-base">
                Try your luck and get the chance to win big prizes!
              </h2>
            </div>
            <Link href={`/${PROTOCOL_ADDRESS}/deposit`}>
              <button className="rounded-lg bg-white py-2 px-10 text-sm font-semibold text-prize-dark-gray shadow-xl sm:text-base">
                Deposit
              </button>
            </Link>
          </div>
        </PlayerStatsCardWrapper>
      </>
    )

  return <Skeleton />
}

export default PlayerStats
