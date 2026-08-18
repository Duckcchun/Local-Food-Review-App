import { describe, it, expect } from 'vitest';
import { validateImageFile } from './imageUpload';

describe('validateImageFile', () => {
  it('should accept valid JPEG file', () => {
    const file = new File([''], 'photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('should accept valid PNG file', () => {
    const file = new File([''], 'photo.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 }); // 2MB
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('should accept valid WebP file', () => {
    const file = new File([''], 'photo.webp', { type: 'image/webp' });
    Object.defineProperty(file, 'size', { value: 500 * 1024 }); // 500KB
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid file type', () => {
    const file = new File([''], 'document.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('JPG');
  });

  it('should reject file over 10MB', () => {
    const file = new File([''], 'huge.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 }); // 11MB
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('10MB');
  });

  it('should accept file exactly at 10MB', () => {
    const file = new File([''], 'max.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }); // exactly 10MB
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });
});
