import { useEffect } from 'react'

/**
 * Google AdSense Banner
 * Thay YOUR_AD_SLOT bằng slot ID từ AdSense dashboard
 */
export default function AdBanner({ slot = 'YOUR_AD_SLOT', format = 'auto' }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  return (
    <div className="my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
