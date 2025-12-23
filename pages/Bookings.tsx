import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../App';
import { format } from 'date-fns';
import { Calendar, Trash2, Clock, User, Download } from 'lucide-react';
import { Booking } from '../types';

const Bookings: React.FC = () => {
  const { userProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!userProfile) return;
    try {
      const data = await api.getBookings(userProfile.uid);
      data.sort((a, b) => {
        const timeA = a.sessionDate?.toDate ? a.sessionDate.toDate().getTime() : 0;
        const timeB = b.sessionDate?.toDate ? b.sessionDate.toDate().getTime() : 0;
        return timeA - timeB;
      });
      setBookings(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, [userProfile]);

  const handleCancel = async (booking: Booking) => {
    if(!window.confirm(`Cancel booking for ${booking.playerName}?`)) return;
    try {
      await api.cancelBooking(booking.id);
      fetchBookings();
    } catch (e) { alert("Failed to cancel."); }
  };

  const exportCalendar = () => {
    if (bookings.length === 0) {
      alert('No bookings to export yet.');
      return;
    }

    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const events = bookings
      .filter(b => b.sessionDate?.toDate)
      .map(b => {
        const start = b.sessionDate!.toDate();
        const end = new Date(start.getTime() + 90 * 60000); // default 90 minute block
        return [
          'BEGIN:VEVENT',
          `UID:${b.id}@muqssquash`,
          `DTSTAMP:${formatDate(new Date())}`,
          `DTSTART:${formatDate(start)}`,
          `DTEND:${formatDate(end)}`,
          `SUMMARY:${b.sessionTitle || 'Squash Session'}`,
          `DESCRIPTION:Athlete: ${b.playerName}`,
          'END:VEVENT'
        ].join('\r\n');
      });

    const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Muqs Squash Academy//Calendar Export//EN', ...events, 'END:VCALENDAR'].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'academy-bookings.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-slate-100 border-t-brand-secondary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Academy Passes</h1>
        <div className="flex items-center gap-3 flex-wrap mt-2">
          <p className="text-slate-500 font-bold text-sm">Confirmed roster entries for your family.</p>
          {bookings.length > 0 && (
            <button
              onClick={exportCalendar}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-card hover:bg-slate-800 transition-colors"
            >
              <Download size={14} />
              Export Calendar
            </button>
          )}
        </div>
      </header>
      
      {bookings.length === 0 ? (
        <div className="bg-white border border-slate-100 p-12 rounded-[2.5rem] text-center shadow-premium">
          <Calendar size={40} className="mx-auto text-slate-100 mb-4" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No Active Bookings</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => {
            const date = booking.sessionDate?.toDate ? booking.sessionDate.toDate() : null;
            const isPast = date ? date < new Date() : false;
            
            return (
              <div key={booking.id} className={`bg-white border p-6 rounded-[2.5rem] shadow-premium flex justify-between items-center transition-all ${isPast ? 'opacity-50 border-slate-50' : 'border-slate-100'}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-brand-secondary/10 px-3 py-1 rounded-full w-fit">
                    <User size={12} className="text-brand-secondary" />
                    <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">{booking.playerName}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">{booking.sessionTitle}</h3>
                  <div className="flex items-center text-slate-400 text-[10px] font-black gap-3 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {date ? format(date, 'MMM do') : ''}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {date ? format(date, 'h:mm a') : ''}</span>
                  </div>
                </div>
                
                {!isPast && (
                  <button onClick={() => handleCancel(booking)} className="p-4 bg-red-50 text-red-400 hover:text-red-600 rounded-2xl transition-all">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;