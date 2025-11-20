import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Users, Shield, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithEmailAndPassword, signInWithPopup, } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import type { UserCredential } from "firebase/auth";


interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onCitizenLogin: () => void;
  onAuthorityLogin: () => void;
}

export function LoginDialog({
  open,
  onClose,
  onCitizenLogin,
  onAuthorityLogin,
}: LoginDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [citizenUsername, setCitizenUsername] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [authorityUsername, setAuthorityUsername] = useState('');
  const [authorityPassword, setAuthorityPassword] = useState('');

  const handleCitizenSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, citizenUsername, citizenPassword);
    onClose();
    onCitizenLogin();
  } catch (error) {
    console.error("Citizen login failed:", error);
    alert("Invalid credentials. Please try again.");
  }
};

const handleAuthoritySubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, authorityUsername, authorityPassword);
    onClose();
    onAuthorityLogin();
  } catch (error) {
    console.error("Authority login failed:", error);
    alert("Invalid credentials. Please try again.");
  }
};


  const handleGoogleSignIn = async (role: 'citizen' | 'authority') => {
  try {
    // Open Google Sign-In popup
    const result: UserCredential = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    console.log("Google user:", user.displayName, user.email);

    // Optional: You can differentiate roles here if needed
    if (role === 'citizen') {
      onCitizenLogin();
    } else {
      onAuthorityLogin();
    }

    onClose();
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    alert("Failed to sign in with Google.");
  }
};


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Login to Alert Sphere</DialogTitle>
          <DialogDescription>
            Select your role and enter your credentials to access the system.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="citizen" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="citizen" className="gap-2">
              <Users className="w-4 h-4" />
              Citizen
            </TabsTrigger>
            <TabsTrigger value="authority" className="gap-2">
              <Shield className="w-4 h-4" />
              Authority
            </TabsTrigger>
          </TabsList>

          {/* Citizen Login Tab */}
          <TabsContent value="citizen">
            <form onSubmit={handleCitizenSubmit} className="space-y-4 mt-4">
              

              <div className="space-y-2">
                <Label htmlFor="citizen-username">Username</Label>
                <Input
                  id="citizen-username"
                  type="text"
                  placeholder="Enter username"
                  value={citizenUsername}
                  onChange={(e) => setCitizenUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizen-password">Password</Label>
                <div className="relative">
                  <Input
                    id="citizen-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={citizenPassword}
                    onChange={(e) => setCitizenPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Forgot password?
                </a>
               
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <Users className="w-4 h-4" />
                  Login as Citizen
                </Button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleGoogleSignIn('citizen')}
                className="w-full flex items-center justify-center gap-2 border-gray-300"
              >
                <FcGoogle className="w-5 h-5" />
                Sign in with Google
              </Button>
            </form>
          </TabsContent>

          {/* Authority Login Tab */}
          <TabsContent value="authority">
            <form onSubmit={handleAuthoritySubmit} className="space-y-4 mt-4">
             

              <div className="space-y-2">
                <Label htmlFor="authority-username">Username / Employee ID</Label>
                <Input
                  id="authority-username"
                  type="text"
                  placeholder="Enter username or employee ID"
                  value={authorityUsername}
                  onChange={(e) => setAuthorityUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authority-password">Password</Label>
                <div className="relative">
                  <Input
                    id="authority-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={authorityPassword}
                    onChange={(e) => setAuthorityPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-900">Authorized personnel only</p>
              </div>

              <div className="flex justify-between items-center">
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Forgot password?
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Request access
                </a>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Login as Authority
                </Button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleGoogleSignIn('authority')}
                className="w-full flex items-center justify-center gap-2 border-gray-300"
              >
                <FcGoogle className="w-5 h-5" />
                Sign in with Google
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
