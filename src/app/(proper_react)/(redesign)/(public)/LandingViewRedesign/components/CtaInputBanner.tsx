/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { LandingPageProps } from "..";
import { FreeScanCta } from "../../FreeScanCta";
import { ScanLimit } from "../../ScanLimit";
import styles from "./CtaInputBanner.module.scss";

export const CtaInputBanner = (props: LandingPageProps) => {
  return (
    <section>
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerHeader}>
            <h2>
              <b>
                {props.l10n.getFragment(
                  "landing-redesign-cta-input-banner-header",
                  {
                    elems: { b: <strong /> },
                  },
                )}
              </b>
            </h2>
            <p>
              {props.l10n.getString(
                "landing-redesign-cta-input-banner-subheader",
              )}
            </p>
          </div>
          {props.eligibleForPremium && props.scanLimitReached ? (
            <ScanLimit />
          ) : (
            <FreeScanCta
              scanLimitReached={props.scanLimitReached}
              eligibleForPremium={props.eligibleForPremium}
              signUpCallbackUrl={`${process.env.SERVER_URL}/user/dashboard`}
              eventId={{
                cta: "clicked_get_scan_header",
                field: "entered_email_address_header",
              }}
              experimentData={props.experimentData}
              label={props.l10n.getString(
                "landing-redesign-hero-cta-input-label",
              )}
              buttonLabel={props.l10n.getString(
                "landing-redesign-hero-cta-button-label",
              )}
              hasFloatingLabel
            />
          )}
        </div>
      </div>
    </section>
  );
};
