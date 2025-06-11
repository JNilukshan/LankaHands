import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="py-8 space-y-8">
      <section className="text-center">
        <FileText size={64} className="mx-auto mb-4 text-accent" />
        <h1 className="text-4xl font-headline font-bold text-primary mb-4">
          Terms of Service
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">1. Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent className="text-foreground/80 leading-relaxed space-y-3">
          <p>
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and LankaHands (“we,” “us” or “our”), concerning your access to and use of the [Your Website URL] website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
          </p>
          <p>
            You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">2. Intellectual Property Rights</CardTitle>
        </CardHeader>
        <CardContent className="text-foreground/80 leading-relaxed space-y-3">
          <p>
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of Sri Lanka, foreign jurisdictions, and international conventions.
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">3. User Representations</CardTitle>
        </CardHeader>
        <CardContent className="text-foreground/80 leading-relaxed space-y-3">
          <p>By using the Site, you represent and warrant that:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>All registration information you submit will be true, accurate, current, and complete.</li>
            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
            <li>You will not use the Site for any illegal or unauthorized purpose.</li>
            <li>Your use of the Site will not violate any applicable law or regulation.</li>
          </ul>
        </CardContent>
      </Card>
      
      {/* Add more sections as needed: Prohibited Activities, User Generated Contributions, Purchases and Payment, Site Management, Term and Termination, Modifications and Interruptions, Governing Law, Dispute Resolution, Disclaimer, Limitations of Liability, Indemnification, User Data, Miscellaneous, Contact Us */}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="text-foreground/80 leading-relaxed">
          <p>
            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
          </p>
          <p className="mt-2">
            LankaHands Legal Department<br />
            123 Craft Lane<br />
            Colombo 00700<br />
            Sri Lanka<br />
            Email: legal@lankahands.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
