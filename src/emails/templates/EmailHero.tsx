/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import { ExtendedReactLocalization } from "../../app/functions/l10n";

export type Props = {
  l10n: ExtendedReactLocalization;
  utm_campaign: string;
  heading: string;
  subheading: string;
  utmContentSuffix?: string;
};

export const EmailHero = (props: Props) => {
  const l10n = props.l10n;
  // Currently <EmailHero> is only used in the redesigned breach alert email,
  // which sets a utmContentSuffix:
  /* c8 ignore next */
  const utmContentSuffix = props.utmContentSuffix ?? "";

  return (
    <mj-wrapper padding="24px 16px">
      <mj-section
        padding="10px 12px"
        background-color="#e4d2ff"
        background-url={`${process.env.SERVER_URL}/images/email/hero-bg-gradient.png`}
        background-repeat="repeat"
        background-position-x={0}
        border-radius="16px 16px 0 0"
      >
        <mj-column
          width="60%"
          padding-left="0"
          padding-right="0"
          vertical-align="middle"
        >
          <mj-image
            alt={l10n.getString("public-nav-name")}
            src={`${process.env.SERVER_URL}/images/email/monitor-logo-transparent.png`}
            href={`${process.env.SERVER_URL}/user/dashboard/fixed?utm_source=monitor-product&utm_medium=email&utm_campaign=${props.utm_campaign}&utm_content=header-logo${utmContentSuffix}`}
            width="200px"
            align="left"
          />
        </mj-column>
        <mj-column
          width="40%"
          padding-left="0"
          padding-right="0"
          vertical-align="middle"
        >
          <mj-text align="right">
            <a
              href={`${process.env.SERVER_URL}/user/dashboard/fixed?utm_source=monitor-product&utm_medium=email&utm_campaign=${props.utm_campaign}&utm_content=sign-in${utmContentSuffix}`}
              style={{ color: "#0060DF" }}
            >
              {l10n.getString("email-header-button-sign-in")}
            </a>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section
        padding="20px 32px"
        background-color="#e4d2ff"
        background-url={`${process.env.SERVER_URL}/images/email/hero-bg-gradient.png`}
        background-repeat="repeat"
        background-position-x={0}
        border-radius="0 0 16px 16px"
      >
        <mj-column>
          <mj-text font-size="20px">
            <h2>{props.heading}</h2>
          </mj-text>
          <mj-text font-size="18px">
            <p>{props.subheading}</p>
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  );
};
