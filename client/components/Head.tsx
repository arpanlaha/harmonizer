import React, { Component, Props, ReactElement } from "react";
import { Helmet } from "react-helmet";

interface HeadProps extends Props<Component> {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function Head(props: HeadProps): ReactElement {
  const { description, keywords, title } = props;
  return (
    <Helmet htmlAttributes={{ lang: "en" }} defer={false}>
      <meta charSet="UTF-8" />
      <meta
        name="description"
        content={description ?? "Harmonize your melodies"}
      />
      <meta
        name="keywords"
        content={
          keywords ??
          "Arpan, Laha, Arpan Laha, Hack4Impact, UIUC, Illinois, Harmonizer"
        }
      />
      <meta name="author" content="Arpan Laha" />
      <title>{title ?? "Harmonizer"}</title>
    </Helmet>
  );
}
