import React, { useState } from 'react';
import { Services as ServiceType } from '@/entities';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface ServiceFormProps {
  service?: ServiceType | null;
  onSave: (data: Partial<ServiceType>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const ServiceForm = ({ service, onSave, onCancel, isSaving }: ServiceFormProps) => {
  const [formData, setFormData] = useState<Partial<ServiceType>>({
    serviceName: service?.serviceName || '',
    serviceDescription: service?.serviceDescription || '',
    serviceIcon: service?.serviceIcon || '',
    serviceDetailedDescription: service?.serviceDetailedDescription || '',
    isFeatured: service?.isFeatured || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Architecture Title</Label>
          <Input 
            value={formData.serviceName}
            onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
            placeholder="e.g., Quantum Data Analysis"
            className="bg-white/[0.02] border-white/10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Icon/Vector Node (URL or Upload)</Label>
          <ImageUpload 
            value={formData.serviceIcon || ''}
            onChange={(url) => setFormData({...formData, serviceIcon: url})}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Brief Transmission (Short Description)</Label>
          <Textarea 
            value={formData.serviceDescription}
            onChange={(e) => setFormData({...formData, serviceDescription: e.target.value})}
            placeholder="A quick summary of the service..."
            className="bg-white/[0.02] border-white/10 rounded-xl min-h-[80px]"
            required
          />
        </div>

        {/* Featured Toggle */}
        <div className="space-y-4 md:col-span-2 pt-4">
           <div 
             onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
             className={`p-6 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
               formData.isFeatured ? 'bg-secondary/10 border-secondary shadow-neon-cyan' : 'bg-white/[0.02] border-white/10 hover:border-white/20'
             }`}
           >
              <div className="space-y-1">
                 <p className="text-sm font-bold tracking-tight">FEATURE ON HOMEPAGE</p>
                 <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Display this service in the main ecosystem overview.</p>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.isFeatured ? 'bg-secondary' : 'bg-white/10'}`}>
                 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isFeatured ? 'left-7' : 'left-1'}`} />
              </div>
           </div>
        </div>
      </div>

      <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
        <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground">Cancel</button>
        <button type="submit" disabled={isSaving} className="futuristic-button px-10">
          <span className="relative z-10">{isSaving ? 'Compiling...' : service ? 'Update Arc' : 'Initialize Arc'}</span>
          <div className="btn-glow" />
        </button>
      </div>
    </form>
  );
};
