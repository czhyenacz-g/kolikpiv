import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const getBeerWord = (count: number): string => {
  if (count === 1) return "pivo";
  if (count >= 2 && count <= 4) return "piva";
  return "piv";
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const price = searchParams.get('price')
    const beerPrice = searchParams.get('beerPrice') || '50'

    // Default fallback image
    if (!price) {
      return new ImageResponse(
        (
          <div
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: 96,
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: 40,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  display: 'flex',
                }}
              >
                Kolik piv to je? 🍺
              </div>
              <div
                style={{
                  fontSize: 48,
                  color: '#9ca3af',
                  textAlign: 'center',
                  display: 'flex',
                }}
              >
                kolikpiv.cz
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      )
    }

    // Calculate beers
    const priceNum = parseFloat(price)
    const beerPriceNum = parseFloat(beerPrice)
    const beers = Math.floor(priceNum / beerPriceNum)
    const beerWord = getBeerWord(beers)

    // Dynamic image with calculation
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Top: Price */}
            <div
              style={{
                fontSize: 56,
                color: '#9ca3af',
                marginBottom: 40,
                textAlign: 'center',
                display: 'flex',
              }}
            >
              Za {price} Kč?
            </div>

            {/* Middle: Result (large) */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#fbbf24',
                marginBottom: 60,
                textAlign: 'center',
                lineHeight: 1.2,
                display: 'flex',
              }}
            >
              {beers < 1 ? (
                'Ani na jedno pivo 😄'
              ) : beers >= 20 ? (
                `To je za ${Math.floor(beers / 20)} ${(() => {
                  const crates = Math.floor(beers / 20);
                  if (crates === 1) return "basa";
                  if (crates >= 2 && crates <= 4) return "basy";
                  return "bas";
                })()} 🍺📦`
              ) : (
                `To je za ${beers} ${beerWord} 🍺`
              )}
            </div>

            {/* Bottom: Website */}
            <div
              style={{
                fontSize: 40,
                color: '#9ca3af',
                textAlign: 'center',
                display: 'flex',
              }}
            >
              kolikpiv.cz
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
