'use client';

import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function ImageCropModal({ open, onClose, onCropComplete, imageSrc, aspectRatio }) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);

  const handleImageLoad = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.target;
    
    // Set initial crop to be centered and maintain aspect ratio if provided
    const initialCrop = {
      unit: '%',
      width: aspectRatio ? Math.min(80, (height / width) * 80 * aspectRatio) : 80,
      height: aspectRatio ? Math.min(80, (width / height) * 80 / aspectRatio) : 80,
      x: 25,
      y: 25,
    };
    
    setCrop(initialCrop);
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleConfirmCrop = () => {
    if (!completedCrop || !imageRef) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      imageRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onCropComplete(reader.result);
          onClose();
        };
        reader.readAsDataURL(blob);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleClose = () => {
    setCrop({
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    });
    setCompletedCrop(null);
    setImageRef(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        برش تصویر
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={handleCropComplete}
            aspect={aspectRatio} // Use provided aspect ratio or allow free cropping
            minWidth={50}
            minHeight={50}
          >
            {imageSrc && (
              <img
                ref={setImageRef}
                src={imageSrc}
                onLoad={handleImageLoad}
                alt="Crop preview"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            )}
          </ReactCrop>
        </Box>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 1 }}>
          برای برش تصویر، مربع را با موس جابجا کرده و اندازه آن را تغییر دهید
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          انصراف
        </Button>
        <Button 
          onClick={handleConfirmCrop} 
          variant="contained"
          disabled={!completedCrop}
        >
          تأیید برش
        </Button>
      </DialogActions>
    </Dialog>
  );
}
