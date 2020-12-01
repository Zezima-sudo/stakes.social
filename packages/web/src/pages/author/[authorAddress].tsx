import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Header } from 'src/components/organisms/Header'

import { Footer } from 'src/components/organisms/Footer'
import styled from 'styled-components'
import { useListPropertyMetaQuery, useGetPropertyAuthenticationQuery } from '@dev/graphql'
import { useGetMyStakingAmount, useGetTotalStakingAmount } from 'src/fixtures/dev-kit/hooks'
import TopStakers from 'src/components/organisms/TopStakers'
import TopSupporting from 'src/components/organisms/TopSupporting'
import { truncate } from 'src/fixtures/utility/string'
import { useGetAuthorInformation } from 'src/fixtures/devprtcl/hooks'
import { Avatar as AuthorAvatar } from 'src/components/molecules/Avatar'
import useWindowDimensions from '../../fixtures/utility/useWindowDimensions'
import { useGetAccount, useGetProperty } from 'src/fixtures/dev-for-apps/hooks'
import { AvatarProperty } from 'src/components/molecules/AvatarProperty'
import { Links } from '../../fixtures/_pages/ProfileHeader/Links'
import { blueGradient } from 'src/styles/gradient'
import Link from 'next/link'
import { useProvider } from 'src/fixtures/wallet/hooks'
import { useState } from 'react'
import { useCurrency } from 'src/fixtures/currency/hooks'

type Props = {}

type PoolProps = {
  propertyAddress: string
  propertyName: string
}

const Wrap = styled.div`
  margin: auto auto;
  max-width: 1048px;
`

const BannerContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  justify-content: center;
  background-color: black;
  padding: 40px 0;
`

const ResponsiveImage = styled.img`
  width: auto;
  height: 200px;
  @media (min-width: 1024px) {
    width: 18rem;
    height: 10rem;
  }
`
const Logo = styled.div`
  display: flex;
  grid-column: 2 / -1;
  justify-content: center;
  align-items: center;
  background-color: black;
`

const ProfilePicture = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  transform: translateY(-50px);
  height: 100px;
  width: 100px;
  border-radius: 90px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12);
  margin-left: 1em;

  @media (min-width: 768px) {
    margin-left: 0;
    height: 150px;
    width: 150px;
    transform: translate(-75px, -75px);
  }
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;

  > div {
    padding: 1em;
  }
  @media (min-width: 768px) {
    > div {
      padding: 0;
      padding-bottom: 1em;
    }
    grid-template-columns: 170px auto;
  }
`

const TransformedGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 120px auto;
  @media (min-width: 768px) {
    grid-template-columns: 170px auto;
  }
`

const PoolsOverview = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 1rem;
  @media (min-width: 768px) {
    grid-template-columns: 3fr 1fr 1fr;
  }
`

const PoolLogoSection = styled.div`
  display: flex;
  align-items: center;
  img,
  svg,
  div {
    margin-right: 10px;
  }
`

const OwnedStake = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`
const TotalStaked = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`

const MutedSpan = styled.span`
  color: grey;
  font-size: 0.9em;
`

const Card = styled.div`
  width: auto;
  border: solid 1px #f0f0f0;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.2em;
  cursor: pointer;
  background: #fff;
  margin-bottom: 20px;
`

const AuthorDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;

  div > button {
    align-self: center;
  }
`

const ShareList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  svg {
    cursor: pointer;
    margin-right: 5px;
  }
`

const AuthorLinks = styled.div`
  display: flex;
  grid-column: 1 / -1;
  transform: translateY(14px);
  font-size: 1.2em;

  a {
    text-decoration: none;
    color: black;

    border-bottom-color: #1ac9fc;
    margin-left: 0.8em;
  }

  @media (min-width: 768px) {
    transform: translateY(14px);
    grid-column: 2;
    font-size: 1.2em;
    a {
      margin-left: 3em;
    }

    a:first-of-type {
      margin-left: 0em;
    }
  }
`

export const Banner = () => {
  return (
    <div style={{ backgroundColor: 'black', paddingTop: '50px' }}>
      <Wrap>
        <div style={{ maxWidth: '1048px', marginRight: 'auto', marginLeft: 'auto', background: 'black' }}>
          <BannerContainer>
            <Logo>
              <ResponsiveImage src="https://res.cloudinary.com/haas-storage/image/upload/v1598697538/background_wmc31h.png" />
            </Logo>
          </BannerContainer>
        </div>
      </Wrap>
    </div>
  )
}

const Pool = ({ propertyAddress }: PoolProps) => {
  const { totalStakingAmount } = useGetTotalStakingAmount(propertyAddress)
  const { myStakingAmount } = useGetMyStakingAmount(propertyAddress)
  const { data } = useGetPropertyAuthenticationQuery({ variables: { propertyAddress } })
  const { data: propertyData } = useGetProperty(propertyAddress)
  const includeAssets = useMemo(
    () => data && truncate(data.property_authentication.map(e => e.authentication_id).join(', '), 24),
    [data]
  )

  const { currency } = useCurrency()
  console.log('propertyData: ', propertyData?.avatar?.url)

  return (
    <Link href={`/${propertyAddress}`} passHref>
      <Card>
        <PoolsOverview>
          <PoolLogoSection>
            <AvatarProperty size={75} propertyAddress={propertyAddress} />
            <h4>{includeAssets}</h4>
          </PoolLogoSection>
          <OwnedStake>
            <span>{`${myStakingAmount?.dp(2).toNumber().toLocaleString() || 0} ${currency}`}</span>
            <MutedSpan>Your stake</MutedSpan>
          </OwnedStake>
          <TotalStaked>
            <span>{`${totalStakingAmount?.dp(2).toNumber().toLocaleString() || 0} ${currency}`}</span>
            <MutedSpan>Total staked</MutedSpan>
          </TotalStaked>
        </PoolsOverview>
      </Card>
    </Link>
  )
}

const AreaLinks = styled(Links)`
  grid-area: links;
  margin-top: -0.5em;
  @media (min-width: 768px) {
    margin: 0;
  }
`

const EditButton = styled.a`
  display: flex;
  ${blueGradient('horizontal')}
  padding: 4px 16px;
  color: white;
  width: fit-content;
  border-radius: 8px;

  :hover {
    color: white;
  }

  @media (max-width: 768px) {
    margin-right: 5px;
  }
`

const Section = styled.a<{ activeSection: string; section: string }>`
  ::after {
    content: '';
    display: block;
    height: 5px;
    background: ${props =>
      props.activeSection === props.section ? 'linear-gradient(to right, #1ac9fc, #2f80ed)' : 'none'};
  }
`

const AuthorAddressDetail = (_: Props) => {
  const router = useRouter()
  let { authorAddress } = router.query
  const author: string = typeof authorAddress == 'string' ? authorAddress : 'none'
  const { data: authorInformation } = useGetAuthorInformation(author)
  const { data, loading } = useListPropertyMetaQuery({
    variables: {
      author
    }
  })
  const { accountAddress } = useProvider()

  const { data: dataAuthor } = useGetAccount(author)
  const { width } = useWindowDimensions()
  const isSelf = author.toLowerCase() === accountAddress?.toLowerCase()
  const [activeSection, setActiveSection] = useState<string>('about')

  return (
    <>
      <Header></Header>
      <Banner />
      <Wrap>
        <ProfilePicture>
          {width > 0 && <AuthorAvatar accountAddress={author} size={width > 1024 ? '140' : '90'} />}
        </ProfilePicture>

        <TransformedGrid>
          {/* <div style={{ display: 'grid', gridTemplateRows: '1fr' }}> */}
          <div style={{ gridColumn: '2 / -1', marginTop: '10px' }}>
            <AuthorDetailGrid>
              <span style={{ fontSize: '1.25em' }}>{dataAuthor?.name || data?.property_meta?.[0]?.name}</span>
              <ShareList>
                <AreaLinks links={dataAuthor?.links} />
              </ShareList>
              {isSelf && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link href={`/author/${author}/edit`}>
                    <EditButton>Edit</EditButton>
                  </Link>
                </div>
              )}
            </AuthorDetailGrid>

            <p style={{ marginBottom: '15px' }}>
              <span style={{ color: '#1AC9FC' }}>{authorInformation?.karma.toLocaleString() || 0} </span>karma
            </p>
          </div>
          <AuthorLinks>
            <Section
              onClick={() => setActiveSection('about')}
              section="about"
              activeSection={activeSection}
              href="#about"
            >
              About
            </Section>
            <Section
              onClick={() => setActiveSection('pools')}
              section="pools"
              activeSection={activeSection}
              href="#pools"
            >
              Pools
            </Section>
            <Section
              onClick={() => setActiveSection('stakers')}
              section="stakers"
              activeSection={activeSection}
              href="#top-stakers"
            >
              Stakers
            </Section>
            <Section
              onClick={() => setActiveSection('supporting')}
              section="supporting"
              activeSection={activeSection}
              href="#supporting"
            >
              Supporting
            </Section>
          </AuthorLinks>
        </TransformedGrid>
      </Wrap>
      <hr color="#F5F5F5" style={{ height: '5px' }} />
      <Wrap>
        <Grid>
          <div id="about" style={{ gridColumn: '2 / -1' }}>
            <h2>About</h2>
            <p>{dataAuthor?.biography || 'No information available for this creator'}</p>
          </div>
          <div id="pools" style={{ gridColumn: '2 / -1', width: '100%' }}>
            <h2>Pools</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {loading && <span>Loading...</span>}

              {data?.property_meta &&
                data?.property_meta?.map((property: { property: string; name: string }, index: number) => (
                  <Pool propertyAddress={property.property} propertyName={property.name} key={index} />
                ))}
            </div>
          </div>
          <div id="top-stakers" style={{ gridColumn: '2 / -1', width: 'auto' }}>
            <h2>Top stakers</h2>
            <TopStakers authorAddress={author} />
          </div>
          <div id="supporting" style={{ gridColumn: '2 / -1', width: 'auto' }}>
            <h2>Supporting</h2>
            <TopSupporting accountAddress={author} />
          </div>
        </Grid>
      </Wrap>

      <Footer />
    </>
  )
}

export default AuthorAddressDetail
