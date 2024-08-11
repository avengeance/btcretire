import React from "react";

const Privacy: React.FC = () => {
  return (
    <div className="mx-24 mb-10">
      <p>Effective Date: July 27th, 2024</p>
      <p>
        Welcome to retireinbitcoin.com ("we", "our", "us"). We are committed to
        protecting your privacy and ensuring that your personal information is
        handled in a safe and responsible manner. This Privacy Policy outlines
        how we collect, use, and protect your information when you visit our
        website.
      </p>
      <p className="font-bold mt-5">Information We Collect:</p>
      <ul className="list-disc list-inside my-5">
        <li>
          <span className="font-bold">Personal Information:</span> We may
          collect personal information such as your name, email address, and any
          other information you voluntarily provide to us.
        </li>
        <li>
          <span className="font-bold">Usage Data:</span> We collect information
          on how you interact with our website, including but not limited to
          your IP address, browser type, pages visited, and the time and date of
          your visit.
        </li>
        <li>
          <span className="font-bold">Cookies and Tracking Technologies:</span>{" "}
          We use cookies and similar tracking technologies to track the activity
          on our website and hold certain information.
        </li>
      </ul>
      <p className="font-bold mt-5">How We Use Your Information:</p>
      <ul className="list-disc list-inside my-5">
        <li>
          <span className="font-bold">
            To Provide and Maintain Our Service:
          </span>{" "}
          To ensure our website functions correctly and is accessible to you.
        </li>
        <li>
          <span className="font-bold">To Improve Our Website:</span> To analyze
          how users interact with our website and improve its performance and
          content.
        </li>
        <li>
          <span className="font-bold">To Communicate with You:</span> To respond
          to your inquiries, provide support, and share updates or information
          you may find useful.
        </li>
        <li>
          <span className="font-bold">For Marketing and Advertising:</span> To
          display personalized advertisements through Google AdSense and to
          inform you about promotions and offers.
        </li>
      </ul>
      <p className="font-bold mt-5">Google AdSense:</p>
      <p className="my-5">
        We use Google AdSense to serve ads on our website. Google AdSense may
        use cookies and other tracking technologies to collect information about
        your interactions with these ads and your visits to our website. This
        information is used to provide personalized advertisements tailored to
        your interests. For more information on how Google AdSense collects and
        uses data, please visit the{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google AdSense Privacy Policy
        </a>
        .
      </p>
      <p className="font-bold mt-5">Bitcoin Donations:</p>
      <p className="my-5">
        We accept Bitcoin donations to support our website. When you make a
        Bitcoin donation, we may collect your Bitcoin address and the
        transaction details. This information is used solely for the purpose of
        processing and acknowledging your donation.
      </p>
      <p className="font-bold mt-5">Sharing Your Information:</p>
      <p className="my-5">
        We do not sell, trade, or otherwise transfer your personal information
        to outside parties without your consent, except as described in this
        Privacy Policy. We may share your information with:
      </p>
      <ul className="list-disc list-inside my-5">
        <li>
          <span className="font-bold">Service Providers:</span> We may share
          your information with third-party service providers who assist us in
          operating our website, conducting our business, or serving our users.
        </li>
        <li>
          <span className="font-bold">Legal Requirements:</span> We may disclose
          your information if required by law or in response to valid requests
          by public authorities.
        </li>
      </ul>
      <p className="font-bold mt-5">Data Security:</p>
      <p className="my-5">
        We implement a variety of security measures to maintain the safety of
        your personal information. However, no method of transmission over the
        Internet or electronic storage is 100% secure, and we cannot guarantee
        absolute security.
      </p>
      <p className="font-bold mt-5">Your Rights:</p>
      <ul className="list-disc list-inside my-5">
        <li>
          <span className="font-bold">Access Your Information:</span> Request a
          copy of the personal information we hold about you.
        </li>
        <li>
          <span className="font-bold">Correct Your Information:</span> Request
          correction of any inaccurate or incomplete information.
        </li>
        <li>
          <span className="font-bold">Delete Your Information:</span> Request
          deletion of your personal information, subject to certain exceptions.
        </li>
      </ul>
      <p className="font-bold mt-5">Third-Party Links:</p>
      <p className="my-5">
        Our website may contain links to third-party websites. We are not
        responsible for the privacy practices or the content of these websites.
        We encourage you to review the privacy policies of any third-party
        websites you visit.
      </p>
      <p className="font-bold mt-5">Changes to This Privacy Policy:</p>
      <p className="my-5">
        We may update our Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page and
        updating the effective date.
      </p>
      <p className="font-bold mt-5">Contact Us:</p>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at: btcretire@protonmail.com
      </p>
      <p>By using our website, you consent to our Privacy Policy.</p>
    </div>
  );
};

export default Privacy;
