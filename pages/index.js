import React from 'react'
import Card from '../components/Card.js'
import { createClient } from 'urql'
import Image from 'next/image'

const client = createClient({
  url: 'https://api.thegraph.com/subgraphs/name/dabit3/zoranftsubgraph'
})

// replace IPFS URL with cloudinary link
async function replaceWithCloudflareCDN(ipfsURL) {
  return ipfsURL.replace(/ipfs.fleek.co/, 'cloudflare-ipfs.com')
}

const query = `
  query {
    tokens(
      orderBy: createdAtTimestamp
      orderDirection: desc
      first: 10
    ) {
      id
      tokenID
      contentURI
      metadataURI
    }
  }
`

async function fetchData() {
  const data = await client
    .query(query)
    .toPromise()
    .then(async result => {
      const tokenData = await Promise.all(result.data.tokens.map(async token => {
        const meta = await (await fetch(token.metadataURI)).json() // ipfs link
        
        console.log(" meta: ", meta)
        if (meta.mimeType === 'video/mp4') {
          token.type = 'video'
          token.meta = meta
        }
        else if (meta.body && meta.body.mimeType === 'audio/wav') {
          token.type = 'audio'
          token.meta = meta.body
        }
        else {
          token.type = 'image'
          token.meta = meta
        }
        return token
      }))
      console.log(tokenData)
      return tokenData
    }).catch(err => {
      console.log(err)
    })
  return data
}


export default function Home(props) {
  if (props.tokens && props.tokens.length) return (
    <div className=" px-6 sm:px-4 mx-auto max-w-lg sm:max-w-2xl md:max-w-full lg:max-w-screen-2xl md:px-8 lg:px-6 lg:py-16">
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  ">
      {
        props.tokens.map(token => {
          return token.type !== 'image' ? null :
            <div key={replaceWithCloudflareCDN(token.contentURI)} style={{
              padding: '20px 0px'
            }}>
              <Card
                key={token.contentURI}
                title={token.meta.name}
                description={token.meta.description}>
                <Image
                  className="rounded-t-xl h-96"
                  src={token.meta.url || token.contentURI}
                  alt={`nft-${token.meta.name}`}
                  width={500}
                  height={500}
                  quality={75}
                />
              </Card>
          </div>
        })
      }
    </div>
    </div>
  )
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const data = await fetchData()
  return {
    props: {
      tokens: data
    }
  }
}
