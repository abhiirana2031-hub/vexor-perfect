import { AuditLogs } from '@/entities';
import { motion } from 'framer-motion';
import { Shield, Clock, User, Activity, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AuditLogManagerProps {
  logs: AuditLogs[];
}

export const AuditLogManager = ({ logs }: AuditLogManagerProps) => {
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'text-green-500 bg-green-500/10';
      case 'UPDATE': return 'text-blue-500 bg-blue-500/10';
      case 'DELETE': return 'text-destructive bg-destructive/10';
      default: return 'text-foreground/40 bg-white/5';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/20 bg-secondary/10">
          <Shield className="w-3 h-3 text-secondary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Security Protocol Audit</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter uppercase italic">Neural Activity Logs</h2>
        <p className="text-foreground/40 text-sm font-medium">Real-time surveillance of administrative maneuvers and state transitions.</p>
      </div>

      <div className="space-y-4">
        {sortedLogs.length === 0 ? (
          <Card className="border-white/5 bg-white/[0.02] p-20 text-center">
            <CardContent>
               <FileText className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20">No archived signals found in current matrix</p>
            </CardContent>
          </Card>
        ) : (
          sortedLogs.map((log, index) => (
            <motion.div
              key={log._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              <Card className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className={`p-4 rounded-2xl ${getActionColor(log.action)}`}>
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                          <h4 className="font-heading font-black text-lg tracking-tight uppercase italic">{log.description}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            <span>Operative: {log.actorName}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3 h-3" />
                            <span>Node: {log.collectionId}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-foreground/20">
                            <span>Token: {log.itemId}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 border border-white/5 bg-white/[0.02] rounded-xl whitespace-nowrap">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span className="text-[10px] font-black font-mono text-secondary">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
