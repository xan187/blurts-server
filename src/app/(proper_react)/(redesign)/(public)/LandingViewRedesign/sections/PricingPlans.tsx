/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { useId } from "react";
import { PricingPlanList } from "./PricingPlanList";
import type { LandingPageProps } from "..";
import styles from "./PricingPlans.module.scss";
import {
  getPremiumSubscriptionUrl,
  getSubscriptionBillingAmount,
} from "../../../../../functions/server/getPremiumSubscriptionInfo";

export const PricingPlans = (props: LandingPageProps) => {
  const headingId = useId();

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 id={headingId}>
            {props.l10n.getString(
              "landing-redesign-pricing-plans-section-title",
            )}
          </h2>
          <p>
            {props.l10n.getString(
              "landing-redesign-pricing-plans-section-description",
            )}
          </p>
        </div>
        <PricingPlanList
          aria-labelledby={headingId}
          premiumSubscriptionUrl={{
            monthly: getPremiumSubscriptionUrl({ type: "monthly" }),
            yearly: getPremiumSubscriptionUrl({ type: "yearly" }),
          }}
          subscriptionBillingAmount={getSubscriptionBillingAmount()}
          scanLimitReached={props.scanLimitReached}
        />
      </div>
    </section>
  );
};
