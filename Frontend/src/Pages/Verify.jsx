const Verify = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center bg-black text-white p-10">
          <h1 className="text-5xl font-bold leading-tight">
            Welcome to <span className="text-yellow-400">E-Shop</span>
          </h1>

          <p className="mt-5 text-gray-300 text-lg">
            Verify your email to activate your account and
            start shopping amazing products with exclusive
            deals and offers.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Secure Account Verification</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Fast & Safe Shopping</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Exclusive Member Benefits</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md text-center">

            {/* ICON */}
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center text-4xl">
                📩
              </div>
            </div>

            {/* HEADING */}
            <h1 className="text-3xl font-bold text-gray-900">
              Check Your Mail
            </h1>

            {/* TEXT */}
            <p className="mt-5 text-gray-600 leading-7">
              We’ve sent a verification link to your email
              address. Please check your inbox and verify
              your account to continue.
            </p>

            {/* EXTRA TEXT */}
            <p className="mt-4 text-sm text-gray-500">
              If you don’t see the email, check your spam
              or junk folder.
            </p>

            {/* BUTTON */}
            <a
              href="https://mail.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
            >
              Open Gmail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;