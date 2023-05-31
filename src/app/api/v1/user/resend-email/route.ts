/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import AppConstants from "../../../../../appConstants";
import { getSubscriberByEmail } from "../../../../../db/tables/subscribers";
import { getUserEmails } from "../../../../../db/tables/emailAddresses";
import { sendVerificationEmail } from "../../../util/email";
import { getL10n } from "../../../../functions/server/l10n";
const l10n = getL10n();

interface ResendEmailRequest {
  emailId: string;
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req });

  if (token) {
    try {
      const body: ResendEmailRequest = await req.json();
      const emailId = body?.emailId;
      const subscriber = await getSubscriberByEmail(token.email);
      const existingEmail = await getUserEmails(subscriber.id);

      const filteredEmail = existingEmail.filter(
        (a) => a.email === emailId && a.subscriber_id === subscriber.id
      );

      if (!filteredEmail) {
        return NextResponse.json(
          {
            success: false,
            message: l10n.getString("user-verify-token-error"),
          },
          { status: 500 }
        );
      }

      await sendVerificationEmail(subscriber, emailId);

      return NextResponse.json({
        success: true,
        message: "Sent the verification email",
      });
    } catch (e) {
      console.error(e);
      if (e.message === "error-email-validation-pending") {
        return NextResponse.json(
          {
            success: false,
            message: "Verification email recently sent, try again later",
          },
          { status: 429 }
        );
      }
      return NextResponse.json({ success: false }, { status: 500 });
    }
  } else {
    // Not Signed in, redirect to home
    return NextResponse.redirect(AppConstants.SERVER_URL, 301);
  }
}