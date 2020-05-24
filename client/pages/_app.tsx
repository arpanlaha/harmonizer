import React, { ReactElement } from "react";
import { AppProps } from "next/app";
import { Head } from "../components";

import "antd/dist/antd.dark.css";
import "../public/styles/style.scss";

export default function Harmonizer({
  Component,
  pageProps,
}: AppProps): ReactElement {
  return (
    <>
      <Head />
      <Component {...pageProps}></Component>
    </>
  );
}
