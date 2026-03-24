# Email Configuration Setup

## Setting Up Gmail for Contact Form Emails

Your contact form is now set up to send emails. Follow these steps to enable email delivery:

### Step 1: Generate a Gmail App Password

Since Gmail doesn't allow third-party apps to use your main password, you need to create an "App Password":

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Sign in with **vexoritsolutions@gmail.com**
3. Look for "2-Step Verification" on the left sidebar
   - If not enabled, you'll need to enable it first (follow Google's prompts)
4. Once 2-Step Verification is enabled, scroll down and look for "App passwords"
5. Select:
   - **App:** Mail
   - **Device:** Windows Computer (or your device)
6. Click "Generate"
7. Google will show you a 16-character password
8. Copy this password

### Step 2: Add Password to Environment File

1. Open `.env.local` in the project root
2. Replace `your-gmail-app-password-here` with the 16-character password you copied:
   ```
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```
3. Save the file

### Step 3: Restart the Development Server

1. Stop the current dev server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. The server will restart with the new environment variables

### Step 4: Test the Contact Form

1. Go to http://localhost:4321/contact
2. Fill out the form with your details
3. Click "Send Message"
4. You should see:
   - A "Thank You" popup appear
   - An email received at vexoritsolutions@gmail.com (admin notification)
   - A confirmation email sent to the user's email address

## What Happens on Form Submission

**When user submits the contact form:**

1. **Admin Email** → Sent to vexoritsolutions@gmail.com with all user details
   - Contains: Name, Email, Phone, Subject, Message, Submission Time

2. **Confirmation Email** → Sent to the user's email address
   - Professional thank you message
   - Submission details summary
   - Assurance that team will respond soon

3. **Thank You Popup** → Displayed on the page
   - "Thank You for Contacting Us!" message
   - Animated checkmark icon
   - "Got It!" button to close

## Email Templates

The emails use professional HTML templates with:
- Branded colors (cyan #00BFFF)
- Clear formatting with sections
- User-friendly design
- Mobile-responsive layout

## Troubleshooting

**Emails not sending?**
- Check that the app password is correctly copied (no spaces at start/end)
- Verify `.env.local` file has `GMAIL_APP_PASSWORD=16-char-password`
- Make sure 2-Step Verification is enabled on the Gmail account
- Check browser console (F12) for error messages

**Getting "Failed to send email" error?**
- Verify the Gmail app password is correct
- Make sure development server was restarted after adding password
- Check that vexoritsolutions@gmail.com account has 2-Step Verification enabled

**Test Email Not Arriving?**
- Check spam/promotions folder in Gmail
- Make sure the recipient email address is correct
- Gmail sometimes delays emails by a few minutes

---

Need help? Check the error message in the browser console for specific details.
