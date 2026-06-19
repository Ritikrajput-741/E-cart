import nodemailer from "nodemailer";

export const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Your OTP Code",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 30px;
      ">
        <div style="
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        ">
          
          <h2 style="color: #333;">
            Email Verification
          </h2>

          <p style="
            color: #555;
            font-size: 16px;
          ">
            Use the OTP below to verify your email address.
          </p>

          <div style="
            margin: 25px 0;
          ">
            <span style="
              display: inline-block;
              background: black;
              color: white;
              padding: 15px 30px;
              font-size: 28px;
              letter-spacing: 8px;
              border-radius: 8px;
              font-weight: bold;
            ">
              ${otp}
            </span>
          </div>

          <p style="
            color: #777;
            font-size: 14px;
          ">
            This OTP is valid for 10 minutes.
          </p>

        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
