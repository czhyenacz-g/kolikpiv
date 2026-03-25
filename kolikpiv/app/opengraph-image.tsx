import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Kolik piv to je? - Přepočet ceny na piva'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
        <div
          style={{
            fontSize: 96,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 40,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          Kolik piv to je?
        </div>
        <div
          style={{
            fontSize: 48,
            color: '#fbbf24',
            marginBottom: 60,
            textAlign: 'center',
          }}
        >
          Přepočet ceny na piva 🍺
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#9ca3af',
            textAlign: 'center',
          }}
        >
          kolikpiv.cz
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
