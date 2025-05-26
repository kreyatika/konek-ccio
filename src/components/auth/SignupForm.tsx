import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { checkIfFirstUser } from '@/contexts/auth/profileUtils';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface SignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ setIsLoading, isLoading }) => {
  const { signup } = useAuth();
  const [isFirstUser, setIsFirstUser] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkFirstUser = async () => {
      const isFirst = await checkIfFirstUser();
      setIsFirstUser(isFirst);
    };
    
    checkFirstUser();
  }, []);

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    try {
      setIsLoading(true);
      await signup(values.email, values.password);
      
      if (isFirstUser) {
        toast.success("You've been registered as a superadmin!");
      } else {
        toast.success("Signup successful! Please check your email for verification.");
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...signupForm}>
      <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
        {isFirstUser && (
          <div className="p-3 bg-green-100 text-green-800 rounded-md mb-4">
            You'll be the first user and automatically assigned as a superadmin.
          </div>
        )}
        <FormField
          control={signupForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signupForm.control}
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
        <FormField
          control={signupForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-[#1C56A3] hover:bg-[#1C56A3]/90" 
          disabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
