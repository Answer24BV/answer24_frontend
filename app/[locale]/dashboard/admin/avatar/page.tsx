"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Image as ImageIcon, User, Star, X, Search, Filter, Grid3x3, List, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAvatars, createAvatar, updateAvatar, deleteAvatar, type Avatar } from "@/app/[locale]/actions/avatar";

type PlanType = 'small' | 'medium' | 'big';

const planColors = {
  free: 'bg-slate-50 text-slate-700 border-slate-200',
  small: 'bg-sky-50 text-sky-700 border-sky-200',
  medium: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  big: 'bg-violet-50 text-violet-700 border-violet-200'
};

const planBadgeColors = {
  free: 'bg-slate-100 text-slate-700 border-slate-200',
  small: 'bg-sky-100 text-sky-700 border-sky-200',
  medium: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  big: 'bg-violet-100 text-violet-700 border-violet-200'
};

const planLabels = {
  free: 'Free',
  small: 'Starter',
  medium: 'Pro',
  big: 'Enterprise'
};

const planGradients = {
  free: 'from-slate-500 to-slate-600',
  small: 'from-sky-500 to-sky-600',
  medium: 'from-indigo-500 to-indigo-600',
  big: 'from-violet-500 to-violet-600'
};

export default function AdminAvatarPage() {
  // State for UI
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<Avatar | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  
  // Fetch avatars on mount
  useEffect(() => {
    loadAvatars();
  }, []);
  
  const loadAvatars = async () => {
    try {
      setIsLoading(true);
      const data = await getAvatars();
      setAvatars(data);
    } catch (error) {
      console.error('Failed to load avatars:', error);
      toast.error('Failed to load avatars');
    } finally {
      setIsLoading(false);
    }
  };

  // Form state
  interface FormData {
    name: string;
    role: string;
    description: string;
    required_plan: PlanType;
    functions: string[];
    image: File | string | null;
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    description: '',
    required_plan: 'small',
    functions: [],
    image: null
  });

  // State for avatars list
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  
  const filteredAvatars = avatars.filter(avatar => {
    const matchesSearch = searchTerm === '' || 
      avatar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avatar.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (avatar.description && avatar.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPlan = filterPlan === 'all' || avatar.required_plan === filterPlan;
    
    return matchesSearch && matchesPlan;
  });
  
  const getToken = (): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || '';
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData(prev => ({ ...prev, [name]: file }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFunctionChange = (index: number, value: string) => {
    const newFunctions = [...formData.functions];
    newFunctions[index] = value;
    setFormData(prev => ({
      ...prev,
      functions: newFunctions
    }));
  };

  const handleAddFunction = () => {
    if (formData.functions.every((fn: string) => fn.trim() !== '')) {
      setFormData(prev => ({
        ...prev,
        functions: [...prev.functions, '']
      }));
    }
  };

  const handleRemoveFunction = (index: number) => {
    const newFunctions = formData.functions.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      functions: newFunctions
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = getToken();
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('role', formData.role.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('required_plan', formData.required_plan);
      formData.functions
        .filter(fn => fn.trim() !== '')
        .forEach((fn, index) => {
          formDataToSend.append(`functions[${index}]`, fn.trim());
        });
      
      // Only append image if it's a File object
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      } else if (formData.image) {
        // If it's a string (existing image URL), send it as is
        formDataToSend.append('image', formData.image);
      }

      if (editingAvatar) {
        // Update existing avatar
        const updatedAvatar = await updateAvatar(editingAvatar.id, token, formDataToSend as any);
        setAvatars(avatars.map(avatar => 
          avatar.id === editingAvatar.id ? updatedAvatar : avatar
        ));
        toast.success('Avatar updated successfully');
      } else {
        // Create new avatar
        const newAvatar = await createAvatar(token, formDataToSend as any);
        setAvatars([...avatars, newAvatar]);
        toast.success('Avatar created successfully');
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save avatar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (avatar: Avatar) => {
    setFormData({
      name: avatar.name,
      role: avatar.role,
      description: avatar.description || '',
      required_plan: avatar.required_plan as PlanType,
      functions: [...avatar.functions],
      image: avatar.image || null
    });
    setEditingAvatar(avatar);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this avatar?')) {
      try {
        const success = await deleteAvatar(id);
        if (success) {
          setAvatars(avatars.filter(avatar => avatar.id !== id));
          toast.success('Avatar deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting avatar:', error);
        toast.error('Failed to delete avatar');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      description: '',
      required_plan: 'small',
      functions: [],
      image: null
    });
    setEditingAvatar(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Avatar Management
              </h1>
              <p className="text-slate-600 mt-2">Create and manage your AI avatars with ease</p>
            </div>
            <button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }} 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Avatar
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-white/20">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search avatars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="pl-10 pr-8 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 appearance-none min-w-[140px]"
                >
                  <option value="all">All Plans</option>
                  <option value="small">Starter</option>
                  <option value="medium">Pro</option>
                  <option value="big">Enterprise</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Avatar Grid/List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredAvatars.map((avatar) => (
              <div 
                key={avatar.id} 
                className={`group bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
                }`}
              >
                <div className={`flex ${viewMode === 'list' ? 'items-center space-x-6 flex-1' : 'flex-col'}`}>
                  {/* Avatar Image and Badge */}
                  <div className={`relative ${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4 self-center'}`}>
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 ring-4 ring-white shadow-lg">
                      {avatar.image ? (
                        <img 
                          src={avatar.image} 
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                          <User className="w-8 h-8 text-indigo-400" />
                        </div>
                      )}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 px-3 py-1 text-xs font-semibold rounded-full border-2 border-white shadow-sm ${planBadgeColors[avatar.required_plan]}`}>
                      {planLabels[avatar.required_plan]}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ${viewMode === 'list' ? 'min-w-0' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'flex items-start justify-between' : ''}`}>
                      <div className={`${viewMode === 'list' ? 'flex-1 min-w-0 pr-4' : 'text-center mb-4'}`}>
                        <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{avatar.name}</h3>
                        <p className="text-indigo-600 font-medium text-sm mb-2 truncate">{avatar.role}</p>
                        <p className={`text-slate-600 text-sm leading-relaxed ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-1'}`}>
                          {avatar.description}
                        </p>
                      </div>

                      {/* Actions - positioned differently for grid vs list */}
                      <div className={`${viewMode === 'list' ? 'flex items-center space-x-2' : 'flex justify-center space-x-2 mt-4'}`}>
                        <button
                          onClick={() => handleEdit(avatar)}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 group"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(avatar.id)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Functions */}
                    {avatar.functions && avatar.functions.length > 0 && (
                      <div className={`flex flex-wrap gap-2 ${viewMode === 'list' ? 'mt-3' : 'mt-4'}`}>
                        {avatar.functions.slice(0, viewMode === 'list' ? 4 : 3).map((func, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {func}
                          </span>
                        ))}
                        {avatar.functions.length > (viewMode === 'list' ? 4 : 3) && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            +{avatar.functions.length - (viewMode === 'list' ? 4 : 3)} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAvatars.length === 0 && !isLoading && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
            <div className="mx-auto h-24 w-24 text-slate-300 mb-6">
              <User className="h-full w-full" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No avatars found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || filterPlan !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by creating your first avatar'
              }
            </p>
            {!searchTerm && filterPlan === 'all' && (
              <button 
                onClick={() => setIsDialogOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Avatar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dialog Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${planGradients[formData.required_plan]} p-8 text-white relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {editingAvatar ? 'Edit Avatar' : 'Create New Avatar'}
                  </h2>
                  <p className="text-white/80">
                    {editingAvatar ? 'Update the avatar details below' : 'Fill in the details to create a new avatar'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Avatar Preview */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Avatar Image
                      {formData.image && !(formData.image instanceof File) && typeof formData.image === 'string' && (
                        <div className="mt-2">
                          <img 
                            src={formData.image} 
                            alt="Current avatar" 
                            className="h-20 w-20 rounded-md object-cover"
                          />
                          <p className="text-xs text-gray-500 mt-1">Current image</p>
                        </div>
                      )}
                      {formData.image instanceof File && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            {formData.image.name} ({(formData.image.size / 1024).toFixed(1)} KB)
                          </p>
                        </div>
                      )}
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/jpeg,image/png,image/jpg,image/gif"
                      onChange={handleInputChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted formats: JPEG, PNG, JPG, GIF (Max 5MB)
                    </p>
                  </div>

                  {/* Plan Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Required Plan
                    </label>
                    <select
                      name="required_plan"
                      value={formData.required_plan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                      required
                    >
                      <option value="small">Starter</option>
                      <option value="medium">Pro</option>
                      <option value="big">Enterprise</option>
                    </select>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g., Alex Johnson"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="role"
                        placeholder="e.g., Customer Support Specialist"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  {/* <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Image URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="image"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.image as string || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                    />
                  </div> */}

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="A brief description of this avatar's role and capabilities..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none"
                    />
                  </div>

                  {/* Functions */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-semibold text-slate-700">
                        Functions <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddFunction}
                        disabled={formData.functions.some(fn => !fn.trim())}
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          formData.functions.some(fn => !fn.trim())
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                        }`}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Function
                      </button>
                    </div>

                    {formData.functions.length === 0 ? (
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                        <p className="text-slate-500">No functions added yet. Add some to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.functions.map((func, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={func}
                              onChange={(e) => handleFunctionChange(index, e.target.value)}
                              placeholder="Enter function name"
                              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFunction(index)}
                              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                  className="px-6 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.role || !formData.description || !formData.image || formData.functions.length === 0}
                  className={`px-8 py-3 text-white font-medium rounded-xl transition-all duration-200 shadow-lg ${
                    isSubmitting || !formData.name || !formData.role || !formData.description || !formData.image || formData.functions.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl'
                  } inline-flex items-center`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingAvatar ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {editingAvatar ? 'Update Avatar' : 'Create Avatar'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}