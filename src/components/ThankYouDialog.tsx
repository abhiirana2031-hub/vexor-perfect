import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface ThankYouDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThankYouDialog({ isOpen, onClose }: ThankYouDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background border-secondary/30 shadow-2xl">
        <DialogHeader className="text-center space-y-4 pt-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl"></div>
              <CheckCircle2 className="h-16 w-16 text-secondary relative animate-bounce" />
            </div>
          </div>
          
          <DialogTitle className="text-3xl font-bold text-primary-foreground">
            Thank You!
          </DialogTitle>
          
          <DialogDescription className="text-base text-foreground/70 leading-relaxed space-y-3">
            <p>
              Thank you for contacting us. We have received your message and appreciate you reaching out.
            </p>
            <p>
              Our team will review your inquiry and get back to you as soon as possible.
            </p>
            <p className="text-sm text-secondary">
              We'll connect with you soon!
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-8 pb-6">
          <Button
            onClick={onClose}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105"
          >
            Got It!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
