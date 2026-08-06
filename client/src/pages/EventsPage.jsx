import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Sparkles, Calendar, MapPin, Clock, Users } from 'lucide-react';

export const EventsPage = () => {
  const events = [
    {
      id: 1,
      title: 'Annual Campus Spatial AI & Robotics Symposium 2026',
      description: 'Keynote speeches by industry leaders, live indoor navigation hackathon, and GIS spatial telemetry showcase.',
      date: '2026-08-15',
      time: '09:00 AM - 05:00 PM',
      location: 'Grand Campus Auditorium',
      organizer: 'Department of Computer Science',
      category: 'Academic Symposium',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'Innovators Startup & Maker Showcase',
      description: 'Exhibition of student 3D printing capstone projects, VR spatial walk-throughs, and drone flight demonstrations.',
      date: '2026-08-20',
      time: '11:00 AM - 04:00 PM',
      location: 'Student Activity & Union Plaza',
      organizer: 'Campus Maker Studio',
      category: 'Exhibition',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" /> Campus Academic & Cultural Events
        </h1>
        <p className="text-xs text-slate-400">Discover upcoming seminars, hackathons, and research exhibitions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((ev) => (
          <GlassCard key={ev.id} className="overflow-hidden p-0">
            <img src={ev.image} alt={ev.title} className="w-full h-48 object-cover" />
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  {ev.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {ev.date}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{ev.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> {ev.location}</span>
                <button
                  onClick={() => alert(`RSVP recorded for ${ev.title}!`)}
                  className="btn-gradient px-4 py-1.5 rounded-xl text-xs font-bold"
                >
                  Register RSVP
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
