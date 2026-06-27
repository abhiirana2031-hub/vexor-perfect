import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Projects as ProjectType } from '@/entities';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface ProjectFormProps {
  project?: ProjectType | null;
  onSave: (data: Partial<ProjectType>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const ProjectForm = ({ project, onSave, onCancel, isSaving }: ProjectFormProps) => {
  const [formData, setFormData] = useState<Partial<ProjectType>>({
    projectTitle: project?.projectTitle || '',
    projectDescription: project?.projectDescription || '',
    technologiesUsed: project?.technologiesUsed || '',
    projectImage: project?.projectImage || '',
    projectUrl: project?.projectUrl || '',
    repoUrl: project?.repoUrl || '',
    projectStatus: project?.projectStatus || 'active',
    clientName: project?.clientName || '',
    isFeatured: project?.isFeatured || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-6">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Title */}
        <motion.div variants={itemVariants} className="space-y-2 group">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary group-focus-within:text-secondary group-focus-within:border-secondary transition-colors">Deployment Name</Label>
          <Input 
            value={formData.projectTitle}
            onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
            placeholder="e.g., Cyber-Neural Interface"
            className="bg-white/[0.02] border-white/10 rounded-xl focus:border-secondary focus:bg-secondary/5 transition-all focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]"
            required
          />
        </motion.div>

        {/* Tech Stack */}
        <motion.div variants={itemVariants} className="space-y-2 group">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary group-focus-within:text-secondary group-focus-within:border-secondary transition-colors">Core Engine / Tech Stack</Label>
          <Input 
            value={formData.technologiesUsed}
            onChange={(e) => setFormData({...formData, technologiesUsed: e.target.value})}
            placeholder="React, Tailwind, Astro"
            className="bg-white/[0.02] border-white/10 rounded-xl focus:border-secondary focus:bg-secondary/5 transition-all focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]"
          />
        </motion.div>

        {/* Image URL / Local Upload */}
        <motion.div variants={itemVariants} className="space-y-2 md:col-span-2 group">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary group-focus-within:text-secondary group-focus-within:border-secondary transition-colors">Visual Node (Image URL / Local Upload)</Label>
          <div className="p-1 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
            <ImageUpload 
              value={formData.projectImage || ''}
              onChange={(url) => setFormData({...formData, projectImage: url})}
            />
          </div>
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants} className="space-y-2 md:col-span-2 group">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary group-focus-within:text-secondary group-focus-within:border-secondary transition-colors">Mission Parameters (Description)</Label>
          <Textarea 
            value={formData.projectDescription}
            onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
            placeholder="Describe the project mission and results..."
            className="bg-white/[0.02] border-white/10 rounded-xl min-h-[120px] focus:border-secondary focus:bg-secondary/5 transition-all focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]"
          />
        </motion.div>

        {/* Live Link */}
        <motion.div variants={itemVariants} className="space-y-2 group">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary group-focus-within:text-secondary group-focus-within:border-secondary transition-colors">Neural Deployment Link (Live)</Label>
          <Input 
            value={formData.projectUrl}
            onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
            placeholder="https://..."
            className="bg-white/[0.02] border-white/10 rounded-xl focus:border-secondary focus:bg-secondary/5 transition-all focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]"
          />
        </motion.div>

        {/* Repo Link */}
        <motion.div variants={itemVariants} className="space-y-2 group">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary group-focus-within:text-secondary group-focus-within:border-secondary transition-colors">Source Code Repository (GitHub)</Label>
          <Input 
            value={formData.repoUrl}
            onChange={(e) => setFormData({...formData, repoUrl: e.target.value})}
            placeholder="https://github.com/..."
            className="bg-white/[0.02] border-white/10 rounded-xl focus:border-secondary focus:bg-secondary/5 transition-all focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]"
          />
        </motion.div>

        {/* Client */}
        <motion.div variants={itemVariants} className="space-y-2 group">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary group-focus-within:text-secondary group-focus-within:border-secondary transition-colors">Partner Organization (Client)</Label>
          <Input 
            value={formData.clientName}
            onChange={(e) => setFormData({...formData, clientName: e.target.value})}
            placeholder="Project Partner"
            className="bg-white/[0.02] border-white/10 rounded-xl focus:border-secondary focus:bg-secondary/5 transition-all focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]"
          />
        </motion.div>

        {/* Status */}
        <motion.div variants={itemVariants} className="space-y-2 group">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary group-focus-within:text-secondary group-focus-within:border-secondary transition-colors">Deployment Status</Label>
          <select 
            value={formData.projectStatus}
            onChange={(e) => setFormData({...formData, projectStatus: e.target.value})}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 focus:border-secondary focus:bg-secondary/5 transition-all focus:shadow-[0_0_15px_rgba(0,245,255,0.1)] outline-none text-sm"
          >
            <option value="active">ACTIVE</option>
            <option value="completed">COMPLETED</option>
            <option value="on-hold">ON HOLD</option>
          </select>
        </motion.div>

        {/* Featured Toggle */}
        <motion.div variants={itemVariants} className="space-y-4 md:col-span-2 pt-4">
           <div 
             onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
             className={`p-6 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
               formData.isFeatured ? 'bg-secondary/10 border-secondary shadow-neon-cyan' : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
             }`}
           >
              <div className="space-y-1">
                 <p className="text-sm font-bold tracking-tight">FEATURE ON HOMEPAGE</p>
                 <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Highlight this deployment in the Featured Projects section.</p>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.isFeatured ? 'bg-secondary' : 'bg-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]'}`}>
                 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${formData.isFeatured ? 'left-7 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'left-1'}`} />
              </div>
           </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end gap-6 pt-10 border-t border-white/5 relative"
      >
        <button 
          type="button"
          onClick={onCancel}
          className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-white hover:bg-white/5 px-6 py-3 rounded-full transition-all"
        >
          Cancel Operation
        </button>
        <button 
          type="submit"
          disabled={isSaving}
          className="futuristic-button px-10"
        >
          <span className="relative z-10">
            {isSaving ? 'Synchronizing...' : project ? 'Update Node' : 'Initialize Node'}
          </span>
          <div className="btn-glow" />
        </button>
      </motion.div>
    </form>
  );
};
