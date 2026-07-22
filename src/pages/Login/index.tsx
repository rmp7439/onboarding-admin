import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { login, storeToken, storeUser } from "../../services/authService";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await login({ email: data.email, password: data.password });
      
      storeToken(response.token, !!data.rememberMe);
      storeUser(response.user, !!data.rememberMe);
      setAuth(response.user, response.token, !!data.rememberMe);
      
      toast("Login successful", "success");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Invalid credentials";
      toast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to manage employee onboarding</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@company.com" 
              {...register("email")} 
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700" onClick={(e) => { e.preventDefault(); toast("Please contact your IT administrator.", "info"); }}>
                Forgot password?
              </a>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              {...register("password")} 
              disabled={isSubmitting}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="rememberMe" 
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              {...register("rememberMe")}
            />
            <Label htmlFor="rememberMe" className="font-normal text-slate-600 cursor-pointer">Remember me for 30 days</Label>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}