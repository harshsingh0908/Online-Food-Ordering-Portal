import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from '../../models/menu-item.model';
import { Review } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-product-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details-modal.component.html',
  styleUrls: ['./product-details-modal.component.scss']
})
export class ProductDetailsModalComponent implements OnInit, OnChanges {
  // map friendly names to image file names (project-specific)
  private imageMap: { [k: string]: string } = {
    'Butter Chicken': 'butter-chicken.jpg',
    'Paneer Butter Masala': 'paneer-butter-masala.jpg',
    'Chicken Biryani': 'chicken-biryani.jpg',
    'Aloo Paratha': 'aloo-paratha.jpg',
    'Masala Dosa': 'masala-dosa.jpg',
    'Pancakes': 'pancake.jpg'
  };

  @Input() menuItem: MenuItem | null = null;
  @Input() cartQty: number = 0;
  @Input() show: boolean = false;

  // optional click origin for expand-from-click animation {x: clientX, y: clientY}
  @Input() origin?: { x: number; y: number } | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  reviews: Review[] = [];
  avgRating = 0;
  reviewCount = 0;
  newReview: { rating: number | null; comment: string } = { rating: null, comment: '' };
  submitting = false;
  errorMsg = '';

  // toggle used to start the CSS transition to center
  animateToCenter = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    if (this.menuItem) this.loadReviews();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuItem'] && this.menuItem) {
      this.loadReviews();
    }

    if (changes['show']) {
      if (this.show) {
        // start collapsed (at origin), then trigger expansion next tick
        this.animateToCenter = false;
        setTimeout(() => (this.animateToCenter = true), 12);
      } else {
        this.animateToCenter = false;
      }
    }
  }

  loadReviews(): void {
    if (!this.menuItem) return;
    const id = Number(this.menuItem.id);
    // load list
    this.reviewService.getReviewsByMenuItem(id).subscribe({
      next: revs => (this.reviews = revs || []),
      error: () => (this.reviews = [])
    });
    // load summary
    this.reviewService.getReviewSummary(id).subscribe({
      next: sum => {
        this.avgRating = sum?.average || 0;
        this.reviewCount = sum?.count || 0;
      },
      error: () => {
        this.avgRating = 0;
        this.reviewCount = 0;
      }
    });
  }

  getImageUrlFromName(name?: string | null): string {
    if (!name) return 'assets/images/placeholder.jpg';
    const trimmed = name.trim();
    const mapped = this.imageMap[trimmed];
    if (mapped) return `assets/images/${mapped}`;
    const base = trimmed.toLowerCase().replace(/[^a-z0-9\s_-]/g, '');
    const hyphen = base.replace(/\s+/g, '-').replace(/-+/g, '-');
    return `assets/images/${hyphen}.jpg`;
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    // try underscore variant if hyphen used once, otherwise placeholder
    if (img.src.includes('-') && !img.src.includes('placeholder.jpg')) {
      img.src = img.src.replace(/-/g, '_');
    } else {
      img.src = 'assets/images/placeholder.jpg';
    }
  }

  onAdd(): void {
    this.add.emit();
  }
  onRemove(): void {
    this.remove.emit();
  }
  onClose(): void {
    this.close.emit();
  }

  increaseQty(): void {
    // optional UI helper - parent owns cart state
    this.onAdd();
  }
  decreaseQty(): void {
    this.onRemove();
  }

  // accept number|string|null for userId coming from template
  submitReview(userId?: number | string | null): void {
    if (!this.menuItem) return;
    if (!this.newReview.rating || !this.newReview.comment) {
      this.errorMsg = 'Please select a rating and write a comment.';
      return;
    }
    this.submitting = true;
    this.errorMsg = '';
    const payload = {
      menuItemId: Number(this.menuItem.id),
      userId: userId != null ? Number(userId) : 0,
      rating: Number(this.newReview.rating),
      comment: this.newReview.comment
    };
    this.reviewService.addReview(payload).subscribe({
      next: () => {
        this.newReview = { rating: null, comment: '' };
        this.loadReviews();
        this.submitting = false;
      },
      error: () => {
        this.errorMsg = 'Failed to submit review. Try again later.';
        this.submitting = false;
      }
    });
  }

  getDefaultDescription(item: MenuItem | null): string {
    if (!item) return 'A delicious dish prepared fresh.';
    const defaults: { [k: string]: string } = {
      'Chicken Biryani': 'Fragrant basmati rice cooked with tender chicken and warm spices.',
      'Paneer Butter Masala': 'Soft paneer cubes in a rich buttery tomato gravy.',
      'Aloo Paratha': 'Whole wheat flatbread stuffed with spiced potatoes.'
    };
    return defaults[item.name] || item.description || 'Delicious and freshly prepared.';
  }
}
