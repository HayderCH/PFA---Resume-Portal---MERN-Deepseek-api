
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();

  const handleResendEmail = async () => {
    try {
      // Get current session to get the email
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;
      
      if (!email) {
        toast.error("We couldn't determine your email address. Please try logging in again.");
        return;
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        throw error;
      }

      toast.success('Verification email resent. Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification email.');
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-12">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-talent-primary" />
            </div>
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>We've sent a verification email to your inbox</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start text-left space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p className="text-sm text-gray-600">Check your email inbox for a verification link</p>
            </div>
            <div className="flex items-start text-left space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p className="text-sm text-gray-600">Click the link to verify your email address</p>
            </div>
            <div className="flex items-start text-left space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p className="text-sm text-gray-600">After verification, you'll be able to log in to your account</p>
            </div>
            <div className="py-3">
              <p className="text-sm text-gray-600 mt-4">
                Didn't receive an email? Check your spam folder or{' '}
                <button 
                  onClick={handleResendEmail}
                  className="text-talent-primary hover:underline"
                >
                  click here to resend
                </button>
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/login">
              <Button variant="outline">Return to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EmailVerification;
