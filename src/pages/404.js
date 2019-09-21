import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>ERROR 404</h1>
    <p>You just hit a route that doesn't exist... the sadness.</p>
    <Link to="/">Return home</Link>
  </Layout>
)

export default NotFoundPage
