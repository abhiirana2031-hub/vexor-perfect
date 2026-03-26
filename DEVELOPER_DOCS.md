# Developer Documentation - Admin Panel

## Architecture Overview

The admin panel is built with a **component-based architecture** using React and TypeScript, with MongoDB backend integration.

```
Admin Panel (AdminDashboardPage.tsx)
├── Authentication
│   ├── Hardcoded login (testing)
│   ├── Member-based login (Wix)
│   └── Auto-redirect for non-admins
├── Content Management
│   ├── Projects CRUD
│   ├── Services CRUD
│   └── Team Members CRUD
├── Image Management
│   ├── File upload (Base64)
│   ├── Preview display
│   └── RemovalToggle
└── UI Components
    ├── Dashboard layout
    ├── Modal dialogs
    ├── Confirmation dialogs
    └── List views with thumbnails
```

---

## Code Architecture

### 1. Image Upload System

#### Base64 Conversion Utility
```typescript
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
```

**Why Base64?**
- Stores images directly in database
- No external storage service needed
- Simple backup and migration
- Works cross-platform

**Limitations**:
- Increases file size by 33%
- Not optimal for very large deployments
- Database bloat with many large images

#### Alternative: URL-Based Storage
For production, consider:

```typescript
// Upload to AWS S3, CloudFlare, etc.
const handleImageUploadS3 = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `uploads/${fileName}`,
    Body: file,
    ContentType: file.type,
  };
  
  const s3 = new AWS.S3();
  const result = await s3.upload(s3Params).promise();
  return result.Location; // URL string instead of base64
};
```

### 2. State Management Pattern

```typescript
// Form data follows a single source of truth pattern
const [formData, setFormData] = useState<any>({});
const [imagePreview, setImagePreview] = useState<string | null>(null);

// Update nested object
const handleFieldChange = (field: string, value: any) => {
  setFormData({ ...formData, [field]: value });
};

// Update array of items
const updateItemInList = (itemId: string, updatedItem: any) => {
  setProjects(projects.map(p => p._id === itemId ? updatedItem : p));
};
```

### 3. CRUD Operations Implementation

```typescript
// CREATE
const handleCreate = async (data: any) => {
  const newItem = { ...data, _id: crypto.randomUUID() };
  await BaseCrudService.create(collectionId, newItem);
  setItems([...items, newItem]);
};

// READ
const handleRead = async () => {
  const result = await BaseCrudService.getAll(collectionId);
  setItems(result.items);
};

// UPDATE
const handleUpdate = async (itemId: string, data: any) => {
  await BaseCrudService.update(collectionId, { ...data, _id: itemId });
  setItems(items.map(item => item._id === itemId ? data : item));
};

// DELETE
const handleDelete = async (itemId: string) => {
  await BaseCrudService.delete(collectionId, itemId);
  setItems(items.filter(item => item._id !== itemId));
};
```

---

## Extending the Admin Panel

### Adding a New Tab (e.g., Testimonials Management)

#### Step 1: Update State
```typescript
const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
```

#### Step 2: Add to Tabs
```tsx
<TabsTrigger value="testimonials" className="text-foreground data-[state=active]:text-secondary">
  Testimonials
</TabsTrigger>
```

#### Step 3: Add TabsContent
```tsx
<TabsContent value="testimonials" className="space-y-4 mt-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-heading text-2xl font-bold text-foreground">Testimonials</h2>
    <Button 
      onClick={() => handleAddNew('testimonials')}
      className="bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Add Testimonial
    </Button>
  </div>
  {/* List testimonials */}
</TabsContent>
```

#### Step 4: Add Form Fields in Dialog
```tsx
{activeTab === 'testimonials' && (
  <>
    <div>
      <label className="block text-foreground font-paragraph text-sm mb-2">Client Name</label>
      <Input
        value={formData.clientName || ''}
        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
        className="bg-background border-secondary/20 text-foreground"
        placeholder="Enter client name"
      />
    </div>
    {/* More fields */}
  </>
)}
```

#### Step 5: Update Load Function
```typescript
const loadAllData = async () => {
  const [projectsRes, servicesRes, teamRes, testimonialsRes] = await Promise.all([
    BaseCrudService.getAll<Projects>('projects'),
    BaseCrudService.getAll<Services>('services'),
    BaseCrudService.getAll<TeamMembers>('teammembers'),
    BaseCrudService.getAll<Testimonials>('testimonials'), // Add this
  ]);
  setTestimonials(testimonialsRes.items); // Add this
};
```

---

## Authentication Improvements

### Current Implementation (Testing)
```typescript
const ADMIN_EMAIL = 'abhayrana8272@gmail.com';
const ADMIN_PASSWORD = 'vexor@#005';

const isAdmin = isAdminLoggedIn || (isAuthenticated && member?.profile?.nickname === 'admin');
```

### Recommended: Environment Variables
```typescript
// .env.local
VITE_ADMIN_EMAIL=admin@company.com
VITE_ADMIN_PASSWORD_HASH=hashed_password_here
```

```typescript
import bcrypt from 'bcrypt';

const isValidCredentials = (email: string, password: string): boolean => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;
  
  if (email !== adminEmail) return false;
  
  return bcrypt.compareSync(password, adminPasswordHash);
};
```

### Better: Wix Members Integration
```typescript
import { useMember } from '@/integrations';

const AdminDashboard = () => {
  const { member, isAuthenticated } = useMember();
  
  // Check if authenticated and has admin role
  const isAdmin = isAuthenticated && (
    member?.profile?.nickname === 'admin' || 
    member?.customProperties?.role === 'admin'
  );
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <AdminContent />;
};
```

---

## Image Upload Improvements

### Add Image Optimization
```typescript
import sharp from 'sharp';

const optimizeImage = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  
  const optimized = await sharp(buffer)
    .resize(1200, 800, { fit: 'cover', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  
  const base64 = optimized.toString('base64');
  return `data:image/webp;base64,${base64}`;
};
```

### Add File Size Validation
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  
  if (!file) return;
  
  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    alert(`File is too large. Max size: 5MB. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    return;
  }
  
  // Validate type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    alert('Invalid file type. Please use JPG, PNG, or WebP');
    return;
  }
  
  // Process
  try {
    const base64 = await fileToBase64(file);
    setImagePreview(base64);
    setFormData({ ...formData, [imageField]: base64 });
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};
```

### Add Image Cropping
```typescript
import EasyCrop from 'react-easy-crop';

const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedImage, setCroppedImage] = useState<string | null>(null);

const onCropComplete = async (croppedArea: any) => {
  // Crop implemented here
};

return (
  <>
    <EasyCrop
      image={imagePreview}
      crop={crop}
      zoom={zoom}
      aspect={4 / 3}
      onCropChange={setCrop}
      onZoomChange={setZoom}
      onCropComplete={onCropComplete}
    />
  </>
);
```

---

## Performance Optimizations

### Lazy Load Images in Lists
```typescript
const LazyImage = ({ src, alt, width, height }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      className={isLoaded ? 'opacity-100' : 'opacity-0'}
    />
  );
};
```

### Pagination for Large Lists
```typescript
const ITEMS_PER_PAGE = 10;

const [currentPage, setCurrentPage] = useState(1);

const paginatedItems = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return items.slice(start, end);
}, [items, currentPage]);

const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
```

### Memoize Heavy Components
```typescript
const ProjectCard = React.memo(({ project, onEdit, onDelete }) => {
  return (
    <Card>
      {/* Card content */}
    </Card>
  );
});
```

---

## Testing Examples

### Unit Test for Image Upload
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('Image Upload', () => {
  it('should convert file to base64', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = await fileToBase64(file);
    
    expect(result).toContain('data:image');
  });
  
  it('should display image preview after upload', async () => {
    render(<AdminPanel />);
    const input = screen.getByType('file');
    
    fireEvent.change(input, { target: { files: [mockFile] } });
    
    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeVisible();
    });
  });
});
```

### Integration Test for CRUD
```typescript
describe('Project CRUD', () => {
  it('should create project with image', async () => {
    const { getByText, getByPlaceholderText } = render(<AdminPanel />);
    
    fireEvent.click(getByText('Add Project'));
    fireEvent.change(getByPlaceholderText('Enter project title'), {
      target: { value: 'Test Project' }
    });
    fireEvent.click(getByText('Save'));
    
    await waitFor(() => {
      expect(getByText('Test Project')).toBeInTheDocument();
    });
  });
});
```

---

## Deployment Checklist

### Before Production

- [ ] **Security**
  - [ ] Remove hardcoded credentials
  - [ ] Implement proper authentication
  - [ ] Add rate limiting to login
  - [ ] Enable HTTPS only
  - [ ] Add CORS restrictions

- [ ] **Performance**
  - [ ] Optimize image sizes
  - [ ] Implement lazy loading
  - [ ] Add pagination for large lists
  - [ ] Cache strategies
  - [ ] Database indexing

- [ ] **Data Management**
  - [ ] Backup strategy for images
  - [ ] Database migration plan
  - [ ] Error logging setup
  - [ ] Audit trail for changes

- [ ] **User Experience**
  - [ ] Loading indicators
  - [ ] Error messages
  - [ ] Confirmation dialogs
  - [ ] Help documentation
  - [ ] Mobile responsive

- [ ] **Testing**
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] E2E tests
  - [ ] Security testing
  - [ ] Performance testing

---

## Environment Variables Template

```env
# .env.local
VITE_API_URL=http://localhost:3000
VITE_ADMIN_EMAIL=admin@example.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
MONGODB_DB_NAME=vexora

# Optional: For external storage
AWS_REGION=us-east-1
AWS_BUCKET_NAME=vexora-images
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

---

## Troubleshooting Guide

### Issue: Images not persisting after refresh
```typescript
// Solution: Check MongoDB connection
const loadAllData = async () => {
  try {
    const result = await BaseCrudService.getAll('projects');
    console.log('Loaded projects:', result);
    setProjects(result.items);
  } catch (error) {
    console.error('Error loading projects:', error);
    // Retry logic here
  }
};
```

### Issue: Large image upload slow
```typescript
// Solution: Compress before storing
const handleImageUpload = async (file: File) => {
  const compressed = await compressImage(file);
  const base64 = await fileToBase64(compressed);
  // Continue with upload
};

const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d')?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(new File([blob!], file.name, { type: 'image/jpeg' }));
      });
    };
    
    img.src = URL.createObjectURL(file);
  });
};
```

### Issue: Out of memory on large bases
```typescript
// Solution: Use external storage
const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.VITE_CLOUDINARY_PRESET!);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  const data = await response.json();
  return data.secure_url; // URL instead of base64
};
```

---

## Best Practices

1. ✅ **Always validate file types and sizes client-side**
2. ✅ **Implement server-side validation too**
3. ✅ **Use transactions for multi-step operations**
4. ✅ **Log all admin actions for audit trail**
5. ✅ **Backup images regularly**
6. ✅ **Use CDN for image delivery**
7. ✅ **Implement proper error handling**
8. ✅ **Test with realistic data volumes**
9. ✅ **Monitor database growth**
10. ✅ **Update dependencies regularly**

---

**For questions or improvements, contact the development team.**
