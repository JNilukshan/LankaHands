
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Min 1 for mock
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { toast } = useToast();
  const { login, currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!authLoading && currentUser) {
      if (currentUser.role === 'seller') {
        router.push('/dashboard/seller');
      } else {
        router.push('/profile');
      }
    }
  }, [currentUser, authLoading, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    const success = await login(data.email, data.password);
    setIsSubmitting(false);

    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      // Redirection is now handled by the useEffect hook
      // if (data.email.toLowerCase() === "nimali.perera@example.com") { 
      //    router.push('/dashboard/seller');
      // } else {
      //    router.push('/profile');
      // }

    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
       form.setError("email", { type: "manual", message: " " });
       form.setError("password", { type: "manual", message: "Invalid credentials" });
    }
  };
  
  // If user is already logged in and loading is finished, useEffect will handle redirect.
  // We can show a loading indicator while that check happens.
  if (authLoading || (!authLoading && currentUser)) {
    return <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <p className="ml-2">Loading...</p></div>;
  }


  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Login to LankaHands</CardTitle>
        <CardDescription>Access your account to view orders, saved items, and more.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardContent className="text-center text-sm text-muted-foreground">
        <p>
          Don&apos;t have an account?{' '}
          <Button variant="link" asChild className="text-primary p-0 h-auto">
            <Link href="/register">Register here</Link>
          </Button>
        </p>
        {/* <Button variant="link" asChild className="text-primary p-0 h-auto mt-2">
            <Link href="/forgot-password">Forgot password?</Link>
        </Button> */}
      </CardContent>
    </Card>
  );
};

export default LoginForm;
