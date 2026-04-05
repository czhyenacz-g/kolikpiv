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
    const label = searchParams.get('label') || ''

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
            {/* Top: item name or price */}
            <div
              style={{
                fontSize: 52,
                color: '#9ca3af',
                marginBottom: 24,
                textAlign: 'center',
                display: 'flex',
              }}
            >
              {label ? label : `Za ${price} Kč`}
            </div>

            {/* Middle: big number */}
            {beers >= 1 && (
              <div
                style={{
                  fontSize: 180,
                  fontWeight: 'bold',
                  color: '#fbbf24',
                  lineHeight: 1,
                  display: 'flex',
                }}
              >
                {beers}
              </div>
            )}

            {/* Beer word */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: 40,
                textAlign: 'center',
                display: 'flex',
              }}
            >
              {beers < 1 ? 'Ani na jedno pivo 😄' : `${beerWord} 🍺`}
            </div>

            {/* Bottom: Website */}
            <div
              style={{
                fontSize: 36,
                color: '#6b7280',
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
