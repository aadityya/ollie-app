import { useState } from 'react';
import { format } from 'date-fns';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { BoyIcon, GirlIcon } from './Icons';
import { formatBabyAge, DEFAULT_CHECKLIST_ITEMS } from '../utils/helpers';
import type { BabyGender, ThemeName } from '../types';

const THEMES: { name: ThemeName; label: string; swatch: string; border: string }[] = [
  { name: 'default', label: 'Warm', swatch: 'bg-[#FFD6E0]', border: 'border-[#FFB8CC]' },
  { name: 'pink', label: 'Pink', swatch: 'bg-[#FFD0DC]', border: 'border-[#FFB0C4]' },
  { name: 'blue', label: 'Blue', swatch: 'bg-[#C8DCFF]', border: 'border-[#A8C8F8]' },
  { name: 'green', label: 'Green', swatch: 'bg-[#C8F0D4]', border: 'border-[#A8E0B8]' },
  { name: 'lavender', label: 'Lavender', swatch: 'bg-[#D8C8F0]', border: 'border-[#C4B0E8]' },
  { name: 'mono', label: 'Mono', swatch: 'bg-[#E0E0E0]', border: 'border-[#CCCCCC]' },
];

export function ProfilePage() {
  const { profiles, activeBabyId, addProfile, updateProfile, removeProfile, setActiveBaby, getActiveBaby } = useStore(useShallow((s) => ({ profiles: s.profiles, activeBabyId: s.activeBabyId, addProfile: s.addProfile, updateProfile: s.updateProfile, removeProfile: s.removeProfile, setActiveBaby: s.setActiveBaby, getActiveBaby: s.getActiveBaby })));
  const activeBaby = getActiveBaby();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<BabyGender>('boy');
  const [dob, setDob] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newCheckItem, setNewCheckItem] = useState('');

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
      addProfile({ name: name.trim(), gender, dateOfBirth: dob, theme: 'default', checklistItems: [...DEFAULT_CHECKLIST_ITEMS] });
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

  const handleThemeChange = (theme: ThemeName) => {
    if (!activeBabyId) return;
    updateProfile(activeBabyId, { theme });
  };

  const handleAddCheckItem = () => {
    if (!newCheckItem.trim() || !activeBaby) return;
    const items = activeBaby.checklistItems || [...DEFAULT_CHECKLIST_ITEMS];
    if (items.includes(newCheckItem.trim())) return;
    updateProfile(activeBaby.id, { checklistItems: [...items, newCheckItem.trim()] });
    setNewCheckItem('');
  };

  const handleRemoveCheckItem = (item: string) => {
    if (!activeBaby) return;
    const items = (activeBaby.checklistItems || [...DEFAULT_CHECKLIST_ITEMS]).filter((i) => i !== item);
    updateProfile(activeBaby.id, { checklistItems: items });
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
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

      {/* Theme Picker — only show when a baby is active */}
      {activeBaby && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blush/10">
          <h3 className="text-sm font-bold text-warm-brown mb-1">Theme</h3>
          <p className="text-xs text-warm-gray mb-3">Pick a color palette for {activeBaby.name}</p>
          <div className="flex gap-3 justify-center">
            {THEMES.map((t) => {
              const isActive = (activeBaby.theme || 'default') === t.name;
              return (
                <button
                  key={t.name}
                  onClick={() => handleThemeChange(t.name)}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className={`w-10 h-10 rounded-full ${t.swatch} border-2 transition-all ${
                    isActive
                      ? `${t.border} ring-2 ring-offset-2 ring-rose/40 scale-110`
                      : 'border-transparent group-hover:scale-105'
                  }`} />
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-warm-brown' : 'text-warm-gray'}`}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Checklist Items Manager */}
      {activeBaby && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blush/10">
          <h3 className="text-sm font-bold text-warm-brown mb-1">Daily Checklist</h3>
          <p className="text-xs text-warm-gray mb-3">Manage {activeBaby.name}'s daily activities</p>

          {/* Add new item */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newCheckItem}
              onChange={(e) => setNewCheckItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCheckItem()}
              placeholder="Add new activity..."
              className="flex-1 bg-cream rounded-xl px-3 py-2 text-sm text-warm-brown placeholder:text-warm-gray/50 border-2 border-transparent focus:border-rose/40 outline-none"
            />
            <button
              onClick={handleAddCheckItem}
              disabled={!newCheckItem.trim()}
              className="px-3 py-2 rounded-xl bg-rose text-white font-semibold text-sm hover:bg-rose-dark transition-colors disabled:opacity-40"
            >
              Add
            </button>
          </div>

          {/* Items list */}
          <div className="space-y-1.5">
            {(activeBaby.checklistItems || [...DEFAULT_CHECKLIST_ITEMS]).map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 bg-cream/60 rounded-lg px-3 py-2 group"
              >
                <span className="flex-1 text-sm text-warm-brown">{item}</span>
                <button
                  onClick={() => handleRemoveCheckItem(item)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-warm-gray hover:text-rose-dark"
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
