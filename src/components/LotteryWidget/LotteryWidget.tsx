import { Avatar, Badge, Skeleton } from 'antd'
import { gql, useQuery } from 'urql'
import { useMoralis } from 'react-moralis'
import { CUSDT, USDT } from '../Images/Images'
import Link from 'next/link'
import { n2 } from '../../utils/formatters'
import Countdown from '../Countdown/Countdown'
import { FunctionComponent, useMemo } from 'react'
import { getDrawingDate } from '../../utils/functions'
import { PROTOCOL_ADDRESS } from '../../utils/constants'

export interface LotteryWidgetProps {
  onLotteryEnd: () => void
}

const query = gql`
  query {
    prizeProtocols(first: 1) {
      name
      address
      drawingPeriod
      minimumDeposit
      token
      tokenName
      tokenSymbol
      cToken
      cTokenName
      cTokenSymbol
      players {
        id
      }
      lotteries(orderBy: id, orderDirection: desc, first: 1) {
        id
        state
        startTimestamp
        amountDeposited
        reserve
        prizePool
      }
    }
  }
`

const LotteryWidget: FunctionComponent<LotteryWidgetProps> = ({
  onLotteryEnd,
}) => {
  const { Moralis } = useMoralis()
  const [{ data }] = useQuery({ query })

  const protocolInfo = useMemo(() => data?.prizeProtocols[0], [data])
  const lotteryInfo = useMemo(() => protocolInfo?.lotteries[0], [protocolInfo])

  if (!data) return <Skeleton />
  return (
    <Link href={`/${PROTOCOL_ADDRESS}/deposit`}>
      <div className="cursor-pointer rounded-xl border bg-white p-5 shadow-xl dark:border-prize-dark-gray dark:bg-gray-800 md:p-10">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-3 space-y-5 sm:col-span-2">
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <Avatar.Group>
                  <Avatar src={<CUSDT />} />
                  <Avatar src={<USDT />} />
                </Avatar.Group>
                <div>
                  <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold text-prize-dark-gray dark:text-white sm:text-2xl">
                      USDT Prize Lottery #{lotteryInfo.id}
                    </h1>
                    <Badge status="processing" color="green" />
                  </div>
                  <h3 className="text-prize-light-gray">cUSDT/USDT Lottery</h3>
                </div>
              </div>
            </div>

            <p className="text-sm text-prize-light-gray">
              Every 10 days at 15UTC the luckiest player will win the prize
              pool. You get the chance to win by depositing as little as $1!
            </p>

            <div className="flex items-center justify-between rounded-lg border p-2 shadow-sm dark:border-prize-dark-gray">
              <div>
                <h3 className="text-left text-xs font-normal text-prize-light-gray sm:text-base">
                  Prize Pool
                </h3>
                <p className="flex items-center text-2xl font-medium text-prize-dark-gray dark:text-white">
                  $
                  {n2.format(
                    parseFloat(Moralis.Units.FromWei(lotteryInfo.prizePool))
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-normal text-prize-light-gray sm:text-base">
                  Players
                </h3>
                <p className="flex items-center text-2xl font-medium text-prize-dark-gray dark:text-white">
                  {protocolInfo.players.length}
                </p>
              </div>
              <div>
                <h3 className="text-right text-xs font-normal text-prize-light-gray sm:text-base">
                  Time left
                </h3>
                <Countdown
                  targetDate={getDrawingDate(
                    lotteryInfo.startTimestamp,
                    protocolInfo.drawingPeriod
                  )}
                  onTargetReached={onLotteryEnd}
                />
              </div>
            </div>
            <div className="justify-left flex">
              <Link href={`/${protocolInfo.address}/deposit`}>
                <button className="w-full rounded-lg bg-prize-red py-2 text-sm font-semibold text-white shadow-xl sm:w-1/2 sm:text-base">
                  Deposit
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default LotteryWidget
