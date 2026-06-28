import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminData } from '@/hooks/useAdminData';

// Modular UI Components
import { Sidebar } from '@/components/admin/Sidebar';
import { Topbar } from '@/components/admin/Topbar';
import { StatsOverview } from '@/components/admin/StatsOverview';

// Tab View Modules
import { ProjectManager } from '@/components/admin/TabViews/ProjectManager';
import { ProjectForm } from '@/components/admin/Dialogs/ProjectForm';
import { ServiceManager } from '@/components/admin/TabViews/ServiceManager';
import { ServiceForm } from '@/components/admin/Dialogs/ServiceForm';
import { BlogManager } from '@/components/admin/TabViews/BlogManager';
import { BlogForm } from '@/components/admin/Dialogs/BlogForm';
import { EnquiryManager } from '@/components/admin/TabViews/EnquiryManager';
import { TeamManager } from '@/components/admin/TabViews/TeamManager';
import { TeamForm } from '@/components/admin/Dialogs/TeamForm';
import { UserManager } from '@/components/admin/TabViews/UserManager';
import { UserForm } from '@/components/admin/Dialogs/UserForm';
import { TestimonialManager } from '@/components/admin/TabViews/TestimonialManager';
import { TestimonialForm } from '@/components/admin/Dialogs/TestimonialForm';
import { AuditLogManager } from '@/components/admin/TabViews/AuditLogManager';
import ScannerView from '@/components/admin/TabViews/ScannerView';
import { BaseCrudService } from '@/integrations';
import { UserProfiles } from '@/entities';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FadingVideo from '@/components/FadingVideo';
import { GLASS_STYLES, SERIF } from '@/lib/design';

const LOGIN_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4';

export default function AdminDashboardPage() {
  const {
    isAdmin,
    setIsAdminLoggedIn,
    isLoading,
    projects,
    services,
    teamMembers,
    testimonials,
    blogs,
    users,
    enquiries,
    refreshData,
    member,
    activeAdminUser,
    auditLogs,
    saveItem,
    deleteItem,
    setActiveAdminUser,
    isDbConnected
  } = useAdminData();

  const [activeTab, setActiveTab] = useState('stats');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [adminName, setAdminName] = useState(() => 
    localStorage.getItem('adminProfileName') || 'Administrator'
  );
  const [adminAvatar, setAdminAvatar] = useState<string | null>(() => 
    localStorage.getItem('adminProfileAvatar') || null
  );

  const handleUpdateAdminProfile = (name: string, avatar: string | null) => {
    setAdminName(name);
    setAdminAvatar(avatar);
    localStorage.setItem('adminProfileName', name);
    if (avatar) {
      localStorage.setItem('adminProfileAvatar', avatar);
    } else {
      localStorage.removeItem('adminProfileAvatar');
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: any, assignedProjectIds?: string[]) => {
    setIsSaving(true);
    const idToUpdate = selectedItem?._id;
    
    // Save the primary item
    const collectionMap: Record<string, string> = {
      'users': 'userprofiles',
      'team': 'teammembers',
    };
    const collectionId = collectionMap[activeTab] || activeTab;

    try {
      const savedRecord = await saveItem(collectionId, data, idToUpdate);
      
      // Cross-Collection logic for Neural Profiles mapping to Projects
      if (savedRecord && activeTab === 'users' && assignedProjectIds) {
         const userId = savedRecord._id;
         try {
             const allProjs = await BaseCrudService.getAll<any>('projects');
             const syncTasks = allProjs.items.map(async (proj) => {
                 const shouldOwn = assignedProjectIds.includes(proj._id);
                 const currentlyOwns = proj.userId === userId;
                 
                 if (shouldOwn && !currentlyOwns) {
                     return BaseCrudService.update('projects', { ...proj, userId: userId });
                 } else if (!shouldOwn && currentlyOwns) {
                     return BaseCrudService.update('projects', { ...proj, userId: null });
                 }
                 return Promise.resolve();
             });
             await Promise.all(syncTasks);
         } catch (err) {
             console.error('Failed to sync project assignments', err);
         }
      }
      
      if (savedRecord) {
        setIsDialogOpen(false);
        setSelectedItem(null);
      }
    } catch (err) {
      console.error('Core Dashboard Save Failure:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdminLogin = async () => {
    const ADMIN_EMAIL = import.meta.env.PUBLIC_ADMIN_EMAIL || 'abhayrana8272@gmail.com';
    const ADMIN_PASSWORD = import.meta.env.PUBLIC_ADMIN_PASSWORD || 'vexor@#005';
    
    // Check root admin credentials first (no blocking database call required)
    if (adminLoginForm.email === ADMIN_EMAIL && adminLoginForm.password === ADMIN_PASSWORD) {
       setIsAdminLoggedIn(true);
       setIsSaving(true);
       
       let adminProfile: any = null;
       try {
          const userRes = await BaseCrudService.getAll<UserProfiles>('userprofiles');
          adminProfile = userRes.items.find(u => u.email === adminLoginForm.email);
       } catch (dbErr) {
          console.warn('Database offline, proceeding with default root admin profile:', dbErr);
       }

       const rootAdminUser = {
         _id: adminProfile?._id || 'root-admin',
         fullName: adminProfile?.fullName || 'Root Administrator',
         email: ADMIN_EMAIL,
         role: 'admin',
         profilePhoto: adminProfile?.profilePhoto
       };
       setActiveAdminUser(rootAdminUser as any);
        const finalName = adminProfile?.fullName || localStorage.getItem('adminProfileName') || 'Root Administrator';
        const finalAvatar = adminProfile?.profilePhoto || localStorage.getItem('adminProfileAvatar') || null;
        setAdminName(finalName);
        setAdminAvatar(finalAvatar);
        localStorage.setItem('adminProfileName', finalName);
        if (finalAvatar) {
          localStorage.setItem('adminProfileAvatar', finalAvatar);
        } else {
          localStorage.removeItem('adminProfileAvatar');
        }
       setIsSaving(false);
       return;
    } 

    setIsSaving(true);
    try {
       const userRes = await BaseCrudService.getAll<UserProfiles>('userprofiles');
       const user = userRes.items.find(u => u.email === adminLoginForm.email && u.passwordHash === adminLoginForm.password);
       
       if (user && user.role === 'admin') {
          setIsAdminLoggedIn(true);
          setActiveAdminUser(user);
           const finalName = user.fullName || localStorage.getItem('adminProfileName') || 'Administrator';
           const finalAvatar = user.profilePhoto || localStorage.getItem('adminProfileAvatar') || null;
           setAdminName(finalName);
           setAdminAvatar(finalAvatar);
           localStorage.setItem('adminProfileName', finalName);
           if (finalAvatar) {
             localStorage.setItem('adminProfileAvatar', finalAvatar);
           } else {
             localStorage.removeItem('adminProfileAvatar');
           }
       } else if (user) {
          setLoginError('Insufficient neural clearance. Admin role required.');
       } else {
          setLoginError('Invalid transmission credentials.');
       }
    } catch (err) {
       console.error('Login synchronization error:', err);
       setLoginError('Neural link failure. Database may be offline.');
    } finally {
       setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
         <style>{GLASS_STYLES}</style>

         {/* Cinematic Background Video */}
         <div className="absolute inset-0 z-0 pointer-events-none">
           <FadingVideo
             src={LOGIN_VIDEO}
             className="absolute inset-0 w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
         </div>
         
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="w-full max-w-md relative z-10"
         >
           <div className="liquid-glass p-8 md:p-12 space-y-8 rounded-[2rem] border-white/5">
              <div className="text-center space-y-4">
                 <h1 className="text-4xl text-white tracking-tight leading-none uppercase font-light italic" style={SERIF}>
                   Root Registry
                 </h1>
                 <p className="text-[9px] uppercase tracking-[0.3em] text-white/40">Secure verification required</p>
              </div>

              <div className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-white/30 pl-3 border-l border-white/20">Identity</label>
                    <input 
                      type="email" 
                      placeholder="Admin Email"
                      value={adminLoginForm.email}
                      onChange={(e) => setAdminLoginForm({...adminLoginForm, email: e.target.value})}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3.5 focus:border-white/20 focus:bg-white/[0.04] outline-none transition-all text-sm font-light text-white"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-white/30 pl-3 border-l border-white/20">Encryption Key</label>
                    <input 
                      type="password" 
                      placeholder="Admin Password"
                      value={adminLoginForm.password}
                      onChange={(e) => setAdminLoginForm({...adminLoginForm, password: e.target.value})}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3.5 focus:border-white/20 focus:bg-white/[0.04] outline-none transition-all text-sm font-light text-white"
                    />
                 </div>
                 {loginError && <p className="text-[10px] text-red-400 uppercase tracking-widest text-center">{loginError}</p>}
                 
                 <button 
                   onClick={handleAdminLogin}
                   className="w-full bg-white text-black rounded-full py-4 text-xs font-semibold uppercase tracking-widest hover:bg-white/95 transition-colors cursor-pointer"
                 >
                    Initialize Session
                 </button>
              </div>
           </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white selection:bg-white/20 overflow-hidden">
      <style>{GLASS_STYLES}</style>

      {/* LEFT SIDEBAR - Desktop */}
      <aside className="w-80 flex-shrink-0 hidden lg:block z-40 relative">
        <Sidebar onSetActiveTab={setActiveTab} activeTab={activeTab} adminName={adminName} adminAvatar={adminAvatar} onUpdateAdminProfile={handleUpdateAdminProfile} />
      </aside>

      {/* LEFT SIDEBAR - Mobile (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsMobileMenuOpen(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 lg:hidden" 
            />
            <motion.aside 
               initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden border-r border-white/5 bg-black"
            >
               <Sidebar onSetActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} activeTab={activeTab} adminName={adminName} adminAvatar={adminAvatar} onUpdateAdminProfile={handleUpdateAdminProfile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full w-full bg-black">
        {/* TOPBAR */}
        <Topbar member={member} adminName={adminName} adminAvatar={adminAvatar} isDbConnected={isDbConnected} onToggleSidebar={() => setIsMobileMenuOpen(true)} />

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 no-scrollbar admin-dark-panel">
          <div className="lg:max-w-[80vw] mx-auto space-y-12 pb-24">
            
            {/* View Orchestrator */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-96 flex items-center justify-center"
                >
                   <div className="flex flex-col items-center gap-6">
                      <LoadingSpinner />
                      <p className="text-[10px] font-light uppercase tracking-[0.25em] text-white/30 animate-pulse">Syncing registry matrices...</p>
                   </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {activeTab === 'stats' && <StatsOverview stats={{ 
                    projects: projects.length, 
                    users: users.length, 
                    enquiries: enquiries.length,
                    blogs: blogs.length
                  }} />}

                  {activeTab === 'projects' && (
                    <ProjectManager 
                      projects={projects} 
                      onAddNew={handleAddNew}
                      onEdit={handleEdit}
                      onDelete={(id) => deleteItem(id, 'projects')}
                    />
                  )}

                  {activeTab === 'services' && (
                    <ServiceManager 
                      services={services} 
                      onAddNew={handleAddNew}
                      onEdit={handleEdit}
                      onDelete={(id) => deleteItem(id, 'services')}
                    />
                  )}

                  {activeTab === 'blogs' && (
                    <BlogManager 
                      blogs={blogs} 
                      onAddNew={handleAddNew}
                      onEdit={handleEdit}
                      onDelete={(id) => deleteItem(id, 'blogs')}
                    />
                  )}

                  {activeTab === 'enquiries' && (
                    <EnquiryManager 
                      enquiries={enquiries} 
                      onDelete={(id) => deleteItem(id, 'enquiries')}
                      onUpdateEnquiry={(id, updates) => {
                         const enquiry = enquiries.find(e => e._id === id);
                         if (enquiry) saveItem('enquiries', { ...enquiry, ...updates }, id);
                      }}
                    />
                  )}

                  {activeTab === 'team' && (
                    <TeamManager 
                      team={teamMembers} 
                      onAddNew={handleAddNew}
                      onEdit={handleEdit}
                      onDelete={(id) => deleteItem(id, 'teammembers')}
                    />
                  )}

                  {activeTab === 'users' && (
                    <UserManager 
                      users={users} 
                      onEdit={handleEdit}
                      onDelete={(id) => deleteItem(id, 'userprofiles')}
                    />
                  )}

                  {activeTab === 'testimonials' && (
                    <TestimonialManager 
                      testimonials={testimonials} 
                      onAddNew={handleAddNew}
                      onEdit={handleEdit}
                      onDelete={(id) => deleteItem(id, 'testimonials')}
                    />
                  )}

                  {activeTab === 'scanner' && (
                    <ScannerView />
                  )}

                  {activeTab === 'logs' && (
                    <AuditLogManager logs={auditLogs} />
                  )}

                  {!['stats', 'projects', 'services', 'blogs', 'enquiries', 'team', 'users', 'testimonials', 'scanner', 'logs'].includes(activeTab) && (
                    <div className="liquid-glass p-20 text-center opacity-30 font-light uppercase tracking-[0.25em] text-xs">
                       View Node: {activeTab.toUpperCase()} Offline
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* CRUD DIALOG PLACEHOLDER */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setSelectedItem(null);
      }}>
        <DialogContent className="liquid-glass border-white/5 bg-black/95 w-[95vw] md:w-full md:max-w-2xl max-h-[85vh] !overflow-y-auto no-scrollbar mx-auto p-8 rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white font-medium uppercase italic" style={SERIF}>
              {selectedItem ? 'Update Node' : 'Initialize Node'}
            </DialogTitle>
          </DialogHeader>
          
          {activeTab === 'projects' && (
             <ProjectForm project={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {activeTab === 'services' && (
             <ServiceForm service={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {activeTab === 'blogs' && (
             <BlogForm blog={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {activeTab === 'team' && (
             <TeamForm member={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {activeTab === 'users' && (
             <UserForm user={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {activeTab === 'testimonials' && (
             <TestimonialForm testimonial={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {!['projects', 'services', 'blogs', 'team', 'users', 'testimonials'].includes(activeTab) && (
            <div className="py-12 text-center space-y-6">
               <LoadingSpinner />
               <p className="text-[10px] font-light uppercase text-white/40 tracking-widest">
                  Initializing controller interfaces...
               </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
