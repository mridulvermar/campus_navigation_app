import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { EmergencyWidget } from '../components/common/EmergencyWidget';
import { HelpCircle, Phone, Mail, ShieldAlert, MessageSquare } from 'lucide-react';

export const HelpCenterPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-cyan-400" /> Help Center & Emergency Contacts
        </h1>
        <p className="text-xs text-slate-400">24/7 Campus safety hotline, spatial system guide, and technical support</p>
      </div>

      <EmergencyWidget />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-base font-bold text-white mb-3">Campus Security & Escort Service</h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-400" />
              <span>Emergency Dispatch: +1 (555) 911-CAMPUS</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Night Walk Security Escort: +1 (555) 019-WALK</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Security Office: security@campus.edu</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-base font-bold text-white mb-3">IT & Spatial Support Desk</h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Helpdesk Extension: x4000</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Email: helpdesk@campus.edu</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Hours: Mon - Fri (08:00 AM - 08:00 PM)</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
