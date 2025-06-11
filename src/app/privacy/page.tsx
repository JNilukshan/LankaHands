import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-8 space-y-8">
      <section className="text-center">
        <ShieldCheck size={64} className="mx-auto mb-4 text-accent" />
        <h1 className="text-4xl font-headline font-bold text-primary mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">1. Introduction</CardTitle>
        </CardHeader>
        <CardContent className="text-foreground/80 leading-relaxed space-y-3">
          <p>
            Welcome to LankaHands. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at privacy@lankahands.com.
          </p>
          <p>
            This privacy notice describes how we might use your information if you visit our website at [Your Website URL], or otherwise engage with us.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">2. What Information Do We Collect?</CardTitle>
        </CardHeader>
        <CardContent className="text-foreground/80 leading-relaxed space-y-3">
          <h3 className="font-semibold">Personal information you disclose to us:</h3>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the LankaHands, express an interest in obtaining information about us or our products and Services, when you participate in activities on LankaHands or otherwise when you contact us.
          </p>
          <p>
            The personal information that we collect depends on the context of your interactions with us and LankaHands, the choices you make and the products and features you use. The personal information we collect may include the following: names; phone numbers; email addresses; mailing addresses; usernames; passwords; contact preferences; billing addresses; debit/credit card numbers.
          </p>
          <h3 className="font-semibold mt-4">Information automatically collected:</h3>
           <p>
            We automatically collect certain information when you visit, use or navigate LankaHands. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our LankaHands and other technical information.
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">3. How Do We Use Your Information?</CardTitle>
        </CardHeader>
        <CardContent className="text-foreground/80 leading-relaxed space-y-3">
          <p>
            We use personal information collected via our LankaHands for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>To facilitate account creation and logon process.</li>
            <li>To post testimonials.</li>
            <li>Request feedback.</li>
            <li>To enable user-to-user communications.</li>
            <li>To manage user accounts.</li>
            <li>To send administrative information to you.</li>
            <li>To protect our Services.</li>
            <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Add more sections as needed: Sharing Information, Cookies, Data Retention, Your Rights, Policy Updates, Contact Us */}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="text-foreground/80 leading-relaxed">
          <p>
            If you have questions or comments about this notice, you may email us at privacy@lankahands.com or by post to:
          </p>
          <p className="mt-2">
            LankaHands Privacy Department<br />
            123 Craft Lane<br />
            Colombo 00700<br />
            Sri Lanka
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
