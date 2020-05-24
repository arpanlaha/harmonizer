import React, { Component, Props, ReactElement } from "react";
import NextHead from "next/head";

interface HeadProps extends Props<Component> {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function Head(props: HeadProps): ReactElement {
  const { description, keywords, title } = props;
  return (
    <NextHead>
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
      <link rel="shortcut icon" href="/logo.svg" />
      <link rel="manifest" href="/manifest.json" />
      <title>{title ?? "Harmonizer"}</title>
    </NextHead>
  );
}
