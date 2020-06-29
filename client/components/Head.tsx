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
      <meta name="theme-color" content="#0d0f12" />
      <link rel="shortcut icon" href="/logo.svg" />
      <link rel="manifest" href="/manifest.json" />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300&display=swap"
        rel="stylesheet"
      ></link>
      <title>{title ?? "Harmonizer"}</title>
    </NextHead>
  );
}
