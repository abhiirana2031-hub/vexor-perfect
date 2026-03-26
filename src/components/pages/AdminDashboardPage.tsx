import { useState, useEffect } from 'react';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Projects, Services, TeamMembers, Testimonials } from '@/entities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trash2, Edit2, Plus, Upload, Lock, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

// HARDCODED CREDENTIALS FOR TESTING ONLY - REMOVE BEFORE PRODUCTION
const ADMIN_EMAIL = 'abhayrana8272@gmail.com';
const ADMIN_PASSWORD = 'vexor@#005';

// Utility function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function AdminDashboardPage() {
  const { member, isAuthenticated } = useMember();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<Projects[]>([]);
  const [services, setServices] = useState<Services[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: string } | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [formData, setFormData] = useState<any>({});
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState('all');
  const [enquirySort, setEnquirySort] = useState('newest');
  const [replyDialog, setReplyDialog] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    emailjs.init({ publicKey: 'RU_MfNjqk66qHxpzu' });
  }, []);

  // Check if user is admin (either authenticated member or hardcoded test login)
  const isAdmin = isAdminLoggedIn || (isAuthenticated && member?.profile?.nickname === 'admin');

  // Redirect non-admin users away from admin page
  useEffect(() => {
    if (!isAdminLoggedIn && !isAdmin && !isLoading) {
      navigate('/');
    }
  }, [isAdmin, isAdminLoggedIn, navigate, isLoading]);

  const handleAdminLogin = () => {
    setLoginError('');
    if (adminLoginForm.email === ADMIN_EMAIL && adminLoginForm.password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setAdminLoginForm({ email: '', password: '' });
    } else {
      setLoginError('Invalid email or password');
    }
  };

  // Handle image upload with preview
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
        
        // Determine which image field to update based on active tab
        const imageField = 
          activeTab === 'projects' ? 'projectImage' :
          activeTab === 'services' ? 'serviceImage' :
          activeTab === 'testimonials' ? 'clientImage' :
          'profilePhoto';
        
        setFormData({ ...formData, [imageField]: base64 });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    const imageField = 
      activeTab === 'projects' ? 'projectImage' :
      activeTab === 'services' ? 'serviceImage' :
      activeTab === 'testimonials' ? 'clientImage' :
      'profilePhoto';
    setFormData({ ...formData, [imageField]: '' });
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadAllData();
  }, [isAdmin]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [projectsRes, servicesRes, teamRes, testimonialsRes, enquiriesRes] = await Promise.all([
        BaseCrudService.getAll<Projects>('projects'),
        BaseCrudService.getAll<Services>('services'),
        BaseCrudService.getAll<TeamMembers>('teammembers'),
        BaseCrudService.getAll<Testimonials>('testimonials'),
        BaseCrudService.getAll<any>('enquiries').catch(() => ({ items: [] }))
      ]);
      setProjects(projectsRes.items);
      setServices(servicesRes.items);
      setTeamMembers(teamRes.items);
      setTestimonials(testimonialsRes.items);
      setEnquiries(enquiriesRes.items || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = (type: string) => {
    setEditingItem(null);
    setFormData({});
    setImagePreview(null);
    setActiveTab(type);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    setFormData(item);
    
    // Set image preview if editing existing item
    const imageField = 
      type === 'projects' ? 'projectImage' :
      type === 'services' ? 'serviceImage' :
      type === 'testimonials' ? 'clientImage' :
      'profilePhoto';
    
    if (item[imageField]) {
      setImagePreview(item[imageField]);
    } else {
      setImagePreview(null);
    }
    
    setActiveTab(type);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, type: string) => {
    try {
      const collectionId =
        type === 'projects'
          ? 'projects'
          : type === 'services'
            ? 'services'
            : type === 'testimonials'
              ? 'testimonials'
              : 'teammembers';
      await BaseCrudService.delete(collectionId, id);
      
      if (type === 'projects') {
        setProjects(projects.filter(p => p._id !== id));
      } else if (type === 'services') {
        setServices(services.filter(s => s._id !== id));
      } else if (type === 'testimonials') {
        setTestimonials(testimonials.filter((t) => t._id !== id));
      } else {
        setTeamMembers(teamMembers.filter(t => t._id !== id));
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSaveItem = async () => {
    try {
      const collectionId =
        activeTab === 'projects'
          ? 'projects'
          : activeTab === 'services'
            ? 'services'
            : activeTab === 'testimonials'
              ? 'testimonials'
              : 'teammembers';
      
      if (editingItem) {
        const saved = await BaseCrudService.update(collectionId, { ...formData, _id: editingItem._id });
        if (activeTab === 'projects') {
          setProjects(projects.map(p => p._id === editingItem._id ? (saved as Projects) : p));
        } else if (activeTab === 'services') {
          setServices(services.map(s => s._id === editingItem._id ? (saved as Services) : s));
        } else if (activeTab === 'testimonials') {
          setTestimonials(testimonials.map((t) => t._id === editingItem._id ? (saved as Testimonials) : t));
        } else {
          setTeamMembers(teamMembers.map(t => t._id === editingItem._id ? (saved as TeamMembers) : t));
        }
      } else {
        const newItem = { ...formData, _id: crypto.randomUUID() };
        const created = await BaseCrudService.create(collectionId, newItem);
        if (activeTab === 'projects') {
          setProjects([...projects, created as Projects]);
        } else if (activeTab === 'services') {
          setServices([...services, created as Services]);
        } else if (activeTab === 'testimonials') {
          setTestimonials([...testimonials, created as Testimonials]);
        } else {
          setTeamMembers([...teamMembers, created as TeamMembers]);
        }
      }
      setIsDialogOpen(false);
      setFormData({});
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // In a real app, you'd upload this to a storage service
      console.log('Logo file selected:', file.name);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // In a real app, you'd call an API to change the password
    console.log('Password change requested');
    setPasswordDialog(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password changed successfully');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-[100rem] mx-auto text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-8">Admin Login</h1>
            <Card className="bg-soft-shadow-gray border-secondary/20 max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-foreground font-paragraph text-sm mb-2">Email</label>
                    <Input
                      type="email"
                      value={adminLoginForm.email}
                      onChange={(e) => setAdminLoginForm({ ...adminLoginForm, email: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                      className="bg-background border-secondary/20 text-foreground"
                      placeholder="Enter admin email"
                    />
                  </div>
                  <div>
                    <label className="block text-foreground font-paragraph text-sm mb-2">Password</label>
                    <Input
                      type="password"
                      value={adminLoginForm.password}
                      onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                      className="bg-background border-secondary/20 text-foreground"
                      placeholder="Enter admin password"
                    />
                  </div>
                  {loginError && (
                    <p className="text-destructive font-paragraph text-sm">{loginError}</p>
                  )}
                  <Button 
                    onClick={handleAdminLogin}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    Login to Admin Panel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-[120rem] mx-auto">
          {/* Header Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading text-5xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="font-paragraph text-foreground/70">Manage your site content, users, and settings</p>
          </motion.div>

          {/* Logo and Settings Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-soft-shadow-gray border-secondary/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Upload className="w-5 h-5 text-secondary" />
                  Upload Logo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/90"
                  />
                  {logoFile && (
                    <p className="text-sm text-secondary">Selected: {logoFile.name}</p>
                  )}
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Upload Logo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-soft-shadow-gray border-secondary/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Lock className="w-5 h-5 text-secondary" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setPasswordDialog(true)}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-soft-shadow-gray border border-secondary/20">
                <TabsTrigger value="projects" className="text-foreground data-[state=active]:text-secondary data-[state=active]:bg-background">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="services" className="text-foreground data-[state=active]:text-secondary data-[state=active]:bg-background">
                  Services
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="text-foreground data-[state=active]:text-secondary data-[state=active]:bg-background">
                  Testimonials
                </TabsTrigger>
                <TabsTrigger value="team" className="text-foreground data-[state=active]:text-secondary data-[state=active]:bg-background">
                  Team Members
                </TabsTrigger>
                <TabsTrigger value="enquiries" className="text-foreground data-[state=active]:text-secondary data-[state=active]:bg-background">
                  Enquiries
                </TabsTrigger>
              </TabsList>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Projects</h2>
                  <Button 
                    onClick={() => handleAddNew('projects')}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </Button>
                </div>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid gap-4">
                    {projects.map((project) => (
                      <Card key={project._id} className="bg-soft-shadow-gray border-secondary/20">
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            {project.projectImage && (
                              <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                <Image
                                  src={project.projectImage}
                                  alt={project.projectTitle}
                                  width={128}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 flex justify-between items-start">
                              <div>
                                <h3 className="font-heading text-lg font-bold text-foreground">{project.projectTitle}</h3>
                                <p className="font-paragraph text-foreground/70 mt-2">{project.projectDescription}</p>
                                <p className="font-paragraph text-sm text-secondary mt-2">Technologies: {project.technologiesUsed}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleEdit(project, 'projects')}
                                  size="sm"
                                  className="bg-secondary/20 text-secondary hover:bg-secondary/30"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  onClick={() => setDeleteConfirm({ id: project._id!, type: 'projects' })}
                                  size="sm"
                                  className="bg-destructive/20 text-destructive hover:bg-destructive/30"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-4 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Services</h2>
                  <Button 
                    onClick={() => handleAddNew('services')}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Service
                  </Button>
                </div>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <Card key={service._id} className="bg-soft-shadow-gray border-secondary/20">
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            {service.serviceImage && (
                              <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                <Image
                                  src={service.serviceImage}
                                  alt={service.serviceName}
                                  width={128}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 flex justify-between items-start">
                              <div>
                                <h3 className="font-heading text-lg font-bold text-foreground">{service.serviceName}</h3>
                                <p className="font-paragraph text-foreground/70 mt-2">{service.shortDescription}</p>
                                <div className="flex gap-2 mt-2">
                                  {service.isFeatured && (
                                    <span className="inline-block px-2 py-1 bg-secondary/20 text-secondary text-xs rounded">Featured</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleEdit(service, 'services')}
                                  size="sm"
                                  className="bg-secondary/20 text-secondary hover:bg-secondary/30"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  onClick={() => setDeleteConfirm({ id: service._id!, type: 'services' })}
                                  size="sm"
                                  className="bg-destructive/20 text-destructive hover:bg-destructive/30"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Testimonials Tab */}
              <TabsContent value="testimonials" className="space-y-4 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Testimonials</h2>
                  <Button
                    onClick={() => handleAddNew('testimonials')}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Testimonial
                  </Button>
                </div>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid gap-4">
                    {testimonials.map((t) => (
                      <Card key={t._id} className="bg-soft-shadow-gray border-secondary/20">
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            {t.clientImage && (
                              <div className="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden border border-secondary/20">
                                <Image
                                  src={t.clientImage}
                                  alt={t.clientName || 'Client'}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 flex justify-between items-start gap-4">
                              <div>
                                <h3 className="font-heading text-lg font-bold text-foreground">
                                  {t.clientName}
                                </h3>
                                <p className="font-paragraph text-secondary text-sm mt-1">
                                  {t.clientRoleCompany}
                                </p>
                                <p className="font-paragraph text-foreground/70 mt-2 line-clamp-3">
                                  {t.reviewText}
                                </p>
                                <p className="font-paragraph text-sm text-foreground/50 mt-2">
                                  Rating: {t.rating ?? '—'}
                                  {t.datePosted
                                    ? ` · ${new Date(t.datePosted).toLocaleDateString()}`
                                    : ''}
                                </p>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <Button
                                  onClick={() => handleEdit(t, 'testimonials')}
                                  size="sm"
                                  className="bg-secondary/20 text-secondary hover:bg-secondary/30"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    setDeleteConfirm({ id: t._id!, type: 'testimonials' })
                                  }
                                  size="sm"
                                  className="bg-destructive/20 text-destructive hover:bg-destructive/30"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Team Members Tab */}
              <TabsContent value="team" className="space-y-4 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Team Members</h2>
                  <Button 
                    onClick={() => handleAddNew('team')}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </Button>
                </div>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid gap-4">
                    {teamMembers.map((member) => (
                      <Card key={member._id} className="bg-soft-shadow-gray border-secondary/20">
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            {member.profilePhoto && (
                              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                <Image
                                  src={member.profilePhoto}
                                  alt={member.fullName}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 flex justify-between items-start">
                              <div>
                                <h3 className="font-heading text-lg font-bold text-foreground">{member.fullName}</h3>
                                <p className="font-paragraph text-secondary mt-1">{member.jobTitle}</p>
                                <p className="font-paragraph text-foreground/70 mt-2">{member.bio}</p>
                                {member.email && (
                                  <p className="font-paragraph text-sm text-foreground/60 mt-2">Email: {member.email}</p>
                                )}
                                {member.joiningDate && (
                                  <p className="font-paragraph text-sm text-secondary/70 mt-2">
                                    Joined: {new Date(member.joiningDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleEdit(member, 'team')}
                                  size="sm"
                                  className="bg-secondary/20 text-secondary hover:bg-secondary/30"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  onClick={() => setDeleteConfirm({ id: member._id!, type: 'team' })}
                                  size="sm"
                                  className="bg-destructive/20 text-destructive hover:bg-destructive/30"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Enquiries Tab */}
              <TabsContent value="enquiries" className="space-y-4 mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Contact Enquiries</h2>
                  <div className="flex gap-4">
                    <select
                      value={enquiryFilter}
                      onChange={(e) => setEnquiryFilter(e.target.value)}
                      className="bg-soft-shadow-gray border border-secondary/20 text-foreground rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-secondary"
                    >
                      <option value="all">All Status</option>
                      <option value="unseen">Unseen</option>
                      <option value="pending">Pending</option>
                      <option value="replied">Replied</option>
                    </select>
                    <select
                      value={enquirySort}
                      onChange={(e) => setEnquirySort(e.target.value)}
                      className="bg-soft-shadow-gray border border-secondary/20 text-foreground rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-secondary"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid gap-4">
                    {enquiries
                      .filter(eq => enquiryFilter === 'all' || eq.status === enquiryFilter)
                      .sort((a, b) => {
                        const dateA = new Date(a.createdAt || 0).getTime();
                        const dateB = new Date(b.createdAt || 0).getTime();
                        return enquirySort === 'newest' ? dateB - dateA : dateA - dateB;
                      })
                      .map((enquiry) => (
                      <Card key={enquiry._id} className="bg-soft-shadow-gray border-secondary/20">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-heading text-lg font-bold text-foreground">{enquiry.name}</h3>
                                <div className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  enquiry.status === 'unseen' ? 'bg-destructive/20 text-destructive' :
                                  enquiry.status === 'pending' ? 'bg-orange-500/20 text-orange-500' :
                                  'bg-secondary/20 text-secondary'
                                }`}>
                                  {(enquiry.status || 'unseen').toUpperCase()}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                                <span>Email: {enquiry.email}</span>
                                <span>Phone: {enquiry.phone || 'N/A'}</span>
                                <span>Date: {new Date(enquiry.createdAt).toLocaleString()}</span>
                              </div>
                              <div className="mt-4">
                                <p className="font-semibold text-foreground text-sm">Subject: {enquiry.subject}</p>
                                <div className="mt-2 p-4 bg-background/50 rounded-lg text-foreground/80 font-paragraph text-sm whitespace-pre-wrap border border-secondary/10">
                                  {enquiry.message}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0 w-full md:w-32">
                              <Button 
                                onClick={async () => {
                                  // Mark as pending if unseen
                                  if (enquiry.status === 'unseen') {
                                    const updated = { ...enquiry, status: 'pending' };
                                    await BaseCrudService.update('enquiries', updated);
                                    setEnquiries(enquiries.map(e => e._id === enquiry._id ? updated : e));
                                  }
                                  setReplyDialog(enquiry);
                                }}
                                size="sm"
                                disabled={enquiry.status === 'replied'}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full"
                              >
                                {enquiry.status === 'replied' ? 'Replied' : 'Reply'}
                              </Button>
                              <Button 
                                onClick={async () => {
                                  const updated = { ...enquiry, status: enquiry.status === 'pending' ? 'unseen' : 'pending' };
                                  await BaseCrudService.update('enquiries', updated);
                                  setEnquiries(enquiries.map(e => e._id === enquiry._id ? updated : e));
                                }}
                                size="sm"
                                variant="outline"
                                className="border-secondary/20 text-foreground hover:bg-secondary/10 w-full"
                              >
                                Mark {enquiry.status === 'pending' ? 'Unseen' : 'Pending'}
                              </Button>
                              <Button 
                                onClick={async () => {
                                  if(confirm('Delete this enquiry?')) {
                                    await BaseCrudService.delete('enquiries', enquiry._id);
                                    setEnquiries(enquiries.filter(e => e._id !== enquiry._id));
                                  }
                                }}
                                size="sm"
                                className="bg-destructive/10 text-destructive hover:bg-destructive/20 w-full"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {enquiries.length === 0 && (
                      <p className="text-foreground/50 text-center py-8">No enquiries found.</p>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={!!replyDialog} onOpenChange={(open) => !open && setReplyDialog(null)}>
        <DialogContent className="bg-soft-shadow-gray border-secondary/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Reply to {replyDialog?.name}</DialogTitle>
            <DialogDescription className="text-foreground/70">
              Sending email to: {replyDialog?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-foreground font-paragraph text-sm mb-2">Subject</label>
              <Input
                value={`Re: ${replyDialog?.subject}`}
                disabled
                className="bg-background/50 border-secondary/20 text-foreground"
              />
            </div>
            <div>
              <label className="block text-foreground font-paragraph text-sm mb-2">Message</label>
              <Textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={6}
                className="bg-background border-secondary/20 text-foreground resize-none"
                placeholder="Type your reply here..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setReplyDialog(null)}
                className="border-secondary/20 text-foreground hover:bg-secondary/10"
              >
                Cancel
              </Button>
              <Button 
                onClick={async () => {
                  if (!replyMessage.trim()) return alert('Message cannot be empty');
                  setSendingReply(true);
                  try {
                    await emailjs.send('service_gec4utq', 'template_saa7kyw', {
                      to_email: replyDialog.email,
                      from_name: 'Vexora IT Solutions',
                      name: 'Vexora IT Solutions',
                      reply_to: 'vexoritsolutions@gmail.com',
                      subject: `Re: ${replyDialog.subject}`,
                      message: replyMessage
                    });
                    
                    const updated = { ...replyDialog, status: 'replied' };
                    await BaseCrudService.update('enquiries', updated);
                    setEnquiries(enquiries.map(e => e._id === replyDialog._id ? updated : e));
                    setReplyDialog(null);
                    setReplyMessage('');
                    alert('Reply sent successfully!');
                  } catch (error) {
                    console.error('Failed to send reply:', error);
                    alert('Failed to send reply. Check console.');
                  } finally {
                    setSendingReply(false);
                  }
                }}
                disabled={sendingReply}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {sendingReply ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-soft-shadow-gray border-secondary/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingItem ? 'Edit' : 'Add New'}{' '}
              {activeTab === 'projects'
                ? 'Project'
                : activeTab === 'services'
                  ? 'Service'
                  : activeTab === 'testimonials'
                    ? 'Testimonial'
                    : 'Team Member'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Image Upload Section - Common for all types */}
            <div className="border-b border-secondary/20 pb-4">
              <label className="block text-foreground font-paragraph text-sm mb-3 font-semibold">
                {activeTab === 'projects'
                  ? 'Project Image'
                  : activeTab === 'services'
                    ? 'Service Image'
                    : activeTab === 'testimonials'
                      ? 'Client Photo'
                      : 'Profile Photo'}
              </label>
              {imagePreview && (
                <div className="mb-4 relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="w-full max-h-48 object-cover rounded-lg"
                  />
                  <Button
                    onClick={handleRemoveImage}
                    size="sm"
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="block flex-1 text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/90 disabled:opacity-50"
                />
              </div>
              {uploadingImage && <p className="text-sm text-secondary mt-2">Uploading image...</p>}
            </div>

            {activeTab === 'projects' && (
              <>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Project Title</label>
                  <Input
                    value={formData.projectTitle || ''}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Description</label>
                  <Textarea
                    value={formData.projectDescription || ''}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Enter project description"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Technologies Used</label>
                  <Input
                    value={formData.technologiesUsed || ''}
                    onChange={(e) => setFormData({ ...formData, technologiesUsed: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Client Name</label>
                  <Input
                    value={formData.clientName || ''}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Project URL</label>
                  <Input
                    value={formData.projectUrl || ''}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Completion Date</label>
                  <Input
                    type="date"
                    value={formData.completionDate ? new Date(formData.completionDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                  />
                </div>
              </>
            )}
            {activeTab === 'testimonials' && (
              <>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Client name</label>
                  <Input
                    value={formData.clientName || ''}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Client name"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Role / company</label>
                  <Input
                    value={formData.clientRoleCompany || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, clientRoleCompany: e.target.value })
                    }
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="e.g. CTO, Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Review</label>
                  <Textarea
                    value={formData.reviewText || ''}
                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Testimonial text"
                    rows={5}
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Rating (1–5)</label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={formData.rating ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: e.target.value === '' ? undefined : Number(e.target.value),
                      })
                    }
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Date posted</label>
                  <Input
                    type="date"
                    value={
                      formData.datePosted
                        ? new Date(formData.datePosted).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, datePosted: e.target.value || undefined })
                    }
                    className="bg-background border-secondary/20 text-foreground"
                  />
                </div>
              </>
            )}
            {activeTab === 'services' && (
              <>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Service Name</label>
                  <Input
                    value={formData.serviceName || ''}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Enter service name"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Short Description</label>
                  <Input
                    value={formData.shortDescription || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Enter short description"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Detailed Description</label>
                  <Textarea
                    value={formData.detailedDescription || ''}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Enter detailed description"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">URL Slug</label>
                  <Input
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="e.g., web-development"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-foreground font-paragraph text-sm">Mark as Featured</label>
                </div>
              </>
            )}
            {activeTab === 'team' && (
              <>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Full Name</label>
                  <Input
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Job Title</label>
                  <Input
                    value={formData.jobTitle || ''}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Enter job title"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Biography</label>
                  <Textarea
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Enter biography"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Email</label>
                  <Input
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">LinkedIn URL</label>
                  <Input
                    value={formData.linkedInUrl || ''}
                    onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Joining Date</label>
                  <Input
                    type="date"
                    value={formData.joiningDate || ''}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Select joining date"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-paragraph text-sm mb-2">Display Order</label>
                  <Input
                    type="number"
                    value={formData.displayOrder || ''}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="bg-background border-secondary/20 text-foreground"
                    placeholder="Enter display order"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button 
              onClick={() => {
                setIsDialogOpen(false);
                setImagePreview(null);
              }}
              className="bg-foreground/10 text-foreground hover:bg-foreground/20"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveItem}
              disabled={uploadingImage}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-soft-shadow-gray border-secondary/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Item</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/70">
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel className="bg-foreground/10 text-foreground hover:bg-foreground/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirm && handleDelete(deleteConfirm.id, deleteConfirm.type)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
        <DialogContent className="bg-soft-shadow-gray border-secondary/20">
          <DialogHeader>
            <DialogTitle className="text-foreground">Change Password</DialogTitle>
            <DialogDescription className="text-foreground/70">
              Enter your current password and new password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-foreground font-paragraph text-sm mb-2">Current Password</label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="bg-background border-secondary/20 text-foreground"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-foreground font-paragraph text-sm mb-2">New Password</label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="bg-background border-secondary/20 text-foreground"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-foreground font-paragraph text-sm mb-2">Confirm Password</label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="bg-background border-secondary/20 text-foreground"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button 
              onClick={() => setPasswordDialog(false)}
              className="bg-foreground/10 text-foreground hover:bg-foreground/20"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordChange}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
