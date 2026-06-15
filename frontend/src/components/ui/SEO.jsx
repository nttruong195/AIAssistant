import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'CareerAI'
const BASE_URL  = 'https://careerai.vn' // thay bằng domain thật sau khi deploy

export default function SEO({ title, description, path = '' }) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url       = `${BASE_URL}${path}`

  return (
    <Helmet>
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
