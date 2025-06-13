import React, { useState, useEffect, useRef } from 'react';
import { Download, Share2, Upload, X, Settings, Trash2, Edit3, Eye, Plus, RotateCcw, ZoomIn, ZoomOut, Move, RotateCw, Image as ImageIcon, Copy, Check } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  template: string;
  campaignImage?: string; // New field for campaign background image
  settings: {
    position: { x: number; y: number };
    size: { width: number; height: number };
    shape: 'circle' | 'square';
  };
  createdAt: string;
  userImage?: string;
  userImageSettings?: {
    position: { x: number; y: number };
    size: { width: number; height: number };
    rotation: number;
  };
}

export const DPCreator: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'copied' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const campaignImageInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // User image adjustment controls
  const [userImageSettings, setUserImageSettings] = useState({
    position: { x: 0, y: 0 },
    size: { width: 150, height: 150 },
    rotation: 0
  });

  // Form state for creating new campaigns
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    template: 'template1',
    campaignImage: null as string | null,
    position: { x: 150, y: 100 },
    size: { width: 150, height: 150 },
    shape: 'circle' as 'circle' | 'square'
  });

  // Load campaigns from localStorage on component mount
  useEffect(() => {
    const savedCampaigns = localStorage.getItem('dpCreatorCampaigns');
    if (savedCampaigns) {
      try {
        const parsedCampaigns = JSON.parse(savedCampaigns);
        // Load campaign images from separate localStorage entries
        const campaignsWithImages = parsedCampaigns.map((campaign: Campaign) => {
          const savedImage = localStorage.getItem(`campaign_${campaign.id}_backgroundImage`);
          return {
            ...campaign,
            campaignImage: savedImage || undefined
          };
        });
        setCampaigns(campaignsWithImages);
      } catch (error) {
        console.error('Error loading campaigns from localStorage:', error);
        setCampaigns([]);
      }
    }
  }, []);

  // Save campaigns to localStorage whenever campaigns change
  useEffect(() => {
    if (campaigns.length > 0) {
      try {
        // Create a copy of campaigns without the campaignImage property to avoid quota issues
        const campaignsToSave = campaigns.map(({ campaignImage, ...campaign }) => campaign);
        localStorage.setItem('dpCreatorCampaigns', JSON.stringify(campaignsToSave));
        
        // Save campaign images separately
        campaigns.forEach(campaign => {
          if (campaign.campaignImage) {
            try {
              localStorage.setItem(`campaign_${campaign.id}_backgroundImage`, campaign.campaignImage);
            } catch (error) {
              console.warn(`Failed to save background image for campaign ${campaign.id}:`, error);
              // If we can't save the image, remove it from the campaign
              campaign.campaignImage = undefined;
            }
          }
        });
      } catch (error) {
        console.error('Error saving campaigns to localStorage:', error);
        // Show user-friendly error message
        alert('Unable to save campaign data. Your browser storage may be full. Consider deleting some campaigns or clearing browser data.');
      }
    } else {
      // If no campaigns, remove from localStorage
      localStorage.removeItem('dpCreatorCampaigns');
    }
  }, [campaigns]);

  // Load user image and settings when campaign changes
  useEffect(() => {
    if (selectedCampaign) {
      // Load saved user image for this campaign
      const savedImage = localStorage.getItem(`campaign_${selectedCampaign.id}_userImage`);
      const savedSettings = localStorage.getItem(`campaign_${selectedCampaign.id}_userImageSettings`);
      
      if (savedImage) {
        setUserImage(savedImage);
      } else {
        setUserImage(null);
      }
      
      if (savedSettings) {
        try {
          setUserImageSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error('Error parsing user image settings:', error);
          // Reset to campaign defaults
          setUserImageSettings({
            position: { x: selectedCampaign.settings.position.x, y: selectedCampaign.settings.position.y },
            size: { width: selectedCampaign.settings.size.width, height: selectedCampaign.settings.size.height },
            rotation: 0
          });
        }
      } else {
        // Reset to campaign defaults
        setUserImageSettings({
          position: { x: selectedCampaign.settings.position.x, y: selectedCampaign.settings.position.y },
          size: { width: selectedCampaign.settings.size.width, height: selectedCampaign.settings.size.height },
          rotation: 0
        });
      }
    }
  }, [selectedCampaign]);

  // Save user image and settings to localStorage
  const saveUserImageData = (image: string, settings: any) => {
    if (selectedCampaign) {
      try {
        localStorage.setItem(`campaign_${selectedCampaign.id}_userImage`, image);
        localStorage.setItem(`campaign_${selectedCampaign.id}_userImageSettings`, JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save user image data:', error);
        alert('Unable to save your photo. Your browser storage may be full.');
      }
    }
  };

  const templates = [
    {
      id: 'template1',
      name: 'SALFAR Webinar',
      image: '/api/placeholder/400/400',
      bgColor: 'linear-gradient(135deg, #2D5016 0%, #8B4513 100%)'
    },
    {
      id: 'template2', 
      name: 'Awareness Campaign',
      image: '/api/placeholder/400/400',
      bgColor: 'linear-gradient(135deg, #EA4335 0%, #FB8C00 100%)'
    },
    {
      id: 'template3',
      name: 'Support Drive',
      image: '/api/placeholder/400/400', 
      bgColor: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)'
    }
  ];

  const handleCampaignImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB to avoid localStorage issues)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image file is too large. Please choose an image smaller than 2MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setNewCampaign({ ...newCampaign, campaignImage: imageData });
      };
      reader.readAsDataURL(file);
    }
  };

  const createCampaign = () => {
    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      template: newCampaign.template,
      campaignImage: newCampaign.campaignImage || undefined,
      settings: {
        position: newCampaign.position,
        size: newCampaign.size,
        shape: newCampaign.shape
      },
      createdAt: new Date().toISOString()
    };

    setCampaigns(prev => [...prev, campaign]);
    setSelectedCampaign(campaign);
    setShowCreateForm(false);
    
    // Reset form
    setNewCampaign({
      name: '',
      template: 'template1',
      campaignImage: null,
      position: { x: 150, y: 100 },
      size: { width: 150, height: 150 },
      shape: 'circle'
    });
  };

  const deleteCampaign = (campaignId: string) => {
    // Remove campaign from list
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    
    // Remove associated user data from localStorage
    localStorage.removeItem(`campaign_${campaignId}_userImage`);
    localStorage.removeItem(`campaign_${campaignId}_userImageSettings`);
    localStorage.removeItem(`campaign_${campaignId}_backgroundImage`);
    
    // If this was the selected campaign, clear selection
    if (selectedCampaign?.id === campaignId) {
      setSelectedCampaign(null);
      setUserImage(null);
    }
    
    setShowDeleteConfirm(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 1MB for user images)
      if (file.size > 1024 * 1024) {
        alert('Image file is too large. Please choose an image smaller than 1MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUserImage(imageData);
        
        // Save immediately to localStorage
        if (selectedCampaign) {
          saveUserImageData(imageData, userImageSettings);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUserImageSettings = (newSettings: any) => {
    setUserImageSettings(newSettings);
    
    // Save to localStorage immediately
    if (selectedCampaign && userImage) {
      saveUserImageData(userImage, newSettings);
    }
  };

  const resetUserImage = () => {
    setUserImage(null);
    if (selectedCampaign) {
      localStorage.removeItem(`campaign_${selectedCampaign.id}_userImage`);
      localStorage.removeItem(`campaign_${selectedCampaign.id}_userImageSettings`);
      
      // Reset to campaign defaults
      setUserImageSettings({
        position: { x: selectedCampaign.settings.position.x, y: selectedCampaign.settings.position.y },
        size: { width: selectedCampaign.settings.size.width, height: selectedCampaign.settings.size.height },
        rotation: 0
      });
    }
  };

  const resetToDefaults = () => {
    if (selectedCampaign) {
      const defaultSettings = {
        position: { x: selectedCampaign.settings.position.x, y: selectedCampaign.settings.position.y },
        size: { width: selectedCampaign.settings.size.width, height: selectedCampaign.settings.size.height },
        rotation: 0
      };
      updateUserImageSettings(defaultSettings);
    }
  };

  const adjustSize = (delta: number) => {
    const newSettings = {
      ...userImageSettings,
      size: {
        width: Math.max(20, Math.min(300, userImageSettings.size.width + delta)),
        height: Math.max(20, Math.min(300, userImageSettings.size.height + delta))
      }
    };
    updateUserImageSettings(newSettings);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (userImage) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && userImage) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      const newSettings = {
        ...userImageSettings,
        position: {
          x: userImageSettings.position.x + deltaX * 0.5, // Reduce sensitivity
          y: userImageSettings.position.y + deltaY * 0.5
        }
      };
      
      updateUserImageSettings(newSettings);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const downloadImage = async () => {
    if (!selectedCampaign || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    // Draw background
    if (selectedCampaign.campaignImage) {
      // Use uploaded campaign image
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 400, 400);
        drawUserImageOnCanvas(ctx);
      };
      img.src = selectedCampaign.campaignImage;
    } else {
      // Use template background
      const template = templates.find(t => t.id === selectedCampaign.template);
      if (template) {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 400, 400);
        if (template.bgColor.includes('2D5016')) {
          gradient.addColorStop(0, '#2D5016');
          gradient.addColorStop(1, '#8B4513');
        } else if (template.bgColor.includes('EA4335')) {
          gradient.addColorStop(0, '#EA4335');
          gradient.addColorStop(1, '#FB8C00');
        } else {
          gradient.addColorStop(0, '#4285F4');
          gradient.addColorStop(1, '#34A853');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 400);
      }

      // Draw template content
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('SALFAR SICKLE AID', 200, 50);
      ctx.fillText('INITIATIVE', 200, 80);
      
      ctx.font = '16px Arial';
      ctx.fillText('Supporting SCD Warriors', 200, 350);
      ctx.fillText('Across Nigeria', 200, 370);

      drawUserImageOnCanvas(ctx);
    }

    function drawUserImageOnCanvas(ctx: CanvasRenderingContext2D) {
      if (userImage) {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          
          // Apply transformations
          const centerX = userImageSettings.position.x + userImageSettings.size.width / 2;
          const centerY = userImageSettings.position.y + userImageSettings.size.height / 2;
          
          ctx.translate(centerX, centerY);
          ctx.rotate((userImageSettings.rotation * Math.PI) / 180);
          
          if (selectedCampaign.settings.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, userImageSettings.size.width / 2, 0, 2 * Math.PI);
            ctx.clip();
          }
          
          ctx.drawImage(
            img,
            -userImageSettings.size.width / 2,
            -userImageSettings.size.height / 2,
            userImageSettings.size.width,
            userImageSettings.size.height
          );
          
          ctx.restore();
          
          // Download the canvas
          const link = document.createElement('a');
          link.download = `${selectedCampaign.name}-dp.png`;
          link.href = canvas.toDataURL();
          link.click();
        };
        img.src = userImage;
      } else {
        // Download without user image
        const link = document.createElement('a');
        link.download = `${selectedCampaign.name}-dp.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  const shareImage = async () => {
    if (!selectedCampaign) return;
    
    setShareStatus('sharing');
    
    try {
      // First try to generate the image as a blob for native sharing
      if (navigator.share && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 400;
          canvas.height = 400;

          // Generate the image on canvas (similar to download function)
          const generateImageBlob = (): Promise<Blob | null> => {
            return new Promise((resolve) => {
              if (selectedCampaign.campaignImage) {
                const img = new Image();
                img.onload = () => {
                  ctx.drawImage(img, 0, 0, 400, 400);
                  drawUserImageAndResolve();
                };
                img.src = selectedCampaign.campaignImage;
              } else {
                // Draw template background
                const template = templates.find(t => t.id === selectedCampaign.template);
                if (template) {
                  const gradient = ctx.createLinearGradient(0, 0, 400, 400);
                  if (template.bgColor.includes('2D5016')) {
                    gradient.addColorStop(0, '#2D5016');
                    gradient.addColorStop(1, '#8B4513');
                  } else if (template.bgColor.includes('EA4335')) {
                    gradient.addColorStop(0, '#EA4335');
                    gradient.addColorStop(1, '#FB8C00');
                  } else {
                    gradient.addColorStop(0, '#4285F4');
                    gradient.addColorStop(1, '#34A853');
                  }
                  
                  ctx.fillStyle = gradient;
                  ctx.fillRect(0, 0, 400, 400);
                }

                // Draw template content
                ctx.fillStyle = 'white';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('SALFAR SICKLE AID', 200, 50);
                ctx.fillText('INITIATIVE', 200, 80);
                
                ctx.font = '16px Arial';
                ctx.fillText('Supporting SCD Warriors', 200, 350);
                ctx.fillText('Across Nigeria', 200, 370);

                drawUserImageAndResolve();
              }

              function drawUserImageAndResolve() {
                if (userImage) {
                  const img = new Image();
                  img.onload = () => {
                    ctx.save();
                    
                    const centerX = userImageSettings.position.x + userImageSettings.size.width / 2;
                    const centerY = userImageSettings.position.y + userImageSettings.size.height / 2;
                    
                    ctx.translate(centerX, centerY);
                    ctx.rotate((userImageSettings.rotation * Math.PI) / 180);
                    
                    if (selectedCampaign.settings.shape === 'circle') {
                      ctx.beginPath();
                      ctx.arc(0, 0, userImageSettings.size.width / 2, 0, 2 * Math.PI);
                      ctx.clip();
                    }
                    
                    ctx.drawImage(
                      img,
                      -userImageSettings.size.width / 2,
                      -userImageSettings.size.height / 2,
                      userImageSettings.size.width,
                      userImageSettings.size.height
                    );
                    
                    ctx.restore();
                    
                    canvas.toBlob(resolve, 'image/png');
                  };
                  img.src = userImage;
                } else {
                  canvas.toBlob(resolve, 'image/png');
                }
              }
            });
          };

          const blob = await generateImageBlob();
          
          if (blob) {
            const file = new File([blob], `${selectedCampaign.name}-dp.png`, { type: 'image/png' });
            
            await navigator.share({
              title: `${selectedCampaign.name} - SALFAR Support DP`,
              text: 'Show your support for SCD warriors with SALFAR! 🩸❤️ #SALFARSupport #SCDWarriors #SickleCell',
              files: [file]
            });
            
            setShareStatus('idle');
            return;
          }
        }
      }
      
      // Fallback: Try sharing just the URL and text
      if (navigator.share) {
        await navigator.share({
          title: `${selectedCampaign.name} - SALFAR Support DP`,
          text: 'Show your support for SCD warriors with SALFAR! Create your own support DP at: ',
          url: window.location.href
        });
        setShareStatus('idle');
        return;
      }
      
      // Final fallback: Copy to clipboard
      const shareText = `Show your support for SCD warriors with SALFAR! 🩸❤️ 

Create your own support DP at: ${window.location.href}

#SALFARSupport #SCDWarriors #SickleCell`;
      
      await navigator.clipboard.writeText(shareText);
      setShareStatus('copied');
      
      // Reset status after 3 seconds
      setTimeout(() => setShareStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Error sharing:', error);
      setShareStatus('error');
      
      // Try clipboard as final fallback
      try {
        const shareText = `Show your support for SCD warriors with SALFAR! 🩸❤️ 

Create your own support DP at: ${window.location.href}

#SALFARSupport #SCDWarriors #SickleCell`;
        
        await navigator.clipboard.writeText(shareText);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 3000);
      } catch (clipboardError) {
        console.error('Clipboard fallback failed:', clipboardError);
        setShareStatus('error');
        setTimeout(() => setShareStatus('idle'), 3000);
      }
    }
  };

  const getBackgroundStyle = (campaign: Campaign) => {
    if (campaign.campaignImage) {
      return {
        backgroundImage: `url(${campaign.campaignImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    } else {
      const template = templates.find(t => t.id === campaign.template);
      return {
        background: template?.bgColor || '#EA4335'
      };
    }
  };

  const getShareButtonContent = () => {
    switch (shareStatus) {
      case 'sharing':
        return (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Sharing...</span>
          </>
        );
      case 'copied':
        return (
          <>
            <Check className="h-5 w-5" />
            <span>Copied!</span>
          </>
        );
      case 'error':
        return (
          <>
            <X className="h-5 w-5" />
            <span>Try Again</span>
          </>
        );
      default:
        return (
          <>
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DP Creator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create personalized display pictures to show your support for SCD warriors across Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Campaigns List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Campaigns</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-google-red text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No campaigns yet</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-google-red text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    Create First Campaign
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedCampaign?.id === campaign.id
                          ? 'border-google-red bg-red-50'
                          : 'border-gray-200 hover:border-google-red'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex-1"
                          onClick={() => setSelectedCampaign(campaign)}
                        >
                          <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">
                            {templates.find(t => t.id === campaign.template)?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(campaign.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCampaign(campaign);
                            }}
                            className="p-1 text-gray-400 hover:text-google-blue transition-colors"
                            title="Edit"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(campaign.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!selectedCampaign ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Settings className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Campaign</h3>
                <p className="text-gray-600">Choose a campaign from the list to start creating your DP</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Preview */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                  <div className="flex justify-center">
                    <div 
                      className="relative w-96 h-96 rounded-lg overflow-hidden shadow-lg cursor-move"
                      style={getBackgroundStyle(selectedCampaign)}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      {/* Template Content - Only show if no campaign image */}
                      {!selectedCampaign.campaignImage && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                          <div className="text-center mb-8">
                            <h4 className="text-lg font-bold">SALFAR SICKLE AID</h4>
                            <h4 className="text-lg font-bold">INITIATIVE</h4>
                          </div>
                          
                          <div className="absolute bottom-4 text-center">
                            <p className="text-sm">Supporting SCD Warriors</p>
                            <p className="text-sm">Across Nigeria</p>
                          </div>
                        </div>
                      )}

                      {/* User Image */}
                      {userImage && (
                        <div
                          className="absolute"
                          style={{
                            left: userImageSettings.position.x,
                            top: userImageSettings.position.y,
                            width: userImageSettings.size.width,
                            height: userImageSettings.size.height,
                            transform: `rotate(${userImageSettings.rotation}deg)`,
                            transformOrigin: 'center'
                          }}
                        >
                          <img
                            src={userImage}
                            alt="User"
                            className={`w-full h-full object-cover ${
                              selectedCampaign.settings.shape === 'circle' ? 'rounded-full' : 'rounded-lg'
                            } border-2 border-white shadow-lg`}
                            draggable={false}
                          />
                        </div>
                      )}

                      {/* Upload Placeholder */}
                      {!userImage && (
                        <div 
                          className="absolute border-2 border-dashed border-white/50 bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                          style={{
                            left: selectedCampaign.settings.position.x,
                            top: selectedCampaign.settings.position.y,
                            width: selectedCampaign.settings.size.width,
                            height: selectedCampaign.settings.size.height,
                            borderRadius: selectedCampaign.settings.shape === 'circle' ? '50%' : '8px'
                          }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="text-center text-white">
                            <Upload className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">Click to upload photo</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Controls */}
                {userImage && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Adjust Your Photo</h3>
                    
                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <button
                        onClick={() => adjustSize(10)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <ZoomIn className="h-4 w-4" />
                        <span>Zoom In</span>
                      </button>
                      <button
                        onClick={() => adjustSize(-10)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <ZoomOut className="h-4 w-4" />
                        <span>Zoom Out</span>
                      </button>
                      <button
                        onClick={resetToDefaults}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Reset</span>
                      </button>
                    </div>

                    {/* Detailed Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Size Controls */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Width: {userImageSettings.size.width}px
                            </label>
                            <input
                              type="range"
                              min="20"
                              max="300"
                              value={userImageSettings.size.width}
                              onChange={(e) => updateUserImageSettings({
                                ...userImageSettings,
                                size: { ...userImageSettings.size, width: parseInt(e.target.value) }
                              })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Height: {userImageSettings.size.height}px
                            </label>
                            <input
                              type="range"
                              min="20"
                              max="300"
                              value={userImageSettings.size.height}
                              onChange={(e) => updateUserImageSettings({
                                ...userImageSettings,
                                size: { ...userImageSettings.size, height: parseInt(e.target.value) }
                              })}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Position Controls */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Position</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              X Position: {userImageSettings.position.x}px
                            </label>
                            <input
                              type="range"
                              min="-100"
                              max="400"
                              value={userImageSettings.position.x}
                              onChange={(e) => updateUserImageSettings({
                                ...userImageSettings,
                                position: { ...userImageSettings.position, x: parseInt(e.target.value) }
                              })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Y Position: {userImageSettings.position.y}px
                            </label>
                            <input
                              type="range"
                              min="-100"
                              max="400"
                              value={userImageSettings.position.y}
                              onChange={(e) => updateUserImageSettings({
                                ...userImageSettings,
                                position: { ...userImageSettings.position, y: parseInt(e.target.value) }
                              })}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Rotation Control */}
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-3">Rotation</h4>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Rotation: {userImageSettings.rotation}°
                          </label>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={userImageSettings.rotation}
                            onChange={(e) => updateUserImageSettings({
                              ...userImageSettings,
                              rotation: parseInt(e.target.value)
                            })}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload and Actions */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-google-blue text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <Upload className="h-5 w-5" />
                      <span>{userImage ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>

                    {userImage && (
                      <button
                        onClick={resetUserImage}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                      >
                        <X className="h-5 w-5" />
                        <span>Reset Photo</span>
                      </button>
                    )}

                    <button
                      onClick={downloadImage}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-google-green text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                      <span>Download</span>
                    </button>

                    <button
                      onClick={shareImage}
                      disabled={shareStatus === 'sharing'}
                      className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-full transition-colors ${
                        shareStatus === 'copied' 
                          ? 'bg-green-500 text-white' 
                          : shareStatus === 'error'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-google-orange text-white hover:bg-orange-600'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {getShareButtonContent()}
                    </button>
                  </div>

                  {userImage && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        💡 <strong>Tip:</strong> Your photo is saved locally and will persist across page refreshes. 
                        You can drag your photo in the preview to reposition it quickly!
                      </p>
                    </div>
                  )}

                  {shareStatus === 'copied' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✅ <strong>Share link copied!</strong> You can now paste it in your social media posts or messages.
                      </p>
                    </div>
                  )}

                  {shareStatus === 'error' && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700">
                        ❌ <strong>Sharing failed.</strong> You can manually copy the page URL and share it with others.
                      </p>
                    </div>
                  )}
                </div>

                {/* Campaign Settings Display */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Campaign Settings</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Position: {selectedCampaign.settings.position.x}px, {selectedCampaign.settings.position.y}px</p>
                    <p>Size: {selectedCampaign.settings.size.width}px × {selectedCampaign.settings.size.height}px</p>
                    <p>Shape: {selectedCampaign.settings.shape}</p>
                    <p>Background: {selectedCampaign.campaignImage ? 'Custom Image' : 'Template'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden Canvas for Download */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Create Campaign Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Campaign</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template
                    </label>
                    <select
                      value={newCampaign.template}
                      onChange={(e) => setNewCampaign({ ...newCampaign, template: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                    >
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Background Image (Optional)
                    </label>
                    <input
                      ref={campaignImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCampaignImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => campaignImageInputRef.current?.click()}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-google-red transition-colors"
                    >
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">
                        {newCampaign.campaignImage ? 'Change Image' : 'Upload Background Image'}
                      </span>
                    </button>
                    {newCampaign.campaignImage && (
                      <button
                        onClick={() => setNewCampaign({ ...newCampaign, campaignImage: null })}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum file size: 2MB. Large images may not persist across sessions due to browser storage limits.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        X Position
                      </label>
                      <input
                        type="number"
                        value={newCampaign.position.x}
                        onChange={(e) => setNewCampaign({
                          ...newCampaign,
                          position: { ...newCampaign.position, x: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Y Position
                      </label>
                      <input
                        type="number"
                        value={newCampaign.position.y}
                        onChange={(e) => setNewCampaign({
                          ...newCampaign,
                          position: { ...newCampaign.position, y: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width
                      </label>
                      <input
                        type="number"
                        value={newCampaign.size.width}
                        onChange={(e) => setNewCampaign({
                          ...newCampaign,
                          size: { ...newCampaign.size, width: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height
                      </label>
                      <input
                        type="number"
                        value={newCampaign.size.height}
                        onChange={(e) => setNewCampaign({
                          ...newCampaign,
                          size: { ...newCampaign.size, height: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shape
                    </label>
                    <select
                      value={newCampaign.shape}
                      onChange={(e) => setNewCampaign({ ...newCampaign, shape: e.target.value as 'circle' | 'square' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                    >
                      <option value="circle">Circle</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <div 
                      className="relative w-full h-64 rounded-lg overflow-hidden"
                      style={{
                        background: newCampaign.campaignImage 
                          ? `url(${newCampaign.campaignImage}) center/cover`
                          : templates.find(t => t.id === newCampaign.template)?.bgColor || '#EA4335'
                      }}
                    >
                      {/* Template Content - Only show if no campaign image */}
                      {!newCampaign.campaignImage && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs">
                          <div className="text-center mb-4">
                            <h4 className="font-bold">SALFAR SICKLE AID</h4>
                            <h4 className="font-bold">INITIATIVE</h4>
                          </div>
                          
                          <div className="absolute bottom-2 text-center">
                            <p>Supporting SCD Warriors</p>
                            <p>Across Nigeria</p>
                          </div>
                        </div>
                      )}

                      {/* Photo Placeholder */}
                      <div 
                        className="absolute border-2 border-dashed border-white/50 bg-white/10 flex items-center justify-center"
                        style={{
                          left: `${(newCampaign.position.x / 400) * 100}%`,
                          top: `${(newCampaign.position.y / 400) * 100}%`,
                          width: `${(newCampaign.size.width / 400) * 100}%`,
                          height: `${(newCampaign.size.height / 400) * 100}%`,
                          borderRadius: newCampaign.shape === 'circle' ? '50%' : '4px'
                        }}
                      >
                        <div className="text-center text-white text-xs">
                          <Upload className="h-4 w-4 mx-auto mb-1" />
                          <p>Photo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewCampaign({
                      name: '',
                      template: 'template1',
                      campaignImage: null,
                      position: { x: 150, y: 100 },
                      size: { width: 150, height: 150 },
                      shape: 'circle'
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createCampaign}
                  disabled={!newCampaign.name.trim()}
                  className="flex-1 px-4 py-2 bg-google-red text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Campaign</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this campaign? This action cannot be undone and will remove all associated data including uploaded photos.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteCampaign(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Campaign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};