import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './product-details.component.html',
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(10px);
      z-index: 1000;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .product-modal {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1010;
      padding: 20px;
    }

    .modal-card {
      display: flex;
      flex-direction: row;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 24px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
      max-width: 920px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      position: relative;
      animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes scaleIn {
      from { transform: scale(0.9) translateY(20px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    .modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 4px 15px rgba(238, 90, 82, 0.4);
    }

    .modal-close:hover {
      transform: rotate(90deg) scale(1.1);
      box-shadow: 0 6px 20px rgba(238, 90, 82, 0.6);
    }

    /* Image Section */
    .image-section {
      flex: 0 0 380px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
      padding: 30px;
      position: relative;
      overflow: hidden;
    }

    .image-section::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%);
      transform: rotate(30deg);
    }

    .main-image {
      width: 300px;
      height: 300px;
      border-radius: 20px;
      object-fit: cover;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      transition: transform 0.4s ease;
      position: relative;
      z-index: 2;
    }

    .main-image:hover {
      transform: scale(1.05) rotate(2deg);
    }

    .veg-indicator {
      position: absolute;
      top: 25px;
      left: 25px;
      background: white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      z-index: 3;
    }

    .veg-dot, .nonveg-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
    }

    .veg-dot { 
      background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
      box-shadow: 0 0 0 2px white, 0 0 0 3px #22c55e;
    }

    .nonveg-dot { 
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
      box-shadow: 0 0 0 2px white, 0 0 0 3px #ef4444;
    }

    /* Info Section */
    .info-section {
      flex: 1;
      padding: 36px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
      background: linear-gradient(to bottom, #ffffff, #f8fafc);
    }

    .title {
      font-size: 2rem;
      font-weight: 900;
      color: #1f2937;
      margin: 0;
      line-height: 1.2;
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .price-row {
      display: flex;
      gap: 14px;
      align-items: center;
      flex-wrap: wrap;
      padding: 12px 0;
    }

    .price { 
      font-size: 1.9rem; 
      font-weight: 900; 
      color: #059669;
      text-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
    }

    .mrp { 
      font-size: 1.4rem;
      text-decoration: line-through; 
      color: #9ca3af; 
    }

    .discount { 
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      color: white; 
      font-weight: 800; 
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 1rem;
      box-shadow: 0 4px 10px rgba(238, 90, 82, 0.3);
    }

    .desc {
      color: #4b5563;
      font-size: 1.1rem;
      line-height: 1.6;
      margin: 0;
      padding: 16px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      border-left: 4px solid #10b981;
    }

    /* Success Message */
    .success-message {
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, #86efac 0%, #4ade80 100%);
      color: #166534;
      padding: 16px 20px;
      border-radius: 12px;
      margin: 12px 0;
      animation: slideIn 0.4s ease-out;
      box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Reviews */
    .reviews h4 {
      font-size: 1.4rem;
      font-weight: 800;
      margin-bottom: 12px;
      color: #1f2937;
      background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }

    .add-review-title {
      margin-top: 28px;
      font-size: 1.4rem;
      font-weight: 800;
      color: #1f2937;
      background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }

    .reviews .empty { 
      font-style: italic; 
      color: #6b7280; 
      margin-bottom: 20px; 
      text-align: center;
      padding: 20px;
      background: rgba(249, 250, 251, 0.8);
      border-radius: 12px;
    }

    .review-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 16px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 700;
      color: #374151;
      font-size: 1rem;
    }

    .star-rating {
      display: flex;
      gap: 6px;
      cursor: pointer;
    }

    .star-rating span {
      transition: all 0.3s ease;
    }

    .star-rating span:hover {
      transform: scale(1.3) rotate(10deg);
    }

    .review-form textarea {
      border: 2px solid #e5e7eb;
      border-radius: 14px;
      padding: 16px;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.3s;
      resize: vertical;
      min-height: 120px;
      background: rgba(255, 255, 255, 0.8);
    }

    .review-form textarea:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
      background: white;
    }

    .submit-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      border: none;
      padding: 16px 28px;
      border-radius: 14px;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s;
      align-self: flex-start;
      margin-top: 12px;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
    }

    .submit-btn:disabled {
      background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    /* Reviews List */
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 28px;
    }

    .review-item {
      padding: 20px;
      background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
      border-radius: 16px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      border-left: 4px solid #10b981;
      transition: transform 0.3s ease;
    }

    .review-item:hover {
      transform: translateY(-5px);
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .stars {
      display: flex;
      gap: 4px;
    }

    .review-date {
      font-size: 0.9rem;
      color: #6b7280;
      font-weight: 500;
    }

    .review-text {
      margin: 0;
      color: #4b5563;
      line-height: 1.6;
      font-size: 1.05rem;
    }

    /* Cart Controls */
    .cart-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 2px dashed #e5e7eb;
    }

    .qty-controls {
      display: flex;
      gap: 16px;
      align-items: center;
      background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
      border-radius: 50px;
      padding: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }

    .qty-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
      font-size: 1.5rem;
      font-weight: 800;
      cursor: pointer;
      color: #374151;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .qty-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      transform: scale(1.1);
      box-shadow: 0 6px 15px rgba(16, 185, 129, 0.4);
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .qty { 
      font-weight: 800; 
      font-size: 1.3rem; 
      min-width: 30px;
      text-align: center;
      color: #1f2937;
    }

    .add-btn {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #fff;
      padding: 18px 36px;
      border: none;
      border-radius: 50px;
      font-weight: 800;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .add-btn:hover {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.5);
    }

    .add-btn::before {
      content: "🛒";
      font-size: 1.2rem;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .modal-card { 
        flex-direction: column; 
        max-width: 95%;
        max-height: 95vh;
      }
      
      .image-section { 
        flex: unset; 
        padding: 25px; 
      }
      
      .main-image { 
        width: 220px; 
        height: 220px; 
      }
      
      .info-section {
        padding: 28px;
        overflow-y: auto;
      }
      
      .cart-controls {
        flex-direction: column;
        gap: 20px;
        align-items: stretch;
      }
      
      .qty-controls {
        align-self: center;
      }
    }

    @media (max-width: 480px) {
      .product-modal {
        padding: 10px;
      }
      
      .modal-card {
        border-radius: 20px;
      }
      
      .title {
        font-size: 1.7rem;
      }
      
      .price {
        font-size: 1.6rem;
      }
      
      .info-section {
        padding: 20px;
      }
      
      .add-btn {
        padding: 16px 28px;
        font-size: 1rem;
      }
    }
  `]
})
export class ProductDetailsComponent implements OnChanges {
  @Input() product: any = null;
  @Input() show = false;
  @Input() cartQty = 0;

  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  rating: number | null = null;
  review: string = '';
  reviews: any[] = [];
  showSuccess: boolean = false;

  // runtime image src used by template (mutable)
  displayImage: string = 'assets/images/placeholder.jpg';

  // internal guard to avoid accidental null access in template
  get productSafe() {
    return this.product || { name: '', img: '', price: 0, mrp: 0, description: '', veg: false };
  }

  get hasDiscount() {
    const p = this.product;
    return !!(p && p.mrp != null && p.price != null && p.mrp > p.price);
  }

  get discountPercent() {
    if (!this.hasDiscount) return 0;
    const p = this.product!;
    return Math.round(100 * (p.mrp - p.price) / p.mrp);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      // Reset image to product image (or placeholder) whenever product changes
      const p = this.product;
      if (p && p.img) {
        // allow both asset path or filename
        this.displayImage = p.img.startsWith('assets/') ? p.img : `assets/images/${p.img}`;
      } else if (p && p.name) {
        // attempt heuristic filename from name
        const base = p.name.trim().toLowerCase().replace(/[^a-z0-9\s_-]/g, '');
        this.displayImage = `assets/images/${base.replace(/\s+/g, '-')}.jpg`;
      } else {
        this.displayImage = 'assets/images/placeholder.jpg';
      }
    }

    // reset rating/review when dialog shown
    if (changes['show'] && this.show) {
      this.rating = null;
      this.review = '';
      this.showSuccess = false;
    }
  }

  // method exposed for template to call (keeps template clean)
  onAddToCart() {
    this.add.emit();
  }

  onClose() {
    this.close.emit();
  }

  onIncrease() {
    this.add.emit();
  }

  onDecrease() {
    this.remove.emit();
  }

  onSubmitReview() {
    if (!this.rating || !this.review.trim()) return;
    
    // Add the new review
    this.reviews.unshift({
      rating: this.rating,
      text: this.review,
      date: new Date()
    });
    
    // Show success message
    this.showSuccess = true;
    
    // Reset form
    this.rating = null;
    this.review = '';
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    // set placeholder (works regardless of read-only getter issues)
    img.src = 'assets/images/placeholder.jpg';
    // also update local state so subsequent bindings are consistent
    this.displayImage = 'assets/images/placeholder.jpg';
  }
}