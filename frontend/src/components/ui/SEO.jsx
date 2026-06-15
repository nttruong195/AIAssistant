import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'CareerAI'
const BASE_URL  = 'https://assitai.vercel.app'

export default function SEO({ title, description, path = '' }) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url       = `${BASE_URL}${path}`

  return (
    <Helmet>
      <meta name="google-site-verification" content="v8OSXyarxXwVomAJFm8g7Q5qzb34NhbQwrgoYf4LKK4" />
      <title>{fullTitle}</title>
      <meta name="description"        content={description} />
      <meta name="robots"             content="index, follow" />
      <link rel="canonical"           href={url} />

      {/* Open Graph (Facebook, Zalo) */}
      <meta property="og:type"        content="website" />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={url} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:locale"      content="vi_VN" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
