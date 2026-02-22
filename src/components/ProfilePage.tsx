import { useState } from 'react';
import { format } from 'date-fns';
import { useStore } from '../store/useStore';
import { BoyIcon, GirlIcon } from './Icons';
import { formatBabyAge } from '../utils/helpers';
import type { BabyGender } from '../types';

export function ProfilePage() {
  const { profiles, activeBabyId, addProfile, updateProfile, removeProfile, setActiveBaby } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<BabyGender>('boy');
  const [dob, setDob] = useState(format(new Date(), 'yyyy-MM-dd'));

  const resetForm = () => {
    setName('');
    setGender('boy');
    setDob(format(new Date(), 'yyyy-MM-dd'));
    setShowForm(false);
    setEditId(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editId) {
      updateProfile(editId, { name: name.trim(), gender, dateOfBirth: dob });
    } else {
      addProfile({ name: name.trim(), gender, dateOfBirth: dob });
    }
    resetForm();
  };

  const handleEdit = (id: string) => {
    const profile = profiles.find((p) => p.id === id);
    if (!profile) return;
    setEditId(id);
    setName(profile.name);
    setGender(profile.gender);
    setDob(profile.dateOfBirth);
    setShowForm(true);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-warm-brown">Baby Profiles</h2>
          <p className="text-xs text-warm-gray">Manage your little ones</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-1.5 rounded-xl bg-rose text-white font-semibold text-xs hover:bg-rose-dark transition-colors shadow-sm"
          >
            + Add Baby
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blush/10 space-y-3">
          <h3 className="text-sm font-bold text-warm-brown">
            {editId ? 'Edit Profile' : 'New Baby'}
          </h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Baby's name *"
            className="w-full bg-cream rounded-xl px-3 py-2.5 text-sm text-warm-brown placeholder:text-warm-gray/50 border-2 border-transparent focus:border-rose/40 outline-none"
          />

          {/* Gender */}
          <div>
            <label className="text-xs font-semibold text-warm-brown mb-2 block">Gender</label>
            <div className="flex gap-3">
              <button
                onClick={() => setGender('boy')}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  gender === 'boy'
                    ? 'bg-sky border-2 border-sky-dark text-warm-brown shadow-sm'
                    : 'bg-cream border-2 border-transparent text-warm-gray'
                }`}
              >
                <BoyIcon size={24} /> Boy
              </button>
              <button
                onClick={() => setGender('girl')}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  gender === 'girl'
                    ? 'bg-blush border-2 border-blush-dark text-warm-brown shadow-sm'
                    : 'bg-cream border-2 border-transparent text-warm-gray'
                }`}
              >
                <GirlIcon size={24} /> Girl
              </button>
            </div>
          </div>

          {/* DOB */}
          <div>
            <label className="text-xs font-semibold text-warm-brown mb-1 block">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-cream rounded-xl px-3 py-2.5 text-sm text-warm-brown border-2 border-transparent focus:border-rose/40 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 py-2.5 rounded-xl border-2 border-blush/40 text-warm-gray font-semibold text-sm hover:bg-cream transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 py-2.5 rounded-xl bg-rose text-white font-semibold text-sm hover:bg-rose-dark transition-colors shadow-md disabled:opacity-40"
            >
              {editId ? 'Update' : 'Add Baby'}
            </button>
          </div>
        </div>
      )}

      {/* Profiles list */}
      {profiles.length > 0 ? (
        <div className="space-y-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all cursor-pointer ${
                profile.id === activeBabyId
                  ? 'border-rose/40 ring-2 ring-rose/20'
                  : 'border-blush/10 hover:border-blush/30'
              }`}
              onClick={() => setActiveBaby(profile.id)}
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  {profile.gender === 'boy' ? <BoyIcon size={48} /> : <GirlIcon size={48} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-warm-brown">{profile.name}</h3>
                    {profile.id === activeBabyId && (
                      <span className="px-2 py-0.5 rounded-full bg-rose/20 text-rose-dark text-[10px] font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-warm-gray">
                    {formatBabyAge(profile.dateOfBirth)}
                  </p>
                  <p className="text-xs text-warm-gray/60">
                    Born {format(new Date(profile.dateOfBirth), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(profile.id); }}
                    className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-warm-gray hover:text-warm-brown hover:bg-lavender/30 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {profiles.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeProfile(profile.id); }}
                      className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-warm-gray hover:text-rose-dark hover:bg-blush/30 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-10">
            <div className="flex justify-center gap-2 mb-3 opacity-50">
              <BoyIcon size={48} />
              <GirlIcon size={48} />
            </div>
            <p className="text-warm-gray text-sm font-medium">No babies added yet</p>
            <p className="text-warm-gray/60 text-xs mt-1">Add your little one to get started</p>
          </div>
        )
      )}
    </div>
  );
}
