interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <title>Verification Code</title>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');
            body {
              font-family: 'Roboto', Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f7f9fc;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: auto;
              padding: 20px;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
              color: #4a4a4a;
            }
            p {
              line-height: 1.6;
            }
            .otp-code {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
            }
            .footer {
              margin-top: 20px;
              font-size: 0.9em;
              color: #777;
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <div
            style={{
              display: "none",
              visibility: "hidden",
              fontSize: "1px",
              lineHeight: "1px",
            }}
          >
            Here's your verification code: {otp}
          </div>
          <h2>Hello {username},</h2>
          <p>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </p>
          <p className="otp-code">{otp}</p>
          <p>If you did not request this code, please ignore this email.</p>
          {/* Uncomment if needed
          <a
            href={`http://localhost:3000/verify/${username}`}
            style={{ color: '#61dafb', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Verify here
          </a>
          */}
          <div className="footer">
            <p>Thank you!</p>
          </div>
        </div>
      </body>
    </html>
  );
}
