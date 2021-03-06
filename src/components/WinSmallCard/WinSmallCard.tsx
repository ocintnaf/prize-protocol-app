import { FunctionComponent, useMemo } from 'react'
import Image from 'next/image'
import { useMoralis } from 'react-moralis'
import { gql, useQuery } from 'urql'
import { getEllipsisTxt, n2 } from '../../utils/formatters'
import logo from '../../assets/images/prize-1.png'
import Link from 'next/link'
import { Skeleton } from 'antd'

export interface Win {
  id: string
  timestamp: string
  amount: string
  winner: {
    address: string
  }
  lottery: {
    id: string
  }
}

export const winQuery = gql`
  query {
    wins(orderBy: timestamp, orderDirection: desc, first: 1) {
      id
      timestamp
      amount
      winner {
        address
      }
      lottery {
        id
      }
    }
  }
`

const WinSmallCard: FunctionComponent = () => {
  const { Moralis, account } = useMoralis()
  const [{ data }] = useQuery({ query: winQuery })

  const win: Win = useMemo(() => data?.wins[0], [data])

  if (!win) return <Skeleton />
  if (win)
    return (
      <div className="space-y-2 rounded-lg border bg-white p-2 text-center shadow-xl dark:border-prize-dark-gray dark:bg-gray-800">
        <h1 className="text-sm font-medium text-prize-light-gray">
          Lottery #{win.lottery.id} has ended!
        </h1>
        <div>
          <Image src={logo} width="125" height="125" />
          <h2 className="font-semibold text-prize-dark-gray dark:text-white">
            {win.winner.address === account
              ? 'You '
              : `${getEllipsisTxt(win.winner.address, 4)} `}
            <span className="font-medium text-prize-light-gray">won </span>
            {`$${n2.format(parseFloat(Moralis.Units.FromWei(win.amount)))}`} 🎉
          </h2>
          {win.winner.address === account && (
            <Link href={`/players/${account}`}>
              <button className="w-full rounded-lg bg-prize-red py-1 text-sm font-medium text-white shadow-xl">
                Claim!
              </button>
            </Link>
          )}
        </div>
      </div>
    )

  return null
}

export default WinSmallCard
