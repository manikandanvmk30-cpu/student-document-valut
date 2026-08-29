import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Award, 
  Edit3, 
  Save, 
  Check, 
  Code2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ProfileViewProps {
  onNavigate: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { studentProfile, updateStudentProfile, documents } = useVault();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(studentProfile.name);
  const [email, setEmail] = useState(studentProfile.email);
  const [phone, setPhone] = useState(studentProfile.phone);
  const [department, setDepartment] = useState(studentProfile.department);
  const [college, setCollege] = useState(studentProfile.college);
  const [skillsInput, setSkillsInput] = useState(studentProfile.skills.join(', '));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeDocs = documents.filter(d => !d.isRecycled && !d.isArchived);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name,
      email,
      phone,
      department,
      college,
      skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean)
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-extrabold text-white">My Profile</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal profile, credentials, contact information, and skills.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition shrink-0"
        >
          <Edit3 className="w-4 h-4 text-indigo-400" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 border-2 border-indigo-400/60 overflow-hidden shadow-xl shrink-0 flex items-center justify-center font-bold text-2xl text-white">
              {studentProfile.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">{studentProfile.name}</h3>
              <p className="text-xs text-indigo-300 font-mono font-semibold">ID: {studentProfile.studentId} • Reg: {studentProfile.regNo}</p>
              <p className="text-xs text-slate-400">{studentProfile.department}</p>
            </div>
          </div>

          <div className="p-2 bg-white rounded-xl shadow self-start sm:self-center">
            <QRCodeSVG value={`${window.location.origin}/profile/${studentProfile.studentId}`} size={64} level="M" />
          </div>
        </div>

        {/* View vs Edit Form */}
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            <div className="space-y-4">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Personal & Contact Information
              </h4>

              <div className="space-y-2.5">
                <div className="flex items-center space-x-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Email Address</span>
                    <span className="text-slate-200 font-mono">{studentProfile.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Phone Number</span>
                    <span className="text-slate-200 font-mono">{studentProfile.phone}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                  <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Institution / College</span>
                    <span className="text-slate-200">{studentProfile.college}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Stored Certifications & Skills
              </h4>

              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Total Stored Certificates:</span>
                  <span className="font-bold text-indigo-300 font-mono text-sm">{activeDocs.length}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1.5">Key Skills & Specializations</span>
                  <div className="flex flex-wrap gap-1.5">
                    {studentProfile.skills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Department *</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">College / Organization *</label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};
