
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Leaf, HandHeart, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-12 py-8">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
          About LankaHands
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
          Connecting you with the vibrant heart of Sri Lankan artistry, LankaHands is more than a marketplace; it&apos;s a celebration of culture, craftsmanship, and community.
        </p>
      </section>

      <section className="relative aspect-video max-h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
        <Image
          src="https://placehold.co/1200x600.png"
          alt="Diverse Sri Lankan crafts collage"
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint="crafts collage"
        />
      </section>

      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-headline font-semibold text-primary mb-4">Our Mission</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Our mission is to empower Sri Lankan artisans by providing a global platform to showcase their unique talents and handcrafted goods. We aim to bridge the gap between traditional craftsmanship and modern connoisseurs, fostering an appreciation for authentic, ethically made products.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            We believe in fair trade principles, ensuring that every purchase directly supports the artisans and their communities, helping to preserve invaluable cultural heritage for generations to come.
          </p>
        </div>
        <div className="relative aspect-square max-h-[400px] w-full rounded-lg overflow-hidden shadow-md">
            <Image
            src="https://placehold.co/600x600.png"
            alt="Artisan working on a craft"
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint="artisan working"
            />
        </div>
      </section>
      
      <section>
        <h2 className="text-3xl font-headline font-semibold text-primary mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <HandHeart size={48} className="mx-auto mb-3 text-accent" />
              <CardTitle className="font-headline text-xl">Authenticity & Heritage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We champion genuine Sri Lankan crafts, celebrating the rich history and traditional techniques behind each creation.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Leaf size={48} className="mx-auto mb-3 text-accent" />
              <CardTitle className="font-headline text-xl">Ethical & Sustainable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We are committed to fair trade practices and promoting sustainable materials and methods that respect both people and planet.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Globe size={48} className="mx-auto mb-3 text-accent" />
              <CardTitle className="font-headline text-xl">Community & Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We strive to build a supportive community that connects artisans with customers, fostering understanding and appreciation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center bg-secondary/30 p-8 md:p-12 rounded-lg">
        <h2 className="text-3xl font-headline font-semibold mb-4 text-primary">Join Our Journey</h2>
        <p className="text-lg text-foreground/80 mb-6 max-w-xl mx-auto">
          Whether you&apos;re an artisan looking to share your work, or a customer seeking unique, handcrafted treasures, we invite you to be part of the LankaHands story.
        </p>
        {/* <Button size="lg" className="bg-primary hover:bg-primary/90">Explore Our Collections</Button> */}
      </section>
    </div>
  );
}
