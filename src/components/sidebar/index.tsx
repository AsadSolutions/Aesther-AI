'use client'
import useSideBar from '@/context/use-sidebar'
import { cn } from '@/lib/utils'
import React from 'react'
import MaxMenu from './maximized-menu'
import { MinMenu } from './minimized-menu'

type Props = {
  domains:
    | {
        id: string
        name: string
        icon: string
      }[]
    | null
    | undefined
}

const SideBar = ({ domains }: Props) => {
  const { expand, onExpand, page, onSignOut } = useSideBar()

  return (
    <div
      className={cn(
        'bg-nav dark:bg-neutral-950 h-full  fill-mode-forwards fixed md:relative rounded-lg shadow-xl',
        expand == undefined && '',
        expand == true
          ? 'animate-open-sidebar '
          : expand == false && 'animate-close-sidebar shadow-2xl '
      )}
    >
      {expand ? (

         <MaxMenu
          domains={domains}
          current={page!}
          onExpand={onExpand}
          onSignOut={onSignOut}
        />

      ) : (
        <MinMenu
          domains={domains}
          onShrink={onExpand}
          current={page!}
          onSignOut={onSignOut}
        />
      )}
    </div>
  )
}

export default SideBar
