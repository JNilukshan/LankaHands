"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Mail, Phone, MapPin } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().email({ message: "Valid email is required." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(20, { message: "Message must be at least 20 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true);
    console.log("Contact form data:", data);
    // Simulate API call or email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you shortly.",
    });
    setIsLoading(false);
    form.reset();
  };

  return (
    <div className="py-8 space-y-12">
      <section className="text-center">
        <Mail size={64} className="mx-auto mb-4 text-accent" />
        <h1 className="text-4xl font-headline font-bold text-primary mb-4">
          Get In Touch
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          We&apos;d love to hear from you! Whether you have a question, feedback, or a collaboration idea, please don&apos;t hesitate to reach out.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Card className="w-full shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Send Us a Message</CardTitle>
            <CardDescription>Fill out the form below and we&apos;ll respond as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Regarding..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Your message..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Message
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
                <div className="flex items-start">
                    <MapPin size={24} className="mr-4 mt-1 text-accent shrink-0" />
                    <div>
                        <h3 className="font-semibold">Our Office</h3>
                        <p>123 Craft Lane, Colombo 00700, Sri Lanka</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <Mail size={24} className="mr-4 mt-1 text-accent shrink-0" />
                    <div>
                        <h3 className="font-semibold">Email Us</h3>
                        <a href="mailto:hello@lankahands.com" className="hover:text-primary">hello@lankahands.com</a>
                    </div>
                </div>
                <div className="flex items-start">
                    <Phone size={24} className="mr-4 mt-1 text-accent shrink-0" />
                    <div>
                        <h3 className="font-semibold">Call Us</h3>
                        <p>+94 11 234 5678 (Mon-Fri, 9am-5pm)</p>
                    </div>
                </div>
            </CardContent>
          </Card>
           <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-3">
                    Have a quick question? You might find an answer in our FAQ section.
                </p>
                <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
                    Visit FAQ Page
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
