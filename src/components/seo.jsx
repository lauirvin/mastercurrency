import React from "react";
import PropTypes from "prop-types";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useStaticQuery, graphql } from "gatsby";
import favicon from "../media/avatar.png";

const SEO = ({ meta, lang, title }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            url
            social {
              twitter
            }
            imageShare
          }
        }
      }
    `
  );

  const metaDescription = site.siteMetadata.description;
  const metaImage = `${site.siteMetadata.siteUrl}/${site.siteMetadata.imageShare}`;

  return (
    <HelmetProvider context={{}}>
      <Helmet
        htmlAttributes={{
          lang
        }}
        title={`${title}`}
        link={[
          { rel: "shortcut icon", type: "image/x-icon", href: `${favicon}` }
        ]}
        meta={[
          {
            name: `description`,
            content: metaDescription
          },
          {
            property: "og:url",
            content: site.siteMetadata.siteUrl
          },
          {
            property: `og:title`,
            content: title
          },
          {
            property: `og:description`,
            content: metaDescription
          },
          {
            property: `og:type`,
            content: `website`
          },
          {
            name: `twitter:card`,
            content: `summary`
          },
          {
            name: `twitter:creator`,
            content: `@${site.siteMetadata.social.twitter}`
          },
          {
            name: `twitter:title`,
            content: title
          },
          {
            name: `twitter:description`,
            content: metaDescription
          }
        ]
          .concat([
            {
              property: "og:image",
              content: metaImage
            },
            {
              name: "twitter:image",
              content: metaImage
            }
          ])
          .concat(meta)}
      />
    </HelmetProvider>
  );
};

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
  title: ``
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string
};

export default SEO;
