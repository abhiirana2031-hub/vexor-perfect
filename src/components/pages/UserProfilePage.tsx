import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { UserProfiles, UserTestimonials, Projects } from '@/entities';
import { QRCodeCanvas } from 'qrcode.react';
import { Shield, QrCode, Key, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Star, Mail, Building2, Briefcase, Globe, X, Phone, LogIn } from 'lucide-react';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'profile' | 'testimonial' | 'projects' | 'security'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfiles | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userProjects, setUserProjects] = useState<Projects[]>([]);

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '', phoneNumber: '', usePhone: false });
  const [loginError, setLoginError] = useState('');

  // Register form
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: '',
    usePhone: false
  });
  const [registerError, setRegisterError] = useState('');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    bio: '',
    company: '',
    jobTitle: '',
    websiteUrl: '',
    phoneNumber: ''
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Testimonial form
  const [testimonialForm, setTestimonialForm] = useState({
    reviewText: '',
    rating: 5
  });
  const [testimonialError, setTestimonialError] = useState('');
  const [showTestimonialDialog, setShowTestimonialDialog] = useState(false);

  // Check for existing user on mount
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setProfileForm({
          fullName: user.fullName || '',
          bio: user.bio || '',
          company: user.company || '',
          jobTitle: user.jobTitle || '',
          websiteUrl: user.websiteUrl || '',
          phoneNumber: user.phoneNumber || ''
        });
        if (user.profilePhoto) {
          setProfileImage(user.profilePhoto);
        }
        setActiveTab('profile');
        loadUserProjects(user._id);
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }, []);

  const loadUserProjects = async (userId: string) => {
    try {
      const allProjects = await BaseCrudService.getAll<Projects>('projects');
      const projects = allProjects.items.filter(p => p.userId === userId);
      setUserProjects(projects);
    } catch (error) {
      console.error('Error loading user projects:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      try {
        const base64 = await fileToBase64(file);
        setProfileImage(base64);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleLogin = async () => {
    setLoginError('');
    if (loginForm.usePhone) {
      if (!loginForm.phoneNumber || !loginForm.password) {
        setLoginError('Phone number and password are required');
        return;
      }
    } else {
      if (!loginForm.email || !loginForm.password) {
        setLoginError('Email and password are required');
        return;
      }
    }

    setIsLoading(true);
    try {
      // Admin Bypass
      const ADMIN_EMAIL = import.meta.env.PUBLIC_ADMIN_EMAIL || 'abhayrana8272@gmail.com';
      const ADMIN_PASSWORD = import.meta.env.PUBLIC_ADMIN_PASSWORD || 'vexor@#005';

      if (loginForm.email === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
        const adminUser: UserProfiles = {
          _id: 'admin-root',
          fullName: 'Vexor Administrator',
          email: ADMIN_EMAIL,
          role: 'admin',
          _createdDate: new Date()
        };
        setCurrentUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        window.dispatchEvent(new Event('userUpdated'));
        setActiveTab('profile');
        setIsLoading(false);
        return;
      }

      const users = await BaseCrudService.getAll<UserProfiles>('userprofiles');
      const user = loginForm.usePhone
        ? users.items.find(u => u.phoneNumber === loginForm.phoneNumber)
        : users.items.find(u => u.email === loginForm.email);

      if (!user) {
        setLoginError(`${loginForm.usePhone ? 'Phone number' : 'Email'} not found. Please register first.`);
        setIsLoading(false);
        return;
      }

      if (user.passwordHash !== loginForm.password) {
        setLoginError('Invalid password');
        setIsLoading(false);
        return;
      }

      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.dispatchEvent(new Event('userUpdated'));
      setProfileForm({
        fullName: user.fullName || '',
        bio: user.bio || '',
        company: user.company || '',
        jobTitle: user.jobTitle || '',
        websiteUrl: user.websiteUrl || '',
        phoneNumber: user.phoneNumber || ''
      });
      if (user.profilePhoto) {
        setProfileImage(user.profilePhoto);
      }
      setActiveTab('profile');
      setLoginForm({ email: '', password: '', phoneNumber: '', usePhone: false });
      loadUserProjects(user._id);
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegisterError('');
    
    if (!registerForm.fullName || !registerForm.password) {
      setRegisterError('Please fill in all required fields');
      return;
    }

    if (registerForm.usePhone && !registerForm.phoneNumber) {
      setRegisterError('Phone number is required');
      return;
    }

    if (!registerForm.usePhone && !registerForm.email) {
      setRegisterError('Email is required');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const existingUsers = await BaseCrudService.getAll<UserProfiles>('userprofiles');
      const duplicate = registerForm.usePhone
        ? existingUsers.items.find(u => u.phoneNumber === registerForm.phoneNumber)
        : existingUsers.items.find(u => u.email === registerForm.email);

      if (duplicate) {
        setRegisterError(`${registerForm.usePhone ? 'Phone number' : 'Email'} already registered`);
        setIsLoading(false);
        return;
      }

      const newUser: UserProfiles = {
        _id: crypto.randomUUID(),
        email: registerForm.usePhone ? undefined : registerForm.email,
        phoneNumber: registerForm.usePhone ? registerForm.phoneNumber : undefined,
        fullName: registerForm.fullName,
        passwordHash: registerForm.password,
        company: registerForm.company || undefined,
        jobTitle: registerForm.jobTitle || undefined,
        isVerified: false,
        loginMethod: registerForm.usePhone ? 'phone' : 'email',
        _createdDate: new Date()
      };

      await BaseCrudService.create('userprofiles', newUser);
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      window.dispatchEvent(new Event('userUpdated'));
      setActiveTab('profile');
      setRegisterForm({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        company: '',
        jobTitle: '',
        usePhone: false
      });
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const updated: UserProfiles = {
        ...currentUser,
        ...profileForm,
        profilePhoto: profileImage || undefined,
        _updatedDate: new Date()
      };

      await BaseCrudService.update('userprofiles', updated);
      setCurrentUser(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
      window.dispatchEvent(new Event('userUpdated'));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const updated: UserProfiles = {
        ...currentUser,
        passwordHash: passwordForm.newPassword,
        _updatedDate: new Date()
      };

      await BaseCrudService.update('userprofiles', updated);
      setCurrentUser(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
      alert('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTestimonial = async () => {
    setTestimonialError('');
    
    if (!testimonialForm.reviewText) {
      setTestimonialError('Please write a testimonial');
      return;
    }

    if (!currentUser) {
      setTestimonialError('You must be logged in to submit a testimonial');
      return;
    }

    setIsLoading(true);
    try {
      const testimonial: UserTestimonials = {
        _id: crypto.randomUUID(),
        userId: currentUser._id,
        clientName: currentUser.fullName,
        clientImage: profileImage || undefined,
        reviewText: testimonialForm.reviewText,
        clientRoleCompany: currentUser.jobTitle ? `${currentUser.jobTitle}${currentUser.company ? ' at ' + currentUser.company : ''}` : currentUser.company,
        rating: testimonialForm.rating,
        isApproved: false,
        dateSubmitted: new Date(),
        _createdDate: new Date()
      };

      await BaseCrudService.create('userTestimonials', testimonial);
      alert('Testimonial submitted successfully! It will be reviewed by admins.');
      setTestimonialForm({ reviewText: '', rating: 5 });
      setShowTestimonialDialog(false);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setTestimonialError('Failed to submit testimonial');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userUpdated'));
    setActiveTab('login');
    setLoginForm({ email: '', password: '', phoneNumber: '', usePhone: false });
    setProfileImage(null);
  };

  const handleGoogleLogin = () => {
    // In production, implement actual Google OAuth
    alert('Google Login will be connected to your Google account for secure authentication');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8 md:mb-12 text-center"
          >
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 sm:mb-4">
              {currentUser ? 'My Profile' : 'User Account'}
            </h1>
            <p className="font-paragraph text-sm sm:text-base md:text-lg text-foreground/70">
              {currentUser ? 'Manage your profile and share your experience' : 'Login or register to share your testimonials'}
            </p>
          </motion.div>

          {!currentUser ? (
            <div className="max-w-sm mx-auto">
              {/* Login Tab */}
              {activeTab === 'login' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="bg-soft-shadow-gray border-secondary/20">
                    <CardHeader>
                      <CardTitle className="text-foreground">Login</CardTitle>
                      <CardDescription className="text-foreground/70">
                        Sign in to your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {loginError && (
                        <div className="p-3 bg-destructive/20 border border-destructive/30 rounded-lg">
                          <p className="text-destructive text-sm">{loginError}</p>
                        </div>
                      )}
                      
                      {/* Login Method Toggle */}
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => setLoginForm({ ...loginForm, usePhone: false })}
                          className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2 ${
                            !loginForm.usePhone
                              ? 'bg-secondary text-secondary-foreground'
                              : 'bg-background border border-secondary/20 text-foreground'
                          }`}
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </button>
                        <button
                          onClick={() => setLoginForm({ ...loginForm, usePhone: true })}
                          className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2 ${
                            loginForm.usePhone
                              ? 'bg-secondary text-secondary-foreground'
                              : 'bg-background border border-secondary/20 text-foreground'
                          }`}
                        >
                          <Phone className="w-4 h-4" />
                          Phone
                        </button>
                      </div>

                      {!loginForm.usePhone ? (
                        <>
                          <div>
                            <label className="block text-foreground font-paragraph text-sm mb-2">
                              Email
                            </label>
                            <Input
                              type="email"
                              value={loginForm.email}
                              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                              className="bg-background border-secondary/20 text-foreground"
                              placeholder="your@email.com"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-foreground font-paragraph text-sm mb-2">
                              Phone Number
                            </label>
                            <Input
                              type="tel"
                              value={loginForm.phoneNumber}
                              onChange={(e) => setLoginForm({ ...loginForm, phoneNumber: e.target.value })}
                              className="bg-background border-secondary/20 text-foreground"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </>
                      )}
                      
                      <div>
                        <label className="block text-foreground font-paragraph text-sm mb-2">
                          Password
                        </label>
                        <Input
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="bg-background border-secondary/20 text-foreground"
                          placeholder="••••••"
                        />
                      </div>
                      <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>

                      {/* Google Login */}
                      <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full border-secondary/20 text-foreground hover:bg-background/50"
                      >
                        Login with Google
                      </Button>

                      <p className="text-center text-sm text-foreground/70">
                        Don't have an account?{' '}
                        <button
                          onClick={() => setActiveTab('register')}
                          className="text-secondary hover:underline font-semibold"
                        >
                          Register here
                        </button>
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Register Tab */}
              {activeTab === 'register' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="bg-soft-shadow-gray border-secondary/20">
                    <CardHeader>
                      <CardTitle className="text-foreground">Create Account</CardTitle>
                      <CardDescription className="text-foreground/70">
                        Register a new account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {registerError && (
                        <div className="p-3 bg-destructive/20 border border-destructive/30 rounded-lg">
                          <p className="text-destructive text-sm">{registerError}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-foreground font-paragraph text-sm mb-2">
                          Full Name *
                        </label>
                        <Input
                          value={registerForm.fullName}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, fullName: e.target.value })
                          }
                          className="bg-background border-secondary/20 text-foreground"
                          placeholder="John Doe"
                        />
                      </div>

                      {/* Register Method Toggle */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRegisterForm({ ...registerForm, usePhone: false })}
                          className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2 ${
                            !registerForm.usePhone
                              ? 'bg-secondary text-secondary-foreground'
                              : 'bg-background border border-secondary/20 text-foreground'
                          }`}
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </button>
                        <button
                          onClick={() => setRegisterForm({ ...registerForm, usePhone: true })}
                          className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2 ${
                            registerForm.usePhone
                              ? 'bg-secondary text-secondary-foreground'
                              : 'bg-background border border-secondary/20 text-foreground'
                          }`}
                        >
                          <Phone className="w-4 h-4" />
                          Phone
                        </button>
                      </div>

                      {!registerForm.usePhone ? (
                        <div>
                          <label className="block text-foreground font-paragraph text-sm mb-2">
                            Email *
                          </label>
                          <Input
                            type="email"
                            value={registerForm.email}
                            onChange={(e) =>
                              setRegisterForm({ ...registerForm, email: e.target.value })
                            }
                            className="bg-background border-secondary/20 text-foreground"
                            placeholder="your@email.com"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-foreground font-paragraph text-sm mb-2">
                            Phone Number *
                          </label>
                          <Input
                            type="tel"
                            value={registerForm.phoneNumber}
                            onChange={(e) =>
                              setRegisterForm({ ...registerForm, phoneNumber: e.target.value })
                            }
                            className="bg-background border-secondary/20 text-foreground"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-foreground font-paragraph text-sm mb-2">
                          Job Title
                        </label>
                        <Input
                          value={registerForm.jobTitle}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, jobTitle: e.target.value })
                          }
                          className="bg-background border-secondary/20 text-foreground"
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-foreground font-paragraph text-sm mb-2">
                          Company
                        </label>
                        <Input
                          value={registerForm.company}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, company: e.target.value })
                          }
                          className="bg-background border-secondary/20 text-foreground"
                          placeholder="Your Company"
                        />
                      </div>
                      <div>
                        <label className="block text-foreground font-paragraph text-sm mb-2">
                          Password *
                        </label>
                        <Input
                          type="password"
                          value={registerForm.password}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, password: e.target.value })
                          }
                          className="bg-background border-secondary/20 text-foreground"
                          placeholder="••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-foreground font-paragraph text-sm mb-2">
                          Confirm Password *
                        </label>
                        <Input
                          type="password"
                          value={registerForm.confirmPassword}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              confirmPassword: e.target.value
                            })
                          }
                          className="bg-background border-secondary/20 text-foreground"
                          placeholder="••••••"
                        />
                      </div>
                      <Button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      >
                        {isLoading ? 'Registering...' : 'Register'}
                      </Button>
                      <p className="text-center text-sm text-foreground/70">
                        Already have an account?{' '}
                        <button
                          onClick={() => setActiveTab('login')}
                          className="text-secondary hover:underline font-semibold"
                        >
                          Login here
                        </button>
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4 md:gap-8">
              {/* Profile Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="md:col-span-1"
              >
                <Card className="bg-soft-shadow-gray border-secondary/20 md:sticky md:top-28">
                  <CardContent className="pt-4 sm:pt-6 text-center">
                    {profileImage ? (
                      <div className="relative mb-3 sm:mb-4">
                        <Image
                          src={profileImage}
                          alt={currentUser.fullName || 'Profile'}
                          width={200}
                          height={200}
                          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full mx-auto object-cover border-4 border-secondary"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full mx-auto bg-secondary/20 border-4 border-secondary flex items-center justify-center mb-3 sm:mb-4">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                    <h3 className="font-heading text-2xl font-bold text-foreground">
                      {currentUser.fullName}
                    </h3>
                    {currentUser.jobTitle && (
                      <p className="text-secondary font-paragraph mt-1">{currentUser.jobTitle}</p>
                    )}
                    {currentUser.company && (
                      <p className="text-foreground/70 font-paragraph text-sm mt-1">
                        {currentUser.company}
                      </p>
                    )}
                    <Button
                      onClick={() => setShowTestimonialDialog(true)}
                      className="w-full mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Write Testimonial
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full mt-3 border-secondary/20 text-foreground"
                    >
                      Logout
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profile Edit Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <Card className="bg-soft-shadow-gray border-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-foreground">Edit Profile</CardTitle>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
                          activeTab === 'profile'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-background border border-secondary/20 text-foreground'
                        }`}
                      >
                        Profile Info
                      </button>
                      <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
                          activeTab === 'projects'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-background border border-secondary/20 text-foreground'
                        }`}
                      >
                        My Projects
                      </button>
                      <button
                        onClick={() => setActiveTab('security')}
                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold flex items-center gap-2 ${
                          activeTab === 'security'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-background border border-secondary/20 text-foreground'
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                        Security & ID
                      </button>
                      <button
                        onClick={() => setShowTestimonialDialog(true)}
                        className="px-4 py-2 rounded-lg bg-background border border-secondary/20 text-foreground hover:bg-background/50 transition-colors text-sm font-semibold ml-auto flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Write Testimonial
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {activeTab === 'profile' && (
                      <>
                    <div>
                      <label className="block text-foreground font-paragraph text-sm mb-3">
                        Profile Photo
                      </label>
                      {profileImage && (
                        <div className="mb-4 relative">
                          <Image
                            src={profileImage}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="w-40 h-40 rounded-lg object-cover"
                          />
                          <button
                            onClick={() => setProfileImage(null)}
                            className="absolute top-2 right-2 bg-destructive text-white p-1 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-secondary file:text-secondary-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-foreground font-paragraph text-sm mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <Input
                        type="email"
                        value={currentUser.email || ''}
                        disabled
                        className="bg-background/50 border-secondary/20 text-foreground/50"
                      />
                    </div>

                    <div>
                      <label className="block text-foreground font-paragraph text-sm mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={profileForm.phoneNumber}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, phoneNumber: e.target.value })
                        }
                        className="bg-background border-secondary/20 text-foreground"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-foreground font-paragraph text-sm mb-2">
                        Full Name
                      </label>
                      <Input
                        value={profileForm.fullName}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, fullName: e.target.value })
                        }
                        className="bg-background border-secondary/20 text-foreground"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-foreground font-paragraph text-sm mb-2">
                          <Briefcase className="w-4 h-4 inline mr-2" />
                          Job Title
                        </label>
                        <Input
                          value={profileForm.jobTitle}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, jobTitle: e.target.value })
                          }
                          className="bg-background border-secondary/20 text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-foreground font-paragraph text-sm mb-2">
                          <Building2 className="w-4 h-4 inline mr-2" />
                          Company
                        </label>
                        <Input
                          value={profileForm.company}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, company: e.target.value })
                          }
                          className="bg-background border-secondary/20 text-foreground"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-foreground font-paragraph text-sm mb-2">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Website URL
                      </label>
                      <Input
                        type="url"
                        value={profileForm.websiteUrl}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, websiteUrl: e.target.value })
                        }
                        className="bg-background border-secondary/20 text-foreground"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div>
                      <label className="block text-foreground font-paragraph text-sm mb-2">
                        Bio
                      </label>
                      <Textarea
                        value={profileForm.bio}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, bio: e.target.value })
                        }
                        className="bg-background border-secondary/20 text-foreground"
                        placeholder="Tell us about yourself"
                        rows={5}
                      />
                    </div>

                    <Button
                      onClick={handleProfileUpdate}
                      disabled={isLoading}
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                      </>
                    )}

                    {activeTab === 'projects' && (
                      <div className="space-y-4">
                        {userProjects.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-foreground/70 font-paragraph">
                              No projects assigned to your account yet.
                            </p>
                            <p className="text-foreground/50 text-sm font-paragraph mt-2">
                              Contact admin to link projects to your profile
                            </p>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-heading text-lg font-bold text-foreground">Your Projects</h3>
                            <div className="grid gap-4">
                              {userProjects.map((project) => (
                                <Card key={project._id} className="bg-background border-secondary/20 hover:border-secondary/50 transition-colors">
                                  <CardContent className="pt-4">
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                      {project.projectImage && (
                                        <div className="w-full sm:w-32 h-40 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                          <Image
                                            src={project.projectImage}
                                            alt={project.projectTitle || 'Project'}
                                            width={300}
                                            height={200}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                      <div className="flex-1">
                                        <h4 className="font-heading text-lg font-bold text-foreground">
                                          {project.projectTitle}
                                        </h4>
                                        <p className="font-paragraph text-foreground/70 mt-2">
                                          {project.projectDescription}
                                        </p>
                                        <p className="font-paragraph text-sm text-secondary mt-2">
                                          Tech: {project.technologiesUsed}
                                        </p>
                                        {project.projectStatus && (
                                          <div className="mt-3">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                              project.projectStatus === 'completed' ? 'bg-green-500/20 text-green-600' :
                                              project.projectStatus === 'active' ? 'bg-blue-500/20 text-blue-600' :
                                              project.projectStatus === 'on-hold' ? 'bg-yellow-500/20 text-yellow-600' :
                                              'bg-gray-500/20 text-gray-600'
                                            }`}>
                                              {project.projectStatus}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {activeTab === 'security' && (
                      <div className="space-y-12 pb-12">
                        {/* QR Identity Section */}
                        <div className="text-center space-y-6">
                           <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-secondary/20 bg-secondary/5 mb-4">
                              <QrCode className="w-4 h-4 text-secondary" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Neural Identity Token</span>
                           </div>
                           <h3 className="font-heading text-2xl font-black tracking-tighter">Your Digital ID</h3>
                           <p className="font-paragraph text-sm text-foreground/40 max-w-md mx-auto">
                              Present this identifier to any Vexora Administrator for instant profile synchronization and physical access verification.
                           </p>
                           
                           <div className="p-8 bg-white rounded-[2rem] inline-block shadow-2xl border-4 border-secondary/20 relative group">
                              <QRCodeCanvas 
                                value={JSON.stringify({ type: 'user_id', id: currentUser._id })}
                                size={200}
                                level="H"
                                includeMargin={false}
                                imageSettings={{
                                   src: "/vexor-logo.svg",
                                   x: undefined,
                                   y: undefined,
                                   height: 48,
                                   width: 48,
                                   excavate: true,
                                }}
                              />
                              <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] flex items-center justify-center pointer-events-none">
                                 <Shield className="w-8 h-8 text-secondary" />
                              </div>
                           </div>
                           <div className="pt-4">
                              <p className="text-[10px] font-black uppercase text-foreground/20 tracking-widest font-mono">Token ID: {currentUser._id}</p>
                           </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* Password Change Section */}
                        <div className="space-y-8">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-xl">
                                 <Key className="w-5 h-5 text-secondary" />
                              </div>
                              <div>
                                 <h4 className="font-heading text-xl font-bold">Protocol Update</h4>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Reset Neural Encryption Key</p>
                              </div>
                           </div>

                           <div className="grid sm:grid-cols-2 gap-6">
                              <div className="sm:col-span-2">
                                 <label className="block text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-3 pl-4 border-l border-secondary">New Transmission Key</label>
                                 <div className="relative">
                                    <Input 
                                      type={showPassword ? "text" : "password"}
                                      value={passwordForm.newPassword}
                                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                      className="bg-background border-white/5 h-14 pr-12"
                                      placeholder="••••••••"
                                    />
                                    <button 
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-secondary transition-colors"
                                    >
                                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                 </div>
                              </div>
                              <div className="sm:col-span-2">
                                 <label className="block text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-3 pl-4 border-l border-secondary">Confirm Initialization</label>
                                 <Input 
                                   type="password"
                                   value={passwordForm.confirmPassword}
                                   onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                   className="bg-background border-white/5 h-14"
                                   placeholder="••••••••"
                                 />
                              </div>
                           </div>

                           <Button 
                             onClick={handleChangePassword}
                             disabled={isLoading}
                             className="w-full h-14 bg-secondary text-secondary-foreground font-black uppercase tracking-widest text-xs"
                           >
                              {isLoading ? 'Updating Protocol...' : 'Overwrite Encryption Key'}
                           </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Testimonial Dialog */}
      <Dialog open={showTestimonialDialog} onOpenChange={setShowTestimonialDialog}>
        <DialogContent className="bg-soft-shadow-gray border-secondary/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Share Your Testimonial</DialogTitle>
            <DialogDescription className="text-foreground/70">
              Tell us about your experience with VEXOR-IT SOLUTIONS
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {testimonialError && (
              <div className="p-3 bg-destructive/20 border border-destructive/30 rounded-lg">
                <p className="text-destructive text-sm">{testimonialError}</p>
              </div>
            )}
            <div>
              <label className="block text-foreground font-paragraph text-sm mb-2">
                Your Review
              </label>
              <Textarea
                value={testimonialForm.reviewText}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    reviewText: e.target.value
                  })
                }
                className="bg-background border-secondary/20 text-foreground"
                placeholder="Share your experience..."
                rows={6}
              />
            </div>

            <div>
              <label className="block text-foreground font-paragraph text-sm mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      setTestimonialForm({ ...testimonialForm, rating: star })
                    }
                    className={`text-3xl transition-colors ${
                      star <= testimonialForm.rating
                        ? 'text-yellow-400'
                        : 'text-foreground/20'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setShowTestimonialDialog(false)}
                className="border-secondary/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitTestimonial}
                disabled={isLoading}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isLoading ? 'Submitting...' : 'Submit Testimonial'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
