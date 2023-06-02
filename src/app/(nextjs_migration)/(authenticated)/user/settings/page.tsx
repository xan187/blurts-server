/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getL10n } from "../../../../functions/server/l10n";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import "../../../../../client/css/partials/settings.css";

// TODO: Set EmailObject to match what comes from db/tables/emailAddresses.js
type EmailObject = {
  email: string;
  verified: boolean;
  breachCount: number;
  primary: boolean;
};

const emailNeedsVerificationSub = (email) => `
  <span class='verification-required'>
    ${getMessage("settings-email-verification-callout")}
  </span>

  <a class='js-settings-resend-email' data-email-id='${email.id}' href='#'>
    ${getMessage("settings-resend-email-verification-link")}
  </a>
`;

const deleteButton = (email) => `
  <button
    data-subscriber-id='${email.subscriber_id}'
    data-email-id='${email.id}'
    class='settings-email-remove-button js-remove-email-button'
  >
    <img src='/images/icon-delete.svg'>
  </button>
`;

const createEmailItem = (EmailObject) => {
  const l10n = getL10n();

  return (
    <li className="settings-email-item">
      <strong>
        {EmailObject.primary
          ? l10n.getString("settings-email-label-primary", {
              email: EmailObject.email,
            })
          : EmailObject.email}
      </strong>
      {EmailObject.verified
        ? l10n.getString("settings-email-number-of-breaches-info", {
            breachCount: EmailObject.breachCount,
          })
        : emailNeedsVerificationSub(EmailObject)}
      {/* {email.primary ? "" : deleteButton(email)} */}
    </li>
  );
};

const createEmailList = (emails: any, breachCounts: any) => {
  // TODO: Iterate through email accounts via createEmailItem()
  // TODO: Sort emails with primary email first via getSortedEmails()

  return <ul className="settings-email-list">TEST</ul>;
};

/**
 * @param {string} csrfToken
 * @param {{ isChecked: boolean; option: unknown; }} options
 * @returns string
 */
const optionInput = (csrfToken, { isChecked, option }) => {
  return (
    <input
      className="js-settings-alert-options-input"
      data-alert-option=""
      data-csrf-token=""
      name="settings-alert-options"
      type="radio"
    ></input>
  );
};

/**
 * @param {{ csrfToken: string; allEmailsToPrimary: boolean }} options
 * @returns string
 */
const alertOptions = ({ csrfToken, allEmailsToPrimary }) => {
  const l10n = getL10n();

  return (
    <div className="settings-alert-options">
      <label className="settings-radio-input">
        {optionInput(csrfToken, {
          isChecked: true,
          option: 0,
        })}
        {/* {optionInput(csrfToken, {
          isChecked: !allEmailsToPrimary,
          option: 0,
        })} */}
        <span className="settings-radio-label">
          {l10n.getString("settings-alert-preferences-option-one")}
        </span>
      </label>

      <label className="settings-radio-input">
        {optionInput(csrfToken, {
          isChecked: false,
          option: 1,
        })}
        {/* {optionInput(csrfToken, {
          isChecked: allEmailsToPrimary,
          option: 1,
        })} */}
        <span className="settings-radio-label">
          {l10n.getString("settings-alert-preferences-option-two")}
        </span>
      </label>
    </div>
  );
};

// const { allEmailsToPrimary, breachCounts, csrfToken, emails, limit } = data

function MonitoredEmails() {
  const l10n = getL10n();

  return (
    <ul class="settings-email-list">
      $
      {getSortedEmails(emails)
        .map((email) => createEmailItem(email, breachCounts))
        .join("")}
    </ul>
  );
}

const mockedEmailsArrayObject = [
  {
    email: "mcrawford@mozilla.com",
    verified: true,
    breachCount: 0,
    primary: true,
  },
  {
    email: "maxx.crawford@gmail.com",
    verified: true,
    breachCount: "25",
    primary: false,
  },
];

const breachCounts = new Map();

for (const email of mockedEmailsArrayObject) {
  breachCounts.set(email.email, email.breachCount);
}

console.log(breachCounts);

export default async function Settings(props: {
  mockedEmailsArray: object;
  breachCounts: Map<string, string>;
}) {
  const l10n = getL10n();
  const session = await getServerSession(authOptions);

  const limit = process.env.MAX_NUM_ADDRESSES;
  const fxaUrl = process.env.FXA_SETTINGS_URL;

  console.log(props);

  return (
    <main data-partial="settings">
      <div className="settings js-settings" data-csrf-token="${csrfToken}">
        <h2 className="settings-title">
          {l10n.getString("settings-page-title")}
        </h2>

        <div className="settings-content">
          {/* <!-- Monitored email addresses --> */}
          <section>
            <h3 className="settings-section-title">
              {l10n.getString("settings-email-list-title")}
            </h3>
            <p>{l10n.getString("settings-email-limit-info", { limit })}</p>

            {createEmailList(props.mockedEmailsArray, props.breachCounts)}
            <button
              className="primary settings-add-email-button"
              data-dialog="addEmail"
              // ${emails.length >= limit ? 'disabled' : ''}
            >
              {l10n.getString("settings-add-email-button")}
            </button>
          </section>

          <hr />

          {/* <!-- Breach alert preferences --> */}
          <section>
            <h3 className="settings-section-title">
              {l10n.getString("settings-alert-preferences-title")}
            </h3>
            {/* {alertOptions({ "", allEmailsToPrimary })} */}
          </section>

          <hr />

          {/* <!-- Deactivate account --> */}
          <section>
            <h3 className="settings-section-title">
              {l10n.getString("settings-deactivate-account-title")}
            </h3>
            <p>{l10n.getString("settings-deactivate-account-info")}</p>
            <a className="settings-link-fxa" href={fxaUrl} target="_blank">
              {l10n.getString("settings-fxa-link-label")}
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}