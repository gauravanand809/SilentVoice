import * as React from 'react';

interface VerificationEmail {
  username: string,
  otp: string,
}

export const EmailTemplate: React.FC<Readonly<VerificationEmail>> = ({
    username,otp
}) => (
  <div>
    <h1>Welcome, {username}!</h1>
    <p> welcoming you in our family of anonymous feedbacks</p>
  </div>
);
