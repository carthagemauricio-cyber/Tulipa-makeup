import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Card, AnimatedCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Professional } from '../../types';

export default function ProfessionalsPage() {
  const { professionals, services, addProfessional, updateProfessional, removeProfessional } = useAppStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Simple form state
  const [formData, setFormData] = useState<Omit<Professional, 'id'>>({
    name: '',
    photoUrl: 'https://picsum.photos/200/200',
    specialties: [],
    availability: { days: [1,2,3,4,5], startHour: '09:00', endHour: '18:00' }
  });

  const toggleSpecialty = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(serviceId)
        ? prev.specialties.filter(id => id !== serviceId)
        : [...prev.specialties, serviceId]
    }));
  };

  const handleSave = () => {
    if (!formData.name) return;
    
    if (isEditing) {
      updateProfessional(isEditing, formData);
      setIsEditing(null);
    } else {
      addProfessional(formData);
    }
    
    // Reset form
    setFormData({
      name: '',
      photoUrl: `https://picsum.photos/seed/${Math.random()}/200/200`,
      specialties: [],
      availability: { days: [1,2,3,4,5], startHour: '09:00', endHour: '18:00' }
    });
  };

  const handleEdit = (p: Professional) => {
    setFormData(p);
    setIsEditing(p.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-medium text-gray-900">Profissionais</h1>
          <p className="text-gray-500 mt-1">Gerencie a equipe do salão.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="md:col-span-1 h-fit">
          <h2 className="text-lg font-medium mb-4">{isEditing ? 'Editar Profissional' : 'Adicionar Profissional'}</h2>
          <div className="space-y-4">
            <Input 
              label="Nome Completo" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
              <div className="flex flex-wrap gap-2">
                {services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleSpecialty(s.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      formData.specialties.includes(s.id)
                        ? 'bg-lilac-100 border-lilac-500 text-lilac-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-lilac-300'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Hora Início" 
                type="time" 
                value={formData.availability.startHour}
                onChange={e => setFormData({...formData, availability: {...formData.availability, startHour: e.target.value}})}
              />
              <Input 
                label="Hora Fim" 
                type="time" 
                value={formData.availability.endHour}
                onChange={e => setFormData({...formData, availability: {...formData.availability, endHour: e.target.value}})}
              />
            </div>

            <Button fullWidth onClick={handleSave} className="mt-4">
              {isEditing ? 'Salvar Alterações' : 'Adicionar'}
            </Button>
            {isEditing && (
              <Button fullWidth variant="ghost" onClick={() => {
                setIsEditing(null);
                setFormData({ name: '', photoUrl: 'https://picsum.photos/200/200', specialties: [], availability: { days: [1,2,3,4,5], startHour: '09:00', endHour: '18:00' }});
              }}>
                Cancelar
              </Button>
            )}
          </div>
        </Card>

        {/* List */}
        <div className="md:col-span-2 space-y-4">
          {professionals.map((p, i) => (
            <AnimatedCard key={p.id} delay={i * 0.1} className="flex flex-col sm:flex-row gap-4 justify-between p-4">
              <div className="flex items-center gap-4">
                <img src={p.photoUrl} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="font-medium text-gray-900 text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-500">
                    {p.specialties.map(sid => services.find(s => s.id === sid)?.name).filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 pb-1 border-lilac-50">
                <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>
                  <Edit2 className="w-4 h-4 mr-1" /> Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => removeProfessional(p.id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Remover
                </Button>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
}
