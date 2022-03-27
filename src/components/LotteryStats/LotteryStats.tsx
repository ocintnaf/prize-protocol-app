import { Skeleton } from 'antd'
import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { gql, useQuery } from 'urql'
import { n4 } from '../../utils/formatters'
import { getCompoundApy } from '../../utils/functions'
import { Compound, CUSDT, USDT } from '../Images/Images'

export interface LotteryInfo {
  tokenName: string
  tokenSymbol: string
  cTokenName: string
  cTokenSymbol: string
  amountDeposited: string
  reserve: string
  prizePool: string
}

const lotteryInfoQuery = gql`
  query {
    prizeProtocols(first: 1) {
      tokenName
      tokenSymbol
      cTokenName
      cTokenSymbol
    }
    lotteries(orderBy: id, orderDirection: desc, first: 1) {
      amountDeposited
      reserve
      prizePool
    }
  }
`

const LotteryStats: FunctionComponent = () => {
  const [{ data }] = useQuery({ query: lotteryInfoQuery })
  const [compoundApy, setCompoundApy] = useState('')
  const { Moralis } = useMoralis()

  const lotteryInfo: LotteryInfo = {
    ...data?.prizeProtocols[0],
    ...data?.lotteries[0],
  }

  const fetchCompoundApy = useCallback(async () => {
    const compoundApy = await getCompoundApy()
    setCompoundApy(compoundApy)
  }, [])

  useEffect(() => {
    fetchCompoundApy()
  }, [])

  if (!data) return <Skeleton />
  return (
    <div className="space-y-3 px-10">
      <h1 className="text-2xl font-semibold text-prize-dark-gray">
        Lottery's Stats
      </h1>
      <div className="space-y-1">
        <div className="flex justify-between">
          <h3 className="text-prize-light-gray">Prize-eligible deposits</h3>
          <p className="text-lg font-medium text-prize-dark-gray">
            {Moralis.Units.FromWei(lotteryInfo.amountDeposited)} USDT
          </p>
        </div>
        <div className="flex justify-between">
          <h3 className="text-prize-light-gray">Reserve</h3>
          <p className="text-lg font-medium text-prize-dark-gray">
            {Moralis.Units.FromWei(lotteryInfo.reserve)} USDT
          </p>
        </div>
        <div className="flex justify-between">
          <h3 className="text-prize-light-gray">Total deposits</h3>
          <p className="text-lg font-medium text-prize-dark-gray">
            {Moralis.Units.FromWei(
              (
                parseInt(lotteryInfo.reserve) +
                parseInt(lotteryInfo.amountDeposited)
              ).toString()
            )}{' '}
            USDT
          </p>
        </div>
        <div className="flex justify-between">
          <h3 className="text-prize-light-gray">Reserve Rate</h3>
          <p className="text-lg font-medium text-prize-dark-gray">0%</p>
        </div>
        <div className="flex justify-between">
          <h3 className="text-prize-light-gray">Token</h3>
          <span className="flex items-center gap-1 text-lg font-medium text-prize-dark-gray">
            USDT
            <USDT size="20" />
          </span>
        </div>
        <div className="flex justify-between">
          <h3 className="text-prize-light-gray">Yield Token</h3>
          <span className="flex items-center gap-1 text-lg font-medium text-prize-dark-gray">
            cUSDT
            <CUSDT size="20" />
          </span>
        </div>
        <hr />
        <div className="flex justify-between">
          <h3 className="text-prize-light-gray">Yield Source</h3>
          <Compound size="20" />
        </div>
        <div className="flex justify-between">
          <h3 className="text-prize-light-gray">Effective APY </h3>
          <p className="text-lg font-medium text-prize-dark-gray">
            {n4.format(parseFloat(compoundApy))}%
          </p>
        </div>
      </div>
    </div>
  )
}

export default LotteryStats