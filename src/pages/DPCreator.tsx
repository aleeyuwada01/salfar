import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Share2, RotateCcw, Move, Crop, Eye, Settings, Image as ImageIcon, Users, TrendingUp } from 'lucide-react';

interface DPPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'circle' | 'square' | 'rounded';
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

export const DPCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Admin states
  const [adminFlyer, setAdminFlyer] = useState<string | null>(null);
  const [dpPosition, setDpPosition] = useState<DPPosition>({
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    shape: 'circle'
  });
  const [campaignName, setCampaignName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const adminFileInputRef = useRef<HTMLInputElement>(null);

  // Mock campaigns data
  const [campaigns, setCampaigns] = useState<Campaign[]>([
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
  ]);

  const handleUserImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
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

    // Load flyer image
    const flyerImg = new Image();
    flyerImg.crossOrigin = 'anonymous';
    
    flyerImg.onload = () => {
      // Set canvas size to match flyer
      canvas.width = flyerImg.width;
      canvas.height = flyerImg.height;
      
      // Draw flyer
      ctx.drawImage(flyerImg, 0, 0);
      
      // Load user image
      const userImg = new Image();
      userImg.onload = () => {
        const pos = selectedCampaign.dpPosition;
        
        // Calculate scaling to maintain aspect ratio
        const scale = Math.min(pos.width / userImg.width, pos.height / userImg.height);
        const scaledWidth = userImg.width * scale;
        const scaledHeight = userImg.height * scale;
        
        // Center the image in the position
        const offsetX = (pos.width - scaledWidth) / 2;
        const offsetY = (pos.height - scaledHeight) / 2;
        
        ctx.save();
        
        // Create clipping path based on shape
        if (pos.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(pos.x + pos.width/2, pos.y + pos.height/2, pos.width/2, 0, 2 * Math.PI);
          ctx.clip();
        } else if (pos.shape === 'rounded') {
          const radius = 10;
          ctx.beginPath();
          ctx.roundRect(pos.x, pos.y, pos.width, pos.height, radius);
          ctx.clip();
        } else {
          ctx.beginPath();
          ctx.rect(pos.x, pos.y, pos.width, pos.height);
          ctx.clip();
        }
        
        // Draw user image
        ctx.drawImage(userImg, pos.x + offsetX, pos.y + offsetY, scaledWidth, scaledHeight);
        ctx.restore();
        
        // Add SALFAR watermark
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(234, 67, 53, 0.7)';
        ctx.fillText('SALFAR.org', canvas.width - 80, canvas.height - 10);
        
        // Convert to data URL
        const dataURL = canvas.toDataURL('image/png', 0.9);
        setPreviewImage(dataURL);
        setIsProcessing(false);
      };
      
      userImg.src = userImage;
    };
    
    flyerImg.src = selectedCampaign.flyerUrl;
  }, [selectedCampaign, userImage]);

  const downloadImage = () => {
    if (!previewImage) return;
    
    const link = document.createElement('a');
    link.download = `salfar-${selectedCampaign?.name.toLowerCase().replace(/\s+/g, '-')}-dp.png`;
    link.href = previewImage;
    link.click();
    
    // Update download count
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
      // Convert data URL to blob
      const response = await fetch(previewImage);
      const blob = await response.blob();
      const file = new File([blob], 'salfar-dp.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My SALFAR Support DP',
          text: 'Supporting SCD Warriors with SALFAR',
          files: [file]
        });
        
        // Update share count
        if (selectedCampaign) {
          setCampaigns(prev => prev.map(c => 
            c.id === selectedCampaign.id 
              ? { ...c, shares: c.shares + 1 }
              : c
          ));
        }
      } else {
        // Fallback: copy to clipboard
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
      dpPosition: dpPosition,
      downloads: 0,
      shares: 0,
      isActive: true
    };
    
    setCampaigns(prev => [...prev, newCampaign]);
    setCampaignName('');
    setAdminFlyer(null);
    setDpPosition({ x: 50, y: 50, width: 100, height: 100, shape: 'circle' });
    alert('Campaign saved successfully!');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTab !== 'admin' || !adminFlyer) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeTab !== 'admin') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDpPosition(prev => ({ ...prev, x: x - prev.width/2, y: y - prev.height/2 }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (selectedCampaign && userImage) {
      generatePreview();
    }
  }, [selectedCampaign, userImage, generatePreview]);

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
                    <img 
                      src={campaign.flyerUrl} 
                      alt={campaign.name}
                      className="w-full h-48 object-cover"
                    />
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Upload Section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Photo</h3>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-google-red transition-colors"
                  >
                    {userImage ? (
                      <div className="space-y-4">
                        <img 
                          src={userImage} 
                          alt="User upload"
                          className="w-32 h-32 object-cover rounded-full mx-auto"
                        />
                        <p className="text-gray-600">Click to change photo</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">Upload your profile picture</p>
                          <p className="text-gray-600">PNG, JPG up to 10MB</p>
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
                    <div className="mt-6 space-y-4">
                      <button
                        onClick={() => setUserImage(null)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Reset Photo</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Preview Section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Preview</h3>
                  
                  {previewImage ? (
                    <div className="space-y-6">
                      <div className="border rounded-lg overflow-hidden">
                        <img 
                          src={previewImage} 
                          alt="Preview"
                          className="w-full h-auto"
                        />
                      </div>
                      
                      <div className="flex space-x-4">
                        <button
                          onClick={downloadImage}
                          className="flex-1 bg-google-red text-white px-4 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Download className="h-5 w-5" />
                          <span>Download</span>
                        </button>
                        
                        <button
                          onClick={shareImage}
                          className="flex-1 bg-google-blue text-white px-4 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Share2 className="h-5 w-5" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      {isProcessing ? (
                        <div className="space-y-4">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-google-red mx-auto"></div>
                          <p className="text-gray-600">Generating preview...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Crop className="h-12 w-12 text-gray-400 mx-auto" />
                          <p className="text-gray-600">
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
                          <label className="block text-xs text-gray-600 mb-1">Width</label>
                          <input
                            type="number"
                            value={dpPosition.width}
                            onChange={(e) => setDpPosition(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Height</label>
                          <input
                            type="number"
                            value={dpPosition.height}
                            onChange={(e) => setDpPosition(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Shape</label>
                        <select
                          value={dpPosition.shape}
                          onChange={(e) => setDpPosition(prev => ({ ...prev, shape: e.target.value as 'circle' | 'square' | 'rounded' }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="circle">Circle</option>
                          <option value="square">Square</option>
                          <option value="rounded">Rounded Square</option>
                        </select>
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
                  <p className="text-gray-600 mb-4">Drag the overlay to position where the profile picture should appear</p>
                  
                  <div 
                    className="relative border rounded-lg overflow-hidden cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <img src={adminFlyer} alt="Flyer" className="w-full h-auto" />
                    
                    {/* DP Position Overlay */}
                    <div
                      className={`absolute border-2 border-google-red bg-google-red bg-opacity-20 ${
                        dpPosition.shape === 'circle' ? 'rounded-full' : 
                        dpPosition.shape === 'rounded' ? 'rounded-lg' : ''
                      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                      style={{
                        left: dpPosition.x,
                        top: dpPosition.y,
                        width: dpPosition.width,
                        height: dpPosition.height,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Move className="h-6 w-6 text-google-red" />
                      </div>
                    </div>
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
                              <img 
                                src={campaign.flyerUrl} 
                                alt={campaign.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
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
                              }`}
                            >
                              {campaign.isActive ? 'Deactivate' : 'Activate'}
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