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
      const [projectsRes, servicesRes, teamRes, testimonialsRes] = await Promise.all([
        BaseCrudService.getAll<Projects>('projects'),
        BaseCrudService.getAll<Services>('services'),
        BaseCrudService.getAll<TeamMembers>('teammembers'),
        BaseCrudService.getAll<Testimonials>('testimonials'),
      ]);
      setProjects(projectsRes.items);
      setServices(servicesRes.items);
      setTeamMembers(teamRes.items);
      setTestimonials(testimonialsRes.items);
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
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-soft-shadow-gray border border-secondary/20">
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
            </Tabs>
          </motion.div>
        </div>
      </div>

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
