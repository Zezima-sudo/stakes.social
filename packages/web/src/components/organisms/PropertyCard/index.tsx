import React from 'react'
import { Card } from 'antd'
import { useGetTotalRewardsAmount } from 'src/fixtures/dev-kit/hooks'
import Link from 'next/link'

interface Props {
  propertyAddress: string
}

export const PropertyCard = ({ propertyAddress }: Props) => {
  const { totalRewardsAmount } = useGetTotalRewardsAmount(propertyAddress)

  return (
    <Link href={'/[propertyAddress]'} as={`/${propertyAddress}`}>
      <Card>
        <p>property address: {propertyAddress}</p>
        {totalRewardsAmount && <p>{totalRewardsAmount.dp(1).toNumber()}</p>}
      </Card>
    </Link>
  )
}