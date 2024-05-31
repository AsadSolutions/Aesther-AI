import { useDomain } from '@/hooks/sidebar/use-domain'
import { cn } from '@/lib/utils'
import React from 'react'
import AppDrawer from '../drawer'
import { Plus } from 'lucide-react'
import { Loader } from '../loader'
import FormGenerator from '../forms/form-generator'
import UploadButton from '../upload-button'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  min?: boolean
  domains:
    | {
        id: string
        name: string
        icon: string | null
      }[]
    | null
    | undefined
}

const DomainMenu = ({ domains, min }: Props) => {
  const { register, onAddDomain, loading, errors, isDomain } = useDomain()

  return (

    <div>
      {min && <p className="text-xs text-gray-800 mt-6">Services</p>}
      <div className={cn('flex flex-col gap-4 bg-white p-3 rounded-lg', min ? 'mt-4' : 'mt-5')}>
     
      <div className="flex justify-between w-full items-center">
      {!min && <p className="text-xs text-gray-800 ">Services</p>}
        <AppDrawer
          description="add in your domain address to integrate your chatbot"
          title="Add your business domain"
          onOpen={
            <div className="cursor-pointer text-gray-800 rounded-full border-2">
              <Plus className='bg-blue shadow-2xl text-white rounded-full'/>
            </div>
          }
        >
          <Loader loading={loading}>
            <form
              className="mt-3 w-6/12 flex flex-col gap-3"
              onSubmit={onAddDomain}
            >
              <FormGenerator
                inputType="input"
                register={register}
                label="Domain"
                name="domain"
                errors={errors}
                placeholder="mydomain.com"
                type="text"
              />
              <UploadButton
                register={register}
                label="Upload Icon"
                errors={errors}
              />
              <Button
                type="submit"
                className="w-full"
              >
                Add Domain
              </Button>
            </form>
          </Loader>
        </AppDrawer>
      </div>
      <div className="flex flex-col gap-1 text-black font-medium">
        {domains &&
          domains.map((domain) => (
            <Link
              href={`/settings/${domain.name.split('.')[0]}`}
              key={domain.id}
              className={cn(
                'flex gap-3  transition duration-100 ease-in-out cursor-pointer ',
                !min ? 'p-2' : 'py-2',
                domain.name.split('.')[0] == isDomain && 'bg-white'
              )}
            >
              <div className='border-2 border-spacing-1 rounded-full border-blue'>
              <Image
              className='rounded-full'
                src={`https://ucarecdn.com/${domain.icon}/`}
                alt="logo"
                width={25}
                height={25}
              />
              </div>
              {!min && <p className="text-sm">{domain.name}</p>}
            </Link>
          ))}
      </div>
    </div>
    </div>
  
  )
}

export default DomainMenu
