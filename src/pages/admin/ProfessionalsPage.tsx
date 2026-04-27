import React, { useState, useRef } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Card, AnimatedCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2, Edit2, Upload, X, CheckCircle2 } from 'lucide-react';
import { Professional } from '../../types';
import { compressImage } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function ProfessionalsPage() {
  const { professionals, services, addProfessional, updateProfessional, removeProfessional } = useAppStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Simple form state
  const [formData, setFormData] = useState<Omit<Professional, 'id'>>({
    name: '',
    photoUrl: '', // Will use default placeholder if empty
    phone: '',
    email: '',
    specialties: [],
    availability: { days: [1,2,3,4,5], startHour: '09:00', endHour: '18:00' }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const toggleSpecialty = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(serviceId)
        ? prev.specialties.filter(id => id !== serviceId)
        : [...prev.specialties, serviceId]
    }));
  };

  const toggleDay = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(dayIndex)
          ? prev.availability.days.filter(d => d !== dayIndex)
          : [...prev.availability.days, dayIndex]
      }
    }));
  };

  const handleOpenModal = () => {
    setIsEditing(null);
    setFormData({
      name: '',
      photoUrl: '',
      phone: '',
      email: '',
      specialties: [],
      availability: { days: [1,2,3,4,5], startHour: '09:00', endHour: '18:00' }
    });
    setIsModalOpen(true);
  };

  const handleEdit = (p: Professional) => {
    setFormData(p);
    setIsEditing(p.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setIsEditing(null), 300); // clear after animation
  };

  const handleSave = () => {
    if (!formData.name) return;
    
    const saveData = {
        ...formData,
        photoUrl: formData.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}&backgroundColor=d946ef`
    };

    if (isEditing) {
      updateProfessional(isEditing, saveData);
    } else {
      addProfessional(saveData);
    }
    
    handleCloseModal();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Compress and resize
      const base64image = await compressImage(file, 400, 400, 0.8);
      setFormData(prev => ({ ...prev, photoUrl: base64image }));
    } catch (err) {
      console.error("Failed to process image", err);
      alert("Erro ao processar imagem.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-deep-purple">Profissionais</h1>
          <p className="text-text-muted mt-1">Gerencie a equipe do salão.</p>
        </div>
        <Button onClick={handleOpenModal} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Professional
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((p, i) => (
          <AnimatedCard key={p.id} delay={i * 0.1} className="flex flex-col gap-4 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-accent-pink overflow-hidden shrink-0">
                <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{p.name}</h3>
                <p className="text-sm text-text-muted">
                  {p.specialties.map(sid => services.find(s => s.id === sid)?.name).filter(Boolean).join(', ') || 'Nenhuma'}
                </p>
              </div>
            </div>

            <div className="text-sm text-white/80 space-y-1">
              {p.phone && <p>📞 {p.phone}</p>}
              {p.email && <p>✉️ {p.email}</p>}
              <p>🕒 {p.availability.startHour} - {p.availability.endHour}</p>
            </div>

            <div className="flex gap-2 mt-auto pt-4 border-t border-border-theme">
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleEdit(p)}>
                <Edit2 className="w-3 h-3 mr-1" /> Editar
              </Button>
              <Button size="sm" variant="danger" className="text-xs px-3" onClick={() => removeProfessional(p.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1c1524] rounded-[32px] p-8 shadow-2xl border border-border-theme max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-serif font-bold text-deep-purple mb-6">
                {isEditing ? 'Editar Profissional' : 'Adicionar Nova Profissional'}
              </h2>

              <div className="space-y-6">
                {/* Image Upload Area */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-[24px] bg-[#2a1d35] border border-border-theme">
                  <div className="w-24 h-24 rounded-full bg-border-theme border-2 border-accent-pink overflow-hidden flex items-center justify-center shrink-0 shrink-0">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-8 h-8 text-text-muted" />
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-white mb-1">Foto de Perfil</h3>
                    <p className="text-xs text-text-muted mb-3">Sugerido: Imagem quadrada 400x400px. Máximo 5MB (JPG, PNG, WEBP).</p>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png, image/webp" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Processando...' : 'Upload Photo'}
                    </Button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <Input 
                    label="Nome Completo *" 
                    placeholder="Ex: Ana Clara"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                  <Input 
                    label="Telefone" 
                    placeholder="+258 84..."
                    type="tel"
                    value={formData.phone || ''} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                  <Input 
                    label="Email" 
                    placeholder="email@exemplo.com"
                    type="email"
                    className="sm:col-span-2"
                    value={formData.email || ''} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-3">Service Category</label>
                  <div className="flex flex-wrap gap-2">
                    {services.map(s => {
                      const isSelected = formData.specialties.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => toggleSpecialty(s.id)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                            isSelected 
                              ? "bg-[rgba(217,70,239,0.15)] border-accent-pink text-accent-pink"
                              : "bg-[#2a1d35] border-transparent text-text-main hover:border-border-theme"
                          )}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />}
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                   <label className="block text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-3">Working Days</label>
                   <div className="flex flex-wrap gap-2">
                     {daysOfWeek.map((day, index) => {
                       const isSelected = formData.availability.days.includes(index);
                       return (
                         <button
                           key={index}
                           onClick={() => toggleDay(index)}
                           className={cn(
                             "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold border transition-all",
                             isSelected
                               ? "bg-accent-pink border-accent-pink text-white shadow-[0_4px_12px_rgba(217,70,239,0.3)]"
                               : "bg-[#2a1d35] border-transparent text-text-muted hover:border-border-theme"
                           )}
                         >
                           {day}
                         </button>
                       );
                     })}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6 bg-[#2a1d35] p-6 rounded-[24px] border border-border-theme">
                  <Input 
                    label="Available Hours (Start)" 
                    type="time" 
                    value={formData.availability.startHour}
                    onChange={e => setFormData({...formData, availability: {...formData.availability, startHour: e.target.value}})}
                  />
                  <Input 
                    label="Available Hours (End)" 
                    type="time" 
                    value={formData.availability.endHour}
                    onChange={e => setFormData({...formData, availability: {...formData.availability, endHour: e.target.value}})}
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <Button variant="ghost" className="flex-1" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={handleSave} disabled={!formData.name || isUploading}>
                    {isEditing ? 'Salvar Alterações' : 'Confirmar Adição'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
