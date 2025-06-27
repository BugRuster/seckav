'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Use AuthContext login method
        login(user, token);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/auth/login?error=google_auth_failed');
      }
    } else {
      router.push('/auth/login?error=missing_auth_data');
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span>Google Sign-In Successful</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Redirecting to dashboard...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 