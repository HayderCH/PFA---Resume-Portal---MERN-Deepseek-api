
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { CompanySignupData } from '@/types/auth';

const companySignupSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  industry: z.string().min(1, {
    message: "Please select an industry.",
  }),
  size: z.string().min(1, {
    message: "Please select a company size.",
  }),
  agreedToTerms: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type FormData = z.infer<typeof companySignupSchema>;

const CompanySignup = () => {
  const navigate = useNavigate();
  const { signupCompany, loading } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(companySignupSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      password: '',
      industry: '',
      size: '',
      agreedToTerms: true
    }
  });
  
  // Handle industry selection
  const handleIndustryChange = (value: string) => {
    setSelectedIndustry(value);
    setValue('industry', value);
  };
  
  // Handle size selection
  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    setValue('size', value);
  };
  
  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      if (signupCompany) {
        await signupCompany({
          companyName: data.companyName,
          contactName: data.contactName,
          email: data.email,
          password: data.password,
          industry: data.industry,
          size: data.size,
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
    <div className="container relative flex h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <Card className="w-[360px] ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create Company Account</CardTitle>
          <CardDescription>
            Enter your company details below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  type="text"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">{errors.companyName.message}</p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  placeholder="Enter contact name"
                  type="text"
                  {...register("contactName")}
                />
                {errors.contactName && (
                  <p className="text-sm text-red-500">{errors.contactName.message}</p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter email"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={handleIndustryChange} value={selectedIndustry}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-red-500">{errors.industry.message}</p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="size">Company Size</Label>
                <Select onValueChange={handleSizeChange} value={selectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small">Small (1-50 employees)</SelectItem>
                    <SelectItem value="Medium">Medium (51-200 employees)</SelectItem>
                    <SelectItem value="Large">Large (201+ employees)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.size && (
                  <p className="text-sm text-red-500">{errors.size.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" {...register("agreedToTerms")} />
                <Label htmlFor="terms">
                  I agree to the <a href="#" className="text-blue-500">terms and conditions</a>
                </Label>
                {errors.agreedToTerms && (
                  <p className="text-sm text-red-500">{errors.agreedToTerms.message}</p>
                )}
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button disabled={isSubmitting || loading} className="w-full mt-4" type="submit">
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySignup;
