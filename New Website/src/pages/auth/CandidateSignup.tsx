import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CandidateSignupData } from '@/types/auth';

const candidateSignupSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  agreedToTerms: z.boolean().refine(value => value === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

type FormData = z.infer<typeof candidateSignupSchema>;

const CandidateSignup = () => {
  const navigate = useNavigate();
  const { signupCandidate, loading } = useContext(AuthContext);
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(candidateSignupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      agreedToTerms: true
    }
  });
  
  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      if (signupCandidate) {
        // Ensure all required fields are present
        await signupCandidate({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          agreedToTerms: data.agreedToTerms
        });
        navigate('/email-verification', { state: { email: data.email } });
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to sign up. Please try again.');
    }
  };
  
  return (
    <div className="container relative flex h-screen w-screen max-w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Enter your details below to create your candidate account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              type="text"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" {...register("agreedToTerms")} />
            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              I agree to the <Link to="#" className="underline underline-offset-2 text-blue-500">terms and conditions</Link>
            </Label>
          </div>
          {errors.agreedToTerms && (
            <p className="text-red-500 text-sm">{errors.agreedToTerms.message}</p>
          )}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
            Already have an account?
          </Link>
          <Button disabled={isSubmitting || loading} onClick={handleSubmit(onSubmit)}>
            {isSubmitting || loading ? "Signing up..." : "Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CandidateSignup;
