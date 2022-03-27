import Link from 'next/link'
import { useMoralis } from 'react-moralis'
import { UserOutlined, TrophyOutlined } from '@ant-design/icons'
import Logo from '../../Logo/Logo'

const Navbar = () => {
  const { account } = useMoralis()
  return (
    <div className="hidden flex-col border-r p-10 py-6 text-slate-500 shadow-lg lg:inline-flex lg:w-48">
      <Logo />
      <nav className="my-6">
        <ul className="space-y-2">
          <li className="flex">
            <Link href="/">
              <button
                className="flex flex-grow items-center space-x-4 
                rounded-lg px-3 py-2 font-medium hover:bg-slate-100"
              >
                <TrophyOutlined />
                <span>Pools</span>
              </button>
            </Link>
          </li>
          <li className="flex">
            <Link href={`/${account}/overview`}>
              <button
                className="flex flex-grow items-center space-x-4 
                rounded-lg px-3 py-2 font-medium hover:bg-slate-100"
              >
                <UserOutlined />
                <span>Account</span>
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
