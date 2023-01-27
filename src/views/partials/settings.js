import AppConstants from '../../app-constants.js'
import { getMessage } from '../../utils/fluent.js'

const emailNeedsVerificationSub = email => `
  <span class='verification-required'>
    ${getMessage('email-verification-required')}
  </span>

  <a class='settings-resend-email' data-email-id='${email.id}' href='#'>
    ${getMessage('resend-verification')}
  </a>
`

const deleteButton = email => `
  <button
    data-subscriber-id='${email.subscriber_id}'
    data-email-id='${email.id}'
    class='settings-email-remove-button js-remove-email'
  >
    <img src='/images/icon-delete.png'>
  </button>
`

const createEmailItem = (email, breachCounts) => `
  <li class='settings-email-item'>
    <strong>
      ${email.primary
          ? `${getMessage('email-address-primary', { email: email.email })}`
          : email.email}
    </strong>
    ${email.verified
        ? getMessage('appears-in-x-breaches', {
            breachCount: breachCounts.get(email.email)
          })
        : emailNeedsVerificationSub(email)}

    ${email.primary ? '' : deleteButton(email)}
  </li>
`

// Sort first by presence of `primary` key, then by email address.
const getSortedEmails = emails => [...emails].sort((a, b) => (
  a.primary
    ? -1
    : b.primary
      ? 1
      : 0 || a.email.localeCompare(b.email)
))

const createEmailList = (emails, breachCounts) => `
  <ul class='settings-email-list'>
    ${getSortedEmails(emails)
      .map(email => createEmailItem(email, breachCounts))
      .join('')}
  </ul>
`

const optionInput = (csrfToken, { commOption, name, isChecked }) => `
  <input
    checked='${isChecked}'
    class='radio-comm-option'
    data-comm-option='${commOption}'
    data-csrf-token='${csrfToken}'
    data-form-action='update-comm-option'
    name='${name}'
    type='radio'
  >
`

const alertOptions = (csrfToken, emails) => `
  <div class='settings-alert-options'>
    <label class='settings-radio-input'>
    ${optionInput(csrfToken, {
      commOption: 0,
      name: '1',
      isChecked: true
    })}
    <span class='settings-radio-label'>
      ${getMessage('to-affected-email')}
    </span>
  </label>

  <label class='settings-radio-input'>
    ${optionInput(csrfToken, {
      commOption: 1,
      name: '1',
      isChecked: false
    })}
    <span class='settings-radio-label'>
      ${getMessage('comm-opt-1', {
        primaryEmail: emails.find(a => a.primary === true)?.email
      })}
    </span>
  </label>
  </div>
`

const addEmailModal = limit => `
  <dialog id='add-email-modal' class='add-email-modal'>
    <button id='settings-close'>
      <img src='/images/close.png'>
    </button>
    <img src='/images/email.png'>

    <h3 class='settings-section-title'>${getMessage('add-another-email')}</h3>
    <div id='add-email-modal-content'>
      ${getMessage('email-address-limit', { limit })}
      ${getMessage('add-another-email')}
    </div>

    <div id='add-email-modal-controls'>
      <label>
        ${getMessage('email-address')}
        <input id='email' type='text'>
      </label>
      <button id='send-verification' class='primary'>
        ${getMessage('send-verification')}
      </button>
    </div>
  </dialog>
`

export const settings = data => {
  const { breachCounts, csrfToken, emails, limit } = data

  return `
    <div id='settings' class='settings' data-csrf-token='${csrfToken}'>
      <h2 class='settings-title'>${getMessage('settings-title')}</h2>

      <div class='settings-content'>
        <!-- Breach alert preferences -->
        <section>
          <h3 class='settings-section-title'>
            ${getMessage('settings-preferences-title')}
          </h3>
          ${alertOptions(csrfToken, emails)}
        </section>

        <hr>

        <!-- Monitored email addresses -->
        <section>
          <h3 class='settings-section-title'>
            ${getMessage('monitored-email-addresses')}
          </h3>
          <p>${getMessage('email-address-limit', { limit })}</p>

          ${createEmailList(emails, breachCounts)}
          <button
            id='settings-add-email'
            class='settings-add-email-button primary'
          >
            ${getMessage('add-new-email')}
          </button>

          ${addEmailModal(limit)}
        </section>

        <hr>

        <!-- Deactivate account -->
        <section>
          <h3 class='settings-section-title'>
            ${getMessage('deactivate-account-title')}
          </h3>
          <p>${getMessage('deactivate-account')}</p>
          <a
            class='settings-link-fxa'
            href='${AppConstants.FXA_SETTINGS_URL}'
            target='_blank'
          >
            ${getMessage('firefox-settings')}
          </a>
        </section>
      </div>
    </div>
  `
}
