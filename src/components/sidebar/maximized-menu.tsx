import { SIDE_BAR_MENU } from '@/constants/menu'
import { LogOut, Menu, MonitorSmartphone } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import DomainMenu from './domain-menu'
import MenuItem from './menu-item'

type Props = {
  onExpand(): void
  current: string
  onSignOut(): void
  domains:
    | {
        id: string
        name: string
        icon: string | null
      }[]
    | null
    | undefined
}

const MaxMenu = ({ current, domains, onExpand, onSignOut }: Props) => {
  return (
    <div className="py-2 px-2 flex flex-col h-full">
      <div className="flex justify-between items-center">
      <Image
    src="/images/aesther-ai-logo.png"
    alt="Aesther-AI Logo"
    sizes="100vw"
    className="animate-fade-in opacity-100 delay-300"
    width={150} 
    height={50} 
    style={{
      maxWidth: '100%',
      height: 'auto'
    }}
  />
        <Menu
          className="cursor-pointer animate-fade-in opacity-0 delay-300 fill-mode-forwards"
          onClick={onExpand}
        />
      </div>
      <div className="animate-fade-in opacity-0 delay-300 fill-mode-forwards flex flex-col justify-between h-full pt-10">
        <div className="flex flex-col">
          <p className="text-xs text-gray-800 mb-3">Menu</p>
          {SIDE_BAR_MENU.map((menu, key) => (

             <MenuItem
              size="max"
              {...menu}
              key={key}
              current={current}
            />

          ))}

          <DomainMenu domains={domains}  />

        </div>
        <div className="flex flex-col">
          <p className="text-xs text-gray-800 mb-3">Settings</p>
          <MenuItem
            size="max"
            label="Sign out"
            icon={<LogOut />}
            onSignOut={onSignOut}
          />

        </div>
      </div>
    </div>
  )
}

export default MaxMenu
