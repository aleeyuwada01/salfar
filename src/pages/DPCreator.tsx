import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Share2, RotateCcw, Move, Crop, Eye, Settings, Image as ImageIcon, Users, TrendingUp, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface DPPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'circle' | 'square' | 'rounded';
}

interface UserImageSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface Campaign {
  id: string;
  name: string;
  flyerUrl: string;
  dpPosition: DPPosition;
  downloads: number;
  shares: number;
  isActive: boolean;
}

const STORAGE_KEY = 'salfar_dp_campaigns';
const USER_IMAGE_KEY = 'salfar_user_image';

export const DPCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // User image positioning controls
  const [userImageSettings, setUserImageSettings] = useState<UserImageSettings>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0
  });
  const [isUserDragging, setIsUserDragging] = useState(false);
  const [userDragOffset, setUserDragOffset] = useState({ x: 0, y: 0 });
  
  // Admin states
  const [adminFlyer, setAdminFlyer] = useState<string | null>(null);
  const [adminDpPosition, setAdminDpPosition] = useState<DPPosition>({
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    shape: 'circle'
  });
  const [campaignName, setCampaignName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const adminFileInputRef = useRef<HTMLInputElement>(null);

  // Load user image from localStorage on component mount
  useEffect(() => {
    try {
      const savedUserImage = localStorage.getItem(USER_IMAGE_KEY);
      if (savedUserImage) {
        setUserImage(savedUserImage);
      }
    } catch (error) {
      console.error('Error loading user image from localStorage:', error);
    }
  }, []);

  // Save user image to localStorage whenever it changes
  useEffect(() => {
    try {
      if (userImage) {
        localStorage.setItem(USER_IMAGE_KEY, userImage);
      } else {
        localStorage.removeItem(USER_IMAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving user image to localStorage:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        setUserImage(null);
        localStorage.removeItem(USER_IMAGE_KEY);
        alert('Storage quota exceeded. Please use a smaller image or clear browser data.');
      }
    }
  }, [userImage]);

  // Reset user image settings when campaign changes
  useEffect(() => {
    if (selectedCampaign) {
      setUserImageSettings({
        x: 0,
        y: 0,
        width: selectedCampaign.dpPosition.width,
        height: selectedCampaign.dpPosition.height,
        rotation: 0
      });
    }
  }, [selectedCampaign]);

  // Load campaigns from localStorage
  const loadCampaigns = (): Campaign[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading campaigns from localStorage:', error);
    }
    
    // Default campaigns if nothing in localStorage
    return [
      {
        id: '1',
        name: 'SCD Awareness Month 2025',
        flyerUrl: 'https://images.pexels.com/photos/6129044/pexels-photo-6129044.jpeg?auto=compress&cs=tinysrgb&w=800',
        dpPosition: { x: 300, y: 50, width: 120, height: 120, shape: 'circle' },
        downloads: 1247,
        shares: 892,
        isActive: true
      },
      {
        id: '2',
        name: 'Warriors Support Campaign',
        flyerUrl: 'https://images.pexels.com/photos/8363028/pexels-photo-8363028.jpeg?auto=compress&cs=tinysrgb&w=800',
        dpPosition: { x: 50, y: 200, width: 100, height: 100, shape: 'rounded' },
        downloads: 856,
        shares: 634,
        isActive: true
      },
      {
        id: '3',
        name: 'Medical Aid Drive',
        flyerUrl: 'https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg?auto=compress&cs=tinysrgb&w=800',
        dpPosition: { x: 200, y: 300, width: 110, height: 110, shape: 'square' },
        downloads: 423,
        shares: 298,
        isActive: false
      }
    ];
  };

  const [campaigns, setCampaigns] = useState<Campaign[]>(loadCampaigns);

  // Save campaigns to localStorage whenever campaigns change
  useEffect(() => {
    try {
      const campaignsToSave = campaigns.map(campaign => ({
        ...campaign,
        flyerUrl: campaign.flyerUrl.startsWith('data:') ? '' : campaign.flyerUrl
      }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaignsToSave));
    } catch (error) {
      console.error('Error saving campaigns to localStorage:', error);
    }
  }, [campaigns]);

  const handleUserImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please select an image smaller than 2MB to ensure it can be saved.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
        // Reset user image settings when new image is uploaded
        if (selectedCampaign) {
          setUserImageSettings({
            x: 0,
            y: 0,
            width: selectedCampaign.dpPosition.width,
            height: selectedCampaign.dpPosition.height,
            rotation: 0
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdminFlyerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdminFlyer(e.target?.result as string);
        setAdminDpPosition({
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          shape: 'circle'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePreview = useCallback(async () => {
    if (!selectedCampaign || !userImage) return;

    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Load flyer image
      const flyerImg = new Image();
      flyerImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        flyerImg.onload = resolve;
        flyerImg.onerror = reject;
        flyerImg.src = selectedCampaign.flyerUrl;
      });

      // Set canvas size to match flyer
      canvas.width = flyerImg.width;
      canvas.height = flyerImg.height;
      
      // Clear canvas and draw flyer
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(flyerImg, 0, 0);
      
      // Load user image
      const userImg = new Image();
      
      await new Promise((resolve, reject) => {
        userImg.onload = resolve;
        userImg.onerror = reject;
        userImg.src = userImage;
      });

      // Use the campaign's DP position as the clipping area
      const dpPos = selectedCampaign.dpPosition;
      
      // Create clipping path based on shape
      ctx.save();
      ctx.beginPath();
      
      if (dpPos.shape === 'circle') {
        ctx.arc(
          dpPos.x + dpPos.width / 2, 
          dpPos.y + dpPos.height / 2, 
          dpPos.width / 2, 
          0, 
          2 * Math.PI
        );
      } else if (dpPos.shape === 'rounded') {
        const radius = Math.min(dpPos.width, dpPos.height) * 0.1;
        ctx.roundRect(dpPos.x, dpPos.y, dpPos.width, dpPos.height, radius);
      } else {
        ctx.rect(dpPos.x, dpPos.y, dpPos.width, dpPos.height);
      }
      
      ctx.clip();
      
      // Apply user image transformations within the DP area
      const centerX = dpPos.x + dpPos.width / 2;
      const centerY = dpPos.y + dpPos.height / 2;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((userImageSettings.rotation * Math.PI) / 180);
      
      // Draw user image with their custom positioning and sizing
      const userX = userImageSettings.x - userImageSettings.width / 2;
      const userY = userImageSettings.y - userImageSettings.height / 2;
      
      ctx.drawImage(
        userImg, 
        userX, 
        userY, 
        userImageSettings.width, 
        userImageSettings.height
      );
      
      ctx.restore();
      ctx.restore();
      
      // Add SALFAR watermark
      ctx.font = `${Math.max(12, canvas.width * 0.02)}px Arial`;
      ctx.fillStyle = 'rgba(234, 67, 53, 0.7)';
      ctx.textAlign = 'right';
      ctx.fillText('SALFAR.org', canvas.width - 10, canvas.height - 10);
      
      // Convert to data URL
      const dataURL = canvas.toDataURL('image/png', 0.9);
      setPreviewImage(dataURL);
      
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Error generating preview. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedCampaign, userImage, userImageSettings]);

  const downloadImage = () => {
    if (!previewImage) return;
    
    const link = document.createElement('a');
    link.download = `salfar-${selectedCampaign?.name.toLowerCase().replace(/\s+/g, '-')}-dp.png`;
    link.href = previewImage;
    link.click();
    
    if (selectedCampaign) {
      setCampaigns(prev => prev.map(c => 
        c.id === selectedCampaign.id 
          ? { ...c, downloads: c.downloads + 1 }
          : c
      ));
    }
  };

  const shareImage = async () => {
    if (!previewImage) return;
    
    try {
      const response = await fetch(previewImage);
      const blob = await response.blob();
      const file = new File([blob], 'salfar-dp.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My SALFAR Support DP',
          text: 'Supporting SCD Warriors with SALFAR',
          files: [file]
        });
        
        if (selectedCampaign) {
          setCampaigns(prev => prev.map(c => 
            c.id === selectedCampaign.id 
              ? { ...c, shares: c.shares + 1 }
              : c
          ));
        }
      } else {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob(async (blob) => {
            if (blob) {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              alert('Image copied to clipboard!');
            }
          });
        };
        img.src = previewImage;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Unable to share. Please download the image instead.');
    }
  };

  const saveCampaign = () => {
    if (!adminFlyer || !campaignName) return;
    
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignName,
      flyerUrl: adminFlyer,
      dpPosition: { ...adminDpPosition },
      downloads: 0,
      shares: 0,
      isActive: true
    };
    
    setCampaigns(prev => [...prev, newCampaign]);
    setCampaignName('');
    setAdminFlyer(null);
    setAdminDpPosition({ x: 50, y: 50, width: 100, height: 100, shape: 'circle' });
    
    alert('Campaign saved successfully!');
  };

  // Admin drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTab !== 'admin' || !adminFlyer) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (x >= adminDpPosition.x && x <= adminDpPosition.x + adminDpPosition.width &&
        y >= adminDpPosition.y && y <= adminDpPosition.y + adminDpPosition.height) {
      
      setDragOffset({
        x: x - adminDpPosition.x,
        y: y - adminDpPosition.y
      });
      
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeTab !== 'admin') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setAdminDpPosition(prev => ({ 
      ...prev, 
      x: Math.max(0, Math.min(x - dragOffset.x, rect.width - prev.width)),
      y: Math.max(0, Math.min(y - dragOffset.y, rect.height - prev.height))
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  // User image drag handlers for preview
  const handleUserMouseDown = (e: React.MouseEvent) => {
    if (!selectedCampaign || !userImage) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is within the user image area (simplified check)
    const dpPos = selectedCampaign.dpPosition;
    const centerX = dpPos.x + dpPos.width / 2;
    const centerY = dpPos.y + dpPos.height / 2;
    const userX = centerX + userImageSettings.x - userImageSettings.width / 2;
    const userY = centerY + userImageSettings.y - userImageSettings.height / 2;
    
    if (x >= userX && x <= userX + userImageSettings.width &&
        y >= userY && y <= userY + userImageSettings.height) {
      
      setUserDragOffset({
        x: x - (centerX + userImageSettings.x),
        y: y - (centerY + userImageSettings.y)
      });
      
      setIsUserDragging(true);
    }
  };

  const handleUserMouseMove = (e: React.MouseEvent) => {
    if (!isUserDragging || !selectedCampaign) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dpPos = selectedCampaign.dpPosition;
    const centerX = dpPos.x + dpPos.width / 2;
    const centerY = dpPos.y + dpPos.height / 2;
    
    setUserImageSettings(prev => ({
      ...prev,
      x: x - centerX - userDragOffset.x,
      y: y - centerY - userDragOffset.y
    }));
  };

  const handleUserMouseUp = () => {
    setIsUserDragging(false);
    setUserDragOffset({ x: 0, y: 0 });
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    setAdminDpPosition(prev => ({
      ...prev,
      [dimension]: Math.max(10, value)
    }));
  };

  const clearUserImage = () => {
    setUserImage(null);
    setPreviewImage(null);
    localStorage.removeItem(USER_IMAGE_KEY);
  };

  const resetUserImageSettings = () => {
    if (selectedCampaign) {
      setUserImageSettings({
        x: 0,
        y: 0,
        width: selectedCampaign.dpPosition.width,
        height: selectedCampaign.dpPosition.height,
        rotation: 0
      });
    }
  };

  React.useEffect(() => {
    if (selectedCampaign && userImage) {
      generatePreview();
    }
  }, [selectedCampaign, userImage, userImageSettings, generatePreview]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-google-blue to-google-green py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">DP Creator</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Create personalized profile pictures to show your support for SCD warriors. 
            Choose from our campaign flyers and add your photo.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('user')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'user'
                  ? 'border-google-red text-google-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>Create DP</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'admin'
                  ? 'border-google-red text-google-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Admin Panel</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* User Interface */}
      {activeTab === 'user' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Campaign Selection */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Choose a Campaign</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {campaigns.filter(c => c.isActive).map((campaign) => (
                  <div
                    key={campaign.id}
                    onClick={() => setSelectedCampaign(campaign)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all ${
                      selectedCampaign?.id === campaign.id ? 'ring-4 ring-google-red' : ''
                    }`}
                  >
                    {campaign.flyerUrl ? (
                      <img 
                        src={campaign.flyerUrl} 
                        alt={campaign.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">Image not available</p>
                          <p className="text-xs">Upload session expired</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                      <div className="p-4 text-white w-full">
                        <h3 className="font-bold text-lg">{campaign.name}</h3>
                        <div className="flex items-center space-x-4 text-sm mt-2">
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{campaign.downloads}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="h-4 w-4" />
                            <span>{campaign.shares}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedCampaign?.id === campaign.id && (
                      <div className="absolute top-2 right-2 bg-google-red text-white p-2 rounded-full">
                        <Eye className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedCampaign && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Your Photo</h3>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-google-red transition-colors"
                  >
                    {userImage ? (
                      <div className="space-y-3">
                        <img 
                          src={userImage} 
                          alt="User upload"
                          className="w-24 h-24 object-cover rounded-full mx-auto"
                        />
                        <p className="text-gray-600 text-sm">Click to change photo</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto" />
                        <div>
                          <p className="font-medium text-gray-900">Upload your photo</p>
                          <p className="text-gray-600 text-sm">PNG, JPG up to 2MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUserImageUpload}
                    className="hidden"
                  />

                  {userImage && (
                    <div className="mt-4 space-y-3">
                      <button
                        onClick={clearUserImage}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Reset Photo</span>
                      </button>
                      <div className="text-xs text-gray-500 text-center">
                        Your photo is saved locally and will persist across page refreshes
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Controls */}
                {userImage && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Adjust Your Photo</h3>
                    
                    <div className="space-y-4">
                      {/* Size Controls */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Width</label>
                            <input
                              type="range"
                              min="20"
                              max="300"
                              value={userImageSettings.width}
                              onChange={(e) => setUserImageSettings(prev => ({ 
                                ...prev, 
                                width: parseInt(e.target.value) 
                              }))}
                              className="w-full"
                            />
                            <div className="text-xs text-gray-500 text-center">{userImageSettings.width}px</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Height</label>
                            <input
                              type="range"
                              min="20"
                              max="300"
                              value={userImageSettings.height}
                              onChange={(e) => setUserImageSettings(prev => ({ 
                                ...prev, 
                                height: parseInt(e.target.value) 
                              }))}
                              className="w-full"
                            />
                            <div className="text-xs text-gray-500 text-center">{userImageSettings.height}px</div>
                          </div>
                        </div>
                      </div>

                      {/* Position Controls */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">X Position</label>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              value={userImageSettings.x}
                              onChange={(e) => setUserImageSettings(prev => ({ 
                                ...prev, 
                                x: parseInt(e.target.value) 
                              }))}
                              className="w-full"
                            />
                            <div className="text-xs text-gray-500 text-center">{userImageSettings.x}px</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Y Position</label>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              value={userImageSettings.y}
                              onChange={(e) => setUserImageSettings(prev => ({ 
                                ...prev, 
                                y: parseInt(e.target.value) 
                              }))}
                              className="w-full"
                            />
                            <div className="text-xs text-gray-500 text-center">{userImageSettings.y}px</div>
                          </div>
                        </div>
                      </div>

                      {/* Rotation Control */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rotation</label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={userImageSettings.rotation}
                          onChange={(e) => setUserImageSettings(prev => ({ 
                            ...prev, 
                            rotation: parseInt(e.target.value) 
                          }))}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-500 text-center">{userImageSettings.rotation}°</div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setUserImageSettings(prev => ({ 
                            ...prev, 
                            width: prev.width * 1.1, 
                            height: prev.height * 1.1 
                          }))}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm"
                        >
                          <ZoomIn className="h-4 w-4" />
                          <span>Zoom In</span>
                        </button>
                        <button
                          onClick={() => setUserImageSettings(prev => ({ 
                            ...prev, 
                            width: prev.width * 0.9, 
                            height: prev.height * 0.9 
                          }))}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm"
                        >
                          <ZoomOut className="h-4 w-4" />
                          <span>Zoom Out</span>
                        </button>
                      </div>

                      <button
                        onClick={resetUserImageSettings}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Reset Position & Size</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Preview Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Preview</h3>
                  
                  {previewImage ? (
                    <div className="space-y-4">
                      <div 
                        className="border rounded-lg overflow-hidden cursor-move"
                        onMouseDown={handleUserMouseDown}
                        onMouseMove={handleUserMouseMove}
                        onMouseUp={handleUserMouseUp}
                        onMouseLeave={handleUserMouseUp}
                      >
                        <img 
                          src={previewImage} 
                          alt="Preview"
                          className="w-full h-auto"
                          draggable={false}
                        />
                      </div>
                      
                      <div className="text-xs text-gray-500 text-center">
                        💡 Tip: You can also drag your photo in the preview above
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={downloadImage}
                          className="flex-1 bg-google-red text-white px-3 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                        
                        <button
                          onClick={shareImage}
                          className="flex-1 bg-google-blue text-white px-3 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 text-sm"
                        >
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      {isProcessing ? (
                        <div className="space-y-3">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-google-red mx-auto"></div>
                          <p className="text-gray-600 text-sm">Generating preview...</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Crop className="h-10 w-10 text-gray-400 mx-auto" />
                          <p className="text-gray-600 text-sm">
                            {!userImage ? 'Upload a photo to see preview' : 'Preview will appear here'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Admin Interface */}
      {activeTab === 'admin' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Campaign Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-google-red p-3 rounded-full">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                    <p className="text-gray-600">Total Campaigns</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-google-green p-3 rounded-full">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {campaigns.reduce((sum, c) => sum + c.downloads, 0)}
                    </p>
                    <p className="text-gray-600">Total Downloads</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-google-blue p-3 rounded-full">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {campaigns.reduce((sum, c) => sum + c.shares, 0)}
                    </p>
                    <p className="text-gray-600">Total Shares</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Create New Campaign */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Flyer
                    </label>
                    <div 
                      onClick={() => adminFileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-google-red transition-colors"
                    >
                      {adminFlyer ? (
                        <img src={adminFlyer} alt="Flyer" className="w-full h-32 object-cover rounded" />
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                          <p className="text-gray-600">Click to upload flyer</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={adminFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAdminFlyerUpload}
                      className="hidden"
                    />
                  </div>

                  {adminFlyer && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        DP Position Settings
                      </label>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Width (px)</label>
                          <input
                            type="number"
                            min="10"
                            max="500"
                            value={adminDpPosition.width}
                            onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 10)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-google-red"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Height (px)</label>
                          <input
                            type="number"
                            min="10"
                            max="500"
                            value={adminDpPosition.height}
                            onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 10)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-google-red"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Shape</label>
                        <select
                          value={adminDpPosition.shape}
                          onChange={(e) => setAdminDpPosition(prev => ({ ...prev, shape: e.target.value as 'circle' | 'square' | 'rounded' }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-google-red"
                        >
                          <option value="circle">Circle</option>
                          <option value="square">Square</option>
                          <option value="rounded">Rounded Square</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">X Position</label>
                          <input
                            type="number"
                            min="0"
                            value={Math.round(adminDpPosition.x)}
                            onChange={(e) => setAdminDpPosition(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-google-red"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Y Position</label>
                          <input
                            type="number"
                            min="0"
                            value={Math.round(adminDpPosition.y)}
                            onChange={(e) => setAdminDpPosition(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-google-red"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={saveCampaign}
                    disabled={!adminFlyer || !campaignName}
                    className="w-full bg-google-red text-white px-4 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Save Campaign
                  </button>
                </div>
              </div>

              {/* Position Editor */}
              {adminFlyer && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Position DP Area</h3>
                  <p className="text-gray-600 mb-4">
                    Drag the red overlay to position where the profile picture should appear, or use the input fields for precise positioning.
                  </p>
                  
                  <div 
                    className="relative border rounded-lg overflow-hidden cursor-crosshair select-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ maxHeight: '400px' }}
                  >
                    <img 
                      src={adminFlyer} 
                      alt="Flyer" 
                      className="w-full h-auto block"
                      draggable={false}
                    />
                    
                    {/* DP Position Overlay */}
                    <div
                      className={`absolute border-2 border-google-red bg-google-red bg-opacity-20 flex items-center justify-center ${
                        adminDpPosition.shape === 'circle' ? 'rounded-full' : 
                        adminDpPosition.shape === 'rounded' ? 'rounded-lg' : ''
                      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} transition-all duration-150`}
                      style={{
                        left: `${adminDpPosition.x}px`,
                        top: `${adminDpPosition.y}px`,
                        width: `${adminDpPosition.width}px`,
                        height: `${adminDpPosition.height}px`,
                        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: isDragging ? '0 4px 12px rgba(234, 67, 53, 0.3)' : 'none'
                      }}
                    >
                      <Move className="h-6 w-6 text-google-red pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <strong>Position:</strong> X: {Math.round(adminDpPosition.x)}px, Y: {Math.round(adminDpPosition.y)}px<br />
                    <strong>Size:</strong> {adminDpPosition.width}px × {adminDpPosition.height}px<br />
                    <strong>Shape:</strong> {adminDpPosition.shape}
                  </div>
                </div>
              )}
            </div>

            {/* Existing Campaigns */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Manage Campaigns</h3>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campaign
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Downloads
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Shares
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {campaign.flyerUrl ? (
                                <img 
                                  src={campaign.flyerUrl} 
                                  alt={campaign.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                                <div className="text-xs text-gray-500">
                                  {campaign.dpPosition.width}×{campaign.dpPosition.height} {campaign.dpPosition.shape}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <Download className="h-4 w-4 text-gray-400" />
                              <span>{campaign.downloads}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <Share2 className="h-4 w-4 text-gray-400" />
                              <span>{campaign.shares}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              campaign.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {campaign.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setCampaigns(prev => prev.map(c => 
                                  c.id === campaign.id 
                                    ? { ...c, isActive: !c.isActive }
                                    : c
                                ));
                              }}
                              className={`${
                                campaign.isActive 
                                  ? 'text-red-600 hover:text-red-900' 
                                  : 'text-green-600 hover:text-green-900'
                              } mr-4`}
                            >
                              {campaign.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this campaign?')) {
                                  setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};